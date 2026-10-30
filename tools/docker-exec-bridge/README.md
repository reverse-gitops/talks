# docker-exec-bridge

Backend for [slidev-addon-web-terminal](../slidev-addon-web-terminal) that opens each terminal as a
`docker exec` shell in **one container, fixed at startup**. It replaces
[btwebterminal](../btwebterminal): no Python, no terminal handling of its own. Docker allocates the
TTY; the bridge only pipes bytes between the WebSocket and the exec stream, over the Docker Engine
API on the Unix socket. The only dependency is `ws`.

Background and design: [settings-that-break/WEB-TERMINAL.md](../../settings-that-break/WEB-TERMINAL.md).

## Run

```sh
npm install
TARGET_CONTAINER=talks-demo ALLOWED_ORIGINS=https://demo.koudijs.dev,http://localhost:3030 npm start
```

Or as a container on the laptop, published on loopback only:

```sh
docker build -t docker-exec-bridge tools/docker-exec-bridge
docker run -d --name docker-exec-bridge \
  -p 127.0.0.1:10001:10001 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --group-add "$(stat -c %g /var/run/docker.sock)" \
  --security-opt label=disable \
  -e TARGET_CONTAINER=talks-demo \
  -e ALLOWED_ORIGINS=https://demo.koudijs.dev,http://localhost:3030 \
  docker-exec-bridge
```

`--group-add` gives the non-root `node` user access to the socket. `--security-opt label=disable`
is for SELinux hosts such as Fedora, where even root in a container gets `EACCES` on the socket
otherwise (the devcontainer uses the same flag). Run the target container with
`--init`, so processes the bridge kills are reaped instead of lingering as zombies.

The bridge refuses to start if the target container is not running.

## Configuration

Everything is read once, at startup. Nothing in a request can change the container, command, user or
environment of a shell.

| Variable | Default | Meaning |
|---|---|---|
| `TARGET_CONTAINER` | (required) | Name or id of the container every shell runs in |
| `ALLOWED_ORIGINS` | `http://localhost:3030` | Comma-separated origins (no path) allowed to use the bridge |
| `LISTEN_HOST` | `127.0.0.1` | Interface to listen on (`0.0.0.0` in the image) |
| `PORT` | `10001` | Port to listen on |
| `PUBLIC_PORT` | `PORT` | Port the browser uses, when Docker publishes on a different one |
| `EXEC_CMD` | `bash -l` | Command for each shell, split on spaces |
| `EXEC_USER` | container default | User the shell runs as |
| `EXEC_WORKDIR` | container default | Working directory of the shell |
| `GRACE_MS` | `30000` | How long a shell survives with no window attached |
| `MAX_SESSIONS` | `8` | Concurrent shells; more get `429` |
| `DOCKER_SOCKET` | `/var/run/docker.sock` | Docker Engine socket |

## Security

Access to the Docker socket is root on the host, so every HTTP request and WebSocket upgrade is
checked before anything reaches Docker:

- **`Origin` must be in `ALLOWED_ORIGINS`.** Browsers set it themselves, so another site open in the
  same browser cannot pose as the deck. A missing `Origin` (curl, scripts) is rejected too.
- **`Host` must be `127.0.0.1:<PUBLIC_PORT>` or `localhost:<PUBLIC_PORT>`.** This stops DNS
  rebinding, where an attacker's domain starts resolving to `127.0.0.1`.
- **CORS** only ever echoes an allowed origin, never `*`. Preflights asking for private network
  access get `Access-Control-Allow-Private-Network: true`.
- **Fixed target.** One container, one command, one user, set at startup.
- **Bounded.** At most `MAX_SESSIONS` shells, 64 KiB per WebSocket message, session ids are random
  UUIDs.

The bridge itself can still do anything the socket allows; keep the Docker socket out of the target
container, or a shell there can reach the host the same way.

## Protocol

The contract slidev-addon-web-terminal expects:

| Request | Result |
|---|---|
| `POST /api/terminals?cols=&rows=` | Starts a shell; returns its session id as `text/plain` |
| WebSocket `/terminals/:id` | Raw terminal bytes both ways. Buffered output (up to 512 KiB, restarting at the last clear-screen) is replayed first, so a second window or a remounted slide shows the same screen |
| `POST /api/terminals/:id/size?cols=&rows=` | Resizes the TTY |
| `DELETE /api/terminals/:id` | Ends the shell now |

An unknown or expired id closes the WebSocket with `4404` / `terminal-not-found`, and the addon
then starts a new session. When the shell exits by itself, open windows are closed with `1000` /
`terminal-exited`.

## Ending shells

Docker does not end an exec when its stream closes. Each shell gets `BRIDGE_SESSION=<id>` in its
environment, which its child processes inherit. To end a session, the bridge runs a short `sh` script
in the container, as the same user, that kills every process carrying that marker. This happens on
`DELETE`, after the grace period, and when the bridge stops (`SIGINT` / `SIGTERM`). The target
container needs `sh`, `tr` and `grep`.

## Tests

```sh
npm test
```

The tests run against a fake Docker client, so they need no Docker. The real Docker path was
checked by hand against an Alpine container: shell I/O, terminal size, resize, the grace-period
kill, and `403` for a request without `Origin`.
