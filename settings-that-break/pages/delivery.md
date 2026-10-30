---
eyebrow: Reverser · delivery
clicks: 4
transition: fade
---

# Ship settings <span class="green">like images</span>.

<p class="lead fade" :class="{ off: $clicks === 3 }">Settings ship as an OCI artifact. Flux picks up new versions, and the Deployment mounts them as a read-only image volume.</p>

<div class="stage">

<!-- everything except the two "inside" panels; click 3 zooms into the Deployment -->
<div class="zoom" :class="{ zoomed: $clicks === 3, back: $clicks >= 4 }">

<!-- the pipeline on the left: dims once the Deployment takes over -->
<div class="dimmed" :class="{ half: $clicks === 3, low: $clicks >= 4 }">

<Arrow points="364,440 435,440" color="var(--good)" dash="6 6" />
<Arrow points="590,639 590,604" color="var(--dim)" dash="2 6" />
<Arrow points="440,686 214,686 214,605" color="var(--dim)" dash="2 6" />
<Arrow points="740,686 770,686 770,420 795,420" color="var(--dim)" dash="2 6" />
<div class="at tag green" style="left: 372px; top: 414px">publish</div>
<div class="at tag" style="left: 600px; top: 610px; color: var(--muted)">watches tags</div>
<div class="at tag" style="left: 236px; top: 694px; color: var(--muted)">bumps the tag in Git</div>
<div class="at tag" style="left: 778px; top: 700px; color: var(--muted)">applies</div>

<div class="box card" style="left: 64px; top: 300px"><div><b>git</b> <small>· config repo</small></div></div>
<div class="commit" style="top: 356px"><span style="color: var(--soft)">alice@stroopwafel.nl</span><br><span style="color: var(--dim)">update sendgrid.apiKey</span></div>
<div class="commit ok" style="top: 412px"><span class="amber">bob@stroopwafel.nl</span><br><span class="green">revert: sendgrid.apiKey</span></div>
<div class="commit pop" :class="{ off: $clicks < 2, late: $clicks === 2 }" style="top: 468px; border-color: var(--line-strong)"><b>flux</b> <span style="color: var(--dim)">· image automation</span><br>orderer-config 42 → 43</div>

<div class="box card" style="left: 440px; top: 300px"><div><b>OCI registry</b> <small>· images and config</small></div></div>
<div class="ref blue" style="top: 356px; border-color: #2D5D85">orderer:1.4 <span>· image</span></div>
<div class="ref" style="top: 408px; color: var(--muted)">orderer-config:42 <span>· artifact</span></div>
<div class="ref ok green pop" :class="{ off: $clicks < 1, late: $clicks === 1 }" style="top: 460px">orderer-config:43 <span>· artifact</span></div>

<div class="box flux" :class="{ glow: $clicks === 2 }"><div><b>Flux</b> <small>· image automation</small><br><span class="tag">ImagePolicy · highest tag wins</span></div></div>

</div>

<!-- the Deployment, as YAML -->
<div class="panel deploy" :class="{ glow: $clicks === 2 }">
<div class="head"><b>Deployment</b> <small>· orderer · in the infra cluster</small></div>
<div class="vol fade" :class="{ off: $clicks < 3 }" />
<div class="bar ref-line" :class="{ flash: $clicks === 2, off: $clicks < 2 }" />

````md magic-move {at:2}
<<< @/snippets/delivery/deployment-42.yaml
<<< @/snippets/delivery/deployment-43.yaml
````

</div>
<div class="at mono green fade roll" :class="{ off: $clicks < 2, late: $clicks === 2 }">rollout · new pod mounts orderer-config:43 read-only at /etc/orderer/config</div>

<!-- one-shot motions -->
<div v-if="$clicks === 1" class="art">orderer-config:43</div>
<template v-if="$clicks === 2">
  <i class="dot scan" />
  <i class="dot bump" />
  <i class="dot apply" />
</template>

</div>

<!-- what's inside orderer-config:43, and the app reading it -->
<div class="panel files pop" :class="{ off: $clicks < 4 }">
<div class="head"><b>Inside orderer-config:43</b> <small>· mounted at /etc/orderer/config</small></div>

<<< @/snippets/delivery/config-volume.sh

