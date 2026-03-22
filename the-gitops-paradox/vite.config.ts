import { defineConfig } from 'vite'
import { createRequire } from 'module'
import { exec, type ExecOptions } from 'child_process'
import { mkdir, readFile } from 'fs/promises'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)

const VOTE_CODE_COMMAND = `kubectl get quizsession kubecon-2026 -n vote -o yaml | yq -r '.status.joinCode'`
const LIVE_MANIFEST_FILE = fileURLToPath(new URL('./.generated/live-cluster-manifest.yaml', import.meta.url))
const LIVE_MANIFEST_DISPLAY_COMMAND = `kubectl get quizsession kubecon-2026 -n vote -o yaml | yq 'del(.metadata.annotations, .metadata.labels)' > .generated/live-cluster-manifest.yaml`
const LIVE_MANIFEST_COMMAND = `kubectl get quizsession kubecon-2026 -n vote -o yaml | yq 'del(.metadata.annotations, .metadata.labels)' > "${LIVE_MANIFEST_FILE}"`
const LIVE_MANIFEST_CACHE_TTL_MS = 2000
const LIVE_MANIFEST_COMMAND_TIMEOUT_MS = 4000

type LiveManifestPayload = {
    manifest: string
    updatedAt: string
    command: string
}

let liveManifestCache: LiveManifestPayload | null = null
let liveManifestCachedAt = 0
let liveManifestRefreshPromise: Promise<LiveManifestPayload> | null = null

const sendJson = (res: any, statusCode: number, payload: unknown) => {
    res.statusCode = statusCode
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(payload))
}

const runCommand = (command: string, options: ExecOptions = {}) =>
    new Promise<void>((resolve, reject) => {
        exec(command, options, (error) => {
            if (error) {
                reject(error)
                return
            }
            resolve()
        })
    })

const getLiveManifestPayload = async (): Promise<LiveManifestPayload> => {
    const now = Date.now()
    if (liveManifestCache && now - liveManifestCachedAt < LIVE_MANIFEST_CACHE_TTL_MS) {
        return liveManifestCache
    }

    if (!liveManifestRefreshPromise) {
        liveManifestRefreshPromise = (async () => {
            await mkdir(dirname(LIVE_MANIFEST_FILE), { recursive: true })
            await runCommand(LIVE_MANIFEST_COMMAND, { timeout: LIVE_MANIFEST_COMMAND_TIMEOUT_MS })
            const manifest = await readFile(LIVE_MANIFEST_FILE, 'utf8')
            const payload: LiveManifestPayload = {
                manifest,
                updatedAt: new Date().toISOString(),
                command: LIVE_MANIFEST_DISPLAY_COMMAND,
            }
            liveManifestCache = payload
            liveManifestCachedAt = Date.now()
            return payload
        })().finally(() => {
            liveManifestRefreshPromise = null
        })
    }

    return liveManifestRefreshPromise
}

export default defineConfig({
    plugins: [
        {
            name: 'dynamic-terminal-proxy',
            configureServer(server) {
                server.middlewares.use((req: any, res: any, next: any) => {
                    if (req.url === '/api/vote-code' && req.method === 'GET') {
                        exec(VOTE_CODE_COMMAND, (error, stdout) => {
                            if (error) {
                                sendJson(res, 500, { error: error.message })
                                return
                            }
                            sendJson(res, 200, { code: stdout.trim() })
                        })
                        return
                    }

                    if (req.url === '/api/live-cluster-manifest' && req.method === 'GET') {
                        void (async () => {
                            try {
                                const payload = await getLiveManifestPayload()
                                sendJson(res, 200, payload)
                            } catch (error: any) {
                                if (liveManifestCache) {
                                    sendJson(res, 200, liveManifestCache)
                                    return
                                }
                                sendJson(res, 500, { error: error?.message ?? 'Failed to refresh live manifest' })
                            }
                        })()
                        return
                    }
                    next()
                })

                const httpProxy = require('http-proxy')
                const proxy = httpProxy.createProxyServer({
                    changeOrigin: true,
                    ws: true
                })

                server.middlewares.use((req: any, res: any, next: any) => {
                    const match = req.url?.match(/^\/proxy\/([^\/]+)\/([^\/]+)\/([^\/]+)(.*)/)
                    if (match) {
                        const protocol = match[1]
                        const host = match[2]
                        const port = match[3]
                        const rest = match[4] || '/'
                        req.url = rest
                        const target = `${protocol}://${host}:${port}`
                        proxy.web(req, res, { target, secure: protocol === 'https' }, (e: any) => {
                            console.error(`[Proxy Error ${target}]:`, e.message)
                            res.statusCode = 502
                            res.end(`Proxy error: ${e.message}`)
                        })
                        return
                    }
                    next()
                })

                server.httpServer?.on('upgrade', (req: any, socket: any, head: any) => {
                    const match = req.url?.match(/^\/proxy\/([^\/]+)\/([^\/]+)\/([^\/]+)(.*)/)
                    if (match) {
                        const protocol = match[1]
                        const host = match[2]
                        const port = match[3]
                        const rest = match[4] || '/'
                        req.url = rest
                        const target = `${protocol}://${host}:${port}`
                        proxy.ws(req, socket, head, { target, secure: protocol === 'https' })
                        return
                    }
                })
            }
        }
    ]
})
