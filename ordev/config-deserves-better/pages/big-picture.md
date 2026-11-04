---
diveOut: 1018px 374px
clicks: 8
---

# Settings are data. Give them <span class="green">their own home</span>.

Orders stay in the app. Settings move behind a data-only API that users never notice, and from there into Git.

<!-- s1…s8 name the click we just arrived on: the CSS uses them to time things inside that step -->
<div class="stage" :class="`s${$clicks}`">

<!-- the infra cluster and everything in it; it shrinks at click 3 to make room for Git -->
<div class="cluster" :class="{ small: $clicks >= 3 }">
<div class="zone" style="left: 288px; top: 200px; width: 1248px; height: 540px" />
<div class="at" style="left: 312px; top: 218px; font-size: 13px; line-height: 18px; color: var(--soft)">
  <span class="kicker">INFRA CLUSTER</span>
</div>
<div class="zone dashed" style="left: 304px; top: 340px; width: 772px; height: 236px" />
<div class="at" style="left: 318px; top: 546px; font-size: 13px; color: var(--soft)">
  <span class="kicker">WORKLOAD</span> · StroopwafelOrderer
</div>
<div class="zone dashed platform" style="left: 1124px; top: 236px; width: 332px; height: 340px" />
<div class="at" style="left: 1124px; top: 586px; font-size: 13px; line-height: 18px; color: var(--soft)">
  <span class="kicker green">DATA-ONLY CONTROL PLANES</span>
  <span class="planes"><img src="/images/logos/kcp.svg" alt="kcp"><img src="/images/logos/kamaji.svg" alt="Kamaji"></span>
</div>

<Arrow points="470,460 555,460" />
<Arrow points="740,460 835,460" />
<Arrow points="654,688 654,515" />
<div class="at tag" style="left: 662px; top: 640px; color: var(--muted)">images</div>

<!-- the new route from the ingress to KCP -->
<div class="route wrap fade" :class="{ off: $clicks < 1, gone: $clicks >= 6 }">
<Arrow points="395,410 395,300 1135,300" color="var(--good)" />
<div class="at tag green" style="left: 420px; top: 272px; font-size: 12px">stroopwafel.nl/settings/change25/apis/config.stroopwafel.nl/v1/emailsettings/sendgrid</div>
<div class="at tag blue" style="left: 478px; top: 432px">/api/orders</div>
</div>

<div class="box" style="left: 320px; top: 410px; width: 150px; height: 100px"><b>Ingress</b><span class="tag">stroopwafel.nl</span></div>
<div class="box api" style="left: 560px; top: 410px; width: 180px; height: 100px; justify-content: flex-start; padding-top: 16px" :class="{ bad: $clicks >= 5 && $clicks <= 7, good: $clicks >= 8 }"><b>API</b></div>
<div class="at tag api-old fade" :class="{ off: $clicks >= 1 }">orders · settings</div>
<div class="at tag api-new fade" :class="{ off: $clicks < 1 }">orders · transactional</div>
<div class="box" style="left: 840px; top: 360px; width: 220px; height: 200px; justify-content: flex-start; align-items: flex-start; padding: 16px"><b>PostgreSQL</b></div>
<div class="db-row" style="top: 420px; border-color: #2D5D85"><span>table</span> orders</div>

<!-- the main config cluster: kept over time, the production state every change starts from -->
<div class="box main-cc pop" :class="{ off: $clicks < 1 }">
  <span><b>main</b> <i>kept over time</i></span>
</div>
<!-- one config cluster per change: this is change25, its CRDs and CRs. The outline behind it: there can be more. -->
<div class="cc-more" :class="{ off: $clicks < 1, gone: $clicks >= 6 }" />
<div class="box kcp pop" :class="{ off: $clicks < 1, gone: $clicks >= 6 }">
  <span><b>change25</b></span>
</div>
<!-- the settings table moves out of PostgreSQL and becomes the EmailSettings kind -->
<div class="db-row settings" :class="{ moved: $clicks >= 1, gone: $clicks >= 6 }">
  <div class="old fade" :class="{ off: $clicks >= 1 }"><span>table</span> settings</div>
  <div class="new fade" :class="{ off: $clicks < 1 }">EmailSettings</div>
