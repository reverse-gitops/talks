---
layout: default
transition: fade
clicks: 4
---

###### KRM: the Kubernetes Resource Model

# One object <span class="green">says everything about itself.</span>

<div class="krm">
  <div class="object">
    <div class="group" :class="{ lit: $clicks === 1 }">
      <div class="l">apiVersion: examples.configbutler.ai/v1alpha1</div>
      <div class="l">kind: Seat</div>
    </div>
    <div class="group" :class="{ lit: $clicks === 2 }">
      <div class="l">metadata:</div>
      <div class="l in">namespace: voter</div>
      <div class="l in">name: ordev-2-turing-7-1</div>
    </div>
    <div class="group spec" :class="{ lit: $clicks === 3 }">
      <div class="l">spec:</div>
      <div class="l in">color: '#a8e05f'</div>
      <div class="l in">emoji: 🐧</div>
    </div>
  </div>
  <div class="answers">
    <div class="off-until" :class="{ on: $clicks >= 1 }"><b>kind</b><strong>What is it?</strong><span>A type with a schema</span></div>
    <div class="off-until" :class="{ on: $clicks >= 2 }"><b>metadata</b><strong>Which one?</strong><span>Its identity, inside the object</span></div>
    <div class="off-until" :class="{ on: $clicks >= 3 }"><b class="green">spec</b><strong class="green">What do you want?</strong><span>The desired state</span></div>
  </div>
</div>

<p class="punch" :class="{ on: $clicks >= 4 }">The object doesn't need a URL. <span class="green">So a file works just as well.</span></p>

<!--
KRM, the Kubernetes Resource Model. Three things to remember. This is your chair, shortened.

[click] Kind: what is it? With apiVersion, this points at a schema. Not a bag of JSON: a type.

[click] Metadata: which one is it? Most REST APIs need the URL and the body together to mean anything. Here the object carries what's in the URL path. The design doc calls this "uniform and self-describing".

[click] Spec: what do you want? Not "set the colour" as a command. A description of what you want it to be.

[click] And that's the whole trick. The object doesn't depend on where it came from. Put it in a request, or in a file in Git. It's the same thing, and nothing has to translate.
-->

<style>
.krm { display: grid; grid-template-columns: 780px 1fr; gap: 48px; margin-top: 28px; align-items: stretch; }
.object { padding: 28px 12px; font-family: var(--mono); font-size: 26px; line-height: 1.45; background: var(--panel); border: 1px solid var(--line); border-radius: 16px; }
.group { padding: 8px 20px; border-radius: 10px; color: var(--soft); transition: background .3s, color .3s; }
.group.lit { color: var(--text); background: rgba(90, 184, 255, .16); }
.group.spec.lit { background: rgba(126, 224, 161, .16); }
.l { white-space: nowrap; }
.l.in { padding-left: 1.2em; }
.answers { display: flex; flex-direction: column; justify-content: space-between; }
.off-until { display: grid; grid-template-columns: 170px 1fr; column-gap: 12px; opacity: 0; transition: opacity .4s; }
.off-until.on { opacity: 1; }
.off-until b { grid-row: span 2; align-self: start; padding-top: 11px; font-family: var(--mono); font-size: 25px; font-weight: 600; color: var(--accent); }
.off-until b.green { color: var(--good); }
.off-until strong { font-size: 40px; line-height: 1.25; }
.off-until strong.green { color: var(--good); }
.off-until span { font-size: 26px; line-height: 1.3; color: var(--soft); }
.punch { position: absolute; left: 64px; right: 64px; bottom: 64px; margin: 0; text-align: center; font-size: 44px; line-height: 1.2; font-weight: 700; opacity: 0; transition: opacity .4s; }
.punch.on { opacity: 1; }
</style>
