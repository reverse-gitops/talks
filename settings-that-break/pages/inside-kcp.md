---
eyebrow: Reverser · Inside the config cluster
diveIn: 730px 460px
diveOut: 1140px 460px
clicks: 3
---

# KCP speaks Kubernetes. <span class="blue">Reverser listens.</span>

Settings are Kubernetes objects. Every change goes through an apiserver that knows exactly who you are.

<!-- `live`: the arrival motion of click 0 only plays on the slide you are looking at (not while it is preloaded) -->
<div class="stage" :class="{ live: $nav.currentPage === $page && $renderContext === 'slide' }">

<Arrow points="224,460 283,460" />
<Arrow points="468,460 515,460" color="var(--good)" />
<Arrow class="fade" :class="{ off: $clicks !== 1 }" points="940,460 1035,460" />
<div class="fade" :class="{ off: $clicks < 2 }">
  <Arrow points="940,430 1035,430" color="var(--accent)" />
  <Arrow points="940,490 1035,490" color="var(--amber)" dash="6 6" />
  <div class="at stream blue" style="top: 404px">WATCH</div>
  <div class="at stream amber" style="top: 500px">AUDIT</div>
</div>
<Arrow class="fade" :class="{ off: $clicks < 1 }" points="1240,460 1315,460" />

<div class="box card" style="left: 64px; top: 420px; width: 160px; height: 80px">
  <b><i class="alice" /> Alice</b><span class="tag amber">● OIDC token</span>
</div>
<div class="box" style="left: 288px; top: 410px; width: 180px; height: 100px">
  <b>Ingress</b><span class="tag">stroopwafel.nl<br>/clusters/root:orderer</span>
</div>

<!-- KCP: the config cluster -->
<div class="box kcp" style="left: 520px; top: 260px; width: 420px; height: 400px">
  <span><b>KCP</b> <small class="green">= a kube-apiserver</small></span>
  <span class="sub">checks Alice’s OIDC token · stores Settings objects</span>
</div>
<div class="at kicker" style="left: 544px; top: 344px; font-size: 10px; color: var(--dim)">CONFIG OBJECTS</div>
<div class="row" style="top: 364px">orderlimits/default</div>
<div class="row" style="top: 416px">apikeys/sendgrid</div>
<div class="row hit" :class="{ arrive: $clicks === 0 }" style="top: 488px">emailsettings/order-confirmations</div>
<div class="at path">
  <span class="tag" style="font-size: 10px; line-height: 15px; color: var(--muted)">PATCH /clusters/root:orderer/apis/orderer.stroopwafel.nl/v1/<br>      namespaces/default/emailsettings/order-confirmations</span><br>to the settings page this is just an API
</div>

<!-- Reverser, the git repo and the commit it writes -->
<div class="box rev fade" :class="{ off: $clicks < 1, pulse: $clicks === 1 || $clicks === 3, late: $clicks === 1 }" style="left: 1040px; top: 400px; width: 200px; height: 120px">
  <b>Reverser</b><span class="sub">changes → commits</span>
</div>
<div class="box git fade" :class="{ off: $clicks < 1 }" style="left: 1320px; top: 380px; width: 216px; height: 160px">
  <span><b>git</b> <small>· config repo</small></span>
</div>
<div class="commit pop" :class="{ out: $clicks < 1, late: $clicks === 1 }">
  <b class="amber">alice@stroopwafel.nl</b><br><span class="green">update email key</span>
</div>

<!-- the two questions -->
<div class="q pop" :class="{ out: $clicks < 2 }" style="top: 300px">What changed?</div>
<div class="q qb amber pop" :class="{ out: $clicks < 2 }" style="top: 342px">Who changed it?</div>

<!-- one-shot motions -->
<template v-if="$clicks === 0">
  <div class="at verb">PATCH</div>
  <i class="dot req" />
</template>
<i v-if="$clicks === 1" class="dot cd" />
<template v-if="$clicks === 2">
  <i class="dot wd" />
  <i class="dot ad" />
</template>

</div>

<Story>

- **KCP** Zoom in: KCP is just a kube-apiserver. The settings page calls it through the same Ingress, with Alice’s own token.
- **Reverser** Reverser sits next to it and writes every settings change to Git.
- **two questions** For a good commit, Reverser needs two answers: <span class="blue">what</span> changed, and <span class="amber">who</span> changed it.
- **two streams** The apiserver already offers both, as two separate streams. Let’s look inside.

</Story>

<!--
Zoom in on the config cluster: KCP is just a kube-apiserver. Alice's settings page sends a PATCH through the same Ingress, with her own OIDC token.

[click] Reverser sits next to it and turns every settings change into a Git commit.

[click] For a good commit it needs two answers: what changed, and who changed it.

[click] The apiserver already offers both, as two separate streams: watch and audit. Let's look inside.
-->

