---
layout: default
transition: fade
---

###### Some of you recognised this

# Don't dismiss this <span class="green">if you dislike Kubernetes.</span>

<div class="two">
  <div class="card"><b>1</b><strong>The idea stands</strong><span>You can push a representation of your configuration as an artifact, however you produce it.</span></div>
  <div class="card"><b>2</b><strong>Be explicit about the process around it</strong><span>Who changes it, what checks it, and how it moves to production.</span></div>
</div>

<Sources slim :items="[{ name: 'Reverse GitOps', href: 'https://reversegitops.dev' }, { name: 'Config Deserves Better', href: 'https://configdeservesbetter.dev' }]" />

<!--
17:00. Some of you will recognise this as Kubernetes. It is. There's an API behind this, and I use it for its great API and for writing back to Git. That part stays a bit of magic until tomorrow.

Two important things, also if you dislike Kubernetes:

The idea stands. You can push a representation as an artifact. It doesn't matter what produced it.

And be explicit about the process around it. That's what the rest of this talk is about.
-->

<style>
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 44px; }
.card { display: flex; flex-direction: column; gap: 14px; padding: 36px; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 16px; }
.card b { width: 56px; height: 56px; border-radius: 28px; display: flex; align-items: center; justify-content: center; font-size: 28px; color: var(--bg); background: var(--good); }
.card strong { font-size: 40px; line-height: 1.15; }
.card span { font-size: 28px; line-height: 1.3; color: var(--soft); }
</style>
