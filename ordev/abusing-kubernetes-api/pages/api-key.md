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

<!--
Live, on my real cluster. Each step takes two presses of the dot key: one types, one runs. Eight steps.

[. .] Setup: trust my cluster's certificate. Don't dwell on it.

[. .] Group, version, resource: G, V and R. Every Kubernetes type has those three, and my Seat is no exception.

[. .] And now the URL reads by itself: the API, the group and version, the namespace, the resource, and which one.

[. .] This is everything the role allows: get, list and watch, on seats. Nothing else.

[. .] Now the API key: one command. It isn't printed, because it's a real credential.

[. .] What's in it? Decode the middle part. It says who I am, and when it expires: in one hour. Most API keys never expire.

[. .] Read the seat: plain curl, with that token. There's the object.

[. .] And now delete it. Forbidden. Read the message out loud: the API server names who I am, and exactly what I'm not allowed to do. I didn't write a line of code for this.

If the network fails: the previous slide already shows the idea, so just move on.
-->

<style>
.slidev-layout h1 { margin-bottom: 16px; }
.live-terminal { height: 660px; border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
</style>