</div>
<div class="kind secret objs" :class="{ off: $clicks < 1, gone: $clicks >= 6, pulse: $clicks === 4 }" style="left: 1346px; top: 318px; width: 70px">v1/Secret</div>
<div class="kinds" :class="{ off: $clicks < 1, gone: $clicks >= 6 }">
<Arrow points="1250,330 1272,330" :head="false" color="#2E6B4E" />
<Arrow points="1324,330 1346,330" :head="false" color="#2E6B4E" />
<div class="kind green" style="left: 1272px; top: 318px; width: 52px">ApiKey</div>
</div>
<!-- main holds the same kinds, and stays -->
<div class="kinds" :class="{ off: $clicks < 1 }">
<Arrow points="1250,450 1272,450" :head="false" color="#2E6B4E" />
<Arrow points="1324,450 1346,450" :head="false" color="#2E6B4E" />
<div class="kind green" style="left: 1156px; top: 438px; width: 94px">EmailSettings</div>
<div class="kind green" style="left: 1272px; top: 438px; width: 52px">ApiKey</div>
<div class="kind secret objs" :class="{ pulse: $clicks === 5 || $clicks === 8 }" style="left: 1346px; top: 438px; width: 70px">v1/Secret</div>
</div>

<!-- Reverser and the way back from Git, from click 3 -->
<div class="wrap fade platform-in" :class="{ off: $clicks < 3 }">
<Arrow points="720,688 720,515" color="var(--good)" dash="6 6" />
<div class="at tag green" style="left: 728px; top: 640px">config as files</div>
</div>

<div class="box registry"><span><b>OCI registry</b> <span style="font-size: 11px; color: var(--dim)">· images and config</span></span></div>
<div class="chip" style="left: 614px; width: 104px; border-color: #2D5D85; color: var(--accent); font-size: 11px">orderer:1.4</div>
<div class="chip c42" :class="{ off: $clicks < 5 }" style="left: 726px">orderer-config:42</div>
<div class="chip c43 pop" :class="{ off: $clicks < 8 }" style="left: 864px">orderer-config:43</div>

<!-- order traffic: always flowing -->
<i v-for="n in 8" :key="n" class="dot traffic loop" :style="{ animationDelay: `${-0.3 * n}s` }" />
<!-- one highlighted order: orders keep working while the settings move -->
<i v-if="$clicks === 1" class="dot order" style="animation-delay: 1.3s" />
<i v-if="$clicks === 3" class="dot order" style="animation-delay: .9s" />
<!-- the settings page reads with GETs -->
<template v-if="$clicks === 2">
<i class="get" style="animation-delay: .3s">GET</i>
<i class="get" style="animation-delay: .75s">GET</i>
<i class="get" style="animation-delay: 1.2s">GET</i>
</template>
<!-- the typo: Alice → KCP → Reverser, and later the new config → the API -->
<i v-if="$clicks === 4" class="dot alice-edit" />
<i v-if="$clicks === 5" class="dot big to-api" style="animation-delay: .55s" />
<i v-if="$clicks === 8" class="dot big to-api" style="animation-delay: 1.8s" />
</div>

<!-- users stay outside the cluster -->
<Arrow points="224,430 315,430" />
<div class="box crowd" :class="{ small: $clicks >= 3 }">
  <div class="faces"><i style="background: #5AB8FF" /><i style="background: #8A96A8" /><i style="background: #2D5D85" /><i style="background: #A3AEBE" /><i style="background: #4A5668" /><i style="background: #5AB8FF" /></div>
  <b>Customers</b><span class="tag">ordering all day</span>
</div>
<div class="alice-side wrap fade" :class="{ off: $clicks >= 5 }">
<Arrow points="224,576 272,576 272,490 315,490" />
<div class="box person" style="top: 540px"><b><i class="avatar" style="background: #DDD6C6" /> Alice</b><span class="tag" style="color: #CFC8B8">power user</span></div>
<div class="screen fade" :class="{ off: $clicks < 2 }">
  <svg width="40" height="34" viewBox="0 0 40 34" aria-hidden="true"><rect x="1" y="1" width="38" height="25" rx="3" /><path d="M14 33h12M20 26v7" /><path d="M7 8h12M7 13h20M7 18h16" stroke="#6B7789" /></svg>
  <div class="tag">settings page</div>
