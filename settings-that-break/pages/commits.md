---
layout: default
transition: fade
---

<script setup>
import scriptFile from './demo-scripts/commits.yaml?url'
</script>

###### What you just did · in Git

# Here are your commits. <span class="green">With your names.</span>

<div class="live-terminal">
  <ScriptedTerminal :script-file="scriptFile" session-id="reverser-audit-trail" />
</div>

<!--
7:30 · Someone changes their colour live: form → object → commit.

[. .] cd into k8s-trail: the repo Reverser writes to.

[. .] git pull.

[. .] git log, one line per commit: look at the names, that's you.

[. .] The newest commit, in full. Point at the two fields:
Author = the human the API server authenticated (from the audit event).
Commit = ConfigButler Bot, the one that actually wrote it.

[. .] tree: what's in the repo. One folder per GitTarget: seats, coffee, databases, quizzes, the Room. Seats are filed the way the room looks: one file per row.

[. .] Last: the first row file, through yq. Every seat in row 2, as plain Kubernetes YAML.
Plain YAML files in a repo: Flux, Argo CD, kustomize can all use these. Really GitOps-compatible.

Recorded afterwards is a different guarantee than approved beforehand. Say it:
- Every change is a commit with the real author: from the API server, not typed in.
- Flux pulls from Git and reconciles the config cluster: Git stays the source of truth.
- Test gets the change straight away. Production waits for a review.

Reverser pushes your change to a branch. Turning that into a PR is the next step, not built yet.
Today I open it by hand, or a small CI job does it.
-->

<style>
.live-terminal { height: 640px; border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
</style>
