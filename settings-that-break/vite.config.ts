import { readFileSync } from 'node:fs'
import { request } from 'node:http'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { defineConfig } from 'vite'

// The live slides only ever call relative /k8s/... URLs. On stage the deck runs at
// demo.koudijs.dev/cnd-utrecht/, where krm-foyer answers /k8s with my own login.
// Locally, this forwards /k8s to `kubectl proxy --port 8001`, so the same components
// work against the same cluster: /k8s/apis/... becomes /apis/... on the proxy.
//
// kubectl proxy carries my admin credentials and `npm run dev` listens on every
// interface (--remote), so the forwarder only serves this machine and only reads.
const KUBECTL_PROXY = { host: '127.0.0.1', port: Number(process.env.KUBECTL_PROXY_PORT ?? 8001) }

// The devcontainer's default gateway, e.g. 172.17.0.1. The devcontainer publishes 3030 on the
// laptop's 127.0.0.1, and Docker delivers those connections from the gateway address, not from
// loopback. Only the laptop itself connects from there; other containers have their own address.
function dockerGateway(): string | undefined {
  try {
    const defaultRoute = readFileSync('/proc/net/route', 'utf8')
      .split('\n')
      .map((line) => line.trim().split(/\s+/))
      .find((fields) => fields[1] === '00000000')
    // The gateway is a little-endian hex IPv4 address.
    return defaultRoute?.[2].match(/../g)?.reverse().map((byte) => parseInt(byte, 16)).join('.')
  } catch {
    return undefined
  }
}

const gateway = dockerGateway()
const THIS_MACHINE = new Set([
  '127.0.0.1', '::1', '::ffff:127.0.0.1',
  ...(gateway ? [gateway, `::ffff:${gateway}`] : []),
])

function forwardToKubectlProxy(req: IncomingMessage, res: ServerResponse) {
  if (!THIS_MACHINE.has(req.socket.remoteAddress ?? '')) {
    res.statusCode = 403
    res.end('The /k8s forwarder only serves this machine.\n')
    return
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405
    res.end('The /k8s forwarder only reads.\n')
    return
  }

  // Connect strips the mount path, so req.url is already the API path.
  const upstream = request({ ...KUBECTL_PROXY, method: req.method, path: req.url, headers: { accept: req.headers.accept ?? 'application/json' } }, (answer) => {
    res.writeHead(answer.statusCode ?? 502, answer.headers)
    answer.pipe(res)
  })
  upstream.on('error', (e) => {
    res.statusCode = 502
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({ kind: 'Status', status: 'Failure', message: `kubectl proxy on :${KUBECTL_PROXY.port} not reachable: ${e.message}` }))
  })
  upstream.end()
}

export default defineConfig({
  plugins: [
    {
      name: 'k8s-forwarder',
      configureServer(server) {
        server.middlewares.use('/k8s', forwardToKubectlProxy)
      },
    },
  ],
})
