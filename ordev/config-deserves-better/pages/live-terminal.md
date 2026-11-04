---
layout: default
transition: fade
---

<script setup>
import scriptFile from './demo-scripts/live-terminal.yaml?url'
</script>

###### Live, not a recording

# This terminal runs in the devcontainer

<div class="live-terminal">
  <DemoTerminal
    backendUrl="http://127.0.0.1:10001"
    sessionId="reverser-live-terminal"
    :script-file="scriptFile"
    fontFamily="'JetBrains Mono', ui-monospace, monospace"
    :fontSize="18"
  />
</div>

<div class="live-terminal-path">
  slide → docker-exec-bridge (127.0.0.1:10001) → <code>docker exec</code> → bash in the devcontainer
</div>

<style>
.live-terminal {
  height: 560px;
  margin-top: 24px;
  border: 1px solid var(--line);
  border-radius: 10px;
  overflow: hidden;
}
.live-terminal-path {
  margin-top: 16px;
  font-family: var(--mono);
  font-size: 14px;
  color: var(--muted);
}
</style>

<!--
Press . to type the next command, . again to run it. Needs the bridge: task run-terminal-bridge.

The shell is a docker exec in the devcontainer, opened through the Docker Engine API.
The bridge only accepts this deck's origin, and only on 127.0.0.1.

[. .] whoami, hostname, pwd: it's my user, in my devcontainer.

[. .] kubectl get nodes: the real cluster.

[. .] git log: this repo, as it is right now.
-->
