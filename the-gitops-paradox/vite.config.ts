import { defineConfig } from 'vite'
import { createRequire } from 'module'
import { exec, type ExecOptions } from 'child_process'
import { mkdir, readFile } from 'fs/promises'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)

const DEFAULT_QUIZ_SESSION = 'demo'
const QUIZ_SESSION_NAMESPACE = 'vote'
const LIVE_MANIFEST_CACHE_TTL_MS = 2000
const LIVE_MANIFEST_COMMAND_TIMEOUT_MS = 4000

type LiveManifestPayload = {
    manifest: string
    updatedAt: string
    command: string
}

const liveManifestCache = new Map<string, LiveManifestPayload>()
const liveManifestCachedAt = new Map<string, number>()
const liveManifestRefreshPromises = new Map<string, Promise<LiveManifestPayload>>()

const sendJson = (res: any, statusCode: number, payload: unknown) => {
    res.statusCode = statusCode
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(payload))
}

const isValidSessionName = (value: string) =>
    /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(value)

const parseRequestUrl = (req: any) =>
    new URL(req.url ?? '/', 'http://localhost')

const getRequestedSession = (req: any) => {
    const session = parseRequestUrl(req).searchParams.get('session')?.trim() || DEFAULT_QUIZ_SESSION

    if (!isValidSessionName(session)) {
        return { error: 'Invalid session name' as const, statusCode: 400 as const }
    }

    return { session }
}

const buildVoteCodeCommand = (session: string) =>
    `kubectl get quizsession ${session} -n ${QUIZ_SESSION_NAMESPACE} -o yaml | yq -r '.status.joinCode'`

const buildLiveManifestKubectlCommand = (session: string) =>
    `kubectl get quizsession ${session} -n ${QUIZ_SESSION_NAMESPACE} -o yaml | yq 'del(.metadata.annotations, .metadata.labels)'`

const getLiveManifestFile = (session: string) =>
    fileURLToPath(new URL(`./.generated/live-cluster-manifest-${session}.yaml`, import.meta.url))

const buildLiveManifestCommand = (session: string) =>
    `${buildLiveManifestKubectlCommand(session)} > "${getLiveManifestFile(session)}"`

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

const getLiveManifestPayload = async (session: string): Promise<LiveManifestPayload> => {
    const now = Date.now()
    const cachedPayload = liveManifestCache.get(session)
    const cachedAt = liveManifestCachedAt.get(session) ?? 0

    if (cachedPayload && now - cachedAt < LIVE_MANIFEST_CACHE_TTL_MS) {
        return cachedPayload
    }

    let refreshPromise = liveManifestRefreshPromises.get(session)

    if (!refreshPromise) {
        refreshPromise = (async () => {
            const liveManifestFile = getLiveManifestFile(session)
            await mkdir(dirname(liveManifestFile), { recursive: true })
            await runCommand(buildLiveManifestCommand(session), { timeout: LIVE_MANIFEST_COMMAND_TIMEOUT_MS })
            const manifest = await readFile(liveManifestFile, 'utf8')
            const payload: LiveManifestPayload = {
                manifest,
                updatedAt: new Date().toISOString(),
                command: buildLiveManifestKubectlCommand(session),
            }
            liveManifestCache.set(session, payload)
            liveManifestCachedAt.set(session, Date.now())
            return payload
        })().finally(() => {
            liveManifestRefreshPromises.delete(session)
        })

        liveManifestRefreshPromises.set(session, refreshPromise)
    }

    return refreshPromise
}

export default defineConfig({
    plugins: [
        {
            name: 'dynamic-terminal-proxy',
            configureServer(server) {
                server.middlewares.use((req: any, res: any, next: any) => {
                    const requestUrl = parseRequestUrl(req)

                    if (requestUrl.pathname === '/api/vote-code' && req.method === 'GET') {
                        const sessionResult = getRequestedSession(req)
                        if ('error' in sessionResult) {
                            sendJson(res, sessionResult.statusCode, { error: sessionResult.error })
                            return
                        }

                        exec(buildVoteCodeCommand(sessionResult.session), (error, stdout) => {
                            if (error) {
                                sendJson(res, 500, { error: error.message })
                                return
                            }
                            sendJson(res, 200, { code: stdout.trim(), session: sessionResult.session })
                        })
                        return
                    }

                    if (requestUrl.pathname === '/api/live-cluster-manifest' && req.method === 'GET') {
                        const sessionResult = getRequestedSession(req)
                        if ('error' in sessionResult) {
                            sendJson(res, sessionResult.statusCode, { error: sessionResult.error })
                            return
                        }

                        void (async () => {
                            try {
                                const payload = await getLiveManifestPayload(sessionResult.session)
                                sendJson(res, 200, payload)
                            } catch (error: any) {
                                const cachedPayload = liveManifestCache.get(sessionResult.session)
                                if (cachedPayload) {
                                    sendJson(res, 200, cachedPayload)
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
