---
layout: default
transition: fade
---

###### Do you have a good option?

# Creating <span class="hl">the artifacts</span>

<div class="options">
  <div class="option">
    <h2>A Dockerfile</h2>
    <pre v-pre>FROM scratch
COPY settings/ /</pre>
    <p>You already know it. No base image and no shell.</p>
  </div>
  <div class="option">
    <h2>ORAS</h2>
    <pre v-pre>oras push \
  registry/shop-settings:43 \
  settings.yaml</pre>
    <p>Pushes plain files to any OCI registry.</p>
  </div>
  <div class="option mine">
    <h2>settings-image</h2>
    <p>The same files give the same digest. Nothing in it executes. A Secret must be SOPS-encrypted, or the build stops.</p>
    <p class="status">Mine, and still v0.1.</p>
  </div>
</div>

<Sources :items="[{ name: 'settings-image', href: 'https://github.com/ConfigButler/settings-image' }, { name: 'ORAS', href: 'https://oras.land' }]" />

<!--
19:00. That was the tool I built, but you may already have a good option to create these artifacts.

A Dockerfile from scratch: you already know it.

ORAS pushes plain files to any OCI registry.

And settings-image, the one you just saw. The same files give the same digest, nothing in it executes, and a Secret must be SOPS-encrypted or the build stops. It's still v0.1.
-->

<style>
h1 .hl { color: var(--good); }
.options { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 32px; margin-top: 40px; }
.option { display: flex; flex-direction: column; gap: 20px; padding: 32px; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 16px; }
.option.mine { border-color: var(--good); }
.option h2 { margin: 0; font-size: 36px; font-weight: 700; }
.option pre { margin: 0; font-family: var(--mono); font-size: 18px; line-height: 1.5; color: var(--text); background: none; white-space: pre-wrap; }
.option p { margin: 0; font-size: 28px; line-height: 1.3; color: var(--soft); opacity: 1; }
.option p.status { font-size: 24px; color: var(--amber); }
</style>
