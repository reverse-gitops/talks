---
layout: default
transition: fade
---

###### Yesterday's talk, in one slide

# Yesterday, your workload only read.<br><span class="green">Today, it also gives back.</span>

<div class="row">
  <div class="when">Yesterday</div>
  <div class="chain six">
    <b>Settings screen</b><i>→</i><b>kube-apiserver</b><i>→</i><b>gitops-reverser</b><i>→</i><b>Files in Git</b><i>→</i><b>Image</b><i>→</i><b>Your workload<small>read-only</small></b>
  </div>
  <p>Settings ship with your workload, promoted together. <strong>The workload never talks to Kubernetes.</strong></p>
</div>

<div v-click class="row">
  <div class="when green">Today</div>
  <div class="chain">
    <b>Settings screen</b><i>→</i><b class="api">Kubernetes API</b><i class="both">⇄</i><b class="hero">Your workload</b>
  </div>
  <p>Your workload gets direct access. <strong>It reads, and it reports back.</strong></p>
</div>

<Sources label="yesterday" :items="[{ name: 'The slides of both talks', href: 'https://koudijs.dev/speaking' }]" />

<!--
Who was here yesterday? Here's that talk in one slide. A settings screen, the kube-apiserver behind it, gitops-reverser turning changes into files in Git, an image, and your workload reads that image. Read-only, and promoted together with the workload.

Reflect: I kept my distance from the Kubernetes control plane, as if it were a bad thing. You really avoid needing Kubernetes. Is that right? I'm not sure anymore. I've built so many pieces of this by now that I'm starting to feel how complex it is.

[click] So today, the other way. It's simple: a consumer, a provider, and an API between them. Your workload talks to that API directly. That means it can also give something back: did it work?

Neither is wrong. The image gives you a pinned version and no dependency at runtime. Direct access gives you live changes and a way to report back, but your workload now depends on the API.

You don't need yesterday's talk to follow this one.
-->

<style>
.slidev-layout h1 { font-size: 56px; margin-bottom: 36px; }
.row { margin-bottom: 36px; }
.when { margin-bottom: 12px; font-family: var(--mono); font-size: 22px; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
.chain { display: flex; align-items: stretch; gap: 16px; font-size: 30px; }
.chain b { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 20px 12px; text-align: center; white-space: nowrap; font-weight: 500; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 12px; }
.chain.six { gap: 10px; font-size: 25px; }
.chain.six b { padding: 20px 6px; }
.chain b small { font-family: var(--mono); font-size: 20px; line-height: 1.3; color: var(--amber); }
.chain i { align-self: center; font-style: normal; color: var(--arrow); }
.chain b.api { border-color: var(--accent); }
.chain b.hero { font-weight: 700; color: var(--bg); background: var(--good); border-color: var(--good); }
.chain i.both { font-size: 48px; line-height: 1; color: var(--good); }
.row p { margin: 14px 0 0; font-size: 28px; line-height: 1.3; color: var(--soft); opacity: 1; }
</style>
