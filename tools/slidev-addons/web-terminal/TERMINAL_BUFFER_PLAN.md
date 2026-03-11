# Plan: Persist terminal screen output across slide navigation

## Problem

The previous improvement ([IMPROVEMENTS.md](./IMPROVEMENTS.md)) keeps the PTY session
(shell process) alive across unmount/remount cycles. However, **xterm.js is still
destroyed and recreated** on every navigation. The new terminal instance starts with a
blank screen, so the presenter sees an empty terminal even though the shell is intact.

Goal: restore the visual terminal output on remount, up to the point of the last `clear`.

---

## Key tool: `@xterm/addon-serialize`

The `@xterm/addon-serialize` addon (`@xterm/addon-serialize@0.14.0`, compatible with
xterm 6.x) serialises the complete terminal frame buffer — viewport + scrollback — into
a string of raw ANSI escape sequences. Writing that string to a fresh terminal instance
reproduces the visual state exactly, including colours, bold/italic, cursor position, and
scroll position.

```ts
import { SerializeAddon } from '@xterm/addon-serialize'

const serializeAddon = new SerializeAddon()
terminal.loadAddon(serializeAddon)

// capture
const snapshot = serializeAddon.serialize()   // full scrollback

// restore into a fresh terminal
terminal.write(snapshot)
```

An optional `rows` argument limits how many scrollback rows are included (default: all).

---

## "Clear releases the buffer"

When the user runs `clear` in the shell, the PTY sends one of these sequences:

| Sequence | Meaning |
|---|---|
| `ESC[2J` | Erase display |
| `ESC[3J` | Erase scrollback |
| `ESC[H ESC[2J` | Cursor home + erase display |

xterm.js processes them and empties its internal buffer. After a `clear`, calling
`serializeAddon.serialize()` returns a near-blank string (just the shell prompt at the
top). So **clearing and then navigating away naturally yields a blank terminal on
return** — no explicit detection needed if we snapshot at unmount time.

However, detecting clear *in real time* (while the component is mounted) is useful if we
want to immediately invalidate a previously stored snapshot mid-session, e.g. so that a
second window that remounts after a `clear` also sees a blank screen. That is an optional
enhancement described in Phase 2 below.

---

## Architecture

### Where to store the snapshot

Extend the existing `BridgeEntry` in `sessionBridgeRegistry.ts` with a
`terminalSnapshot` field. The session ID already serves as the natural key.

```ts
interface BridgeEntry {
  bridge: SessionBridge
  refCount: number
  lastUrl: string | null
  terminalSnapshot: string | null   // NEW
}
```

Expose two new functions:

```ts
export function saveTerminalSnapshot(sessionId: string, snapshot: string): void
export function getTerminalSnapshot(sessionId: string): string | null
```

Alternatively, a separate `terminalSnapshotRegistry.ts` module keeps concerns separated
— simpler if the bridge and snapshot lifecycles diverge later.

### Changes to `WebTerminal.vue`

#### On mount (after `terminal.open()`, before connecting WebSocket)

```ts
const snapshot = effectiveSessionId ? getTerminalSnapshot(effectiveSessionId) : null
if (snapshot) {
    terminal.write(snapshot)
    debugLog('Restored terminal snapshot', { bytes: snapshot.length })
}
```

Write the snapshot **before** the WebSocket connects. The PTY will not send unsolicited
output after reconnect (the shell is just waiting for input), so the snapshot stays
intact.

#### On unmount (before `terminal.dispose()`)

```ts
if (effectiveSessionId && serializeAddon && terminal) {
    const snapshot = serializeAddon.serialize(MAX_SCROLLBACK_ROWS)
    saveTerminalSnapshot(effectiveSessionId, snapshot)
    debugLog('Saved terminal snapshot', { bytes: snapshot.length })
}
```

`serializeAddon` must be disposed *after* this call, not before.

#### In `dispose()`

```ts
// Serialize before disposing (must come first)
if (effectiveSessionId && serializeAddon && terminal) {
    const snapshot = serializeAddon.serialize(MAX_SCROLLBACK_ROWS)
    saveTerminalSnapshot(effectiveSessionId, snapshot)
}
// ... existing socket.close(), terminal.dispose() ...
```

---

## Phase 1 — Basic snapshot restore (recommended first step)

