---
layout: default
transition: fade
---

###### Where it gets hard

# Pros and cons

<div class="cols">
  <div>
    <h2><span class="green">Pros</span></h2>
    <ul>
      <li>People keep their settings screen; nobody needs to learn Git</li>
      <li>Structured, validated changes: schema, admission policies</li>
      <li>History with real authors, review and <code>git revert</code></li>
      <li>The same API for people, scripts and AI agents, with the same limits</li>
    </ul>
  </div>
  <div v-click>
    <h2><span class="red">Cons</span></h2>
    <ul>
      <li>Extra infrastructure: a config cluster plus Reverser</li>
      <li>Git runs a few seconds behind (commit windows)</li>
      <li>Conflicts: on the same resource, the API wins over a Git edit</li>
      <li>Real authors need audit flags on kube-apiserver: most managed control planes can't</li>
      <li>PRs are not created yet</li>
    </ul>
  </div>
</div>

<!--
18:00 → 22:00
Frame the cons as choices: "you may choose differently".
Git is not a database: one sentence on the SaaS story, customers creating merge conflicts in the background.
The why needs a CommitRequest: one line, the backup slide has the rest.
-->

<style>
.cols { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; }
.cols h2 { margin: 0 0 8px; }
.cols li { font-size: 24px; margin: 12px 0; }
</style>
