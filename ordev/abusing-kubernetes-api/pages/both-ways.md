---
layout: default
transition: fade
---

###### Bi-directional GitOps

# One document. <span class="green">Both directions.</span>

<div class="ways">
  <div class="node">kube-apiserver<span>Seat/ordev-2-turing-7-1</span></div>
  <div class="arrows">
    <div v-click class="way reverse"><span>Reverse GitOps · commit</span><i>→</i></div>
    <div v-click class="way forward"><i>←</i><span>GitOps · apply</span></div>
  </div>
  <div class="node git">Git<span>the same YAML, in seats/</span></div>
</div>

<ul class="points">
  <li v-click><strong>Nothing to translate.</strong> It's the same object on both sides, so nothing gets lost on the way</li>
  <li v-click><strong>Edits: through the API.</strong> It checks them, knows who you are, and merges per field</li>
  <li v-click><strong>Promote and revert: through Git.</strong> That's what Git is good at</li>
</ul>

<Sources label="links" :items="[
  { name: 'GitOps Reverser', href: 'https://github.com/ConfigButler/gitops-reverser', note: 'API resources into Git as clean YAML' },
  { name: 'Reverse GitOps', href: 'https://reversegitops.dev', note: 'change through the API, a controller writes it to Git' },
]" />

<style>
.ways { display: grid; grid-template-columns: 440px 1fr 440px; align-items: center; gap: 28px; margin: 36px 0 36px; }
.ways .node { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 40px 0; font-size: 38px; font-weight: 700; background: var(--panel); border: 1px solid var(--accent); border-radius: 14px; }
.ways .node span { font-family: var(--mono); font-size: 20px; font-weight: 400; color: var(--soft); }
.ways .node.git { border-color: var(--good); }
.arrows { display: flex; flex-direction: column; gap: 28px; }
.way { display: flex; align-items: center; gap: 12px; font-family: var(--mono); font-size: 19px; white-space: nowrap; }
.way i { font-style: normal; font-size: 36px; line-height: 1; }
.way::before, .way::after { content: ''; flex: 1; border-top: 3px solid currentColor; }
.way.reverse { color: var(--good); }
.way.forward { color: var(--amber); }
.way span { color: var(--text); }
.slidev-layout ul.points { list-style: none; margin: 0; padding: 0; }
.slidev-layout .points li { margin: 0 0 16px; padding: 0; font-size: 29px; line-height: 1.25; }
</style>

<!--
**22:00 · 1:00**

The opposite of Argo CD and Flux, for plain KRM and simple Kustomize. Bi-directional GitOps.

[click] API change becomes a commit. Reverse GitOps.

[click] Commit applied to the API: what our GitOps friends already do.

[click] Only works because of KRM: same document.

[click] Edit through the API: validates, knows you, merges per field.

[click] Git: promote and go back.
-->
