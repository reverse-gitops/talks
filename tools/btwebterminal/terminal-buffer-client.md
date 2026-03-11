# Terminal buffer — what the client expects from bert.webterminal

## Goal

When the WebTerminal component remounts (presenter navigates back to a slide), the
terminal should show the shell output that was on screen before navigation, without
replaying a new shell spawn. The PTY session already stays alive.
What is missing is the visual output (the characters send before the websocket is connected)

---

## Chosen approach: inline replay over the existing WebSocket

Rather than adding a separate HTTP endpoint for the buffer, the server sends buffered
output **as the first messages on every WebSocket connection** to an existing session,
immediately after the connection is established. Live PTY output follows without any
protocol change.

This eliminates the sync problem entirely: because the server controls the ordering
inside a single connection, there is no window between "fetch buffer" and "connect live"
during which output could be duplicated or lost.

```
Client connects WS to /terminals/{pid}
         │
         ▼
Server:  send buffered bytes  ──────────────────►  xterm writes them
         │
         ▼
Server:  pipe live PTY output ──────────────────►  xterm continues
```

The client does not change at all. `AttachAddon` writes every incoming WebSocket message
to xterm, whether it is buffered replay or live output.

---

## Server buffer behaviour

### Accumulation

For every PTY session the server maintains a byte buffer that records all output the PTY
process has produced since the buffer was last reset.

When a byte sequence arrives from the PTY, the server:
1. Appends it to the session buffer.
2. Forwards it to all currently connected WebSocket clients.

The buffer is a ring: once it exceeds a configurable maximum (e.g. 512 KB), the oldest
bytes are dropped.

### Reset on clear

Whenever the buffer append encounters the byte sequence `ESC [ 2 J` (`\x1b[2J`) or
`ESC [ 3 J` (`\x1b[3J`) — which is what `clear` and `reset` produce — the buffer is
truncated to empty before continuing to accumulate.

This means a client that reconnects after the user has run `clear` receives an empty (or
near-empty) replay, exactly matching the cleared screen.

### On WebSocket connect

When a client opens a WebSocket to `/terminals/{pid}`:

1. The server atomically snapshots the current buffer contents and marks the current
   write position in the PTY output stream.
2. It sends the snapshot bytes to the client.
3. From that write position onward, all new PTY output is forwarded to the client in
   real time.

Because steps 1–3 happen inside the server's PTY-output handler (not across two
separate requests), bytes produced between the snapshot and the start of live forwarding
cannot be skipped or duplicated.

### New sessions

For a brand-new session the buffer is empty. Step 2 sends nothing and step 3 begins
immediately. Behaviour is identical to today.

---

## What the client already does — no changes needed

1. Acquires or reuses the PTY URL from the session registry (no new PTY is spawned on
   return navigation).
2. Opens the WebSocket to the existing PTY URL.
3. Loads `AttachAddon`, which pipes all incoming messages — replay bytes first, then live
   — into the xterm instance.
4. Calls `safeFit` to resize.

The buffer replay is completely transparent. The client cannot tell (and does not need to
tell) whether a given message is a replayed byte or a live byte.

---

## Sequence diagram

```
Slide load #1 (fresh)
  client  ──POST /api/terminals──►  server  creates PTY, returns pid
  client  ──WS /terminals/{pid}──►  server  buffer empty → live only
  PTY produces: "$ ls\nfoo bar\n$ "
  server  ──"$ ls\nfoo bar\n$ "──►  client  (buffer now holds this)

Presenter navigates away
  client  WS close
  PTY stays alive; "$ " is the current prompt

Slide load #2 (return)
  client  ──WS /terminals/{pid}──►  server
  server  ──"$ ls\nfoo bar\n$ "──►  client  (replay from buffer)
  server  ──live output ─────────►  client  (continues normally)
  terminal shows the previous state ✓
```

---

## Summary of server changes

| What | Detail |
|---|---|
| Per-session byte buffer | Append PTY output; ring at a configurable max size |
| Clear detection | Reset buffer on `\x1b[2J` or `\x1b[3J` in PTY output |
| On WS connect | Flush buffered bytes to the new client before switching to live |
| Ordering guarantee | Snapshot + live-start must be atomic w.r.t. the PTY output stream |
