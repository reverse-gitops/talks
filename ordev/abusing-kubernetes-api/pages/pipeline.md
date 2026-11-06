---
layout: default
transition: fade
clicks: 2
---

###### One request through the kube-apiserver

# You get to <span class="green">plug in here.</span>

<div class="chain">
  <div class="step"><small>authentication</small><b>Who are you?</b><span>OIDC, service accounts</span></div>
  <i>→</i>
  <div class="step"><small>authorization</small><b>May you?</b><span>RBAC</span></div>
  <i>→</i>
  <div class="step" :class="{ hook: $clicks >= 1 }"><small>mutating admission</small><b>Fill it in</b><span>webhook, policy</span></div>
  <i>→</i>
  <div class="step"><small>schema</small><b>Right shape?</b><span>your CRD, CEL rules</span></div>
  <i>→</i>
  <div class="step" :class="{ hook: $clicks >= 1 }"><small>validating admission</small><b>Makes sense?</b><span>webhook, policy</span></div>
  <i>→</i>
  <div class="step"><small>storage</small><b>Stored</b><span>etcd</span></div>
</div>

<div class="audit" :class="{ on: $clicks >= 2 }">
  <b>Audit:</b> every request, <span class="amber">with who you are</span>
</div>

<p class="punch" :class="{ on: $clicks >= 1 }">Open/closed again: you don't change the pipeline, <span class="green">you plug in.</span></p>

<style>
.chain { display: flex; align-items: stretch; gap: 10px; margin-top: 76px; }
.chain i { align-self: center; font-style: normal; font-size: 30px; color: var(--arrow); }
.step { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 12px; height: 270px; padding: 0 10px; text-align: center; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 14px; transition: border-color .4s ease, background .4s ease; }
.step small { font-family: var(--mono); font-size: 15px; line-height: 20px; color: var(--muted); }
.step b { font-size: 30px; line-height: 1.15; font-weight: 700; color: var(--text); }
.step span { font-size: 20px; line-height: 1.25; color: var(--soft); }
.step.hook { border: 3px solid var(--good); background: rgba(126, 224, 161, .12); }
.audit { margin-top: 44px; padding: 28px; text-align: center; font-size: 36px; background: var(--panel); border: 1px solid var(--amber); border-radius: 14px; opacity: 0; transition: opacity .4s ease; }
.audit.on { opacity: 1; }
.punch { position: absolute; left: 64px; right: 64px; bottom: 76px; margin: 0; text-align: center; font-size: 44px; line-height: 1.2; font-weight: 700; opacity: 0; transition: opacity .4s ease; }
.punch.on { opacity: 1; }
</style>

<!--
**18:00 · 1:00**

One request. Each step you'd otherwise build. Who are you? May you?

[click] Your interaction points: admission. Webhook, or policy inside the API server. Open/closed again: you plug in.

[click] Audit, with the identity: user and groups, not the token.

Mention, don't go back: identity kept all the way. Token, audit, commit author. Commits signed, audit webhook over TLS.
-->
