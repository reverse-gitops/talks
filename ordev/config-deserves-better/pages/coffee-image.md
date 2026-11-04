---
layout: default
transition: fade
---

<script setup>
import scriptFile from './demo-scripts/coffee-image.yaml?url'
</script>

###### Demo · the secret word arrived

# From a commit <span class="green">to a pod.</span>

<div class="live-terminal">
  <ScriptedTerminal :script-file="scriptFile" session-id="coffee-image" />
</div>

<a class="page" href="https://coffee-settings.k8s.koudijs.dev/decrypted/" target="_blank">coffee-settings.k8s.koudijs.dev/decrypted/ ↗</a>

<Sources slim :items="[{ name: 'coffee-settings', href: 'https://github.com/ConfigButler/coffee-settings' }, { name: 'settings-image', href: 'https://github.com/ConfigButler/settings-image' }]" />

<!--
26:00. Back to the secret word.

[. .] cd into coffee-settings.

[. .] git pull.

[. .] git log: there's the commit, with the name of whoever typed the word.

[. .] The Secret in Git. Point at it: this is all Git knows, ciphertext. The name is still readable.

[. .] What's in the image: the same encrypted file next to the CoffeeConfig.

[. .] Over to the GitOps repo.

[. .] Flux's own commits there: it saw the new image and wrote the digest. Nobody typed this. This repo is the real truth of what runs.

[. .] The digest the Deployment points at. THE line: "this is what's running".

[. .] STATUS.txt: this pod read its key from OpenBao with its own identity, and opened the Secrets.

Then click the link and open the word in the browser. This page only shows it to prove that it opened: a real app keeps it to itself.
If the new image hasn't arrived yet: show the previous commit, and come back to it during the next slides.
-->

<style>
.slidev-layout h1 { margin-bottom: 16px; }
.live-terminal { height: 580px; border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
.page { position: absolute; right: 64px; top: 72px; font-family: var(--mono); font-size: 20px; color: var(--accent); text-decoration: none; border-bottom: 2px solid var(--accent); }
</style>
