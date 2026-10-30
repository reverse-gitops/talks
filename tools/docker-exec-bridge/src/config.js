// Everything that decides what a shell can do is fixed here, at startup.
// Nothing in a request can change the container, command, user or environment.

const DEFAULTS = {
  LISTEN_HOST: '127.0.0.1',
  PORT: '10001',
  ALLOWED_ORIGINS: 'http://localhost:3030',
  DOCKER_SOCKET: '/var/run/docker.sock',
  EXEC_CMD: 'bash -l',
  GRACE_MS: '30000',
  MAX_SESSIONS: '8',
}

const parsePort = (name, value) => {
  const port = Number(value)
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`${name} must be a port number, got "${value}"`)
  }
  return port
}

const parseNonNegativeInt = (name, value) => {
  const number = Number(value)
  if (!Number.isInteger(number) || number < 0) {
    throw new Error(`${name} must be a non-negative integer, got "${value}"`)
  }
  return number
}

const parseList = (value) =>
  value.split(',').map((item) => item.trim()).filter(Boolean)

const parseOrigin = (value) => {
  let url
  try {
    url = new URL(value)
  } catch {
    throw new Error(`ALLOWED_ORIGINS entry "${value}" is not a URL`)
  }
  // An origin is scheme + host + port; a path would never match the Origin header.
  if (url.origin !== value.replace(/\/$/, '')) {
    throw new Error(`ALLOWED_ORIGINS entry "${value}" must be an origin like https://demo.koudijs.dev, without a path`)
  }
  return url.origin
}

export function loadConfig(env = process.env) {
  const read = (name) => env[name] ?? DEFAULTS[name]

  const targetContainer = env.TARGET_CONTAINER?.trim()
  if (!targetContainer) {
    throw new Error('TARGET_CONTAINER is required: the name or id of the container shells run in')
  }

  const port = parsePort('PORT', read('PORT'))
  // The port the browser uses. Differs from PORT when Docker publishes the bridge on another port.
  const publicPort = parsePort('PUBLIC_PORT', env.PUBLIC_PORT ?? String(port))

  const allowedOrigins = parseList(read('ALLOWED_ORIGINS')).map(parseOrigin)
  if (allowedOrigins.length === 0) {
    throw new Error('ALLOWED_ORIGINS must list at least one origin')
  }

  const execCmd = parseList(read('EXEC_CMD').replaceAll(' ', ','))
  if (execCmd.length === 0) {
    throw new Error('EXEC_CMD must not be empty')
  }

  return Object.freeze({
    targetContainer,
    listenHost: read('LISTEN_HOST'),
    port,
    allowedOrigins: new Set(allowedOrigins),
    allowedHosts: new Set([`127.0.0.1:${publicPort}`, `localhost:${publicPort}`]),
    dockerSocket: read('DOCKER_SOCKET'),
    execCmd,
    execUser: env.EXEC_USER || undefined,
    execWorkdir: env.EXEC_WORKDIR || undefined,
    graceMs: parseNonNegativeInt('GRACE_MS', read('GRACE_MS')),
    maxSessions: parseNonNegativeInt('MAX_SESSIONS', read('MAX_SESSIONS')),
  })
}
