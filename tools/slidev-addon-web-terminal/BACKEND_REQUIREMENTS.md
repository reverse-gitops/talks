# Backend Requirements For Shared PTY Sessions

This document is for the backend team responsible for the terminal service used by
`slidev-addon-web-terminal`.

The frontend refactor now assumes explicit PTY session lifetime semantics instead
of treating disconnect behavior as undefined. The backend needs to implement the
contract below so presenter/main-window remounts preserve shell state reliably.

## Why this is needed

The frontend now:

- caches PTY WebSocket URLs per `sessionId`
- reconnects to the same PTY after slide remounts
- treats `4404` / `terminal-not-found` as "the PTY is really gone"
- recovers by creating exactly one replacement PTY per shared session

If the backend kills the PTY immediately when the last WebSocket disconnects,
navigation between slides turns every remount into a recreate flow. That still
works, but it loses shell state and defeats the shared-session architecture.

## Required behavior

### 1. PTY sessions must survive brief WebSocket disconnects

When the last WebSocket attached to a PTY disconnects:

- do not kill the PTY immediately
- keep the PTY alive for a configurable grace period
- recommended default: `5m`

During that grace period:

- reconnecting to the same `/terminals/:id` must reattach to the existing PTY
- shell state, cwd, scrollback, running processes, and TTY state must remain intact

If the grace period expires without a reconnect:

- terminate the PTY
- clean up all backend session state

### 2. Existing session IDs must remain reconnectable

Current frontend behavior assumes:

- `POST /api/terminals` returns a stable session identifier
- the WebSocket URL is `/terminals/:id`
- reconnecting to `/terminals/:id` refers to the same PTY as long as it is alive

This identifier does not need to change format. It only needs stable reconnect
semantics.

### 3. Missing or expired sessions must fail explicitly

When a client connects to `/terminals/:id` and the PTY no longer exists:

- reject the WebSocket with close code `4404`
- use close reason `terminal-not-found`

The frontend already treats either of these as the canonical stale-session signal.

### 4. Reconnect must cancel pending expiry

If a PTY is in the disconnect grace period and a client reconnects:

- cancel the scheduled PTY cleanup timer
- rebind the new WebSocket to the existing PTY
- continue normal streaming without creating a new PTY

This must work for:

- main presentation window remount
- presenter window remount
- two clients reconnecting nearly simultaneously

### 5. Resize endpoint behavior must remain unchanged

The frontend still uses:

- `POST /api/terminals/:id/size?cols=:cols&rows=:rows`

Requirements:

- ignore resize requests for already-expired PTYs safely
- return a non-2xx response only for true errors
- do not recreate a PTY from a resize request

## Required API contract

### Create session

`POST /api/terminals`

Response:

- `200 OK`
- response body: terminal session id as plain text

Semantics:

- creates a new PTY session
- session is initially unattached or immediately attachable
- returned id is used directly in `/terminals/:id`

### Attach/re-attach WebSocket

`GET /terminals/:id` as WebSocket upgrade

Semantics:

- if session exists: attach socket to existing PTY
- if session is disconnected-but-not-expired: reattach to same PTY
- if session is expired/missing: close with `4404` / `terminal-not-found`

### Resize

`POST /api/terminals/:id/size?cols=:cols&rows=:rows`

Semantics:

- resize existing PTY only
- no side effects beyond resize

### Optional but recommended: explicit cleanup

`DELETE /api/terminals/:id`

Not required for current frontend behavior, but recommended.

Semantics:

- terminate PTY immediately
- remove session state
- future `/terminals/:id` attach attempts return `4404`

## Session state machine

Recommended backend model:

1. `active`
   - PTY exists
   - at least one WebSocket attached, or recently detached but no expiry scheduled yet
2. `idle_grace`
   - PTY exists
   - zero WebSockets attached
   - expiry timer scheduled
3. `expired`
   - PTY terminated
   - no attach allowed

Transitions:

- `POST /api/terminals` -> `active`
- last socket disconnects -> `idle_grace`
- reconnect before timer expiry -> `active`
- grace timer fires -> `expired`
- `DELETE /api/terminals/:id` -> `expired`

## Configuration

Expose at least one backend configuration value:

- `PTY_DISCONNECT_GRACE_MS=300000`

Recommended behavior:

- values below `5000` should be considered unsafe for presenter remount flows
- value `0` may be allowed only for explicit debug/testing, not production/default use

## Concurrency requirements

The backend must tolerate races like:

- 2 browser windows attached to the same PTY
- both sockets disconnecting within milliseconds
- both reconnecting within milliseconds
- reconnect arriving while expiry timer is about to fire

Implementation requirement:

- cleanup and reconnect logic must be synchronized per PTY/session id
- the expiry timer must not win once a reconnect has been accepted

## Observability

Please log or emit metrics for:

- PTY created
- WebSocket attached
- WebSocket detached
- grace timer scheduled
- grace timer cancelled
- PTY expired by timer
- attach rejected because session missing

Minimum fields:

- `session_id`
- `pty_pid` if distinct from session id
- `attached_client_count`
- `grace_ms`
- event timestamp

## Acceptance criteria

The backend change is complete when all of these hold:

1. Create PTY, connect, run `pwd`, disconnect socket, reconnect within 5 minutes:
   same shell state remains.
2. Create PTY, connect two clients, disconnect both, reconnect one within 5 minutes:
   same PTY is reused.
3. Create PTY, disconnect all clients, wait past 5 minutes, reconnect:
   WebSocket closes with `4404` or `terminal-not-found`.
4. Reconnect just before expiry:
   PTY survives and timer is cancelled.
5. Resize requests during grace period:
   apply to the same PTY or fail safely if already expired.

## Non-goals

These are not required for the current frontend contract:

- persistent PTYs across backend restarts
- durable session storage
- scrollback replay API
- auth changes
- multi-tenant routing changes

## Notes for implementation

The simplest safe implementation is usually:

- store session records in memory keyed by terminal id
- each record holds:
  - PTY handle
  - attached socket count
  - optional expiry timer handle
- on last detach:
  - schedule timer
- on reattach:
  - cancel timer before finalizing attach
- on timer fire:
  - verify socket count is still zero
  - terminate PTY
  - delete session record

The frontend side is already implemented to take advantage of this contract.