</div>
</div>

<!-- Git and the push back to the registry: outside the cluster, from click 3 -->
<div class="wrap fade platform-in" :class="{ off: $clicks < 3 }">
<Arrow points="1430,386 1430,585" />
<Arrow points="1290,588 1290,484" />
<Arrow points="1158,448 1131,448" />
<Arrow points="1239,665 814,665" color="var(--good)" dash="6 6" />
<div class="at tag green" style="left: 1000px; top: 674px">push as OCI artifact</div>
</div>
<!-- Reverser: outside the data-only control planes, above git; its arrow from change25 goes when change25 does -->
<div class="wrap fade platform-in" :class="{ off: $clicks < 3, gone: $clicks >= 6 }">
<Arrow points="1127,347 1326,347" />
</div>
<div class="box sync-box pop platform-in" :class="{ off: $clicks < 3, pulse: $clicks === 5 || $clicks === 8 }">
  <b>Flux · Argo CD</b><span>sync git → main</span>
</div>
<div class="box reverser pop platform-in" :class="{ off: $clicks < 3, pulse: $clicks === 4 }">
  <b>Reverser</b><span style="font-size: 12px; line-height: 18px; color: var(--soft)">turns changes into commits</span>
</div>
<div class="box git platform-in" :class="{ off: $clicks < 3, pulse: $clicks === 4 || $clicks === 8 }">
  <span><b>git</b> <span style="font-size: 13px; color: var(--soft)">· config repo · audit trail</span></span>
</div>
<div class="commit typo" :class="{ off: $clicks < 4 }"><b>alice@stroopwafel.nl</b> <span class="red">· typo</span><br>update sendgrid.apiKey</div>
<div class="commit fix" :class="{ off: $clicks < 8 }"><b>bob@stroopwafel.nl</b> <span class="green">· fix</span><br>revert: sendgrid.apiKey</div>

<!-- Bob works in Git directly -->
<div class="wrap fade" :class="{ off: $clicks < 7 }">
<div class="box person" style="top: 684px"><b><i class="avatar" style="background: #5AB8FF" /> Bob</b><span class="tag">developer · git</span></div>
<Arrow points="224,720 1235,720" color="var(--muted)" />
<div class="at tag" style="left: 248px; top: 696px">git revert · straight in the repo</div>
</div>

<!-- one-shot motions outside the cluster -->
<i v-if="$clicks === 4" class="dot alice-down" style="animation-delay: .95s" />
<i v-if="$clicks === 4" class="dot to-git" style="animation-delay: 1.3s" />
<i v-if="$clicks === 5" class="dot big to-registry" style="animation-delay: .1s" />
<i v-if="$clicks === 8" class="dot bob-revert" />
<i v-if="$clicks === 8" class="dot big to-registry" style="animation-delay: .65s" />
<!-- after a push to git, Flux or Argo CD syncs main -->
<i v-if="$clicks === 5" class="dot sync to-main" style="animation-delay: .1s" />
<i v-if="$clicks === 8" class="dot sync to-main" style="animation-delay: .65s" />

<div class="failing fade" :class="{ off: $clicks < 5 }">emails failing · 401 <Counter :from="5" :until="8" :rate="5" /></div>
<div class="fixed fade" :class="{ off: $clicks < 8 }">fixed · emails flow again</div>

</div>

<Story>

- **today** Today: the app keeps its settings in its own database, right next to the orders.
- **split** Move them out: a data-only control plane serves them, as a <span class="green">model of connected kinds</span>. Same domain, same login.
- **reads** Alice’s settings page is just a client of that API: it reads with plain <span class="alice">GET</span>s, using her own login.
- **platform** Reverser turns settings changes into commits. Git and the OCI registry close the loop back to the app.
- **same typo** Alice makes the same typo. Reverser commits it: in Git, with her name on it.
- **deploy** main is synced and the config ships to the app: emails fail again. But now you know <span class="who">who</span>, when, and what.
- **cleanup** It is deployed, so change25 goes away. main keeps the production state.
- **revert** Bob opens the config repo. Every change is a commit with a name on it, so he sees who changed the key and when.
- **revert** Bob reverts in Git. The fix ships to the app, the emails flow again, and the next config cluster starts from it.

