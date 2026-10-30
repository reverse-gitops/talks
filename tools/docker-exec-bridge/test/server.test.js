import assert from 'node:assert/strict'
import { once } from 'node:events'
import net from 'node:net'
import { Duplex } from 'node:stream'
import { after, before, test } from 'node:test'
import WebSocket from 'ws'
import { loadConfig } from '../src/config.js'
import { createBridgeServer } from '../src/server.js'
import { SessionManager } from '../src/sessions.js'

const ORIGIN = 'https://demo.koudijs.dev'

// Stands in for Docker: every exec is a stream that echoes its input back.
class FakeDocker {
  execs = []
  resizes = []
  runs = []

  async createExec(container, options) {
    this.execs.push({ container, ...options })
    return `exec${this.execs.length}`
  }

  async startExec() {
    const stream = new Duplex({
      read() {},
      write(chunk, _encoding, callback) {
        this.push(Buffer.concat([Buffer.from('echo:'), chunk]))
        callback()
      },
    })
    return stream
  }

  async resizeExec(execId, size) {
    this.resizes.push({ execId, ...size })
  }

  async run(container, cmd, user) {
    this.runs.push({ container, cmd, user })
    return { ExitCode: 0 }
  }
}

const freePort = async () => {
  const probe = net.createServer().listen(0, '127.0.0.1')
  await once(probe, 'listening')
  const { port } = probe.address()
  probe.close()
  return port
}

let docker, sessions, server, base, config

before(async () => {
  const port = await freePort()
  config = loadConfig({
    TARGET_CONTAINER: 'talks-demo',
    PORT: String(port),
    ALLOWED_ORIGINS: ORIGIN,
    EXEC_USER: 'node',
    GRACE_MS: '50',
    MAX_SESSIONS: '2',
  })
  docker = new FakeDocker()
  sessions = new SessionManager(docker, config, () => {})
  server = createBridgeServer(config, sessions)
  server.listen(port, '127.0.0.1')
  await once(server, 'listening')
  base = `http://127.0.0.1:${port}`
})

after(async () => {
  await sessions.terminateAll()
  server.close()
})

const createSession = (query = '?cols=80&rows=24') =>
  fetch(`${base}/api/terminals${query}`, { method: 'POST', headers: { Origin: ORIGIN } })

const openSocket = (id, origin = ORIGIN) =>
  new WebSocket(`${base.replace('http', 'ws')}/terminals/${id}`, { headers: { Origin: origin } })

const nextMessage = async (ws) => {
  const [data] = await once(ws, 'message')
  return data.toString()
}

test('creates a shell in the fixed container with the fixed command', async () => {
  const response = await createSession()
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('access-control-allow-origin'), ORIGIN)
  const id = await response.text()

  const exec = docker.execs.at(-1)
  assert.equal(exec.container, 'talks-demo')
  assert.deepEqual(exec.cmd, ['bash', '-l'])
  assert.equal(exec.user, 'node')
  assert.deepEqual(exec.env, ['TERM=xterm-256color', `BRIDGE_SESSION=${id}`])
  assert.deepEqual([exec.rows, exec.cols], [24, 80])

  await sessions.terminate(id)
})

test('pipes input and output, and replays output to a second window', async () => {
  const id = await (await createSession()).text()

  const presenter = openSocket(id)
  await once(presenter, 'open')
  presenter.send('ls\n')
  assert.equal(await nextMessage(presenter), 'echo:ls\n')

  const audience = openSocket(id)
  assert.equal(await nextMessage(audience), 'echo:ls\n')

  presenter.close()
  audience.close()
  await sessions.terminate(id)
})

test('resizes and deletes sessions; deleting kills the process tree in the container', async () => {
  const id = await (await createSession()).text()
  const execId = `exec${docker.execs.length}`

  const resize = await fetch(`${base}/api/terminals/${id}/size?cols=120&rows=40`, { method: 'POST', headers: { Origin: ORIGIN } })
  assert.equal(resize.status, 200)
  assert.deepEqual(docker.resizes.at(-1), { execId, rows: 40, cols: 120 })

  const removed = await fetch(`${base}/api/terminals/${id}`, { method: 'DELETE', headers: { Origin: ORIGIN } })
  assert.equal(removed.status, 204)
  const kill = docker.runs.at(-1)
  assert.equal(kill.container, 'talks-demo')
  assert.equal(kill.user, 'node')
  assert.equal(kill.cmd.at(-1), id)
})

test('unknown sessions close with 4404 so the addon recovers', async () => {
  const ws = openSocket('00000000-0000-0000-0000-000000000000')
  const [code, reason] = await once(ws, 'close')
  assert.equal(code, 4404)
  assert.equal(reason.toString(), 'terminal-not-found')
})

test('a session nobody attaches to is killed after the grace period', async () => {
  const id = await (await createSession()).text()
  await new Promise((resolve) => setTimeout(resolve, 150))
  assert.equal(sessions.has(id), false)
  assert.equal(docker.runs.at(-1).cmd.at(-1), id)
})

test('rejects a wrong Origin on HTTP and on the WebSocket upgrade', async () => {
  const response = await fetch(`${base}/api/terminals`, { method: 'POST', headers: { Origin: 'https://evil.example' } })
  assert.equal(response.status, 403)
  assert.equal(response.headers.get('access-control-allow-origin'), null)

  const id = await (await createSession()).text()
  const ws = openSocket(id, 'https://evil.example')
  const [error] = await once(ws, 'error')
  assert.match(error.message, /403/)
  await sessions.terminate(id)
})

test('rejects a rebound Host', async () => {
  const port = new URL(base).port
  const status = await new Promise((resolve, reject) => {
    const socket = net.connect(port, '127.0.0.1', () => {
      socket.write(`POST /api/terminals HTTP/1.1\r\nHost: rebind.evil.example:${port}\r\nOrigin: ${ORIGIN}\r\nContent-Length: 0\r\nConnection: close\r\n\r\n`)
    })
    let reply = ''
    socket.on('data', (chunk) => { reply += chunk })
    socket.on('end', () => resolve(Number(reply.split(' ')[1])))
    socket.on('error', reject)
  })
  assert.equal(status, 403)
})

test('refuses more sessions than MAX_SESSIONS', async () => {
  const ids = [await (await createSession()).text(), await (await createSession()).text()]
  const third = await createSession()
  assert.equal(third.status, 429)
  await Promise.all(ids.map((id) => sessions.terminate(id)))
})

test('answers the preflight for Chrome private network access', async () => {
  const response = await fetch(`${base}/api/terminals`, {
    method: 'OPTIONS',
    headers: { Origin: ORIGIN, 'Access-Control-Request-Private-Network': 'true' },
  })
  assert.equal(response.status, 204)
  assert.equal(response.headers.get('access-control-allow-private-network'), 'true')
})