</div>
<div class="panel code pop" :class="{ off: $clicks < 4 }">
<div class="head"><b>The app</b> <small>· just reads YAML, through a typed lib generated from the CRDs</small></div>
<div class="bar decrypt" :class="{ flash: $clicks === 4 }" />

<<< @/snippets/delivery/app.go

</div>

</div>

<Story>

- **publish** Bob’s revert lands in Git and is published as a new OCI artifact: <span class="green">orderer-config:43</span>.
- **registry** The registry holds the app image and every version of its settings, side by side.
- **Flux bumps** Flux image automation sees the new tag, bumps the Deployment in Git, and applies it. No pipeline to babysit.
- **mounted** Settings arrive as a read-only <span class="green">image volume</span>. No settings resources live in the infra cluster.
- **the app reads it** And the app just reads YAML files. A typed library, generated from the CRDs, makes that a few lines of code.

</Story>

<!--
Bob's revert is just a commit in the config repo. CI publishes the repo as an OCI artifact: orderer-config:43.

[click] The registry now holds the app image and every version of its settings, side by side.

[click] Flux image automation sees the new tag, bumps the tag in Git, and applies the Deployment. No pipeline to babysit.

[click] The settings arrive as a read-only image volume. Nothing settings-related lives in the infra cluster.

[click] And the app just reads YAML files, through a typed library generated from the CRDs. A few lines of code.
-->

<style>
.lead { width: 1300px !important; }
small { font-size: 13px; font-weight: 400; color: var(--soft); }

.zoom { position: absolute; inset: 0; transform-origin: 1536px 600px; transition: transform .5s ease; }
.zoom.zoomed { transform: scale(1.2); transition: transform 1.2s cubic-bezier(.3, 0, .2, 1) .3s; }
.dimmed { position: absolute; inset: 0; transition: opacity .6s; }
.dimmed.half { opacity: .25; transition: opacity 1.2s .3s; }
.dimmed.low { opacity: .07; }

