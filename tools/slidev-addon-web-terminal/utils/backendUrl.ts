/**
 * Normalises a backendUrl. The browser talks to the backend directly, so the backend must
 * answer CORS for the deck's origin (docker-exec-bridge does, for its ALLOWED_ORIGINS).
 */
export function getCleanBackendUrl(backendUrl: string): string {
    return backendUrl.replace(/\/$/, '')
}
