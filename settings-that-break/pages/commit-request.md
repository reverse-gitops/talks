---
eyebrow: Reverser · CommitRequest
diveOut: 1132px 612px
clicks: 6
---

# Say <span class="green">why</span>, and the commit carries it.

A CommitRequest is a custom resource the user applies with kubectl. Reverser uses its message for the commit, closes the open window right away, and reports back in its status. Real Git history, without ever touching Git.

<div class="stage">

<Arrow points="224,570 299,570" />
<Arrow points="464,524 715,524" color="var(--accent)" />
<Arrow points="464,676 483,676" color="var(--amber)" />
<Arrow points="628,676 715,676" color="var(--amber)" dash="6 6" />
<Arrow points="1272,542 1315,542" />
<Arrow points="719,444 469,444" color="var(--good)" dash="6 6" class="fade" :class="{ off: $clicks < 5 }" />
<div class="at label green fade" :class="{ off: $clicks < 5 }" style="left: 476px; top: 416px">STATUS · written back</div>
<div class="at label blue" style="left: 476px; top: 496px">WATCH · what changed</div>
<div class="at label amber" style="left: 476px; top: 736px">AUDIT · who changed it</div>
<div class="at tag" style="left: 236px; top: 544px; color: var(--dim)">kubectl</div>

<!-- Alice, the API server with its objects, and the webhook batch -->
<div class="box tl" style="left: 64px; top: 522px; width: 160px; height: 96px; justify-content: center; padding: 12px 14px">
  <b>Alice</b><span class="tag">alice@stroopwafel.nl</span><span class="tag amber">● OIDC token</span>
</div>
<div class="box tl" style="left: 304px; top: 384px; width: 160px; height: 356px; padding: 16px 14px">
  <b>kube-apiserver</b><span class="sub">verifies the OIDC token<br>and stores the objects</span>
</div>
<div class="at kicker" style="left: 316px; top: 576px; font-size: 10px; color: var(--dim)">OBJECTS</div>
<div class="obj" style="top: 598px">deploy/web</div>
<div class="obj" style="top: 622px">hpa/web</div>
<div class="obj cr-row fade" :class="{ off: $clicks < 3 }" style="top: 646px; transition-delay: 1s">cr/launch-prep</div>
<div class="webhook">WEBHOOK BATCH</div>

<!-- Reverser with its two phases, and the git log -->
<div class="box tl" style="left: 720px; top: 384px; width: 552px; height: 356px; font-size: 20px; line-height: 26px">
  <span><b>Reverser</b> <span class="sub" style="font-size: 13px">· two phases per change</span></span>
</div>
<div class="zone phase" style="left: 736px; width: 256px" />
<div class="zone phase" style="left: 1008px; width: 248px" />
<div class="phase-head" style="left: 736px; width: 256px"><span class="amber">1 · JOIN</span><br>wait until identity arrives</div>
<div class="phase-head" style="left: 1008px; width: 248px"><span class="blue">2 · WINDOW</span><br>open until timeout or CommitRequest</div>
<div class="note" style="left: 752px; top: 700px; width: 228px">a CommitRequest is joined too</div>
<div class="note" style="left: 1024px; top: 704px; width: 220px">CommitRequest → close now</div>
<div class="box tl" style="left: 1320px; top: 384px; width: 216px; height: 356px; font-size: 20px; line-height: 26px">
  <b>git log</b><span class="sub" style="font-size: 13px">one commit per window</span>
</div>
<div class="note" style="left: 1336px; top: 700px; width: 192px">message comes from the user</div>

<!-- the open window: its timer runs from click 1 until the CommitRequest closes it on click 5 -->
<div class="window" :class="{ open: $clicks >= 1 && $clicks < 5, closing: $clicks === 5 }">
  window open
  <div class="timer-track"><i v-if="$clicks >= 1" class="timer" /></div>
</div>
<div class="at early fade" :class="{ off: $clicks !== 5 }">closed now</div>

