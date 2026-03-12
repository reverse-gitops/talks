/**
 * Rewrites a backendUrl to go through the Vite dev-server proxy when the
 * backend is cross-origin, so that fetch/WebSocket calls avoid CORS issues.
 *
 * Same-origin URLs are returned unchanged.
 * Cross-origin URLs are rewritten to /proxy/<protocol>/<host>/<port>.
 */
export function getCleanBackendUrl(
    backendUrl: string,
    currentOrigin = window.location.origin,
): string {
    let clean = backendUrl.replace(/\/$/, '')
    try {
        const url = new URL(clean, currentOrigin)
        if (url.origin !== currentOrigin) {
            const protocol = url.protocol.replace(':', '')
            const host = url.hostname
            const port = url.port || (url.protocol === 'https:' ? '443' : '80')
            clean = `/proxy/${protocol}/${host}/${port}`
        }
    } catch (e) {
        console.warn(`URL parsing failed for backendUrl with error ${e}, falling back to original: ${clean}`)
    }
    return clean
}
