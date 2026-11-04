---
layout: default
transition: fade
---

<script setup>
import scriptFile from './demo-scripts/chairs.yaml?url'
</script>

###### Your chair, as a real object

# YAML is just JSON <span class="green">that is afraid of curly braces.</span>

<div class="live-terminal">
  <ScriptedTerminal :script-file="scriptFile" session-id="chairs" />
</div>

<Sources slim :items="[{ name: 'GitOps Reverser', href: 'https://github.com/ConfigButler/gitops-reverser' }]" />

<!--
18:30. Enough pictures, here are the real objects. Back to the repo with your commits.

[. .] cd into the repo.

[. .] ls seats: plain files, filed the way the room looks. One file per row.

[. .] One chair, through yq. This is the real thing: somebody in this room.

[. .] The same chair as JSON. Read the title out loud.

[. .] Every chair on one line: emoji, place, name.

[. .] Which emoji does this room like? Text files, so you can throw tools at them. No database login, no admin screen.

That's the gist.
-->

<style>
.slidev-layout h1 { font-size: 56px; margin-bottom: 16px; }
.live-terminal { height: 640px; border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
</style>