</Story>

<!--
Today the app keeps its settings in its own database, right next to the orders.

[click] Move them out. A data-only control plane (KCP, Kamaji, …) serves part of the customer-facing API. One main config cluster, kept over time: the production state. And one temporary config cluster per change, starting from main: change25 here, with its CRDs and CRs: a model of connected kinds. Same domain, same login.

[click] Alice's settings page is just a client of that API: plain GETs, with her own login.

[click] Reverser turns every settings change into a commit. Flux or Argo CD syncs git back into main. Git and the OCI registry close the loop back to the app.

[click] Alice makes the same typo. Reverser commits it: there it is in Git, with her name on it. Pause here.

[click] Flux or Argo CD syncs main, the config ships to the app, and emails fail again. But now you know who, when and what.

[click] Deployed, so change25 is done: its temporary cluster goes away. main stays, synced from git by Flux or Argo CD.

[click] Bob opens the config repo: every change is a commit with a name on it.

[click] He reverts in Git. The fix ships to the app, the emails flow again, and the next config cluster starts from it.
-->

<style>
/* the logos of data-only control planes, under their label */
.planes { display: flex; gap: 10px; margin-top: 8px; }
.planes img { width: 40px; height: 40px; padding: 5px; box-sizing: border-box; object-fit: contain; background: #fff; border-radius: 9px; }
.main-cc { left: 1140px; top: 370px; width: 300px; height: 106px; padding: 14px 16px; justify-content: flex-start; align-items: flex-start; text-align: left; gap: 4px; background: #101C17; border-color: var(--good); }
.main-cc i { font-style: normal; font-size: 13px; color: var(--good); }
/* change25 is temporary: once its change is deployed, it goes away (its own click) */
.gone { opacity: 0 !important; transition: opacity .8s .3s !important; pointer-events: none; }
/* another config cluster behind change25: there can be more than one */
.cc-more { position: absolute; left: 1148px; top: 242px; width: 300px; height: 106px; border: 1px dashed #2E6B4E; border-radius: 12px; opacity: .6; transition: opacity .6s 1.2s; }
.cc-more.off { opacity: 0; transition-delay: 0s; }
/* the route to KCP: a thinner line than the traffic paths */
.route svg.arrow { stroke-width: 1.2; }

/* ── layout ── */
.cluster { position: absolute; inset: 0; transform-origin: 320px 460px; transition: transform .7s cubic-bezier(.4, 0, .2, 1); }
.cluster.small { transform: scale(.72); }
.zone.platform { border-color: #2E6B4E; }

.api-old, .api-new { left: 560px; top: 452px; width: 180px; text-align: center; line-height: 18px; }
.db-row {
  position: absolute; left: 856px; width: 188px; height: 36px; box-sizing: border-box; padding: 0 12px;
  display: flex; align-items: center; gap: .6em;
  background: #0F1A26; border: 1px solid var(--line); border-radius: 8px;
  font-family: var(--mono); font-size: 12px;
}
.db-row span { color: var(--dim); }

.kcp { left: 1140px; top: 250px; width: 300px; height: 106px; padding: 14px 16px; justify-content: flex-start; align-items: flex-start; text-align: left; background: #101C17; border-color: #2E6B4E; }
.pop.off { transform: scale(.9); }

/* the settings table: moves to KCP, then shrinks into the EmailSettings kind */
.db-row.settings {
  top: 470px; padding: 0; overflow: hidden;
  transition: left .9s ease-in-out, top .9s ease-in-out, width .3s, height .3s, border-radius .3s, background-color .3s, border-color .3s;
}
.db-row.settings.moved { left: 1156px; top: 318px; width: 94px; height: 24px; border-radius: 12px; background: #101C17; border-color: var(--good); }
.db-row.settings .old { position: absolute; left: 12px; top: 9px; white-space: nowrap; color: var(--text); }
.db-row.settings .new { position: absolute; left: 0; top: 0; width: 92px; line-height: 22px; text-align: center; font-size: 10px; color: var(--good); }

.kind {
  position: absolute; height: 24px; box-sizing: border-box; display: flex; align-items: center; justify-content: center;
  background: #0F1A26; border: 1px solid var(--line-strong); border-radius: 12px;
  font-family: var(--mono); font-size: 10px; white-space: nowrap; color: var(--soft); transition: opacity .4s;
}
.kind.green { background: #101C17; border-color: #2E6B4E; color: var(--good); }
.kind.secret { background: #17140F; border-color: #5A4520; color: var(--amber); }
.kinds { position: absolute; inset: 0; pointer-events: none; transform-origin: 1290px 360px; transition: opacity .4s, transform .4s; }
.kinds.off { transform: scale(.85); }

/* Reverser: top and bottom in line with the data-only control planes once the cluster has shrunk; as wide as git */
.reverser { left: 1330px; top: 300px; width: 206px; height: 86px; padding: 12px 16px; justify-content: center; align-items: flex-start; text-align: left; gap: 4px; }
.reverser b { font-size: 22px; line-height: 1.1; }
.reverser span { font-size: 13px !important; line-height: 1.35 !important; }
/* Flux · Argo CD: syncs git back into main, level with it */
.sync-box { left: 1160px; top: 416px; width: 150px; height: 64px; padding: 10px 12px; justify-content: center; align-items: flex-start; text-align: left; gap: 2px; border-color: #2E6B4E; }
.sync-box b { font-size: 15px; line-height: 1.2; }
.sync-box span { font-size: 11px; line-height: 1.3; color: var(--soft); }
.registry { left: 600px; top: 688px; width: 400px; height: 80px; padding: 9px 14px; justify-content: flex-start; align-items: flex-start; border-color: var(--line-strong); border-radius: 10px; font-size: 15px; line-height: 20px; }
.chip {
  position: absolute; top: 722px; width: 132px; height: 30px; box-sizing: border-box; padding: 0 10px;
  display: flex; align-items: center; background: #0F1A26; border: 1px solid var(--line-strong); border-radius: 8px;
  font-family: var(--mono); font-size: 10px; white-space: nowrap; color: var(--muted); transition: opacity .4s, transform .4s;
}
.chip.c43 { background: #101C17; border-color: var(--good); color: var(--good); }
.chip.c43.off { transform: scale(.8); }

/* people */
.crowd { left: 64px; top: 374px; width: 160px; height: 112px; align-items: flex-start; text-align: left; transform-origin: 100% 50%; }
.crowd.small { transform: scale(.8); }
.faces { display: flex; margin-bottom: 4px; }
.faces i { width: 18px; height: 18px; margin-left: -6px; border-radius: 9px; border: 2px solid var(--panel); }
.faces i:first-child { margin-left: 0; }
.person { left: 64px; width: 160px; height: 72px; align-items: flex-start; text-align: left; line-height: 22px; }
.avatar { display: inline-block; width: 18px; height: 18px; border-radius: 9px; vertical-align: -3px; }
.screen { position: absolute; left: 64px; top: 624px; display: flex; align-items: center; gap: 10px; transform-origin: 0 50%; transition: opacity .4s, transform .4s; }
.screen.off { transform: scale(.9); }
.screen svg { flex: none; fill: none; stroke: #DDD6C6; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
.screen .tag { white-space: nowrap; }

.git { left: 1240px; top: 590px; width: 296px; height: 150px; padding: 14px 16px; justify-content: flex-start; align-items: flex-start; line-height: 22px; }
.commit {
  position: absolute; left: 1256px; width: 264px; height: 48px; box-sizing: border-box; padding: 5px 12px;
  background: #0F1512; border: 1px solid #5A2A28; border-radius: 8px;
  font-family: var(--mono); font-size: 12px; line-height: 18px; transition: opacity .4s, transform .4s;
}
.commit b { color: var(--amber); font-weight: 600; }
.commit.off { transform: scale(.94); }
.commit.typo { top: 628px; }
.commit.fix { top: 682px; border-color: #2E6B4E; }

.failing {
  position: absolute; left: 360px; top: 222px; height: 40px; box-sizing: border-box; padding: 0 12px;
  display: flex; align-items: center; gap: 10px; background: #2A1414; border: 1px solid var(--bad); border-radius: 10px;
  font-family: var(--mono); font-size: 12px; color: var(--bad);
}
.failing .counter { font-size: 20px; font-weight: 600; }
.fixed {
  position: absolute; left: 600px; top: 230px; height: 24px; box-sizing: border-box; padding: 0 10px;
  display: flex; align-items: center; background: #101C17; border: 1px solid var(--good); border-radius: 12px;
  font-family: var(--mono); font-size: 11px; color: var(--good);
}
.alice { color: #DDD6C6; }
.who { color: var(--amber); }

/* ── timing inside a step: delays only apply on the click that changes them ── */
.s1 .db-row.settings { transition-delay: .3s, .3s, 1.2s, 1.2s, 1.2s, 1.2s, .4s; }
.s1 .db-row.settings .old { transition-delay: 1.05s; }
.s1 .db-row.settings .new { transition-delay: 1.35s; }
.s1 .api-old { transition-delay: .9s; }
.s1 .api-new { transition-delay: 1.1s; }
.s1 .route, .s1 .objs { transition-delay: 1.2s; }
.s1 .kinds { transition-delay: 1.45s; }
.s3 .platform-in { transition-delay: .6s; }
.s4 .objs.pulse { animation-delay: .9s; }
.s4 .reverser.pulse { animation-delay: 1.25s; }
.s5 .sync-box.pulse { animation-delay: .2s; }
.s5 .objs.pulse { animation-delay: .65s; }
.s8 .sync-box.pulse { animation-delay: .75s; }
.s4 .git.pulse { animation-delay: 1.7s; }
.s4 .commit.typo { transition-delay: 1.7s; }
.s5 .c42 { transition-delay: .5s; }
.s5 .api.bad { transition-delay: .9s; animation-delay: .9s; }
.s5 .failing { transition-delay: .9s; }

.s8 .git.pulse { animation-delay: .6s; }
.s8 .commit.fix { transition-delay: .6s; }
.s8 .objs.pulse { animation-delay: 1.15s; }
.s8 .c43 { transition-delay: 1.15s; }
.s8 .api.good { transition-delay: 1.6s; animation-delay: 1.6s; }
.s8 .fixed { transition-delay: 1.7s; }

/* a short glow when something arrives */
.pulse { animation: pulse-green 1s ease-out both; }
.reverser.pulse { animation-name: pulse-blue; }
@keyframes pulse-green {
  0%, 100% { box-shadow: 0 0 0 0 rgba(126, 224, 161, 0); }
  30% { box-shadow: 0 0 0 6px rgba(126, 224, 161, .35); }
}
@keyframes pulse-blue {
  0%, 100% { box-shadow: 0 0 0 0 rgba(90, 184, 255, 0); }
  30% { box-shadow: 0 0 0 6px rgba(90, 184, 255, .3); }
}

/* ── moving things: placed with translate(), from the top-left of the canvas ── */
.dot { position: absolute; left: 0; top: 0; width: 10px; height: 10px; border-radius: 5px; animation-timing-function: linear; animation-fill-mode: both; }
.dot.big { width: 12px; height: 12px; border-radius: 6px; background: var(--good); box-shadow: 0 0 12px rgba(126, 224, 161, .9); }

.traffic { width: 8px; height: 8px; border-radius: 4px; background: var(--accent); animation: traffic 2.4s linear infinite both; }
@keyframes traffic {
  0% { opacity: 0; transform: translate(219px, 425px); }
  4% { opacity: .85; }
  26% { transform: translate(390px, 455px); }
  60% { transform: translate(645px, 455px); }
  94% { opacity: .85; }
  100% { opacity: 0; transform: translate(945px, 433px); }
}
.order { background: var(--accent); box-shadow: 0 0 10px rgba(90, 184, 255, .8); animation-name: order; animation-duration: 1.2s; }
@keyframes order {
  0% { opacity: 0; transform: translate(182px, 413px); }
  1% { opacity: 1; }
  27% { transform: translate(390px, 455px); }
  53% { transform: translate(645px, 455px); }
  89% { opacity: 1; transform: translate(945px, 433px); }
  100% { opacity: 0; transform: translate(945px, 433px); }
}

.get {
  position: absolute; left: 0; top: 0; height: 24px; box-sizing: border-box; padding: 0 8px;
  display: flex; align-items: center; border-radius: 12px; background: #DDD6C6; color: var(--bg);
  font-family: var(--mono); font-size: 16px; font-style: normal; font-weight: 600; box-shadow: 0 0 10px rgba(221, 214, 198, .6);
  animation: get 1.3s linear both;
}
@keyframes get {
  0% { opacity: 0; transform: translate(166px, 611px); }
  1% { opacity: 1; }
  13% { transform: translate(232px, 611px); }
  26% { transform: translate(232px, 492px); }
  40% { transform: translate(374px, 450px); }
  53% { transform: translate(374px, 290px); }
  75% { transform: translate(1119px, 290px); }
  88% { opacity: 1; transform: translate(1140px, 313px); }
  100% { opacity: 0; transform: translate(1140px, 313px); }
}

.alice-edit, .alice-down, .to-git { background: #DDD6C6; box-shadow: 0 0 10px rgba(221, 214, 198, .85); }
.alice-edit { animation-name: alice-edit; animation-duration: .9s; }
@keyframes alice-edit {
  0% { opacity: 0; transform: translate(182px, 616px); }
  3% { opacity: 1; transform: translate(182px, 616px); }
  7% { transform: translate(248px, 616px); }
  14% { transform: translate(248px, 497px); }
  23% { transform: translate(390px, 455px); }
  33% { transform: translate(390px, 295px); }
  77% { transform: translate(1135px, 295px); }
  92% { opacity: 1; transform: translate(1376px, 325px); }
  100% { opacity: 0; transform: translate(1376px, 325px); }
}
.alice-down { animation-name: alice-down; animation-duration: .3s; }
@keyframes alice-down {
  0% { opacity: 0; transform: translate(1122px, 342px); }
  5% { opacity: 1; transform: translate(1122px, 342px); }
  95% { opacity: 1; transform: translate(1321px, 342px); }
  100% { opacity: 0; transform: translate(1321px, 342px); }
}
.to-git { animation-name: to-git; animation-duration: .4s; }
@keyframes to-git {
  0% { opacity: 0; transform: translate(1425px, 386px); }
  5% { opacity: 1; transform: translate(1425px, 386px); }
  90% { opacity: 1; transform: translate(1425px, 580px); }
  100% { opacity: 0; transform: translate(1425px, 580px); }
}
.sync { background: var(--good); box-shadow: 0 0 10px rgba(126, 224, 161, .85); }
.to-main { animation-name: to-main; animation-duration: .6s; }
@keyframes to-main {
  0% { opacity: 0; transform: translate(1285px, 583px); }
  5% { opacity: 1; transform: translate(1285px, 583px); }
  60% { transform: translate(1285px, 443px); }
  92% { opacity: 1; transform: translate(1128px, 443px); }
  100% { opacity: 0; transform: translate(1128px, 443px); }
}
.to-registry { animation-name: to-registry; animation-duration: .45s; }
@keyframes to-registry {
  0% { opacity: 0; transform: translate(1228px, 659px); }
  5% { opacity: 1; transform: translate(1228px, 659px); }
  85% { opacity: 1; transform: translate(814px, 659px); }
  100% { opacity: 0; transform: translate(814px, 659px); }
}
.to-api { animation-name: to-api; animation-duration: .4s; }
@keyframes to-api {
  0% { opacity: 0; transform: translate(711px, 682px); }
  5% { opacity: 1; transform: translate(711px, 682px); }
  85% { opacity: 1; transform: translate(711px, 505px); }
  100% { opacity: 0; transform: translate(711px, 505px); }
}
.bob-revert { background: var(--accent); box-shadow: 0 0 10px rgba(90, 184, 255, .8); animation-name: bob-revert; animation-duration: .6s; }
@keyframes bob-revert {
  0% { opacity: 0; transform: translate(219px, 715px); }
  3% { opacity: 1; transform: translate(219px, 715px); }
  88% { opacity: 1; transform: translate(1234px, 715px); }
  100% { opacity: 0; transform: translate(1234px, 715px); }
}
</style>
