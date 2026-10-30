// Every HTTP request and WebSocket upgrade passes this check before anything talks to Docker.
//
// - Origin: browsers set it themselves, so another site open in the same browser cannot
//   pretend to be the deck. A missing Origin (curl, scripts) is rejected as well.
// - Host: stops DNS rebinding, where an attacker's domain starts resolving to 127.0.0.1.
//   The browser then still sends the attacker's hostname in Host.

export function checkRequest(req, config) {
  const host = req.headers.host ?? ''
  if (!config.allowedHosts.has(host)) {
    return { ok: false, status: 403, reason: `host not allowed: "${host}"` }
  }

  const origin = req.headers.origin ?? ''
  if (!config.allowedOrigins.has(origin)) {
    return { ok: false, status: 403, reason: `origin not allowed: "${origin || '(none)'}"` }
  }

  return { ok: true, origin }
}

// Only ever echoes an origin that already passed checkRequest; never "*".
export const corsHeaders = (origin) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
  'Access-Control-Max-Age': '600',
  Vary: 'Origin',
})
