// Minimal Docker Engine API client over the Unix socket. Only what the bridge needs:
// inspect the target container, and create / start / resize / inspect execs.
import http from 'node:http'

export class DockerClient {
  constructor(socketPath) {
    this.socketPath = socketPath
  }

  #request(method, path, body) {
    return new Promise((resolve, reject) => {
      const payload = body === undefined ? undefined : JSON.stringify(body)
      const req = http.request({
        socketPath: this.socketPath,
        method,
        path,
        headers: payload ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } : {},
      }, (res) => {
        const chunks = []
        res.on('data', (chunk) => chunks.push(chunk))
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8')
          if (res.statusCode >= 400) {
            let message = text
            try { message = JSON.parse(text).message ?? text } catch { /* not JSON */ }
            reject(new Error(`Docker ${method} ${path} failed (${res.statusCode}): ${message.trim()}`))
            return
          }
          resolve(text ? JSON.parse(text) : null)
        })
      })
      req.on('error', reject)
      req.end(payload)
    })
  }

  inspectContainer(name) {
    return this.#request('GET', `/containers/${encodeURIComponent(name)}/json`)
  }

  async createExec(container, { cmd, user, workdir, env, rows, cols }) {
    const { Id } = await this.#request('POST', `/containers/${encodeURIComponent(container)}/exec`, {
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
      Cmd: cmd,
      Env: env,
      User: user,
      WorkingDir: workdir,
      ConsoleSize: rows && cols ? [rows, cols] : undefined,
    })
    return Id
  }

  // Starts the exec and takes over the HTTP connection. With Tty the stream is the raw
  // terminal, in both directions, without Docker's stdout/stderr framing.
  startExec(execId, { rows, cols }) {
    return new Promise((resolve, reject) => {
      const payload = JSON.stringify({ Detach: false, Tty: true, ConsoleSize: rows && cols ? [rows, cols] : undefined })
      const req = http.request({
        socketPath: this.socketPath,
        method: 'POST',
        path: `/exec/${execId}/start`,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
          Connection: 'Upgrade',
          Upgrade: 'tcp',
        },
      })
      req.on('upgrade', (res, socket, head) => {
        if (head.length > 0) socket.unshift(head)
        resolve(socket)
      })
      req.on('response', (res) => {
        res.resume()
        reject(new Error(`Docker did not upgrade the exec stream (status ${res.statusCode})`))
      })
      req.on('error', reject)
      req.end(payload)
    })
  }

  resizeExec(execId, { rows, cols }) {
    return this.#request('POST', `/exec/${execId}/resize?h=${rows}&w=${cols}`)
  }

  inspectExec(execId) {
    return this.#request('GET', `/exec/${execId}/json`)
  }

  // Runs a short command in the container and waits for it to finish. Output is discarded.
  async run(container, cmd, user) {
    const id = await this.createExec(container, { cmd, user })
    const socket = await this.startExec(id, {})
    await new Promise((resolve) => {
      socket.on('close', resolve)
      socket.on('error', resolve)
      socket.resume()
    })
    return this.inspectExec(id)
  }
}
