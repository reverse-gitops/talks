import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
    resolve: {
        dedupe: ['vue'],
        alias: {
            'vue': path.resolve(__dirname, 'node_modules/vue'),
        },
    },
    plugins: [
        {
            name: 'dynamic-terminal-proxy',
            configureServer(server) {
                // Use the same proxy library Vite uses internally
                const httpProxy = require('http-proxy')
                const proxy = httpProxy.createProxyServer({
                    changeOrigin: true,
                    ws: true
                })

                // Intercept HTTP requests
                server.middlewares.use((req, res, next) => {
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

                // Intercept WebSocket upgrades
                server.httpServer?.on('upgrade', (req, socket, head) => {
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
    ],
    server: {
        // We handle proxying via the plugin above for better reliability
    }
})
