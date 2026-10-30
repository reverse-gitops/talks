// One session = one docker exec shell with a TTY, shared by every WebSocket attached to it
// (presenter and audience window). Output is buffered and replayed to each new attach, so a
// remounted terminal shows what was on screen. With no client attached, the shell lives on for
// the grace period and is then killed.
import { randomUUID } from 'node:crypto'

const BUFFER_MAX_BYTES = 512 * 1024
// Output after a clear-screen is all a fresh terminal needs to show.
const CLEAR_SEQUENCES = [Buffer.from('\x1b[2J'), Buffer.from('\x1b[3J')]

// Docker does not end an exec when its stream closes. Every shell carries BRIDGE_SESSION=<id>
// in its environment, which its child processes inherit, so this finds and kills the whole tree.
const KILL_SCRIPT =
  'for d in /proc/[0-9]*; do ' +
  'tr "\\0" "\\n" < "$d/environ" 2>/dev/null | grep -qx "BRIDGE_SESSION=$1" && kill -KILL "${d#/proc/}" 2>/dev/null; ' +
  'done; true'

export const SESSION_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

export class TooManySessionsError extends Error {}

export function appendToReplayBuffer(buffer, chunk) {
  let clearAt = -1
  for (const sequence of CLEAR_SEQUENCES) {
    clearAt = Math.max(clearAt, chunk.lastIndexOf(sequence))
  }

  const next = clearAt >= 0 ? chunk.subarray(clearAt) : Buffer.concat([buffer, chunk])
  return next.length > BUFFER_MAX_BYTES ? next.subarray(next.length - BUFFER_MAX_BYTES) : next
}

export class SessionManager {
  #sessions = new Map()

  constructor(docker, config, log = console.log) {
    this.docker = docker
    this.config = config
    this.log = log
  }

  get size() {
    return this.#sessions.size
  }

  has(id) {
    return this.#sessions.has(id)
  }

  async create({ rows, cols } = {}) {
    if (this.#sessions.size >= this.config.maxSessions) {
      throw new TooManySessionsError(`session limit of ${this.config.maxSessions} reached`)
    }

    const id = randomUUID()
    const execId = await this.docker.createExec(this.config.targetContainer, {
      cmd: this.config.execCmd,
      user: this.config.execUser,
      workdir: this.config.execWorkdir,
      env: ['TERM=xterm-256color', `BRIDGE_SESSION=${id}`],
      rows,
      cols,
    })
    const stream = await this.docker.startExec(execId, { rows, cols })

    const session = { id, execId, stream, clients: new Set(), buffer: Buffer.alloc(0), graceTimer: null }
    this.#sessions.set(id, session)

    stream.on('data', (chunk) => {
      session.buffer = appendToReplayBuffer(session.buffer, chunk)
      for (const client of session.clients) client.send(chunk)
    })
    stream.on('close', () => {
      if (this.#sessions.get(id) !== session) return
      this.log('session.exited', { id })
      this.#forget(session, 1000, 'terminal-exited')
    })
    stream.on('error', (error) => this.log('session.stream_error', { id, error: error.message }))

    // Nobody may ever attach; don't keep the shell around forever.
    this.#startGrace(session)
    this.log('session.created', { id, execId: execId.slice(0, 12), rows, cols })
    return id
  }

  attach(id, ws) {
    const session = this.#sessions.get(id)
    if (!session) {
      ws.close(4404, 'terminal-not-found')
      return
    }

    clearTimeout(session.graceTimer)
    session.graceTimer = null
    if (session.buffer.length > 0) ws.send(session.buffer)
    session.clients.add(ws)
    this.log('session.attached', { id, clients: session.clients.size })

    ws.on('message', (data) => {
      if (!session.stream.destroyed) session.stream.write(data)
    })
    ws.on('close', () => {
      session.clients.delete(ws)
      this.log('session.detached', { id, clients: session.clients.size })
      if (session.clients.size === 0 && this.#sessions.get(id) === session) this.#startGrace(session)
    })
  }

  async resize(id, { rows, cols }) {
    const session = this.#sessions.get(id)
    if (!session) return false
    await this.docker.resizeExec(session.execId, { rows, cols })
    return true
  }

  async terminate(id, reason = 'terminated') {
    const session = this.#sessions.get(id)
    if (!session) return false
    this.#forget(session, 1000, reason)
    await this.#kill(session)
    return true
  }

  async terminateAll() {
    await Promise.all([...this.#sessions.keys()].map((id) => this.terminate(id, 'bridge-shutdown')))
  }

  #startGrace(session) {
    clearTimeout(session.graceTimer)
    session.graceTimer = setTimeout(() => {
      this.log('session.grace_expired', { id: session.id })
      void this.terminate(session.id, 'grace-expired')
    }, this.config.graceMs)
  }

  #forget(session, code, reason) {
    clearTimeout(session.graceTimer)
    this.#sessions.delete(session.id)
    for (const client of session.clients) client.close(code, reason)
    session.clients.clear()
    session.stream.destroy()
  }

  async #kill(session) {
    try {
      await this.docker.run(this.config.targetContainer, ['sh', '-c', KILL_SCRIPT, 'sh', session.id], this.config.execUser)
      this.log('session.killed', { id: session.id })
    } catch (error) {
      this.log('session.kill_failed', { id: session.id, error: error.message })
    }
  }
}
