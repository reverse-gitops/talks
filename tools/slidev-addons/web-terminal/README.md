# Slidev Addon Web Terminal

This addon provides a `WebTerminal` component for [Slidev](https://sli.dev/) presentations, allowing you to embed a fully functional terminal connected to a backend process.

## Features

- **Xterm.js Integration**: Uses a full-featured terminal emulator.
- **Backend Connection**: Connects to a backend WebSocket/API service.
  - See: [berttejeda/bert.webterminal](https://github.com/berttejeda/bert.webterminal)
- **Zero-Config Dynamic Proxy**: Specify any `backendUrl` (including different domains and ports) in your markdown, and the addon handles CORS and proxying automatically.
- **Managed Shared Sessions**: `backendUrl` mode shares one PTY across presenter/main windows and serializes same-tab creation and recovery.
- **Click to Execute**: Commands are automatically sent to the terminal when clicking an element with the `.clickable-code` class (e.g. a wrapper around a code block).
- **Auto-fit**: Automatically resizes the terminal to fit the container.
- **Theme Support**: Styled for dark mode by default.

## Installation

```bash
npm install slidev-addon-web-terminal
```

## Backend Setup

This addon requires a backend service to handle the terminal sessions.

To get started quickly, run the [Webterminal Agent](https://github.com/berttejeda/bert.webterminal) using Docker:

```bash
docker run -d --name webterminal --rm -p {{ HOSTPORT }}:10001 berttejeda/bill-webterminal
```

Example (port 10001):
```bash
docker run -d --name webterminal --rm -p 10001:10001 berttejeda/bill-webterminal
```

### Backend session contract

Managed `backendUrl` mode assumes the backend supports short-lived PTY persistence:

- `POST /api/terminals` creates a session identifier
- reconnecting to `/terminals/:id` reattaches to the same PTY while it is alive
- PTYs should survive brief WebSocket disconnects
- recommended disconnect grace period: 5 minutes
- expired sessions should fail with `4404` or `terminal-not-found`

If the backend kills the PTY immediately when the last socket closes, the addon
still works, but navigation/remount flows will recreate the PTY instead of
preserving shell state.

## Configuration

To enable the **Dynamic Port Proxy** (which solves CORS issues when using different hosts or ports), you must add the proxy plugin to your `vite.config.ts`.

### 1. Install `http-proxy`
```bash
npm install -s http-proxy
```

### 2. Update `vite.config.ts`
Add the following plugin to your Vite configuration:

```typescript
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      name: 'dynamic-terminal-proxy',
      configureServer(server) {
        const httpProxy = require('http-proxy')
        const proxy = httpProxy.createProxyServer({ changeOrigin: true, ws: true })

        const proxyPattern = /^\/proxy\/([^\/]+)\/([^\/]+)\/([^\/]+)(.*)/

        server.middlewares.use((req, res, next) => {
          const match = req.url?.match(proxyPattern)
          if (match) {
            const [_, protocol, host, port, rest] = match
            const target = `${protocol}://${host}:${port}`
            req.url = rest || '/'
            proxy.web(req, res, { target, secure: protocol === 'https' }, (e) => {
              res.statusCode = 502
              res.end(`Proxy error: ${e.message}`)
            })
            return
          }
          next()
        })

        server.httpServer?.on('upgrade', (req, socket, head) => {
          const match = req.url?.match(proxyPattern)
          if (match) {
            const [_, protocol, host, port, rest] = match
            req.url = rest || '/'
            proxy.ws(req, socket, head, { target: `${protocol}://${host}:${port}`, secure: protocol === 'https' })
          }
        })
      }
    }
  ]
})
```

## Usage

In your slides configuration (e.g., `slides.md`):

```markdown
---
addons:
  - web-terminal
---
```

Then use the component in your slides. You can point to any backend URL directly:

```markdown
<!-- Localhost with default port -->
<WebTerminal backendUrl="http://localhost:10001" />

<!-- Arbitrary remote host (handles CORS automatically) -->
<WebTerminal backendUrl="https://my-websocket-host.example.com:4443" />

<!-- Direct unmanaged mode -->
<WebTerminal wsUrl="wss://my-websocket-host.example.com/terminals/preallocated" />
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `backendUrl` | `string` | - | Managed session mode. Creates PTYs through the backend API and participates in shared-session caching, discovery, and recovery. Cross-origin backends are rewritten through the dynamic proxy. |
| `wsUrl` | `string` | - | Direct unmanaged mode. Connects to the provided WebSocket and bypasses PTY creation, shared-session caching, and recovery orchestration. |
| `sessionId` | `string` | `backendUrl` | Stable identifier used to share one managed PTY between the presentation and presenter windows. Set this explicitly when multiple terminals should intentionally share or intentionally not share the same backend session. |
| `fontSize` | `number` | `15` | Terminal font size in pixels. |
| `releaseKey` | `string` | `'F2'` | Key that releases keyboard focus from the terminal back to Slidev. |
| `debug` | `boolean` | `false` | Enables verbose console logging for terminal lifecycle, bridge handshake, and websocket events. |

If both `wsUrl` and `backendUrl` are provided, `wsUrl` takes precedence and the
component logs a warning because managed sharing is disabled in that case.

### Presenter mode / TTY sharing

When you open Slidev's presenter view, the terminal component in the speaker window automatically connects to the **same PTY session** as the main presentation window. This means:

- Commands typed in either window are sent to the same shell process.
- Output appears in both windows simultaneously (from the moment the presenter view connects).
- No extra configuration is needed — it works automatically as long as `backendUrl` is used.

> **Note**: The presenter view does not replay scrollback history from before it connected. Both windows share the same live session going forward.

If the main presentation window is not open when presenter view loads, the
presenter window falls back to creating its own terminal session after a short
discovery timeout. Concurrent same-tab mounts are serialized so they do not
spawn duplicate PTYs for the same `sessionId`.

### Debug logging

To troubleshoot presenter/main synchronization, enable debug logs in one of these ways:

- Prop: `<WebTerminal ... :debug="true" />`
- Query parameter: append `?webTerminalDebug=1` to the Slidev URL
- Local storage: `localStorage.setItem('webTerminalDebug', '1')`

## Development

```bash
# Install dependencies
npm install

# Run linter
npm run lint
```
