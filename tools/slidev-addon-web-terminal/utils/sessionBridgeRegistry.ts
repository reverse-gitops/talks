/**
 * Module-level singleton registry for SessionBridge instances.
 *
 * Keeps one bridge per session ID alive for the lifetime of the browser tab,
 * independent of any component mount/unmount cycle. This means:
 *
 * - The last announced PTY URL is retained when the WebTerminal component
 *   unmounts (slide navigation away) and is available immediately on remount.
 * - A re-mounting component skips the 1200 ms BroadcastChannel timeout entirely
 *   and reuses the already-running PTY without spawning a new shell.
 * - Two simultaneous instances (e.g. presenter + thumbnail) share the same bridge
 *   entry and can never create competing sessions on the same session ID.
 */

import { createSessionBridge, type SessionBridge } from './sessionBridge'

interface SessionBridgeOptions {
  debug?: boolean
  logger?: (message: string, details?: unknown) => void
}

interface BridgeEntry {
  bridge: SessionBridge
  refCount: number
  lastUrl: string | null
  /** In-flight PTY creation shared across concurrent same-window mounts. */
  pendingUrl: Promise<string | null> | null
}

const registry = new Map<string, BridgeEntry>()

/**
 * Return (or create) the singleton SessionBridge for `sessionId` and increment
 * its reference count. The returned bridge is already instrumented to keep
 * `lastUrl` in sync whenever a URL is announced or received.
 */
export function acquireBridge(sessionId: string, opts: SessionBridgeOptions = {}): SessionBridge {
  let entry = registry.get(sessionId)
  if (!entry) {
    const rawBridge = createSessionBridge(sessionId, opts)
    entry = { bridge: rawBridge, refCount: 0, lastUrl: null, pendingUrl: null }
    registry.set(sessionId, entry)

    // Intercept announce() so the cache is updated whenever this instance sets a URL.
    const originalAnnounce = rawBridge.announce.bind(rawBridge)
    rawBridge.announce = (url: string) => {
      entry!.lastUrl = url
      originalAnnounce(url)
    }

    // Intercept requestUrl() so the cache is updated when a URL arrives from
    // another window/tab via BroadcastChannel.
    const originalRequestUrl = rawBridge.requestUrl.bind(rawBridge)
    rawBridge.requestUrl = async (timeoutMs?: number) => {
      const url = await originalRequestUrl(timeoutMs)
      if (url) entry!.lastUrl = url
      return url
    }
  }

  entry.refCount++
  return entry.bridge
}

/**
 * Decrement the reference count for `sessionId`. The bridge is intentionally
 * kept alive in the registry (BroadcastChannel is cheap) so that the next
 * mount of the same component can reuse it and its cached URL instantly.
 */
export function releaseBridge(sessionId: string): void {
  const entry = registry.get(sessionId)
  if (!entry) return
  entry.refCount = Math.max(0, entry.refCount - 1)
}

/**
 * Return the last PTY URL announced for `sessionId`, or null if none has been
 * seen yet. A non-null value means the component can skip the BroadcastChannel
 * timeout and connect immediately.
 */
export function getCachedUrl(sessionId: string): string | null {
  return registry.get(sessionId)?.lastUrl ?? null
}

/**
 * Ensure exactly one PTY session is created for `sessionId`, even when multiple
 * component instances mount simultaneously within the same window.
 *
 * BroadcastChannel does not deliver messages within the same browsing context,
 * so the "request → announce" protocol cannot prevent a race between two
 * components in the same tab. This function closes that gap by serialising
 * concurrent creation attempts through a shared in-flight promise:
 *
 * - If a URL is already cached, it is returned immediately.
 * - If another caller is already running `creator`, their promise is returned
 *   (only one PTY is created; both callers get the same URL).
 * - Otherwise `creator` is called, the result is cached and announced, and the
 *   resolved URL is returned.
 */
export function ensureSessionUrl(
  sessionId: string,
  creator: () => Promise<string | null>,
): Promise<string | null> {
  const entry = registry.get(sessionId)
  if (!entry) return creator()

  if (entry.lastUrl) return Promise.resolve(entry.lastUrl)
  if (entry.pendingUrl) return entry.pendingUrl

  entry.pendingUrl = creator().then(url => {
    entry.pendingUrl = null
    if (url) {
      entry.lastUrl = url
      entry.bridge.announce(url)
    }
    return url
  })
  return entry.pendingUrl
}

/**
 * Drop a cached URL when it is known to be stale.
 *
 * If `expectedUrl` is provided, the cache is only cleared when it still matches
 * that URL. Existing in-flight creation/recovery work is left untouched so that
 * concurrent callers keep sharing the same promise.
 */
export function invalidateCachedUrl(sessionId: string, expectedUrl?: string): void {
  const entry = registry.get(sessionId)
  if (!entry || entry.pendingUrl) return
  if (expectedUrl && entry.lastUrl !== expectedUrl) return
  entry.lastUrl = null
}

export interface RecoverSessionUrlResult {
  url: string | null
  source: 'cached' | 'recovered' | 'reused_pending'
}

/**
 * Recover from a stale cached/shared URL while preserving same-window
 * serialisation. Concurrent callers all converge on a single replacement PTY.
 */
export function recoverSessionUrl(
  sessionId: string,
  staleUrl: string,
  creator: () => Promise<string | null>,
): Promise<RecoverSessionUrlResult> {
  const entry = registry.get(sessionId)
  if (!entry) {
    return creator().then(url => ({ url, source: 'recovered' }))
  }

  if (entry.lastUrl && entry.lastUrl !== staleUrl) {
    return Promise.resolve({ url: entry.lastUrl, source: 'cached' })
  }

  if (entry.pendingUrl) {
    return entry.pendingUrl.then(url => ({ url, source: 'reused_pending' }))
  }

  invalidateCachedUrl(sessionId, staleUrl)
  entry.pendingUrl = creator().then(url => {
    entry.pendingUrl = null
    if (url) {
      entry.lastUrl = url
      entry.bridge.announce(url)
    }
    return url
  })

  return entry.pendingUrl.then(url => ({ url, source: 'recovered' }))
}

export function __resetSessionBridgeRegistryForTests(): void {
  for (const entry of registry.values()) {
    entry.bridge.close()
  }
  registry.clear()
}
