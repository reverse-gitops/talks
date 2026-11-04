---
layout: default
transition: fade
---

###### How it works · one document, both directions

# One document. <span class="green">Both directions.</span>

<!-- Git in the middle: people edit in the config-cluster; infra clusters pull from Git as always. -->
<div class="ways">
  <div class="node">config-cluster<span>temporary · data only</span><span>Seat/mission2-6-6</span></div>
  <div class="arrows">
    <div class="way forward"><i>←</i><span>sync</span></div>
    <div v-click class="way back"><span>reverse · commit</span><i>→</i></div>
  </div>
  <div class="node git">Git<span>seats/row-06.yaml</span></div>
  <div class="arrows">
    <div class="way forward"><span>GitOps · pull</span><i>→</i></div>
    <div class="tools">Flux · Argo CD</div>
  </div>
  <div class="node">infra clusters<span>run the workloads</span></div>
</div>

<ul class="points">
  <li v-click><strong>GitOps compatible.</strong> Infra clusters pull from Git, exactly as they do today</li>
  <li v-click><strong>Editing happens through the temporary config-cluster.</strong> One per change, starting from production state</li>
  <li v-click><strong>Bi-directional.</strong> Git to the API, and the API back to Git: nothing gets lost on the way, the object holds it all</li>
</ul>

<Sources label="links" :items="[
  { name: 'GitOps Reverser', href: 'https://github.com/ConfigButler/gitops-reverser', note: 'the way back: API resources into Git as clean YAML, commits as the audit trail' },
  { name: 'Reverse GitOps', href: 'https://reversegitops.dev', note: 'the operating model: change through the API, a controller writes it to Git' },
]" />

<!--
≈1:00 · The explainer, now they've seen their commits and their seats. Your seat again.
Git stays in the middle. Infra clusters pull from it with Flux or Argo CD, like they always did. The config-cluster gets synced from Git too.

[click] The other way round: your change in the config-cluster becomes a commit. Read your Seat, write it to Git, and Git has everything: row, colour, emoji, who.

[click] GitOps compatible: nothing changes for the infra clusters.

[click] Editing happens through the temporary config-cluster: one per change, from production state.

[click] Bi-directional. So whether Git or the API is where people make the change: that's a choice. Hold that thought for the big picture.
-->

<style>
.ways { display: grid; grid-template-columns: 300px 1fr 240px 1fr 280px; align-items: center; gap: 24px; margin: 48px 0 40px; }
.ways .node { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 30px 0; font-size: 32px; font-weight: 700; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 16px; }
.ways .node span { font-family: var(--mono); font-size: 15px; font-weight: 400; color: var(--soft); }
.ways .node.git { border-color: var(--good); }
.arrows { display: flex; flex-direction: column; gap: 32px; }
.way { display: flex; align-items: center; gap: 12px; font-family: var(--mono); font-size: 18px; white-space: nowrap; }
.way i { font-style: normal; font-size: 36px; }
.way::before, .way::after { content: ''; flex: 1; border-top: 3px solid currentColor; }
.way.forward { color: var(--good); }
.way.back { color: var(--accent); }
.way span { color: var(--text); }
.tools { margin-top: -20px; text-align: center; font-family: var(--mono); font-size: 15px; color: var(--soft); }
.slidev-layout ul.points { list-style: none; padding: 0; margin: 0; }
.points li { margin: 0 0 14px; font-size: 24px; }
</style>
