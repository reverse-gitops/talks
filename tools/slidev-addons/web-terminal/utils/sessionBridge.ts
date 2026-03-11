/**
 * Coordinates PTY session sharing between any number of windows/tabs using
 * BroadcastChannel with a "first one wins" model:
 *
 * - Every instance sends a `request` on mount and waits briefly.
 * - If another instance already holds the URL it replies with `announce`.
 * - If nobody replies within the timeout, this instance is first: it creates
 *   the PTY, stores the URL, and responds to all future requests.
 */

type BridgeMessage =
  | { type: 'announce'; connectionUrl: string }
  | { type: 'control'; ownerId: string | null }
  | { type: 'request' }

interface SessionBridgeOptions {
  debug?: boolean
  logger?: (message: string, details?: unknown) => void
}

export interface SessionBridge {
  /**
   * Ask whether another instance already has a connection URL.
   * Resolves with the URL if one is found within `timeoutMs`, otherwise null.
   */
  requestUrl(timeoutMs?: number): Promise<string | null>
  /**
   * Legacy alias kept for compatibility with older builds that used a different
   * method name.
   */
  requestConnectionUrl?(timeoutMs?: number): Promise<string | null>

  /** Store and broadcast a connection URL so other instances can reuse it. */
  announce(connectionUrl: string): void

  /** Broadcast which browser context currently owns keyboard control, if any. */
  setControlOwner(ownerId: string | null): void
  getControlOwner(): string | null
  onControlOwnerChange(listener: (ownerId: string | null) => void): () => void

  close(): void
}

export function createSessionBridge(sessionId: string, options: SessionBridgeOptions = {}): SessionBridge {
  const log = (message: string, details?: unknown) => {
    if (!options.debug) return
    if (options.logger) {
      options.logger(message, details)
      return
    }
    if (details === undefined) {
      console.info(`[SessionBridge:${sessionId}] ${message}`)
    } else {
      console.info(`[SessionBridge:${sessionId}] ${message}`, details)
    }
  }

  if (typeof BroadcastChannel === 'undefined') {
    log('BroadcastChannel unavailable; bridge disabled')
    return {
      requestUrl: async () => null,
      requestConnectionUrl: async () => null,
      announce() {},
      setControlOwner() {},
      getControlOwner: () => null,
      onControlOwnerChange: () => () => {},
      close() {},
    }
  }

  const channel = new BroadcastChannel(`web-terminal:${sessionId}`)
  let storedUrl: string | null = null
  let currentControlOwnerId: string | null = null
  const controlOwnerListeners = new Set<(ownerId: string | null) => void>()
  log('BroadcastChannel opened', { channel: `web-terminal:${sessionId}` })

  const notifyControlOwnerListeners = () => {
    for (const listener of controlOwnerListeners) {
      listener(currentControlOwnerId)
    }
  }

  channel.onmessage = (event: MessageEvent<BridgeMessage>) => {
    const msg = event.data
    if (msg.type === 'announce') {
      // Another instance just announced — cache it in case we need it later
      storedUrl = msg.connectionUrl
      log('Received announce', { connectionUrl: msg.connectionUrl })
    } else if (msg.type === 'control') {
      currentControlOwnerId = msg.ownerId
      log('Received control owner', { ownerId: msg.ownerId })
      notifyControlOwnerListeners()
    } else if (msg.type === 'request' && storedUrl) {
      // Someone is asking: reply with what we have
      log('Received request; re-announcing stored URL')
      channel.postMessage({ type: 'announce', connectionUrl: storedUrl } satisfies BridgeMessage)
      if (currentControlOwnerId) {
        channel.postMessage({ type: 'control', ownerId: currentControlOwnerId } satisfies BridgeMessage)
      }
    } else if (msg.type === 'request') {
      log('Received request; no stored URL to announce yet')
    }
  }

  return {
    requestUrl(timeoutMs = 5000): Promise<string | null> {
      // Ask any existing instance for its URL
      log('Requesting shared URL', { timeoutMs })
      channel.postMessage({ type: 'request' } satisfies BridgeMessage)

      return new Promise(resolve => {
        let resolved = false

        const onMessage = (event: MessageEvent<BridgeMessage>) => {
          if (resolved || event.data.type !== 'announce') return
          resolved = true
          clearTimeout(timer)
          channel.removeEventListener('message', onMessage)
          storedUrl = event.data.connectionUrl
          log('requestUrl resolved with announce', { connectionUrl: event.data.connectionUrl })
          resolve(event.data.connectionUrl)
        }

        channel.addEventListener('message', onMessage)

        const timer = setTimeout(() => {
          if (resolved) return
          resolved = true
          channel.removeEventListener('message', onMessage)
          log('requestUrl timed out without shared URL')
          resolve(null)
        }, timeoutMs)
      })
    },

    requestConnectionUrl(timeoutMs = 5000): Promise<string | null> {
      return this.requestUrl(timeoutMs)
    },

    announce(connectionUrl: string) {
      storedUrl = connectionUrl
      log('Announcing URL', { connectionUrl })
      channel.postMessage({ type: 'announce', connectionUrl } satisfies BridgeMessage)
    },

    setControlOwner(ownerId: string | null) {
      currentControlOwnerId = ownerId
      log('Announcing control owner', { ownerId })
      notifyControlOwnerListeners()
      channel.postMessage({ type: 'control', ownerId } satisfies BridgeMessage)
    },

    getControlOwner() {
      return currentControlOwnerId
    },

    onControlOwnerChange(listener: (ownerId: string | null) => void) {
      controlOwnerListeners.add(listener)
      return () => {
        controlOwnerListeners.delete(listener)
      }
    },

    close() {
      log('Closing channel')
      controlOwnerListeners.clear()
      channel.close()
    },
  }
}
