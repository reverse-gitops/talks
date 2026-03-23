import { getCleanBackendUrl } from './backendUrl'
import {
  acquireBridge,
  getCachedUrl,
  ensureSessionUrl,
  recoverSessionUrl,
  releaseBridge,
  type RecoverSessionUrlResult,
} from './sessionBridgeRegistry'

export type TerminalSessionSource = 'cached' | 'shared' | 'created' | 'recovered'

export interface ResolvedTerminalConnection {
  url: string
  pid: string | null
  source: TerminalSessionSource
}

export interface TerminalSessionController {
  resolveConnection(): Promise<ResolvedTerminalConnection | null>
  handleSocketClose(event: CloseEvent, currentUrl: string): Promise<{ retryUrl: string } | null>
  setFocused(focused: boolean): void
  setControlOwner(ownerId: string | null): void
  getControlOwner(): string | null
  onControlOwnerChange(listener: (ownerId: string | null) => void): () => void
  requestResize(cols: number, rows: number, reason: string, force?: boolean): void
  dispose(): void
}

interface TerminalSessionControllerOptions {
  backendUrl: string
  sessionId: string
  debug?: boolean
  sharedUrlTimeoutMs?: number
  getInitialSize?: () => { cols: number; rows: number } | null
  logger?: (event: string, details?: Record<string, unknown>) => void
}

const DEFAULT_SHARED_URL_TIMEOUT_MS = 1200
const pendingSessionResolutions = new Map<string, Promise<ResolvedTerminalConnection | null>>()

