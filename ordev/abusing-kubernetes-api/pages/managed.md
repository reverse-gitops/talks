---
layout: default
transition: fade
---

###### The plan · not there yet

# It's not easy. <span class="green">It should be easy to play around with.</span>

<div class="split">
  <div class="side you">
    <div class="head blue">You</div>
    <ul>
      <li>Give access to a Git repo</li>
      <li>Create your CRDs</li>
    </ul>
  </div>
  <div v-click class="side me">
    <div class="head green">Me</div>
    <ul>
      <li>The kube-apiserver</li>
      <li>The login</li>
      <li>gitops-reverser</li>
    </ul>
  </div>
</div>

<p v-click class="punch">Would you try that? <span class="green">Come and tell me.</span></p>

<style>
.slidev-layout h1 { font-size: 56px; margin-bottom: 40px; }
.split { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
.side { padding: 36px 40px; background: var(--panel); border: 1px solid var(--line); border-radius: 16px; }
.side.you { border-color: var(--accent); }
.side.me { border-color: var(--good); }
.head { margin-bottom: 20px; font-size: 46px; line-height: 1.2; font-weight: 700; }
.side ul { margin: 0; padding-left: 1.1em; }
.slidev-layout .side li { margin: 16px 0; font-size: 34px; line-height: 1.25; color: var(--text); }
.punch { position: absolute; left: 64px; right: 64px; bottom: 64px; margin: 0; text-align: center; font-size: 48px; line-height: 1.2; font-weight: 700; opacity: 1; }
</style>

<!--
**33:30 · 1:00**

Honest: it works, it isn't easy. Cluster, TLS, login, audit flags. Too much just to find out if you like it.

A plan, not there yet. You: a Git repo and your CRDs. Your data stays yours.

[click] I do the Kubernetes stuff.

[click] Would you use that, or run it yourself? Not a pitch: I want to hear where I'm wrong.
-->