<style>
.stage { --green-line: #2E6B4E; }
.alice { display: inline-block; width: 18px; height: 18px; border-radius: 9px; background: #DDD6C6; vertical-align: -3px; }
.card { align-items: flex-start; text-align: left; padding: 10px 14px; line-height: 22px; }
.box .tag { line-height: 24px; }
.box small { font-size: 13px; font-weight: 400; color: var(--soft); }
.box .sub { font-size: 12px; color: var(--soft); }

.kcp {
  justify-content: flex-start; align-items: flex-start; text-align: left; padding: 18px 20px;
  background: #101C17; border-color: var(--green-line); font-size: 22px; line-height: 28px;
}
.kcp small { font-size: 15px; color: var(--good); }
.kcp .sub { margin-top: 8px; font-size: 13px; line-height: 20px; }
.row {
  position: absolute; left: 544px; width: 372px; height: 40px; box-sizing: border-box; padding: 0 14px;
  display: flex; align-items: center; background: #0F1A26; border: 1px solid var(--line); border-radius: 8px;
  font-family: var(--mono); font-size: 12px;
}
.row.hit { border-color: var(--green-line); }
/* on arrival the row lights up when Alice's PATCH lands */
.live .row.arrive { animation: row-hit 2.8s both; }
@keyframes row-hit {
  0%, 80% { border-color: var(--line); box-shadow: 0 0 0 0 rgba(126, 224, 161, 0); }
  85% { border-color: var(--green-line); box-shadow: 0 0 0 6px rgba(126, 224, 161, .35); }
  100% { border-color: var(--green-line); box-shadow: 0 0 0 0 rgba(126, 224, 161, 0); }
}
.path { left: 544px; top: 600px; width: 372px; font-size: 12px; line-height: 18px; color: var(--dim); }

.stream { left: 952px; font-family: var(--mono); font-size: 11px; letter-spacing: .08em; }
.rev { font-size: 20px; }
.rev.pulse { animation: glow-blue 1s ease-out both; }
.rev.pulse.late { animation-delay: .9s; }
@keyframes glow-blue {
  0% { box-shadow: 0 0 0 0 rgba(90, 184, 255, 0); }
  30% { box-shadow: 0 0 0 7px rgba(90, 184, 255, .3); }
  100% { box-shadow: 0 0 0 0 rgba(90, 184, 255, 0); }
}
.git { justify-content: flex-start; align-items: flex-start; padding: 14px 16px; line-height: 22px; }

/* pop in: fade + slight scale */
.pop { transition: opacity .4s ease, transform .4s ease; }
.pop.out { opacity: 0; transform: scale(.92); }
.commit {
  position: absolute; left: 1332px; top: 430px; width: 192px; height: 56px; box-sizing: border-box; padding: 8px 12px;
  background: #101C17; border: 1px solid var(--green-line); border-radius: 8px;
  font-family: var(--mono); font-size: 12px; line-height: 20px;
}
.commit b { font-weight: 600; }
.commit.late { transition-delay: 1.8s; }
.q {
  position: absolute; left: 1040px; height: 30px; box-sizing: border-box; padding: 0 12px;
  display: flex; align-items: center; background: #0F1A26; border: 1px solid var(--accent); border-radius: 15px;
  font-size: 15px; color: var(--accent);
}
.q.qb { background: #2A1F0C; border-color: var(--amber); transition-delay: .4s; }

.verb { left: 232px; top: 432px; font-family: var(--mono); font-size: 11px; font-weight: 600; opacity: 0; }
.live .verb { animation: verb 2.4s both; }
@keyframes verb { 0%, 35% { opacity: 0 } 40%, 85% { opacity: 1 } 90%, 100% { opacity: 0 } }

.dot { position: absolute; left: 0; top: 0; width: 10px; height: 10px; border-radius: 5px; opacity: 0; }
.req, .cd { background: #DDD6C6; box-shadow: 0 0 10px rgba(221, 214, 198, .85); }
.live .req { animation: req 1.4s .9s ease-in-out both; }
@keyframes req {
  0% { opacity: 1; transform: translate(219px, 455px); }
  30% { transform: translate(358px, 455px); }
  60% { transform: translate(515px, 455px); }
  96% { opacity: 1; transform: translate(700px, 503px); }
  100% { opacity: 0; transform: translate(700px, 503px); }
}
.cd { animation: cd 1.4s .5s ease-in-out both; }
@keyframes cd {
  0% { opacity: 1; transform: translate(935px, 455px); }
  35% { transform: translate(1135px, 455px); }
  96% { opacity: 1; transform: translate(1423px, 453px); }
  100% { opacity: 0; transform: translate(1423px, 453px); }
}
.wd { background: var(--accent); box-shadow: 0 0 10px rgba(90, 184, 255, .8); animation: wd .8s .7s ease-in-out both; }
.ad { border-radius: 3px; background: var(--amber); box-shadow: 0 0 10px rgba(242, 169, 59, .8); animation: ad .8s 1.3s ease-in-out both; }
@keyframes wd {
  0% { opacity: 1; transform: translate(935px, 425px); }
  90% { opacity: 1; transform: translate(1033px, 425px); }
  100% { opacity: 0; transform: translate(1033px, 425px); }
}
@keyframes ad {
  0% { opacity: 1; transform: translate(935px, 485px); }
  90% { opacity: 1; transform: translate(1033px, 485px); }
  100% { opacity: 0; transform: translate(1033px, 485px); }
}
</style>
