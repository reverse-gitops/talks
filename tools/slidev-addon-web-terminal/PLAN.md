# Web Terminal Session Refactor Plan

## Summary

Refactor the addon in two incremental phases:

1. Stabilize the current shared-session model by moving all session creation and stale-session recovery behind a single per-session controller/registry path.
2. Split `WebTerminal.vue` into a thin terminal view layer plus dedicated session orchestration logic, and define a backend PTY lifetime contract so remount persistence is real rather than best-effort.

This keeps the existing component usable with only small API cleanup, fixes the duplicate-PTY recovery bug, and gives the addon a clean boundary between UI concerns and session lifecycle concerns.

## Key Changes

### 1. Consolidate session ownership into one controller per `sessionId`

- Introduce a new internal module, `terminalSessionController`, keyed by `sessionId`.
- Move these responsibilities out of `WebTerminal.vue` into that controller:
  - cached URL lookup
  - BroadcastChannel discovery
  - PTY creation
  - stale URL invalidation
  - serialized recovery after `4404`
  - connection state tracking
- Keep `sessionBridgeRegistry.ts` as the low-level shared-tab registry, but extend it so recovery uses the same serialized path as initial creation.

Internal controller contract:

```ts
interface TerminalSessionController {
  resolveConnection(): Promise<{ url: string; pid: string | null; source: 'cached' | 'shared' | 'created' | 'recovered' } | null>
  handleSocketClose(event: CloseEvent, currentUrl: string): Promise<{ retryUrl: string } | null>
  setFocused(focused: boolean): void
  requestResize(cols: number, rows: number, reason: string, force?: boolean): void
  dispose(): void
}
```

Registry changes:

- Add `invalidateCachedUrl(sessionId, expectedUrl?)`.
- Add `recoverSessionUrl(sessionId, staleUrl, creator)` or equivalent `ensureFreshSessionUrl(...)`.
- Serialize recovery with the same shared promise mechanism used for initial creation.
- Keep invalidation idempotent: if a recovery promise is already in flight, later callers reuse it instead of clearing state again.

### 2. Make `WebTerminal.vue` a terminal view shell

`WebTerminal.vue` should only own:

- xterm creation/disposal
- DOM event wiring
- focus state
- click-to-execute behavior
- mouse coordinate fix
- resize observer hookup
- Slidev placeholder/thumbnail checks
- rendering terminal connection state to the user

It should no longer:

- decide how a PTY is discovered or created
- know about BroadcastChannel behavior
- announce URLs directly
- create PTYs directly during recovery

Resulting shape:

- `WebTerminal.vue` initializes xterm and asks the controller for a connection.
- The controller returns the URL and source metadata.
- `WebTerminal.vue` opens the socket and forwards close events back to the controller.
- If the controller returns a retry URL, the component reconnects once through that path.

### 3. Define explicit session semantics

Adopt these rules:

- `backendUrl` mode is the managed/shared mode.
- `wsUrl` mode remains unmanaged/direct mode and does not participate in session sharing or recovery orchestration.
- `sessionId` remains the public grouping key for shared sessions.
- Default behavior stays backward-compatible: if `sessionId` is absent, derive it from `backendUrl` as today.
- Add a runtime warning when both `wsUrl` and `backendUrl` are provided; `wsUrl` wins and shared-session features are disabled.

No breaking public prop changes are required. Small API cleanup is documentation and validation only.

### 4. Add a backend PTY lifetime contract

The frontend refactor should assume and document a real backend session policy instead of guessing.

Backend contract to target:

- `POST /api/terminals` creates a terminal session and returns a session identifier.
- When the last WebSocket disconnects, the PTY is not killed immediately.
- The backend keeps the PTY alive for a 5-minute grace period by default.
- A reconnect to the same session during that window reattaches to the existing PTY.
- After the grace period, reconnect attempts fail with `4404` / `terminal-not-found`.
- Optional future enhancement: explicit `DELETE /api/terminals/:id` for eager cleanup.

Frontend behavior under this contract:

- Remount within the grace window reuses the same PTY and shell state.
- `4404` becomes a true “session expired/missing” signal, not a normal navigation side effect.
- Recovery path creates exactly one replacement PTY for the session group.

### 5. Tighten observability

- Replace scattered debug strings with structured session lifecycle events:
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
- Include `instanceId`, `sessionId`, `url`, `pid`, `renderContext`, and `source`.
- Keep debug output opt-in through the existing `debug`/query/localStorage path.

## Test Plan

Add tests in three layers.

### 1. Registry/controller unit tests

- concurrent `ensureSessionUrl` callers create exactly one PTY
- cached URL is returned immediately on remount
- `invalidateCachedUrl` clears only the matching stale URL
- concurrent stale-session recoveries share one recovery promise
- failed recovery clears pending state and allows retry
- recovery does not duplicate announcements

### 2. Component integration tests

Use mocked `fetch`, `WebSocket`, `BroadcastChannel`, and xterm shell objects.

Scenarios:

- 6 same-tab mounts with no cached URL create one PTY and 6 sockets
- remount after cached URL hit connects without waiting for BroadcastChannel timeout
- cached stale URL returning `4404` causes one replacement PTY creation and all instances reconnect to it
- thumbnail/overview instances never trigger resize corruption
- `wsUrl` direct mode bypasses session controller features

### 3. Backend/session acceptance scenarios

- navigate away and back within 5 minutes: same shell state
- open presenter and main view together: one PTY session
- open second browser window: shared session via BroadcastChannel plus backend persistence
- let grace window expire: next reconnect gets `4404`, then one fresh session is created

## Assumptions And Defaults

- Default path is incremental refactor, not a full addon rewrite.
- Public `WebTerminal` props stay compatible; only validation/docs are tightened.
- Shared-session behavior applies only to `backendUrl` mode.
- Backend persistence is included in scope and uses a 5-minute disconnect grace period as the default.
- `4404` / `terminal-not-found` remains the canonical stale-session signal.
- Existing `sessionBridge.ts` stays as the cross-window transport; it is not promoted into the source of truth for recovery logic.
