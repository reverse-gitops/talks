---
layout: default
transition: fade
---

<script setup>
import scriptFile from './demo-scripts/api-key.yaml?url'
</script>

###### Let's just do it

# My token can read. <span class="green">It can't delete.</span>

<div class="live-terminal">
  <ScriptedTerminal :script-file="scriptFile" session-id="abusing-api-key" :font-size="22" />
</div>

<style>
.slidev-layout h1 { margin-bottom: 16px; }
.live-terminal { height: 660px; border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
</style>

<!--
**14:00 · 2:30**

Live. Dot key: one types, one runs. Eight steps. Talk little during setup.

[. .] Trust the certificate. Don't dwell.
[. .] G, V, R.
[. .] The URL reads by itself.
[. .] The role: get, list, watch on seats.
[. .] The API key: one command, not printed.
[. .] Decode: who I am, expires in one hour.
[. .] Plain curl. There's the object.
[. .] Delete. Forbidden. Read it out loud. "I didn't write a line of code for this."

Network fails: move on. The idea is on the previous slides.
-->
