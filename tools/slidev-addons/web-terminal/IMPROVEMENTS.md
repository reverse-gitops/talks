# Web Terminal Session Architecture

## What changed

The shared-session lifecycle is no longer implemented ad hoc inside
`WebTerminal.vue`.

The addon now has three layers:

1. `WebTerminal.vue`
   - owns xterm.js, DOM events, focus state, resize observers, and Slidev-specific UI behavior
2. `terminalSessionController.ts`
   - owns managed-session resolution, PTY creation, stale-session recovery, and resize posts
3. `sessionBridgeRegistry.ts`
   - owns cross-instance bridge reuse, cached URL state, and same-tab serialization

This removes the previous split where initial startup used registry serialization but
stale-session recovery bypassed it.

## Managed vs direct mode

Two connection modes are now explicit:

- `backendUrl`: managed mode
  - participates in presenter/main PTY sharing
  - uses cached URLs, BroadcastChannel discovery, and serialized recovery
- `wsUrl`: direct mode
  - connects straight to the provided WebSocket
  - does not participate in shared-session orchestration

If both are provided, `wsUrl` wins and the component logs a runtime warning.

## Shared-session behavior

Managed mode resolves a session in this order:

1. cached URL in `sessionBridgeRegistry`
2. shared URL announced by another window via `BroadcastChannel`
3. newly created PTY serialized through `ensureSessionUrl`

Recovery from `4404` / `terminal-not-found` now goes through
`recoverSessionUrl`, which:

- invalidates the stale cached URL
- reuses any in-flight recovery promise
- creates at most one replacement PTY per `sessionId`
- announces the fresh URL back through the bridge

This closes the race where several remounted terminals could each create their own
replacement PTY after a stale cached reconnect.

## Backend contract

The frontend now documents a concrete session-lifetime expectation for managed mode:

- `POST /api/terminals` creates a terminal session
- reconnecting to `/terminals/:id` should reattach to the same PTY while it is still alive
- the backend should keep PTYs alive for a short disconnect grace period
  - recommended default: 5 minutes
- once the PTY is gone, reconnect attempts should fail with `4404` or
  `terminal-not-found`

Without that grace period, slide remounts still work, but they degrade into a
recover-and-recreate path instead of preserving the original shell state.

## Observability

Managed-session flow now emits structured debug events such as:

- `session.resolve.start`
- `session.resolve.cached_hit`
- `session.resolve.shared_hit`
- `session.create.start`
- `session.create.success`
- `session.recover.start`
- `session.recover.reused_pending`
- `session.recover.success`
- `socket.open`
- `socket.close`

These remain opt-in through the existing `debug` prop, `?webTerminalDebug=1`,
or `localStorage.webTerminalDebug`.

## Test coverage

The automated test suite now covers:

- concurrent same-tab PTY creation through the registry
- cache invalidation semantics
- serialized stale-session recovery
- managed controller behavior for remount reuse and recovery
- resize posting behavior gated by focus state