<!-- the changes: api → join (wait for who) → window → git -->
<div class="card e1" :class="{ on: $clicks >= 1 && $clicks < 6, join: $clicks === 1, win: $clicks >= 2 && $clicks < 6, git: $clicks >= 6, named: $clicks >= 1 }" style="--named: 1.7s">
  <span><span class="blue">deploy/web</span> replicas</span><i class="badge who">who?</i><i class="badge name">alice</i>
</div>
<div class="card e2" :class="{ on: $clicks >= 2 && $clicks < 6, join: $clicks === 2, win: $clicks >= 3 && $clicks < 6, git: $clicks >= 6, named: $clicks >= 3 }" style="--named: .8s">
  <span><span class="blue">hpa/web</span> maxReplicas</span><i class="badge who">who?</i><i class="badge name">alice</i>
</div>
<div class="card cr" :class="{ on: $clicks >= 3 && $clicks < 6, join: $clicks === 3 || $clicks === 4, win: $clicks === 5, named: $clicks >= 4 }" style="--named: 1s">
  CommitRequest<i class="badge who">who?</i><i class="badge name">alice</i>
</div>
<div class="commit" :class="{ shown: $clicks >= 6 }">
  <span class="amber" style="font-weight: 600">alice@stroopwafel.nl</span><br>
  <span class="green">Prep for launch traffic</span><br>
  <span style="color: var(--soft)">a3f9c1 · 2 changes</span>
</div>

<!-- the CommitRequest object, with the status Reverser writes back -->
<div class="pop" :class="{ shown: $clicks >= 3 }">
  <div><span class="y">kind:</span> <span class="green">CommitRequest</span></div>
  <div><span class="y">metadata:</span></div>
  <div class="in"><span class="y">name:</span> launch-prep</div>
  <div class="in"><span class="y">namespace:</span> test</div>
  <div><span class="y">spec:</span></div>
  <div class="in"><span class="y">message:</span> Prep for launch traffic</div>
  <template v-if="$clicks < 5">
    <div><span class="y">status:</span> <span style="color: var(--dim)">{}</span></div>
  </template>
  <div v-else-if="$clicks === 5" class="late">
    <div><span class="y">status:</span></div>
    <div class="in"><span class="y">phase:</span> <span class="amber">Processing</span></div>
  </div>
  <div v-else class="late">
    <div><span class="y">status:</span></div>
    <div class="in"><span class="y">phase:</span> <span class="green">Committed</span></div>
    <div class="in"><span class="y">commit:</span> a3f9c1</div>
  </div>
  <i class="tail" />
</div>

<!-- events waiting in the webhook batch -->
<i class="ev fade" :class="{ off: $clicks !== 2 }" style="left: 504px; transition-delay: .6s" />
<i class="ev fade" :class="{ off: $clicks !== 3 }" style="left: 526px; transition-delay: 1.5s" />

<!-- one-shot motions, one group per click -->
<template v-if="$clicks === 1">
  <i class="pkt" />
  <i class="pulse" style="top: 604px; animation-delay: .5s" />
  <i class="ring r-api" style="--c: 90, 184, 255; animation-delay: .5s" />
  <i class="ev blip" style="left: 504px" />
  <i class="audit" style="animation-delay: .9s">audit batch</i>
  <i class="ring r-cor" style="--c: 242, 169, 59; animation-delay: 1.7s" />
</template>
<template v-if="$clicks === 2">
  <i class="pkt" />
  <i class="pulse" style="top: 628px; animation-delay: .5s" />
  <i class="ring r-api" style="--c: 90, 184, 255; animation-delay: .5s" />
</template>
<template v-if="$clicks === 3">
  <i class="audit">audit batch</i>
  <i class="ring r-cor" style="--c: 242, 169, 59; animation-delay: .8s" />
  <i class="pkt green" style="animation-delay: .4s" />
  <i class="pulse green" style="top: 652px; animation-delay: .9s" />
  <i class="ring r-api" style="--c: 126, 224, 161; animation-delay: .9s" />
  <i class="ring r-pop" style="--c: 126, 224, 161; animation-delay: 1s" />
