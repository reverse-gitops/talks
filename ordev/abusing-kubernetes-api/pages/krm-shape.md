---
layout: default
transition: fade
clicks: 5
---

###### KRM: the Kubernetes Resource Model

# One object <span class="green">says everything about itself.</span>

<div class="krm">
  <div class="object">
    <div class="group" :class="{ lit: $clicks === 1 }">
      <div class="l">apiVersion: <span class="map type" :class="{ on: $clicks >= 5 }">examples.configbutler.ai/v1alpha1</span></div>
      <div class="l">kind: <span class="map type dashed" :class="{ on: $clicks >= 5 }">Seat</span></div>
    </div>
    <div class="group" :class="{ lit: $clicks === 2 }">
      <div class="l">metadata:</div>
      <div class="l in">namespace: <span class="map id" :class="{ on: $clicks >= 5 }">voter</span></div>
      <div class="l in">name: <span class="map id" :class="{ on: $clicks >= 5 }">ordev-2-turing-7-1</span></div>
    </div>
    <div class="group spec" :class="{ lit: $clicks === 3 }">
      <div class="l">spec:</div>
      <div class="l in">color: '#a8e05f'</div>
      <div class="l in">emoji: 🐧</div>
    </div>
    <div class="group status" :class="{ lit: $clicks === 4 }">
      <div class="l">status:</div>
      <div class="l in">lastCommit:</div>
      <div class="l in2">message: 'Green for the team'</div>
    </div>
  </div>
  <div class="answers">
    <div class="off-until" :class="{ on: $clicks >= 1 }"><b>kind</b><strong>What is it?</strong><span>A type with a schema</span></div>
    <div class="off-until" :class="{ on: $clicks >= 2 }"><b>metadata</b><strong>Which one?</strong><span>Its identity, inside the object</span></div>
    <div class="off-until" :class="{ on: $clicks >= 3 }"><b class="green">spec</b><strong class="green">What do you want?</strong><span>The desired state</span></div>
    <div class="off-until" :class="{ on: $clicks >= 4 }"><b class="amber">status</b><strong class="amber">What happened?</strong><span>From the control loop. Not in Git</span></div>
  </div>
</div>

<div class="address" :class="{ on: $clicks >= 5 }">
  <div class="url">.../apis/<span class="map type on">examples.configbutler.ai/v1alpha1</span>/namespaces/<span class="map id on">voter</span>/<span class="map type dashed on">seats</span>/<span class="map id on">ordev-2-turing-7-1</span></div>
</div>

<style>
.krm { display: grid; grid-template-columns: 780px 1fr; gap: 48px; margin-top: 28px; align-items: stretch; }
.object { padding: 16px 12px; font-family: var(--mono); font-size: 25px; line-height: 1.38; background: var(--panel); border: 1px solid var(--line); border-radius: 16px; }
.group { padding: 8px 20px; border-radius: 10px; color: var(--soft); transition: background .3s, color .3s; }
.group.lit { color: var(--text); background: rgba(90, 184, 255, .16); }
.group.spec.lit { background: rgba(126, 224, 161, .16); }
.group.status.lit { background: rgba(242, 169, 59, .16); }
.l { white-space: nowrap; }
.l.in { padding-left: 1.2em; }
.l.in2 { padding-left: 2.4em; }
.answers { display: flex; flex-direction: column; justify-content: space-between; }
.off-until { display: grid; grid-template-columns: 170px 1fr; column-gap: 12px; opacity: 0; transition: opacity .4s; }
.off-until.on { opacity: 1; }
.off-until b { grid-row: span 2; align-self: start; padding-top: 11px; font-family: var(--mono); font-size: 25px; font-weight: 600; color: var(--accent); }
.off-until b.green { color: var(--good); }
.off-until strong { font-size: 36px; line-height: 1.2; }
.off-until strong.green { color: var(--good); }
.off-until b.amber, .off-until strong.amber { color: var(--amber); }
.off-until span { font-size: 25px; line-height: 1.25; color: var(--soft); }
.map { transition: color .3s; }
.map.on { text-decoration: underline; text-decoration-thickness: 3px; text-underline-offset: 7px; }
.map.type.on { text-decoration-color: var(--accent); }
.map.dashed.on { text-decoration-style: dashed; }
.map.id.on { text-decoration-color: var(--good); }
.address { position: absolute; left: 64px; right: 64px; bottom: 72px; text-align: center; opacity: 0; transition: opacity .4s; }
.address.on { opacity: 1; }
.url { padding: 12px 8px; white-space: nowrap; font-family: var(--mono); font-size: 28px; line-height: 1.3; color: var(--soft); background: var(--panel); border: 1px solid var(--line-strong); border-radius: 12px; }
</style>

<!--
**5:15 · 1:15**

KRM. Four things. Your chair, shortened.

[click] Kind: a type, not a bag of JSON.

[click] Metadata: the object carries what's in the URL. "Uniform and self-describing."

[click] Spec: not a command. What you want it to be.

[click] Status: the system answers, not you. Not checked into Git, only desired state. Back to it soon.

[click] The URL from a moment ago. Group and version, namespace, seats, name: it's all in the object. So it's an API resource and a YAML manifest at the same time. The whole trick: nothing translates. Except the dashed one: Seat and seats. Hold that thought.
-->