1. `npm install @xterm/addon-serialize` (add to `dependencies` in package.json)
2. Extend `BridgeEntry` / registry with `terminalSnapshot`.
3. Load `SerializeAddon` in `initTerminal()`.
4. Save snapshot in `dispose()` before `terminal.dispose()`.
5. Restore snapshot in `initTerminal()` after `terminal.open()`, before WS connect.

Expected result: navigating away and back replays the complete terminal history. Running
`clear` before navigating away restores a clean terminal.

**Buffer size concern**: with `scrollback: 10000` (current setting), the serialized
string for a heavy session could be hundreds of KB. Introduce a constant
`MAX_SCROLLBACK_ROWS = 500` (configurable via prop) to cap what gets saved.

---

## Phase 2 — Real-time clear detection (optional enhancement)

Intercept incoming WebSocket data before it reaches xterm, detect clear sequences, and
immediately invalidate the stored snapshot. This ensures that a second browser window
opening after a `clear` also starts blank.

Replace `AttachAddon` with a manual message handler:

```ts
socket.addEventListener('message', (event) => {
    const data: string | ArrayBuffer = event.data
    if (typeof data === 'string' && containsClearSequence(data)) {
        if (effectiveSessionId) saveTerminalSnapshot(effectiveSessionId, '')
        debugLog('Clear detected; snapshot invalidated')
    }
    terminal?.write(data as string)
})
```

```ts
// Sequences that indicate the screen was cleared (not exhaustive, but covers bash/zsh clear)
const CLEAR_PATTERN = /\x1b\[(?:2J|3J)/

const containsClearSequence = (data: string): boolean => CLEAR_PATTERN.test(data)
```

Note: `AttachAddon` also handles `ArrayBuffer` and `Blob` payloads. If the backend
sends binary frames, those would need to be decoded before pattern matching (or just
skipped for clear detection, since most PTYs send text for `clear`).

---

## Expected behaviour after both phases

| Scenario | Before | After |
|---|---|---|
| Navigate away → back | Blank terminal | Previous output restored |
| Run `clear` → navigate away → back | Blank (happened to work) | Blank (explicit, reliable) |
| Open in second window (after content) | Content via BroadcastChannel (if bridge holds URL) | Blank (snapshot is per-tab, not cross-window) |
| Scroll up → navigate away → back | Blank, scroll lost | Scroll position restored |
| Very long session (10 000+ lines) | n/a | Capped at `MAX_SCROLLBACK_ROWS` to control memory |

---

## Files to change

| File | Change |
|---|---|
| `package.json` | Add `@xterm/addon-serialize` to `dependencies` |
| `utils/sessionBridgeRegistry.ts` | Add `terminalSnapshot` field + `saveTerminalSnapshot` / `getTerminalSnapshot` |
| `components/WebTerminal.vue` | Load `SerializeAddon`; save on unmount; restore on mount |
| `tests/terminalSnapshot.test.ts` | Unit tests for registry snapshot helpers |

---

---

## Approach comparison: client-side vs server-side

### Client-side (described above)

The browser serialises the xterm.js frame buffer on unmount and writes it back on
remount. The registry lives in JavaScript memory inside the browser tab.

| | |
|---|---|
| **Pros** | No backend changes required; self-contained in the addon |
| | Works with any PTY backend (ttyd, bert.webterminal, custom) |
| | Accurate serialisation via the xterm.js buffer — colours, cursor position, scroll |
| **Cons** | State is **per browser tab** — a second window, the presenter view, or a page refresh all start blank |
| | Requires the `@xterm/addon-serialize` dependency |
| | "Clear" detection needs intercepting the WebSocket stream per-client |
| | Memory lives in JS heap — large scrollback means a large string held per tab |

---

### Server-side (bert.webterminal)

The PTY server accumulates a ring buffer of all raw bytes it writes to each PTY session.
When a client (re)connects it receives the buffered output first, then live output. Clear
detection happens once, on the server, and is authoritative for every client.

This is conceptually what `tmux` and GNU `screen` do — they hold the terminal state and
replay it to any attaching client.

| | |
|---|---|
| **Pros** | **Cross-client**: presenter view, second browser window, and a refreshed tab all get the same buffer |
| | No client-side dependency or state |
| | "Clear" is detected once, server-side — all clients are automatically unaffected |
| | Buffer survives a page reload (server process is still running) |
| | Centralised buffer size control |
| **Cons** | Requires changes to bert.webterminal |
| | Adds per-session memory cost to the server process |