</template>
<template v-if="$clicks === 4">
  <i class="audit">audit batch</i>
  <i class="ring r-cor" style="--c: 242, 169, 59; animation-delay: .8s" />
</template>
<template v-if="$clicks === 5">
  <i class="ring r-win" style="--c: 126, 224, 161; animation-delay: .4s" />
  <i class="st" style="animation-delay: .6s" />
  <i class="pulse green" style="top: 652px; animation-delay: 1.2s" />
  <i class="ring r-api" style="--c: 126, 224, 161; animation-delay: 1.2s" />
  <i class="ring r-pop" style="--c: 242, 169, 59; animation-delay: 1.3s" />
</template>
<template v-if="$clicks === 6">
  <i class="ring r-git" style="--c: 126, 224, 161; animation-delay: .8s" />
  <i class="st" style="animation-delay: .9s" />
  <i class="pulse green" style="top: 652px; animation-delay: 1.5s" />
  <i class="ring r-api" style="--c: 126, 224, 161; animation-delay: 1.5s" />
  <i class="ring r-pop" style="--c: 126, 224, 161; animation-delay: 1.6s" />
</template>

</div>

<Story>

- **changes** Alice changes the web Deployment and its autoscaler. Both are joined and land in an open window.
- **changes** Alice changes the web Deployment and its autoscaler. Both are joined and land in an open window.
- **changes** Alice changes the web Deployment and its autoscaler. Both are joined and land in an open window.
- **CommitRequest** Then she applies a <span class="green">CommitRequest</span> that says why. It lives in the cluster like any other object.
- **CommitRequest** Then she applies a <span class="green">CommitRequest</span> that says why. It lives in the cluster like any other object.
- **window closed** It does not join the window, it steers it: the window closes right away. Reverser sets its status to <span class="amber">Processing</span>.
- **committed** One commit by Alice with <span class="green">her reason</span> as the message. The status now points to that commit.

</Story>

<!--
Reverser handles every change in two phases: join (wait for the audit event that says who) and the window (collect changes until a timeout).

[click] Alice scales the web Deployment. The watch sees what changed, the audit batch says it was Alice. A window opens.

[click] She also bumps the autoscaler. Again: Reverser waits for the audit event before it knows who.

[click] Now she applies a CommitRequest with a message: "Prep for launch traffic". It is just another object in the cluster.

[click] Like any change, the CommitRequest is joined with its identity: Alice.

[click] But it does not land in the window, it closes it, right now. Reverser writes status Processing back on the object.

[click] One commit, authored by Alice, with her reason as the message. The status points to commit a3f9c1. Real Git history, and she never touched Git.
-->

<style>
.diagram > h1 + p { left: 600px; top: 160px; width: 900px; }
.label { font-family: var(--mono); font-size: 11px; letter-spacing: .06em; }
.tl { justify-content: flex-start; align-items: flex-start; text-align: left; padding: 16px; }
.sub { font-size: 12px; line-height: 18px; color: var(--soft); }
.note { position: absolute; font-size: 12px; line-height: 16px; color: var(--dim); }

.obj { position: absolute; left: 334px; font-family: var(--mono); font-size: 11px; line-height: 20px; color: var(--soft); }
.obj::before { content: ''; position: absolute; left: -14px; top: 6px; width: 8px; height: 8px; border-radius: 4px; background: var(--accent); }
.obj.cr-row { color: var(--good); }
.obj.cr-row::before { background: var(--good); }
.webhook {
  position: absolute; left: 488px; top: 628px; width: 140px; height: 96px; box-sizing: border-box; padding: 10px 12px;
  background: #17140F; border: 1px solid #5A4520; border-radius: 10px;
  font-family: var(--mono); font-size: 10px; letter-spacing: .1em; color: var(--amber);
}
.phase { top: 496px; height: 232px; border-radius: 8px; }
.phase-head { position: absolute; top: 452px; font-size: 13px; line-height: 18px; color: var(--soft); }
.phase-head span { font-family: var(--mono); font-size: 12px; letter-spacing: .08em; }

