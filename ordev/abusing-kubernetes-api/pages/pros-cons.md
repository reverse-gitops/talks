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
      <li>See how settings are used: how often was something configured?</li>
      <li>You can move ownership: your settings are files in a repo</li>
      <li>Very flexible: policies and RBAC are resources too, so they get the same rigour</li>
    </ul>
  </div>
  <div v-click>
    <h2><span class="red">Cons</span></h2>
    <ul>
      <li>Extra infrastructure: a config cluster plus Reverser</li>
      <li>Git runs 2 or 3 seconds behind</li>
      <li>Conflicts: incoming commits replay audit events, but if it comes to it, the API wins</li>
      <li>Mostly hidden, but people will recognize Kubernetes. <code>x-kubernetes-validations</code> even says it literally, unless you avoid CEL</li>
    </ul>
  </div>
</div>

<style>
.cols { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; }
.cols h2 { margin: 0 0 8px; }
.cols li { font-size: 24px; margin: 12px 0; }
.cols code { white-space: nowrap; }
</style>

<!--
**31:45 · 1:00**

Don't read them all. Pick two pros.

Every change on record: how often did someone configure this? Move ownership. Policies and RBAC get the same rigour.

[click] Cons as choices: "you may choose differently".

Git 2 or 3 seconds behind. I replay audit events on incoming commits, but in the end I decide for the API.

Git is not a database. Kubernetes shows through: you can rename your URL, not x-kubernetes-validations. You could avoid CEL.
-->
