import { defineConfig } from 'vite'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

export default defineConfig({
    plugins: [
        {
            name: 'dynamic-terminal-proxy',
            configureServer(server) {
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
