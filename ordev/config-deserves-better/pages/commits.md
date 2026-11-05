---
layout: default
transition: fade
---

<script setup>
import scriptFile from './demo-scripts/commits.yaml?url'
</script>

###### What you just did · in Git

# Your commits. <span class="green">Your names, your reasons.</span>

<div class="live-terminal">
  <ScriptedTerminal :script-file="scriptFile" session-id="reverser-audit-trail" />
</div>

<Sources slim :items="[{ name: 'GitOps Reverser', href: 'https://github.com/ConfigButler/gitops-reverser' }]" />

<!--
7:30 · Someone changes their colour live and types why.
Keep Kubernetes out of this. Only commits and messages: the wow is that it's them. The files come right after this.

[. .] cd into the repo.

[. .] git pull.

[. .] git log, one line per commit. Read a few out loud: the names are you, and the messages are why you did it.
Who did it? Why? Those were my frustrations a few minutes ago.

[. .] The newest one in full. Point at the two fields:
Author = the person who made the change, which they didn't have to type.
Commit = the bot that actually wrote it.

You never saw Git, and yet here you are.

The turn: "This is an audit log, and it's a good start. But recorded afterwards is a different guarantee than approved beforehand. It isn't delivery yet."
-->

<style>
.live-terminal { height: 640px; border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
</style>