const parsePidFromConnectionUrl = (connectionUrl: string): string | null => {
  try {
    const url = new URL(connectionUrl, window.location.href)
    const match = url.pathname.match(/\/terminals\/([^/?#]+)/)
    return match ? decodeURIComponent(match[1]) : null
  } catch {
    return null
  }
}

const isTerminalNotFoundClose = (event: CloseEvent) =>
  event.code === 4404 || event.reason === 'terminal-not-found'

const getValidatedInitialSize = (
  getInitialSize?: () => { cols: number; rows: number } | null,
) => {
  const size = getInitialSize?.() ?? null
  if (!size) return null

  const cols = Math.floor(size.cols)
  const rows = Math.floor(size.rows)
  if (!Number.isFinite(cols) || !Number.isFinite(rows) || cols <= 0 || rows <= 0) {
    return null
  }

  return { cols, rows }
}

const createPtySession = async (
  backendUrl: string,
  initialSize: { cols: number; rows: number } | null,
  logger?: (event: string, details?: Record<string, unknown>) => void,
): Promise<string | null> => {
  try {
    const cleanBackendUrl = getCleanBackendUrl(backendUrl)
    const requestUrl = new URL(`${cleanBackendUrl}/api/terminals`, window.location.href)
    if (initialSize) {
      requestUrl.searchParams.set('cols', String(initialSize.cols))
      requestUrl.searchParams.set('rows', String(initialSize.rows))
    }
    logger?.('session.create.start', { backendUrl: cleanBackendUrl, initialSize, requestUrl: requestUrl.toString() })
    const response = await fetch(requestUrl.toString(), { method: 'POST' })
    if (!response.ok) {
      logger?.('session.create.error', {
        backendUrl: cleanBackendUrl,
        initialSize,
        requestUrl: requestUrl.toString(),
        status: response.status,
        statusText: response.statusText,
      })
      return null
    }

    const pid = await response.text()
    if (cleanBackendUrl.startsWith('/proxy/')) {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const url = `${protocol}//${window.location.host}${cleanBackendUrl}/terminals/${pid}`
      logger?.('session.create.success', { backendUrl: cleanBackendUrl, pid, url })
      return url
    }

    const url = new URL(cleanBackendUrl, window.location.href)
    const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${url.host}/terminals/${pid}`
    logger?.('session.create.success', { backendUrl: cleanBackendUrl, pid, url: wsUrl })
    return wsUrl
  } catch (error) {
    logger?.('session.create.error', {
      backendUrl,
      initialSize,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}

const toResolvedConnection = (
  url: string,
  source: TerminalSessionSource,
): ResolvedTerminalConnection => ({
  url,
  pid: parsePidFromConnectionUrl(url),
  source,
})

const toRecoveryLogEvent = (result: RecoverSessionUrlResult) => {
  if (result.source === 'reused_pending') return 'session.recover.reused_pending'
  return 'session.recover.success'
}

export function createTerminalSessionController(
  options: TerminalSessionControllerOptions,
): TerminalSessionController {
  const {
    backendUrl,
    sessionId,
    debug,
    logger,
    sharedUrlTimeoutMs = DEFAULT_SHARED_URL_TIMEOUT_MS,
    getInitialSize,
  } = options

  const bridge = acquireBridge(sessionId, {
    debug,
    logger: (message, details) => logger?.(`bridge.${message}`, details as Record<string, unknown> | undefined),
  })

  let isFocused = false
  let activePid: string | null = null
  let disposed = false

  const setActiveConnection = (connection: ResolvedTerminalConnection | null) => {
    activePid = connection?.pid ?? null
  }

  const runResolution = async (): Promise<ResolvedTerminalConnection | null> => {
    logger?.('session.resolve.start', { sessionId, backendUrl })

    const cachedUrl = getCachedUrl(sessionId)
    if (cachedUrl) {
      const connection = toResolvedConnection(cachedUrl, 'cached')
      logger?.('session.resolve.cached_hit', { sessionId, url: connection.url, pid: connection.pid })
      return connection
    }

    const requestSharedUrl =
      typeof bridge.requestUrl === 'function'
        ? bridge.requestUrl.bind(bridge)
        : typeof bridge.requestConnectionUrl === 'function'
          ? bridge.requestConnectionUrl.bind(bridge)
          : null

    if (requestSharedUrl) {
      const sharedUrl = await requestSharedUrl(sharedUrlTimeoutMs)
      if (sharedUrl) {
        const connection = toResolvedConnection(sharedUrl, 'shared')
        logger?.('session.resolve.shared_hit', { sessionId, url: connection.url, pid: connection.pid })
        return connection
      }
    }

    const createdUrl = await ensureSessionUrl(
      sessionId,
      () => createPtySession(backendUrl, getValidatedInitialSize(getInitialSize), logger),
    )
    return createdUrl ? toResolvedConnection(createdUrl, 'created') : null
  }

  return {
    async resolveConnection(): Promise<ResolvedTerminalConnection | null> {
      if (disposed) return null

      let resolution = pendingSessionResolutions.get(sessionId)
      if (!resolution) {
        resolution = runResolution().finally(() => {
          if (pendingSessionResolutions.get(sessionId) === resolution) {
            pendingSessionResolutions.delete(sessionId)
          }
        })
        pendingSessionResolutions.set(sessionId, resolution)
      }

      const connection = await resolution
      if (!connection || disposed) return null
      setActiveConnection(connection)
      return connection
    },

    async handleSocketClose(event: CloseEvent, currentUrl: string): Promise<{ retryUrl: string } | null> {
      if (disposed || !isTerminalNotFoundClose(event)) return null

      logger?.('session.recover.start', { sessionId, staleUrl: currentUrl, code: event.code, reason: event.reason })
      const result = await recoverSessionUrl(
        sessionId,
        currentUrl,
        () => createPtySession(backendUrl, getValidatedInitialSize(getInitialSize), logger),
      )
      if (!result.url || disposed) return null

      const connection = toResolvedConnection(result.url, 'recovered')
      setActiveConnection(connection)
      logger?.(toRecoveryLogEvent(result), {
        sessionId,
        staleUrl: currentUrl,
        url: connection.url,
        pid: connection.pid,
      })
      return { retryUrl: connection.url }
    },

    setFocused(focused: boolean) {
      isFocused = focused
    },

    setControlOwner(ownerId: string | null) {
      bridge.setControlOwner(ownerId)
    },

    getControlOwner() {
      return bridge.getControlOwner()
    },

    onControlOwnerChange(listener: (ownerId: string | null) => void) {
      return bridge.onControlOwnerChange(listener)
    },

    requestResize(cols: number, rows: number, reason: string, force = false) {
      if (disposed || !activePid) return
      if (!force && !isFocused) return

      const base = getCleanBackendUrl(backendUrl)
      void fetch(`${base}/api/terminals/${activePid}/size?cols=${cols}&rows=${rows}`, { method: 'POST' }).catch((error) => {
        logger?.('session.resize.error', {
          sessionId,
          pid: activePid,
          cols,
          rows,
          reason,
          force,
          error: error instanceof Error ? error.message : String(error),
        })
      })
    },

    dispose() {
      if (disposed) return
      disposed = true
      activePid = null
      releaseBridge(sessionId)
    },
  }
}

export function __resetTerminalSessionControllerForTests(): void {
  pendingSessionResolutions.clear()
}
