# Code Walkthrough: Web Terminal Addon

This addon is split into a thin Vue terminal view plus a managed-session layer.

## Architecture

### `components/WebTerminal.vue`

The component is responsible for:

- creating and disposing the xterm instance
- loading xterm addons
- wiring DOM events
- managing focus UI
- handling Slidev-specific placeholder and thumbnail behavior
- opening a WebSocket once a connection URL has been resolved

It is no longer responsible for deciding how PTY sessions are discovered,
created, or recovered.

### `utils/terminalSessionController.ts`

The controller owns managed-session behavior for `backendUrl` mode:

- cached URL lookup
- BroadcastChannel discovery
- PTY creation
- stale-session recovery after `4404` / `terminal-not-found`
- focus-aware resize POSTs back to the backend

It exposes a small interface to the component:

```ts
interface TerminalSessionController {
  resolveConnection(): Promise<{ url: string; pid: string | null; source: 'cached' | 'shared' | 'created' | 'recovered' } | null>
  handleSocketClose(event: CloseEvent, currentUrl: string): Promise<{ retryUrl: string } | null>
  setFocused(focused: boolean): void
  requestResize(cols: number, rows: number, reason: string, force?: boolean): void
  dispose(): void
}
```

### `utils/sessionBridgeRegistry.ts`

This module is the per-tab shared state for managed sessions.

It keeps one `SessionBridge` per `sessionId` and stores:

- the last known PTY URL
- one in-flight same-tab creation promise
- one in-flight same-tab recovery promise

This is what prevents duplicate PTY creation when several instances mount or
recover at the same time inside one browsing context.

### `utils/sessionBridge.ts`

This remains the cross-window transport. It uses `BroadcastChannel` so the
presentation window and presenter window can announce and discover the same PTY
URL.

## Connection modes

### Managed mode: `backendUrl`

The controller resolves a connection in this order:

1. cached URL from the registry
2. shared URL from another window via `BroadcastChannel`
3. newly created PTY via `POST /api/terminals`

If the WebSocket later closes with `4404` or `terminal-not-found`, the
controller runs serialized recovery and returns one fresh retry URL for all
concurrent callers.

### Direct mode: `wsUrl`

If `wsUrl` is provided, the component bypasses the controller and connects
directly to that WebSocket.

This mode is intentionally unmanaged:

- no PTY creation
- no shared-session cache
- no recovery orchestration

If both `wsUrl` and `backendUrl` are provided, `wsUrl` wins.

## Backend expectations

Managed mode assumes the backend supports reconnecting to an existing PTY for a
short disconnect grace period. The recommended behavior is:

- `POST /api/terminals` creates a PTY session
- `/terminals/:id` reconnects to the same PTY while it is alive
- the PTY survives brief WebSocket disconnects
- once expired, reconnects fail with `4404` or `terminal-not-found`

If the backend kills PTYs immediately on disconnect, the frontend still works,
but slide remounts fall back to recovery instead of true session persistence.
