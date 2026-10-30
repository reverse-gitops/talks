# Slidev Addon Web Terminal

This addon provides a `WebTerminal` component for [Slidev](https://sli.dev/) presentations, allowing you to embed a fully functional terminal connected to a backend process.

## Features

- **Xterm.js Integration**: Uses a full-featured terminal emulator.
- **Backend Connection**: Connects directly to a backend WebSocket/API service, such as [docker-exec-bridge](../docker-exec-bridge).
- **Managed Shared Sessions**: `backendUrl` mode shares one PTY across presenter/main windows and serializes same-tab creation and recovery.
- **Click to Execute**: Commands are automatically sent to the terminal when clicking an element with the `.clickable-code` class (e.g. a wrapper around a code block).
- **DemoTerminal Controller**: A dedicated `DemoTerminal` component drives forward-only terminal demos from external YAML scripts, with `.` as the default advance key.
- **Auto-fit**: Automatically resizes the terminal to fit the container.
- **Theme Support**: Styled for dark mode by default.

## Installation

```bash
npm install slidev-addon-web-terminal
```

## Backend Setup

This addon needs a backend that runs the shells. In this repo that is
[docker-exec-bridge](../docker-exec-bridge): each terminal becomes a `docker exec` shell in one
container fixed at bridge startup.

```bash
TARGET_CONTAINER=talks-demo ALLOWED_ORIGINS=http://localhost:3030 node ../docker-exec-bridge/src/server.js
```

The browser connects to the backend directly, so the backend must allow the deck's origin (CORS
for `POST /api/terminals`, and the `Origin` of the WebSocket upgrade). A deck hosted elsewhere, such
as `https://demo.koudijs.dev`, works the same way when that origin is allowed: the terminals then
only work in a browser that can reach the backend on its own `127.0.0.1`.

### Backend session contract

Managed `backendUrl` mode assumes the backend supports short-lived PTY persistence:

- `POST /api/terminals?cols=&rows=` creates a session and returns its identifier as text
- reconnecting to `/terminals/:id` reattaches to the same PTY while it is alive, and replays recent output
- `POST /api/terminals/:id/size?cols=&rows=` resizes the PTY
- PTYs should survive brief WebSocket disconnects
- expired sessions should fail with `4404` or `terminal-not-found`

If the backend kills the PTY immediately when the last socket closes, the addon
still works, but navigation/remount flows will recreate the PTY instead of
preserving shell state.

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

<!-- Another host; it must allow the deck's origin -->
<WebTerminal backendUrl="https://my-websocket-host.example.com:4443" />

<!-- Direct unmanaged mode -->
<WebTerminal wsUrl="wss://my-websocket-host.example.com/terminals/preallocated" />
```

For scripted live demos, import a YAML file as a URL and use `DemoTerminal` instead:

```vue
<script setup>
import demoScriptUrl from './demo-scripts.yaml?url'
</script>

<DemoTerminal
  backendUrl="http://localhost:10001"
  sessionId="demo-terminal"
  :script-file="demoScriptUrl"
/>
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `backendUrl` | `string` | - | Managed session mode. Creates PTYs through the backend API and participates in shared-session caching, discovery, and recovery. The browser connects to it directly. |
| `wsUrl` | `string` | - | Direct unmanaged mode. Connects to the provided WebSocket and bypasses PTY creation, shared-session caching, and recovery orchestration. |
| `sessionId` | `string` | `backendUrl` | Stable identifier used to share one managed PTY between the presentation and presenter windows. Set this explicitly when multiple terminals should intentionally share or intentionally not share the same backend session. |
| `fontSize` | `number` | `15` | Terminal font size in pixels. |
| `releaseKey` | `string` | `'F2'` | Key that releases keyboard focus from the terminal back to Slidev. |
| `debug` | `boolean` | `false` | Enables verbose console logging for terminal lifecycle, bridge handshake, and websocket events. |

If both `wsUrl` and `backendUrl` are provided, `wsUrl` takes precedence and the
component logs a warning because managed sharing is disabled in that case.

### `DemoTerminal` props

`DemoTerminal` wraps `WebTerminal` and adds demo-step control on top of the live PTY.

| Prop | Type | Default | Description |
|---|---|---|---|
| `sessionId` | `string` | - | Stable identifier used for both the shared PTY session and the shared demo-step controller. |
| `scriptFile` | `string` | - | URL to a YAML demo script. In Slidev, the most reliable pattern is `import demoScriptUrl from './demo-scripts.yaml?url'`. |
| `advanceKey` | `string` | `'.'` | Keyboard key that advances the terminal demo when the active slide contains this component. |
| `showStepHint` | `boolean` | `true` | Shows the lower-right presenter hint such as `Demo 2/5 - press . to run`. |
| `backendUrl` / `wsUrl` | `string` | - | Passed through to `WebTerminal`. |
| `fontSize`, `fontFamily`, `releaseKey`, `activationKey`, `debug` | same as `WebTerminal` | - | Passed through to `WebTerminal`. |

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

### Demo script format

`DemoTerminal` uses a small flat YAML format:

```yaml
steps:
  - run: kubectl get nodes

  - run: |
      kubectl get quizsubmissions -A --watch

  - keys: ctrl+c
```

Supported step kinds:

- `run`: types the command and, by default, waits for a second `.` press before sending `Enter`
- `keys`: sends one of `ctrl+c`, `ctrl+d`, `tab`, `escape`, `up`, `down`, `left`, or `right`

Set `waitForEnter: false` on a `run` step to type and submit it in one advance.

## Development

```bash
# Install dependencies
npm install

# Run linter
npm run lint
```
