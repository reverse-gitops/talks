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

<div class="pages">
  <a href="https://demo.koudijs.dev/" target="_blank">demo.koudijs.dev ↗</a>
  <a href="https://demo-production.koudijs.dev/dont-do-this" target="_blank">demo-production.koudijs.dev/dont-do-this ↗</a>
  <a href="https://coffee-settings.k8s.koudijs.dev/decrypted/" target="_blank">coffee-settings.k8s.koudijs.dev/decrypted/ ↗</a>
</div>

<div class="more">
  <div>
    <h3>How is promotion now done</h3>
    <a href="https://kargo.k8s.koudijs.dev/project/coffee-settings-kargo" target="_blank">kargo.k8s.koudijs.dev/project/coffee-settings-kargo</a>
    <a href="https://fluxcd.k8s.koudijs.dev/resource/ImageUpdateAutomation/flux-system/coffee-settings#reconciler-spec" target="_blank">fluxcd.k8s.koudijs.dev/…/coffee-settings</a>
  </div>
  <div>
    <h3>Which environments do we now run</h3>
    <a href="https://demo-production.koudijs.dev" target="_blank">demo-production.koudijs.dev</a>
    <a href="https://coffee-settings.k8s.koudijs.dev/resources/coffeeconfig.yaml" target="_blank">coffee-settings.k8s.koudijs.dev/resources/coffeeconfig.yaml</a>
    <a href="https://coffee-settings.k8s.koudijs.dev/decrypted/STATUS.txt" target="_blank">coffee-settings.k8s.koudijs.dev/decrypted/STATUS.txt</a>
  </div>
  <div>
    <h3>&nbsp;</h3>
    <a href="https://coffee-settings-kargo-test.k8s.koudijs.dev/resources/coffeeconfig.yaml" target="_blank">coffee-settings-kargo-test.k8s.koudijs.dev/resources/coffeeconfig.yaml</a>
    <a href="https://coffee-settings-kargo-prod.k8s.koudijs.dev/resources/coffeeconfig.yaml" target="_blank">coffee-settings-kargo-prod.k8s.koudijs.dev/resources/coffeeconfig.yaml</a>
  </div>
</div>

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

Then click the decrypted link and open the word in the browser. This page only shows it to prove that it opened: a real app keeps it to itself.
The other two links: demo.koudijs.dev is the demo itself, and demo-production.koudijs.dev/dont-do-this shows the actual files that are in there.
Below the terminal: how promotion is now done (Kargo, Flux), and the environments we now run.
If the new image hasn't arrived yet: show the previous commit, and come back to it during the next slides.
-->

<style>
.slidev-layout h1 { margin-bottom: 16px; }
.live-terminal { height: 580px; border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
.pages { position: absolute; right: 64px; top: 64px; display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
.more { position: absolute; left: 64px; top: 780px; display: flex; gap: 16px; }
.more > div { display: flex; flex-direction: column; gap: 2px; }
.more h3 { margin: 0 0 4px; font-family: var(--mono); font-size: 12px; font-weight: 600; line-height: 1.4; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
.more a { font-family: var(--mono); font-size: 12.5px; line-height: 1.5; color: var(--accent); text-decoration: none; }
.pages a { font-family: var(--mono); font-size: 18px; line-height: 1.3; color: var(--accent); text-decoration: none; border-bottom: 2px solid var(--accent); }
</style>
