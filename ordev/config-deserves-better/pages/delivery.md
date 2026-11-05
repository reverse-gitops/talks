---
eyebrow: What is happening right now
clicks: 4
transition: fade
---

# Ship settings <span class="green">like images</span>.

<p class="lead fade" :class="{ off: $clicks === 3 }">Settings ship as an image. Kargo moves it one stage at a time, and the Deployment mounts it as a read-only image volume.</p>

<div class="stage">

<!-- everything except the two "inside" panels; click 3 zooms into the Deployment -->
<div class="zoom" :class="{ zoomed: $clicks === 3, back: $clicks >= 4 }">

<!-- the pipeline on the left: dims once the Deployment takes over -->
<div class="dimmed" :class="{ half: $clicks === 3, low: $clicks >= 4 }">

<Arrow points="364,440 435,440" color="var(--good)" dash="6 6" />
<Arrow points="590,639 590,604" color="var(--dim)" dash="2 6" />
<Arrow points="740,686 770,686 770,420 795,420" color="var(--dim)" dash="2 6" />
<div class="at tag green" style="left: 372px; top: 414px">publish</div>
<div class="at tag" style="left: 462px; top: 610px; color: var(--muted)">keeps watching</div>
<div class="at tag" style="left: 604px; top: 610px; color: var(--muted)">commits the digest</div>

<div class="box card" style="left: 64px; top: 300px; height: 190px"><div><b>coffee-settings</b> <small>· config repo</small></div></div>
<div class="commit" style="top: 356px"><span style="color: var(--soft)">1eed2d5 Simon Koudijs</span><br><span style="color: var(--dim)">Let's do a little title change</span></div>
<div class="commit ok" style="top: 412px"><span class="amber">7a53b5b Simon Koudijs</span><br><span class="green">Let's go back to the same image</span></div>

<div class="box card" style="left: 440px; top: 300px"><div><b>Registry</b> <small>· code and config</small></div></div>
<div class="ref blue" style="top: 356px; border-color: #2D5D85">voter:2.12.0 <span>· image</span></div>
<div class="ref" style="top: 408px; color: var(--muted)"><div>coffee-settings<br>main-1793872606-1eed2d5</div></div>
<div class="ref ok green pop" :class="{ off: $clicks < 1, late: $clicks === 1 }" style="top: 460px"><div>coffee-settings<br>main-1793873184-7a53b5b</div></div>

<div class="box kargo" :class="{ glow: $clicks === 2 }"><img class="kargo-logo" src="/images/logos/kargo.png" alt=""><div><b>Kargo</b> <small>· Warehouse</small><br><span class="tag">test by itself · production on a click</span></div></div>

<i class="dot watch loop" />

</div>

<!-- the Deployment, as YAML, in its own repo -->
<div class="panel deploy" :class="{ glow: $clicks === 2 }">
<div class="head"><b>ConfigButler/k8s</b> <small>· the real truth</small></div>
<div class="kargocommit pop" :class="{ off: $clicks < 2, late: $clicks === 2 }"><b>kargo</b> test mounts main-1793873184-7a53b5b</div>
<div class="vol fade" :class="{ off: $clicks < 3 }" />
<div class="bar ref-line" :class="{ flash: $clicks === 2, off: $clicks < 2 }" />

````md magic-move {at:2}
<<< @/snippets/delivery/settings-before.yaml
<<< @/snippets/delivery/settings-after.yaml
````

</div>
<Arrow points="1168,632 1168,650" color="var(--dim)" dash="2 6" />
<div class="box cluster"><b>Cluster</b> <small>Flux follows that repo</small><span class="mono green fade roll" :class="{ off: $clicks < 2, late: $clicks === 2 }">new test pod mounts main-1793873184-7a53b5b</span></div>

<!-- one-shot motions -->
<div v-if="$clicks === 1" class="art">main-1793873184-7a53b5b</div>
<template v-if="$clicks === 2">
  <i class="dot apply" />
  <i class="dot sync" />