**Verdict**: the server-side approach is strictly better for multi-window and
multi-reload scenarios. The client-side approach is a reasonable fallback when
bert.webterminal cannot be modified or when using a third-party backend.

---

### Recommended strategy

Implement server-side buffering in bert.webterminal as the primary solution.
Add an optional client-side fallback (Phase 1 above) for compatibility with backends
that have not yet been updated. The client activates the fallback automatically when the
server does not advertise buffer support (see `X-Terminal-Buffer` header below).

---

## Server-side interface design for bert.webterminal

### 1  Per-session output buffer

The server maintains a ring buffer for each PTY session:

```
MAX_BUFFER_BYTES = 512 KB   (configurable)
```

Every byte written from the PTY process to its file descriptor is appended to the
session's buffer. When the buffer reaches `MAX_BUFFER_BYTES`, the oldest bytes are
dropped (ring / circular buffer).

The buffer is reset to empty whenever the server detects a screen-clear sequence in
the PTY output stream:

```
Clear trigger pattern:  ESC [ 2 J   or   ESC [ 3 J
```

These cover `clear`, `reset`, and most full-screen programs (vim, less) that erase the
display on exit.

---

### 2  Advertising buffer capability

The `POST /api/terminals` response should include a header so the client can detect
support without trial and error:

```
X-Terminal-Buffer: supported
```

The client checks this header after creating (or reusing) a session. If absent, the
client falls back to the client-side serialize approach.

---

### 3  Buffer retrieval endpoint

```
GET /api/terminals/{pid}/buffer
```

Returns the accumulated output since the last clear as a raw byte stream (the exact
bytes the PTY produced). The response type is `application/octet-stream`.

The client fetches this **before** opening the WebSocket, writes the bytes to the new
xterm.js instance, and then connects the WebSocket for live output.

```
Response headers:
  Content-Type:  application/octet-stream
  X-Buffer-Bytes: 14372        (informational)
  X-Buffer-Cleared: false      (true if the last event was a clear — client can skip write)
```

If the session does not exist or has already been reaped: `404 Not Found`.

---

### 4  WebSocket connection — no protocol change required

The existing WebSocket endpoint (`GET /terminals/{pid}`) is unchanged. The client
fetches the buffer via HTTP, writes it to xterm, then connects the WebSocket. From
the server's perspective, new connections look identical to today.

Optional enhancement: support a query parameter for clients that want replay inline
rather than via the extra HTTP request:

```
ws://host/terminals/{pid}?replay=1
```

With `?replay=1` the server sends the buffer contents as the very first WebSocket
message(s) before switching to live output.

---

### 5  Revised client flow with server-side buffer

```
initTerminal()
│
├─ acquireBridge / getCachedUrl  →  connectionUrl (PTY URL from registry)
│
├─ if server advertises X-Terminal-Buffer: supported
│    GET /api/terminals/{pid}/buffer
│    terminal.write(bufferBytes)          ← restore screen content
│    connectWebSocket(connectionUrl)      ← live output from here
│
└─ else  (fallback)
     if clientSnapshot exists: terminal.write(clientSnapshot)
     connectWebSocket(connectionUrl)
```

---

### 6  Summary of new bert.webterminal additions

| Addition | Details |
|---|---|
| Per-session ring buffer | Accumulate PTY stdout; ring at 512 KB |
| Clear detection | Reset ring buffer on `ESC[2J` / `ESC[3J` in PTY output |
| `POST /api/terminals` response header | Add `X-Terminal-Buffer: supported` |
| `GET /api/terminals/{pid}/buffer` | Return raw buffer bytes |
| Optional: `?replay=1` on WebSocket URL | Send buffer inline at WS open |

---

## Open questions

- **Cross-window snapshot sharing**: Should the snapshot be shared across windows via
  BroadcastChannel (like the PTY URL)? Probably not for now — the snapshot can be large
  and the second window can use the live PTY feed instead.

- **Snapshot invalidation on tab refresh**: The registry is in-memory, so a full page
  refresh always starts blank. This is acceptable.

- **Alt screen (vim/less)**: When the user opens a full-screen program like `vim`, the
  terminal uses the alt screen buffer. `serialize()` serializes whichever buffer is
  active. On restore the alt screen app won't be interactive (the WebSocket reconnects
  and the PTY is still running vim), so there may be a brief visual mismatch until the
  PTY sends a fresh redraw. Consider not saving the snapshot when the alt screen is
  active: `terminal.buffer.active.type === 'alternate'`.
