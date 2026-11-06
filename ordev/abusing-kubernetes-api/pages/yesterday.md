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

<!--
**2:15 · 0:30**

Who was here? Yesterday: workload only reads an image, promoted together.

I kept my distance from the control plane. Is that right? Not sure anymore.

[click] Today: the workload talks to the API, and gives back.

Neither is wrong. Pinned and no runtime dependency, or live with a way back. You don't need yesterday's talk.
-->
