---
layout: default
transition: fade
---

<script setup>
import scriptFile from './demo-scripts/get-seats.yaml?url'
</script>

###### The same API, from a terminal

# Your seats. <span class="green">Just a <code>kubectl get</code>.</span>

<div class="live-terminal">
  <ScriptedTerminal :script-file="scriptFile" session-id="reverser-get-seats" />
</div>

<!--
Straight after "kube-apiserver is the API": here it is. The seats you claimed on your phone are objects in it.

[. .] kubectl get seats: row, column, your name, your emoji, your colour, your why.
-->

<style>
.live-terminal {
  height: 600px;
  margin-top: 24px;
  border: 1px solid var(--line);
  border-radius: 10px;
  overflow: hidden;
}
</style>