</template>

</div>

<!-- what's inside the image, and the app reading it -->
<div class="panel files pop" :class="{ off: $clicks < 4 }">
<div class="head"><b>Inside main-1793873184-7a53b5b</b> <small>· mounted at /settings</small></div>

<<< @/snippets/delivery/config-volume.sh

</div>
<div class="panel code pop" :class="{ off: $clicks < 4 }">
<div class="head"><b>The app: Voter</b> <small>· just reads the files in that folder</small></div>
<div class="bar decrypt" :class="{ flash: $clicks === 4 }" />

<<< @/snippets/delivery/voter-env.yaml

</div>

</div>

<Story>

- **publish** My last commit lands in coffee-settings and is published as a new image: <span class="green">main-1793873184-7a53b5b</span>.
- **registry** The registry holds the app image and every version of its settings, side by side.
- **Kargo writes** Kargo sees the new image and commits it to test's <span class="green">settings.yaml</span>. Production's file doesn't move until someone clicks.
- **mounted** The settings arrive as a read-only <span class="green">image volume</span> at /settings. The same three files.
- **the app reads it** And Voter just reads those files, and opens the two secrets in memory.

</Story>

<Sources slim :items="[{ name: 'settings-image', href: 'https://github.com/ConfigButler/settings-image' }, { name: 'Kargo', href: 'https://kargo.io' }, { name: 'zot', href: 'https://zotregistry.dev' }]" />

<!--
22:30. While the word is on its way: this is what's happening to it, and these are the real names. My last commit in coffee-settings. CI publishes the repo as an image, with the time and the commit in the tag.

[click] The registry now holds the app image and every version of its settings, side by side. zot tells Kargo about a push straight away.

[click] The Deployment lives in its own repo, ConfigButler/k8s, and that repo is the real truth of what runs. Kargo commits the new image to test's settings.yaml, by itself. Look at production's settings.yaml: it hasn't moved, and it won't until someone clicks Promote. Flux makes the cluster follow that repo.

[click] The settings arrive as a read-only image volume at /settings. Same reference, in the pod spec, by digest.

