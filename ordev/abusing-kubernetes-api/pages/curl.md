---
layout: default
transition: fade
---

###### What's behind that URL

# It's <span class="green">just an API.</span>

<a class="panel" href="https://demo.koudijs.dev/k8s/apis/examples.configbutler.ai/v1alpha1/namespaces/voter/seats/ordev-2-turing-7-1" target="_blank">
  <div class="l">GET https://demo.koudijs.dev/<span class="key">k8s</span>/apis/<span class="type">examples.configbutler.ai/v1alpha1</span></div>
  <div class="l">    /namespaces/<span class="id">voter</span>/<span class="type">seats</span>/<span class="id">ordev-2-turing-7-1</span></div>
  <span class="naming"><span class="key">k8s</span>? That should be settings or config.</span>
</a>

<div class="where">
  <div v-click class="small">
    <div class="name">A single cluster, just for this</div>
    <div class="parts">
      <div class="part api"><b>kube-apiserver</b><span>the API</span></div>
      <i>⇄</i>
      <div class="part"><b>etcd</b><span>where it's stored</span></div>
    </div>
    <div class="tools">
      <span class="for">for example</span>
      <a href="https://github.com/kcp-dev/kcp" target="_blank"><img src="/images/logos/kcp.svg" alt="">kcp</a>
      <a href="https://github.com/clastix/kamaji" target="_blank"><img src="/images/logos/kamaji.svg" alt="">Kamaji</a>
    </div>
  </div>
  <div v-click class="infra">
    <div class="name">Your infra clusters</div>
    <p>Your pods and nodes. <strong>No end users in here.</strong></p>
  </div>
</div>

<p v-click class="punch">A single cluster for this. <span class="green">Don't let end users poke in your infra.</span></p>

<style>
.slidev-layout h1 { margin-bottom: 14px; }
.slidev-layout a.panel { position: relative; display: block; padding: 12px 24px; font-family: var(--mono); font-size: 25px; line-height: 1.4; color: var(--soft); background: var(--panel); border: 1px solid var(--line); border-radius: 14px; text-decoration: none; }
.naming { position: absolute; right: 24px; bottom: 10px; font-family: 'Caveat', cursive; font-size: 36px; line-height: 1; font-weight: 600; color: var(--amber); }
.l { white-space: pre; }
.type { color: var(--accent); }
.id { color: var(--text); }
.key { color: var(--amber); }
.where { display: grid; grid-template-columns: 1fr 400px; gap: 32px; margin-top: 24px; }
.small { padding: 20px 28px; border: 2px dashed var(--good); border-radius: 16px; }
.infra { padding: 20px 28px; background: var(--panel-deep); border: 1px solid var(--line); border-radius: 16px; }
.name { margin-bottom: 14px; font-size: 32px; line-height: 1.2; font-weight: 700; }
.parts { display: flex; align-items: stretch; gap: 16px; }
.parts i { align-self: center; font-style: normal; font-size: 40px; line-height: 1; color: var(--good); }
.part { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 16px; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 12px; }
.part.api { border-color: var(--accent); }
.part b { font-size: 32px; line-height: 1.2; font-weight: 700; color: var(--text); }
.part span { font-size: 22px; line-height: 1.3; color: var(--soft); }
.tools { display: flex; align-items: center; gap: 24px; margin-top: 16px; }
.for { font-family: var(--mono); font-size: 18px; color: var(--muted); }
.slidev-layout .tools a { display: flex; align-items: center; gap: 10px; font-size: 26px; color: var(--text); border: none; text-decoration: none; }
.tools img { width: 48px; height: 48px; padding: 4px; box-sizing: border-box; object-fit: contain; background: #fff; border-radius: 8px; }
.infra p { margin: 0; font-size: 28px; line-height: 1.35; color: var(--soft); opacity: 1; }
.punch { position: absolute; left: 64px; right: 64px; bottom: 34px; margin: 0; text-align: center; font-size: 44px; line-height: 1.2; font-weight: 700; opacity: 1; }
</style>

<!--
**3:50 · 1:15**

Plain HTTPS. No SDK, no kubectl. Your chair: open it yourself.

"k8s" in that URL should be settings or config. Your users don't need to know.

[click] kube-apiserver and etcd. That's the whole thing. No nodes, no pods, no scheduler. kcp, Kamaji.

[click] Not in your infra clusters. Don't let end users poke around there.

[click] Nothing to do with infra, we just know it from there.

Honest: my demo runs in namespaces on my own cluster. Live call with a real token comes in part 2.
-->
