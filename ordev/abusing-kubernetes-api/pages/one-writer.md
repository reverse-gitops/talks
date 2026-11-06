---
layout: default
transition: fade
---

###### The hard part of bi-directional GitOps

# Everything <span class="green">in the same order.</span>

<div class="row">
  <div class="label red">Flux on its own schedule: a race</div>
  <div class="steps">
    <b>Alice edits in the API</b><i>→</i><b>Her edit isn't in Git yet</b><i>→</i><b class="bad">Flux applies the older value</b><i>→</i><b class="bad">Her edit is gone</b>
  </div>
</div>

<div v-click class="row">
  <div class="label green">One writer per branch decides the moment</div>
  <div class="steps">
    <b>Alice edits in the API</b><i>→</i><b>Commit and push first</b><i>→</i><b class="good">Then ask Flux to apply once</b><i>→</i><b class="good">Her edit is safe</b>
  </div>
  <p class="how"><code>FluxClaim</code> and <code>ArgoCDClaim</code> hold the applier: its own schedule is off, so it only applies when asked.</p>
</div>

<p v-click class="honest">I got this wrong a few times. It's hard, and I'm open to improvements.</p>

<Sources slim label="read more" :items="[{ name: 'Bi-directional GitOps', href: 'https://github.com/ConfigButler/gitops-reverser/blob/main/docs/bi-directional.md' }]" />

<style>
.slidev-layout h1 { margin-bottom: 24px; }
.row { margin-bottom: 26px; }
.label { margin-bottom: 10px; font-size: 28px; line-height: 1.2; font-weight: 700; }
.steps { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr; align-items: stretch; gap: 12px; }
.steps b { display: flex; align-items: center; justify-content: center; min-height: 104px; padding: 10px 16px; box-sizing: border-box; text-align: center; font-size: 26px; line-height: 1.2; font-weight: 500; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 12px; }
.steps b.bad { border-color: var(--bad); color: var(--bad); }
.steps b.good { border-color: var(--good); color: var(--good); }
.steps i { align-self: center; font-style: normal; font-size: 26px; color: var(--arrow); }
.how { margin: 14px 0 0; font-size: 26px; line-height: 1.3; color: var(--soft); opacity: 1; }
.honest { position: absolute; left: 64px; right: 64px; bottom: 40px; margin: 0; text-align: center; font-family: 'Caveat', cursive; font-size: 52px; line-height: 1.1; font-weight: 600; color: var(--amber); opacity: 1; }
</style>

<!--
So both directions work. But here's the catch, and I got this wrong a few times.

Between an edit and its push, the edit is live in the cluster and not in Git yet. Flux doesn't know that. If it applies at that moment, it writes Git's older value over your edit. And then gitops-reverser sees that change and commits the revert. It looks perfectly normal, and your edit is gone. With Argo CD's self-heal it's reverted within a second.

[click] So there's one writer loop per branch, and it takes control of the reconcile moment. A FluxClaim keeps the Kustomization suspended, an ArgoCDClaim keeps automated sync off. Flux and Argo CD still fetch, apply, prune and report health. They only stop choosing when.

Edits get published first, and then Flux is asked to apply, once. A push to Git from someone else comes in through a webhook and takes its place in that same line.

[click] This is the hardest part I've built, and I'm sure it can be better. If you've solved this differently, please come and tell me.

Be honest if asked: the claims are off by default. My demo cluster doesn't run a claim right now.
-->