[click] Look inside: coffeeconfig.yaml, coffee-mail.sops.yaml and coffee-payments.sops.yaml. The same three files we started with, still encrypted. Voter reads that folder, gets an age key from OpenBao, and opens the two secrets in memory. It has no Kubernetes API access at all.
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
.kargo { left: 440px; top: 640px; width: 300px; height: 92px; padding: 12px 16px; align-items: flex-start; text-align: left; line-height: 22px; border-color: var(--line-strong); }
.kargo .tag { font-size: 11px; }
.kargo-logo { position: absolute; right: 14px; top: 8px; height: 40px; width: auto; }
.commit, .ref {
  position: absolute; width: 268px; box-sizing: border-box; padding: 5px 12px;
  background: #0F1A26; border: 1px solid var(--line); border-radius: 8px;
  font-family: var(--mono); font-size: 12px; line-height: 18px;
}
.commit { left: 80px; height: 48px; }
.commit b { font-weight: 600; }
.commit .amber { font-weight: 600; }
.ref { left: 456px; height: 46px; display: flex; align-items: center; gap: .6em; }
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
.deploy { left: 800px; top: 220px; width: 736px; height: 412px; --slidev-code-font-size: 10.5px; }
.files { left: 64px; top: 220px; width: 696px; height: 244px; padding: 12px 20px; background: #101C17; border-color: #2E6B4E; }
.code { left: 64px; top: 484px; width: 696px; height: 196px; padding: 12px 20px; border-color: #2D5D85; }
.files .head, .code .head { height: 26px; }
.files.pop.off, .code.pop.off { transform: scale(.97); }
.files:not(.off) { transition-delay: .4s; }
.code:not(.off) { transition-delay: 1s; }
.vol { position: absolute; left: 12px; top: 202px; width: 712px; height: 84px; border-radius: 6px; background: rgba(126, 224, 161, .07); border: 1px dashed #2E6B4E; }
.vol:not(.off) { transition-delay: .2s; }
.bar { position: absolute; left: 20px; height: 20px; border-radius: 4px; }
.ref-line { top: 262px; width: 696px; background: rgba(126, 224, 161, .08); transition: opacity .3s; }
.ref-line.flash { animation: flash-green 1.2s 1.2s both; }
@keyframes flash-green { 0% { background: rgba(126, 224, 161, 0) } 15% { background: rgba(126, 224, 161, .22) } 100% { background: rgba(126, 224, 161, .08) } }
.decrypt { top: 78px; width: 656px; background: rgba(242, 169, 59, .08); }
.decrypt.flash { animation: flash-amber 1.4s 1.6s both; }
@keyframes flash-amber { 0% { background: rgba(242, 169, 59, 0) } 25% { background: rgba(242, 169, 59, .25) } 100% { background: rgba(242, 169, 59, .08) } }

/* glows: Kargo when it spots the tag, the Deployment when it is applied */
.kargo.glow { animation: glow-green 1s .35s both; }
@keyframes glow-green { 0% { box-shadow: 0 0 0 0 rgba(126, 224, 161, 0) } 30% { box-shadow: 0 0 0 6px rgba(126, 224, 161, .3) } 100% { box-shadow: 0 0 0 0 rgba(126, 224, 161, 0) } }
.deploy.glow { animation: glow-blue 1s 1.05s both; }
@keyframes glow-blue { 0% { box-shadow: 0 0 0 0 rgba(90, 184, 255, 0) } 30% { box-shadow: 0 0 0 6px rgba(90, 184, 255, .25) } 100% { box-shadow: 0 0 0 0 rgba(90, 184, 255, 0) } }

/* the GitOps repo's newest commit, and the cluster that follows it */
.kargocommit {
  position: absolute; right: 16px; top: 10px; height: 26px; box-sizing: border-box; padding: 0 10px;
  display: flex; align-items: center; gap: .6em; background: #0F1A26; border: 1px solid var(--line-strong); border-radius: 7px;
  font-size: 12px; line-height: 18px; color: var(--soft);
}
.kargocommit b { font-weight: 600; color: var(--text); }
.cluster { left: 800px; top: 652px; width: 736px; height: 60px; padding: 0 20px; flex-direction: row; justify-content: flex-start; gap: 12px; font-size: 20px; line-height: 26px; }
.cluster .roll { margin-left: auto; font-size: 14px; line-height: 20px; }

/* one-shot motions */
.art {
  position: absolute; left: 0; top: 0; width: 190px; height: 28px; box-sizing: border-box; padding: 0 10px;
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
/* Kargo never stops looking at the registry. */
.watch { background: var(--text); box-shadow: 0 0 10px rgba(231, 236, 242, .8); animation: watch 1.8s ease-in-out infinite; }
@keyframes watch {
  0%, 15% { opacity: 0; transform: translate(585px, 632px); }
  25% { opacity: 1; }
  75% { opacity: 1; transform: translate(585px, 602px); }
  85%, 100% { opacity: 0; transform: translate(585px, 602px); }
}
.apply { background: var(--accent); box-shadow: 0 0 10px rgba(90, 184, 255, .8); animation: apply .6s .5s linear both; }
@keyframes apply {
  0% { opacity: 1; transform: translate(735px, 681px); }
  12% { transform: translate(765px, 681px); }
  75% { transform: translate(765px, 415px); }
  92% { opacity: 1; transform: translate(794px, 415px); }
  100% { opacity: 0; transform: translate(794px, 415px); }
}
.sync { background: var(--good); box-shadow: 0 0 10px rgba(126, 224, 161, .8); animation: sync .4s 1.8s linear both; }
@keyframes sync {
  0% { opacity: 1; transform: translate(1163px, 630px); }
  90% { opacity: 1; transform: translate(1163px, 648px); }
  100% { opacity: 0; transform: translate(1163px, 648px); }
}
</style>