/* git and registry cards */
.card { width: 300px; height: 300px; padding: 16px; justify-content: flex-start; align-items: flex-start; font-size: 20px; line-height: 26px; }
.flux { left: 440px; top: 640px; width: 300px; height: 92px; padding: 12px 16px; align-items: flex-start; text-align: left; line-height: 22px; border-color: var(--line-strong); }
.flux .tag { font-size: 11px; }
.commit, .ref {
  position: absolute; width: 268px; box-sizing: border-box; padding: 5px 12px;
  background: #0F1A26; border: 1px solid var(--line); border-radius: 8px;
  font-family: var(--mono); font-size: 12px; line-height: 18px;
}
.commit { left: 80px; height: 48px; }
.commit b { font-weight: 600; }
.commit .amber { font-weight: 600; }
.ref { left: 456px; height: 44px; display: flex; align-items: center; gap: .6em; }
.ref span { color: var(--dim); }
.ok { background: #101C17; border-color: #2E6B4E; }
.pop { transition: opacity .4s, transform .4s; }
.pop.off { transform: scale(.94); }
.late { transition-delay: 1.1s; }
.ref.late { transition-delay: 1.3s; }
.roll.late { transition-delay: 2.1s; }

/* code panels */
.panel {
  position: absolute; box-sizing: border-box; padding: 14px 20px;
  background: var(--panel-deep); border: 1px solid var(--line); border-radius: 12px;
  font-family: var(--mono); font-size: 12px; line-height: 20px; color: var(--soft);
}
.panel .head { height: 28px; font-family: var(--sans); font-size: 15px; color: var(--text); }
.panel small { font-size: 12px; color: var(--muted); }
/* Slidev code blocks inside the panels: no own background or padding, deck font and line height */
.panel { --slidev-code-background: transparent; --slidev-code-padding: 0; --slidev-code-margin: 0; --slidev-code-font-size: 12px; --slidev-code-line-height: 20px; }
.panel .slidev-code-wrapper { position: relative; }
.deploy { left: 800px; top: 220px; width: 736px; height: 412px; --slidev-code-font-size: 11px; }
.files { left: 64px; top: 220px; width: 696px; height: 244px; padding: 12px 20px; background: #101C17; border-color: #2E6B4E; }
.code { left: 64px; top: 484px; width: 696px; height: 196px; padding: 12px 20px; border-color: #2D5D85; }
.files .head, .code .head { height: 26px; }
.files.pop.off, .code.pop.off { transform: scale(.97); }
.files:not(.off) { transition-delay: .4s; }
.code:not(.off) { transition-delay: 1s; }
.vol { position: absolute; left: 12px; top: 302px; width: 712px; height: 104px; border-radius: 6px; background: rgba(126, 224, 161, .07); border: 1px dashed #2E6B4E; }
.vol:not(.off) { transition-delay: .2s; }
.bar { position: absolute; left: 20px; height: 20px; border-radius: 4px; }
.ref-line { top: 362px; width: 696px; background: rgba(126, 224, 161, .08); transition: opacity .3s; }
.ref-line.flash { animation: flash-green 1.2s 1.2s both; }
@keyframes flash-green { 0% { background: rgba(126, 224, 161, 0) } 15% { background: rgba(126, 224, 161, .22) } 100% { background: rgba(126, 224, 161, .08) } }
.decrypt { top: 78px; width: 656px; background: rgba(242, 169, 59, .08); }
.decrypt.flash { animation: flash-amber 1.4s 1.6s both; }
@keyframes flash-amber { 0% { background: rgba(242, 169, 59, 0) } 25% { background: rgba(242, 169, 59, .25) } 100% { background: rgba(242, 169, 59, .08) } }
.roll { left: 800px; top: 646px; font-size: 12px; line-height: 18px; }

/* glows: Flux when it spots the tag, the Deployment when it is applied */
.flux.glow { animation: glow-green 1s .35s both; }
@keyframes glow-green { 0% { box-shadow: 0 0 0 0 rgba(126, 224, 161, 0) } 30% { box-shadow: 0 0 0 6px rgba(126, 224, 161, .3) } 100% { box-shadow: 0 0 0 0 rgba(126, 224, 161, 0) } }
.deploy.glow { animation: glow-blue 1s 1.95s both; }
@keyframes glow-blue { 0% { box-shadow: 0 0 0 0 rgba(90, 184, 255, 0) } 30% { box-shadow: 0 0 0 6px rgba(90, 184, 255, .25) } 100% { box-shadow: 0 0 0 0 rgba(90, 184, 255, 0) } }

/* one-shot motions */
.art {
  position: absolute; left: 0; top: 0; width: 140px; height: 28px; box-sizing: border-box; padding: 0 10px;
  display: flex; align-items: center; white-space: nowrap; background: #101C17; border: 1px solid var(--good); border-radius: 8px;
  font-family: var(--mono); font-size: 11px; color: var(--good);
  animation: art 1.7s ease-in-out both;
}
@keyframes art {
  0% { opacity: 0; transform: translate(150px, 420px); }
  10% { opacity: 1; transform: translate(150px, 420px); }
  80% { opacity: 1; transform: translate(476px, 467px); }
  100% { opacity: 0; transform: translate(476px, 467px); }
}
.dot { position: absolute; left: 0; top: 0; width: 10px; height: 10px; border-radius: 5px; opacity: 0; }
.scan { background: var(--muted); box-shadow: 0 0 10px rgba(138, 150, 168, .8); animation: scan .45s linear both; }
@keyframes scan {
  0% { opacity: 1; transform: translate(585px, 602px); }
  85% { opacity: 1; transform: translate(585px, 632px); }
  100% { opacity: 0; transform: translate(585px, 632px); }
}
.bump { background: var(--text); box-shadow: 0 0 10px rgba(231, 236, 242, .8); animation: bump .7s .5s linear both; }
@keyframes bump {
  0% { opacity: 1; transform: translate(435px, 681px); }
  50% { transform: translate(209px, 681px); }
  90% { opacity: 1; transform: translate(209px, 606px); }
  100% { opacity: 0; transform: translate(209px, 606px); }
}
.apply { background: var(--accent); box-shadow: 0 0 10px rgba(90, 184, 255, .8); animation: apply .6s 1.4s linear both; }
@keyframes apply {
  0% { opacity: 1; transform: translate(735px, 681px); }
  12% { transform: translate(765px, 681px); }
  75% { transform: translate(765px, 415px); }
  92% { opacity: 1; transform: translate(794px, 415px); }
  100% { opacity: 0; transform: translate(794px, 415px); }
}
</style>
