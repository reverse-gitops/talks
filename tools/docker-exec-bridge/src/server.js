#!/usr/bin/env node
// HTTP + WebSocket front for SessionManager, speaking the slidev-addon-web-terminal backend contract:
//   POST   /api/terminals?cols=&rows=        -> session id (text/plain)
//   WS     /terminals/:id                    -> raw terminal bytes both ways; 4404 if unknown
//   POST   /api/terminals/:id/size?cols=&rows=
//   DELETE /api/terminals/:id
import { realpathSync } from 'node:fs'
import http from 'node:http'
import { pathToFileURL } from 'node:url'
import { WebSocketServer } from 'ws'
import { loadConfig } from './config.js'
import { DockerClient } from './docker.js'
import { checkRequest, corsHeaders } from './guard.js'
import { SessionManager, SESSION_ID_PATTERN, TooManySessionsError } from './sessions.js'

const log = (event, details = {}) =>
  console.log(JSON.stringify({ time: new Date().toISOString(), event, ...details }))

const parseSize = (url) => {
  const cols = Number(url.searchParams.get('cols'))
  const rows = Number(url.searchParams.get('rows'))
  const valid = (n) => Number.isInteger(n) && n > 0 && n <= 1000
  return valid(cols) && valid(rows) ? { cols, rows } : null
}

const send = (res, status, headers, body = '') => {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', ...headers })
  res.end(body)
}

export function createBridgeServer(config, sessions) {
  const wss = new WebSocketServer({ noServer: true, maxPayload: 64 * 1024 })

  const server = http.createServer(async (req, res) => {
    const check = checkRequest(req, config)
    if (!check.ok) {
      log('request.rejected', { method: req.method, url: req.url, reason: check.reason })
      send(res, check.status, {}, 'Forbidden\n')
      return
    }

    const cors = corsHeaders(check.origin)
    const url = new URL(req.url ?? '/', 'http://bridge')
    const sizeMatch = url.pathname.match(/^\/api\/terminals\/([^/]+)\/size$/)
    const sessionMatch = url.pathname.match(/^\/api\/terminals\/([^/]+)$/)

    try {
      if (req.method === 'OPTIONS') {
        const extra = req.headers['access-control-request-private-network'] === 'true'
          ? { 'Access-Control-Allow-Private-Network': 'true' }
          : {}
        send(res, 204, { ...cors, ...extra })
        return
      }

      if (req.method === 'POST' && url.pathname === '/api/terminals') {
        const id = await sessions.create(parseSize(url) ?? {})
        send(res, 200, cors, id)
        return
      }

      if (req.method === 'POST' && sizeMatch) {
        const size = parseSize(url)
        if (!size) {
          send(res, 400, cors, 'cols and rows must be integers between 1 and 1000\n')
          return
        }
        const found = SESSION_ID_PATTERN.test(sizeMatch[1]) && await sessions.resize(sizeMatch[1], size)
        send(res, found ? 200 : 404, cors)
        return
      }

      if (req.method === 'DELETE' && sessionMatch) {
        const found = SESSION_ID_PATTERN.test(sessionMatch[1]) && await sessions.terminate(sessionMatch[1], 'deleted')
        send(res, found ? 204 : 404, cors)
        return
      }

      send(res, 404, cors, 'Not found\n')
    } catch (error) {
      const status = error instanceof TooManySessionsError ? 429 : 502
      log('request.failed', { method: req.method, url: req.url, status, error: error.message })
      send(res, status, cors, `${error.message}\n`)
    }
  })

  server.on('upgrade', (req, socket, head) => {
    const check = checkRequest(req, config)
    if (!check.ok) {
      log('upgrade.rejected', { url: req.url, reason: check.reason })
      socket.end('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n')
      return
    }

    const match = new URL(req.url ?? '/', 'http://bridge').pathname.match(/^\/terminals\/([^/]+)$/)
    if (!match) {
      socket.end('HTTP/1.1 404 Not Found\r\nConnection: close\r\n\r\n')
      return
    }

    // Unknown ids are still accepted, then closed with 4404 so the addon recovers with a new session.
    wss.handleUpgrade(req, socket, head, (ws) => sessions.attach(match[1], ws))
  })

  return server
}

async function main() {
  const config = loadConfig()
  const docker = new DockerClient(config.dockerSocket)

  const container = await docker.inspectContainer(config.targetContainer)
  if (!container.State?.Running) {
    throw new Error(`target container "${config.targetContainer}" is not running`)
  }

  const sessions = new SessionManager(docker, config, log)
  const server = createBridgeServer(config, sessions)

  const shutdown = async (signal) => {
    log('bridge.stopping', { signal, sessions: sessions.size })
    server.close()
    await sessions.terminateAll()
    process.exit(0)
  }
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)

  server.listen(config.port, config.listenHost, () => {
    log('bridge.listening', {
      listen: `${config.listenHost}:${config.port}`,
      container: container.Name.replace(/^\//, ''),
      command: config.execCmd.join(' '),
      user: config.execUser ?? '(container default)',
      allowedOrigins: [...config.allowedOrigins],
      allowedHosts: [...config.allowedHosts],
      graceMs: config.graceMs,
      maxSessions: config.maxSessions,
    })
  })
}

if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) {
  main().catch((error) => {
    console.error(`docker-exec-bridge: ${error.message}`)
    process.exit(1)
  })
}