/* the window: opens late on click 1, glows and fades when the CommitRequest closes it */
.window {
  position: absolute; left: 1016px; top: 536px; width: 232px; height: 160px; box-sizing: border-box; padding: 8px 10px 12px;
  display: flex; align-items: flex-end; justify-content: flex-end; overflow: hidden;
  background: rgba(90, 184, 255, .06); border: 1px dashed var(--accent); border-radius: 10px;
  font-family: var(--mono); font-size: 11px; color: var(--accent);
  opacity: 0; transform: scale(.96); transition: opacity .3s, transform .3s;
}
.window.open { opacity: 1; transform: none; transition-delay: 1.9s; }
.window.closing { opacity: 0; transform: scale(.97); transition-delay: 1.3s; }
.timer-track { position: absolute; left: 0; bottom: 0; width: 100%; height: 3px; }
.timer { position: absolute; inset: 0; background: var(--accent); transform-origin: 0 50%; animation: timer 60s linear 1.9s both; }
@keyframes timer { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.closing .timer { animation-play-state: paused; background: var(--good); }
.closing .timer-track { animation: blink .6s steps(2, jump-none) .4s 2 both; }
@keyframes blink { 50% { opacity: .1; } }
.early {
  left: 1026px; top: 668px; height: 18px; box-sizing: border-box; padding: 0 7px; display: flex; align-items: center;
  background: var(--good); border-radius: 9px; font-family: var(--mono); font-size: 10px; font-weight: 600; color: var(--bg);
  transition-delay: .5s;
}

/* a change card; its classes say where it is (join, window, git) */
.card {
  position: absolute; left: 0; top: 0; width: 216px; height: 40px; box-sizing: border-box; padding: 0 10px;
  display: flex; align-items: center; background: #0F1A26; border: 1px solid #2D5D85; border-radius: 8px;
  font-family: var(--mono); font-size: 11px; color: var(--text);
  opacity: 0; transform: translate(472px, 504px); transition: transform .4s ease-in-out, opacity .2s;
}
.card.cr { background: #101C17; border-color: #2E6B4E; color: var(--good); font-weight: 600; }
.card.on { opacity: 1; }
.card.join { transform: translate(756px, 504px); transition-delay: .6s, .5s; }
.card.cr.join { transition-delay: 1.6s, 1.5s; }
.card.e1.win { transform: translate(1024px, 572px); transition-delay: .2s; }
.card.e2.win { transform: translate(1024px, 620px); transition-delay: 1.1s; }
.card.cr.win { transform: translate(1024px, 512px); opacity: 0; transition: transform .4s ease-in-out, opacity .4s 1.4s; }
.card.git { transform: translate(1340px, 504px); opacity: 0; transition: transform .6s ease-in .1s, opacity .3s .4s; }
.badge {
  position: absolute; right: 8px; top: 8px; height: 22px; box-sizing: border-box; padding: 0 7px;
  display: flex; align-items: center; border-radius: 11px; font-style: normal; transition: opacity .25s, transform .25s;
}
.who { border: 1px dashed var(--muted); color: var(--soft); font-weight: 400; }
.name { background: var(--amber); color: var(--bg); font-weight: 600; opacity: 0; transform: scale(.6); }
.named .badge { transition-delay: var(--named); }
.named .who { opacity: 0; }
.named .name { opacity: 1; transform: none; }

.commit {
  position: absolute; left: 1328px; top: 504px; width: 200px; height: 80px; box-sizing: border-box; padding: 9px 12px;
  background: #101C17; border: 1px solid #2E6B4E; border-radius: 8px; font-family: var(--mono); font-size: 12px; line-height: 20px;
  opacity: 0; transform: scale(.94); transition: opacity .4s, transform .4s;
}
.commit.shown { opacity: 1; transform: none; transition-delay: .8s; }

.pop {
  position: absolute; left: 224px; top: 184px; width: 320px; height: 186px; box-sizing: border-box; padding: 12px 16px;
  background: #0F1512; border: 1px solid #2E6B4E; border-radius: 12px;
  font-family: var(--mono); font-size: 12px; line-height: 18px; white-space: nowrap; color: var(--text);
  opacity: 0; transform: scale(.96); transform-origin: 160px 100%; transition: opacity .3s, transform .3s;
}
.pop.shown { opacity: 1; transform: none; transition-delay: .9s; }
.pop .y { color: var(--accent); }
.pop .in { padding-left: 16px; }
.pop .tail {
  position: absolute; left: 154px; bottom: -7px; width: 12px; height: 12px; background: #0F1512;
  border-right: 1px solid #2E6B4E; border-bottom: 1px solid #2E6B4E; transform: rotate(45deg);
}
.late { animation: appear .3s 1.4s both; }
@keyframes appear { from { opacity: 0; } to { opacity: 1; } }

/* ── one-shot motions ── */
.ev { position: absolute; top: 669px; width: 14px; height: 14px; border-radius: 3px; background: var(--amber); }
.blip { animation: blip .55s .4s both; }
@keyframes blip {
  0% { opacity: 0; transform: scale(.3); }
  20%, 90% { opacity: 1; transform: none; }
  100% { opacity: 0; }
}
.pkt {
  position: absolute; left: 0; top: 0; width: 12px; height: 12px; border-radius: 6px;
  background: var(--amber); box-shadow: 0 0 12px rgba(242, 169, 59, .8); animation: pkt .5s ease-in both;
}
.pkt.green { background: var(--good); box-shadow: 0 0 12px rgba(126, 224, 161, .8); }
@keyframes pkt {
  0% { opacity: 0; transform: translate(226px, 564px); }
  10% { opacity: 1; }
  90% { opacity: 1; transform: translate(290px, 564px); }
  100% { opacity: 0; transform: translate(290px, 564px); }
}
.st {
  position: absolute; left: 0; top: 0; width: 12px; height: 12px; border-radius: 6px;
  background: var(--good); box-shadow: 0 0 12px rgba(126, 224, 161, .8); animation: st .6s ease-in-out both;
}
@keyframes st {
  0% { opacity: 0; transform: translate(708px, 438px); }
  10% { opacity: 1; }
  90% { opacity: 1; transform: translate(470px, 438px); }
  100% { opacity: 0; transform: translate(470px, 438px); }
}
.pulse { position: absolute; left: 320px; width: 8px; height: 8px; border-radius: 4px; background: var(--accent); animation: pulse .5s both; }
.pulse.green { background: var(--good); }
@keyframes pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 transparent; }
  30% { transform: scale(1.6); box-shadow: 0 0 8px 2px currentColor; }
}
.audit {
  position: absolute; left: 0; top: 0; width: 112px; height: 32px; box-sizing: border-box; padding: 0 10px;
  display: flex; align-items: center; background: #2A1F0C; border: 1px solid var(--amber); border-radius: 8px;
  font-family: var(--mono); font-size: 11px; font-style: normal; color: var(--amber);
  animation: audit .9s ease-in-out both;
}
@keyframes audit {
  0% { opacity: 0; transform: translate(500px, 660px); }
  8% { opacity: 1; transform: translate(500px, 660px); }
  60% { opacity: 1; transform: translate(772px, 660px); }
  100% { opacity: 0; transform: translate(870px, 508px); }
}
/* a glow around a box: --c is the rgb of the colour */
.ring { position: absolute; border-radius: 12px; pointer-events: none; animation: ring .8s ease-out both; }
@keyframes ring {
  0% { box-shadow: 0 0 0 0 rgba(var(--c), 0); }
  30% { box-shadow: 0 0 0 6px rgba(var(--c), .3); }
  100% { box-shadow: 0 0 0 0 rgba(var(--c), 0); }
}
.r-api { left: 304px; top: 384px; width: 160px; height: 356px; }
.r-cor { left: 720px; top: 384px; width: 552px; height: 356px; }
.r-git { left: 1320px; top: 384px; width: 216px; height: 356px; }
.r-pop { left: 224px; top: 184px; width: 320px; height: 186px; }
.r-win { left: 1016px; top: 536px; width: 232px; height: 160px; border-radius: 10px; }
</style>
