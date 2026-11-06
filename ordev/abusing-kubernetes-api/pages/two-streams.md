---
eyebrow: Reverser · how it works
diveIn: 996px 442px
diveOut: 1132px 492px
clicks: 9
---

# Two streams in. <span class="blue">What</span> changed, joined with <span class="amber">who</span> changed it.

The watch stream says what changed; the audit webhook says who. Each change waits only until its author is known, then joins a window. One window becomes one commit.

<!--
  Alice: click 1 change, 2 joined, 3 commit.
  Bob:   click 4 svc/web, 5 joined; 6 cm/flags; 7 it joins + job/migrate deleted; 8 joined; 9 commit.
  Delays inside a click: the change reaches the API server at ~.7s, the audit batch reaches Reverser at ~.8s.
-->
<div class="stage">

<Arrow points="224,348 299,348" />
<Arrow points="224,548 299,548" />
<Arrow points="464,404 715,404" color="var(--accent)" />
<Arrow points="464,556 483,556" color="var(--amber)" />
<Arrow points="628,556 715,556" color="var(--amber)" dash="6 6" />
<Arrow points="1272,412 1315,412" />

<!-- people, each with their own OIDC token -->
<div class="box user" style="top: 300px"><b>Alice</b><span class="tag">alice@stroopwafel.nl</span><span class="tag amber">● OIDC token</span></div>
<div class="box user" style="top: 500px"><b>Bob</b><span class="tag">bob@stroopwafel.nl</span><span class="tag amber">● OIDC token</span></div>

<!-- the API server and its objects -->
<div class="box group" style="left: 304px; width: 160px; padding: 16px 14px">
  <b>kube-apiserver</b><span class="small">verifies the OIDC token<br>and stores the objects</span>
</div>
<div class="at kicker" style="left: 316px; top: 440px; font-size: 10px; color: var(--dim)">OBJECTS</div>
<div class="obj" style="top: 462px" :class="{ ping: $clicks === 1 }">deploy/web</div>
<div class="obj" style="top: 486px" :class="{ ping: $clicks === 4 }">svc/web</div>
<div class="obj gone" :class="{ off: $clicks >= 7, ping: $clicks === 7 }">job/migrate</div>
<div class="obj added" :class="{ off: $clicks < 6, up: $clicks >= 7, ping: $clicks === 6 }">cm/flags</div>

<!-- the audit webhook batches events and sends them every second -->
<div class="webhook">WEBHOOK BATCH</div>
<i class="beat" /><i class="beat ring loop" />
<div class="at stream blue" style="top: 376px">WATCH · instant · no who</div>
<div class="at stream amber" style="top: 616px">AUDIT · has who · 1s batch</div>

<!-- Reverser: join, then window -->
<div class="box group" style="left: 720px; width: 552px; font-size: 20px; line-height: 26px">
  <span><b>Reverser</b> <span class="small">· two phases per change</span></span>
</div>
<div class="panel" style="left: 736px; width: 256px" />
<div class="panel" style="left: 1008px; width: 248px" />
<div class="at phase" style="left: 736px; width: 256px"><span class="kicker amber">1 · JOIN</span><br>wait until identity arrives</div>
<div class="at phase" style="left: 1008px; width: 248px"><span class="kicker blue">2 · WINDOW</span><br>group changes · 10s</div>
<div class="at note" style="left: 752px; top: 580px; width: 228px">identity attached → moves on at once</div>
<div class="at note" style="left: 1024px; top: 584px; width: 220px">window closes → one commit</div>

<div class="box group" style="left: 1320px; width: 216px; font-size: 20px; line-height: 26px">
  <span><b>git log</b><br><span class="small">one commit per window</span></span>
</div>
<div class="at note" style="left: 1336px; top: 580px; width: 192px">authored by the token’s user</div>

<!-- the commit windows: the bar is the 10s timer, running in real time -->
<div class="window" :class="{ off: $clicks !== 2, wait: $clicks === 2 }">alice · window 10s<i :class="{ run: $clicks === 2 }" /></div>
<div class="window" :class="{ off: $clicks < 5 || $clicks > 8, wait: $clicks === 5 }">bob · window 10s<i :class="{ run: $clicks >= 5 }" /></div>

<!-- commits -->
<div class="commit" :class="{ off: $clicks < 3, wait: $clicks === 3, down: $clicks >= 9 }"><b>alice@stroopwafel.nl</b><br>a3f9c1 · 1 change</div>
<div class="commit" :class="{ off: $clicks < 9, wait: $clicks === 9 }"><b>bob@stroopwafel.nl</b><br>e71b0d · 3 changes</div>

<!-- the changes: from the watch stream into join, into a window, into git -->
<div class="ev" :class="[$clicks < 1 ? '' : $clicks === 1 ? 'join' : $clicks === 2 ? 'w1' : 'git', { arrive: $clicks === 1, move: $clicks === 2 }]">
  <span><em>MODIFIED</em> deploy/web</span>
  <b class="who" :class="{ off: $clicks >= 2, tagged: $clicks === 2 }">who?</b>
  <b class="name" :class="{ off: $clicks < 2, tagged: $clicks === 2 }">alice</b>
</div>
<div class="ev" :class="[$clicks < 4 ? '' : $clicks === 4 ? 'join' : $clicks < 9 ? 'w1' : 'git', { arrive: $clicks === 4, move: $clicks === 5 }]">
  <span><em>MODIFIED</em> svc/web</span>
  <b class="who" :class="{ off: $clicks >= 5, tagged: $clicks === 5 }">who?</b>
  <b class="name" :class="{ off: $clicks < 5, tagged: $clicks === 5 }">bob</b>
</div>
<div class="ev" :class="[$clicks < 6 ? '' : $clicks === 6 ? 'join' : $clicks < 9 ? 'w2' : 'git', { arrive: $clicks === 6, move: $clicks === 7 }]">
  <span><em>ADDED</em> cm/flags</span>
  <b class="who" :class="{ off: $clicks >= 7, tagged: $clicks === 7 }">who?</b>
  <b class="name" :class="{ off: $clicks < 7, tagged: $clicks === 7 }">bob</b>
</div>
<div class="ev" :class="[$clicks < 7 ? '' : $clicks === 7 ? 'join' : $clicks < 9 ? 'w3' : 'git', { arrive: $clicks === 7, late: $clicks === 7, move: $clicks === 8 }]">
  <span><em>DELETED</em> job/migrate</span>
  <b class="who" :class="{ off: $clicks >= 8, tagged: $clicks === 8 }">who?</b>
  <b class="name" :class="{ off: $clicks < 8, tagged: $clicks === 8 }">bob</b>
</div>

<!-- one-shot motions: the request with its token, the API server and Reverser lighting up -->
<template v-if="[1, 4, 6, 7].includes($clicks)">
  <div :key="'verb' + $clicks" class="verb" :style="{ top: $clicks === 1 ? '320px' : '520px' }">{{ $clicks === 6 ? 'POST' : $clicks === 7 ? 'DELETE' : 'PATCH' }}</div>
  <i :key="'token' + $clicks" class="token" :style="{ '--y': $clicks === 1 ? '342px' : '542px' }" />
  <i :key="'api' + $clicks" class="glow api" />
</template>
<!-- the audit event waits in the batch; the next batch carries it to Reverser -->
<i v-if="[1, 4, 6, 7].includes($clicks)" :key="'event' + $clicks" class="event" :class="{ late: $clicks === 7 }" />
<template v-if="[2, 5, 7, 8].includes($clicks)">
  <div :key="'batch' + $clicks" class="batch">batch · 1 evt</div>
  <i :key="'rev' + $clicks" class="glow rev" />
</template>
<i v-if="$clicks === 3 || $clicks === 9" :key="'git' + $clicks" class="glow git" />

</div>

<Story>

- **change** Two streams leave the API server: the watch stream says <span class="blue">what</span>, the audit webhook says <span class="amber">who</span>.
- **change** Alice scales <b>deploy/web</b>. The watch event arrives instantly but anonymous, so it waits in the join phase.
- **joined** The next 1s audit batch brings <span class="amber">who</span>. Identity attached → straight on into a 10s window.
- **commit** The window closes: one change becomes one commit by alice&#64;stroopwafel.nl.
- **Bob: 3 changes** Then Bob updates a Service. Its watch event waits for <span class="amber">who</span>, just like Alice’s did.
- **Bob: 3 changes** The audit batch names bob, and his change opens a new 10s window.
- **Bob: 3 changes** Bob creates a ConfigMap: another anonymous change in the join phase.
- **Bob: 3 changes** It joins Bob’s open window. Meanwhile he deletes a Job.
- **Bob: 3 changes** All three land in the same open window.
- **commit** One commit by bob&#64;stroopwafel.nl with all three: an update, a create and a delete.

</Story>

<!--
Two streams: the watch stream tells Reverser what changed, the audit webhook tells it who.

[click] Alice scales deploy/web. The watch event is instant, but anonymous. It waits in the join phase.

[click] The audit webhook batches every second. That batch brings the who: alice. Identity attached, straight into a 10-second window.

[click] Window closes: one change, one commit, authored by alice.

[click] Now Bob. He updates a Service. Same thing: instant, but waiting for who.

[click] The batch names bob; his change opens a new window.

[click] He creates a ConfigMap...

[click] ...which joins the same window. And he deletes a Job.

[click] All three are in Bob's open window.

[click] Window closes: one commit by bob with an update, a create and a delete.
-->

<style>
.slidev-layout h1 { width: 1320px; }
.small { font-size: 12px; line-height: 18px; font-weight: 400; color: var(--soft); }
.note { font-size: 12px; line-height: 16px; color: var(--dim); }

.user { left: 64px; width: 160px; height: 96px; padding: 12px 14px; align-items: flex-start; text-align: left; }
.user .tag { line-height: 26px; }
.group { top: 264px; height: 356px; padding: 16px; justify-content: flex-start; align-items: flex-start; text-align: left; }

.obj {
  position: absolute; left: 334px; font-family: var(--mono); font-size: 11px; line-height: 20px; color: var(--soft);
  transition: opacity .4s, top .5s;
}
.obj::before { content: ''; position: absolute; left: -14px; top: 6px; width: 8px; height: 8px; border-radius: 4px; background: var(--accent); }
.obj.ping::before { animation: ping .8s .6s ease-out both; }
@keyframes ping {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(90, 184, 255, 0); }
  30% { transform: scale(1.6); box-shadow: 0 0 8px 2px rgba(90, 184, 255, .8); }
}
.obj.gone { top: 510px; transition-delay: .9s; }
.obj.added { top: 534px; transition-delay: .6s; }
.obj.added.up { top: 510px; transition-delay: 1.2s; }

.webhook {
  position: absolute; left: 488px; top: 508px; width: 140px; height: 96px; box-sizing: border-box; padding: 10px 12px;
  background: #17140F; border: 1px solid #5A4520; border-radius: 10px;
  font-family: var(--mono); font-size: 10px; letter-spacing: .1em; color: var(--amber);
}
.beat { position: absolute; left: 610px; top: 518px; width: 8px; height: 8px; border-radius: 4px; background: var(--amber); }
.beat.ring { left: 608px; top: 516px; width: 12px; height: 12px; box-sizing: border-box; border-radius: 6px; background: none; border: 1px solid var(--amber); animation: beat 1s ease-out infinite both; }
@keyframes beat { 0% { transform: scale(1); opacity: .9; } 60%, 100% { transform: scale(2.6); opacity: 0; } }
.stream { left: 476px; font-family: var(--mono); font-size: 11px; letter-spacing: .06em; }

.panel { position: absolute; top: 376px; height: 232px; box-sizing: border-box; background: var(--panel-deep); border: 1px solid #1E2733; border-radius: 8px; }
.phase { top: 332px; font-size: 13px; line-height: 18px; color: var(--soft); }
.phase .kicker { letter-spacing: .08em; }

.window {
  position: absolute; left: 1016px; top: 384px; width: 232px; height: 188px; box-sizing: border-box; padding: 8px 10px; overflow: hidden;
  background: rgba(90, 184, 255, .06); border: 1px dashed var(--accent); border-radius: 10px;
  font-family: var(--mono); font-size: 11px; color: var(--accent);
  transition: opacity .5s, transform .5s;
}
.window.off { transform: scale(.96); }
.window.wait { transition-delay: .8s; }
.window i { position: absolute; left: 0; bottom: 0; width: 100%; height: 3px; background: var(--accent); transform: scaleX(0); transform-origin: 0 50%; }
.window i.run { animation: timer 10s 1.1s linear both; }
@keyframes timer { to { transform: scaleX(1); } }

.commit {
  position: absolute; left: 1328px; top: 384px; width: 200px; height: 56px; box-sizing: border-box; padding: 8px 12px;
  background: #101C17; border: 1px solid #2E6B4E; border-radius: 8px;
  font-family: var(--mono); font-size: 12px; line-height: 20px; color: var(--soft);
  transition: opacity .4s, transform .5s, top .6s;
}
.commit b { color: var(--amber); font-weight: 600; }
.commit.off { transform: scale(.94); }
.commit.wait { transition-delay: .5s; }
.commit.down { top: 456px; transition-delay: 0s; }

/* a change: starts at the end of the watch arrow, then join → window row → git */
.ev {
  position: absolute; left: 0; top: 0; width: 216px; height: 40px; box-sizing: border-box; padding: 0 10px;
  display: flex; align-items: center; background: #0F1A26; border: 1px solid #2D5D85; border-radius: 8px;
  font-family: var(--mono); font-size: 11px; color: var(--text);
  opacity: 0; transform: translate(472px, 384px);
  transition: transform .7s cubic-bezier(.4, 0, .2, 1), opacity .3s;
}
.ev em { font-style: normal; color: var(--accent); }
.ev.join { opacity: 1; transform: translate(756px, 384px); }
.ev.w1 { opacity: 1; transform: translate(1024px, 420px); }
.ev.w2 { opacity: 1; transform: translate(1024px, 468px); }
.ev.w3 { opacity: 1; transform: translate(1024px, 516px); }
.ev.git { opacity: 0; transform: translate(1340px, 384px); transition-duration: .6s; transition-timing-function: ease-in; }
.ev.arrive { transition-delay: .8s; }
.ev.arrive.late { transition-delay: 1.6s; }
.ev.move { transition-delay: 1.1s; }
.ev b {
  position: absolute; right: 8px; top: 8px; height: 22px; box-sizing: border-box; padding: 0 7px;
  display: flex; align-items: center; border-radius: 11px; transition: opacity .3s, transform .3s;
}
.ev .who { border: 1px dashed var(--muted); color: var(--soft); font-weight: 400; }
.ev .name { background: var(--amber); color: var(--bg); font-weight: 600; }
.ev .name.off { transform: scale(.6); }
.ev .tagged { transition-delay: .8s; }

/* one-shot motions */
.verb {
  position: absolute; left: 236px; font-family: var(--mono); font-size: 11px; font-weight: 600; letter-spacing: .04em;
  animation: verb 2.2s both;
}
@keyframes verb { 0% { opacity: 0; } 8%, 75% { opacity: 1; } 100% { opacity: 0; } }
.token {
  position: absolute; left: 0; top: 0; width: 12px; height: 12px; border-radius: 6px; background: var(--amber);
  box-shadow: 0 0 12px rgba(242, 169, 59, .8); animation: token .7s .1s ease-in-out both;
}
@keyframes token {
  0% { opacity: 1; transform: translate(226px, var(--y)); }
  90% { opacity: 1; transform: translate(290px, var(--y)); }
  100% { opacity: 0; transform: translate(290px, var(--y)); }
}
.event {
  position: absolute; left: 504px; top: 549px; width: 14px; height: 14px; border-radius: 3px; background: var(--amber);
  animation: event .3s .8s ease-out both;
}
.event.late { animation-delay: 1.6s; }
@keyframes event { from { opacity: 0; transform: scale(.3); } to { opacity: 1; transform: scale(1); } }
.batch {
  position: absolute; left: 0; top: 0; width: 112px; height: 32px; box-sizing: border-box; padding: 0 10px;
  display: flex; align-items: center; white-space: nowrap;
  background: #2A1F0C; border: 1px solid var(--amber); border-radius: 8px; font-family: var(--mono); font-size: 11px; color: var(--amber);
  animation: batch .9s ease-in-out both;
}
@keyframes batch {
  0% { opacity: 1; transform: translate(500px, 540px); }
  55% { opacity: 1; transform: translate(772px, 540px); }
  100% { opacity: 0; transform: translate(870px, 388px); }
}
.glow { position: absolute; top: 264px; height: 356px; border-radius: 12px; pointer-events: none; animation: 1s ease-out both; }
.glow.api { left: 304px; width: 160px; --c: rgba(90, 184, 255, .28); animation-name: glow; animation-delay: .7s; }
.glow.rev { left: 720px; width: 552px; --c: rgba(242, 169, 59, .3); animation-name: glow; animation-delay: .8s; }
.glow.git { left: 1320px; width: 216px; --c: rgba(126, 224, 161, .25); animation-name: glow; animation-delay: .5s; }
@keyframes glow {
  0%, 100% { box-shadow: 0 0 0 0 transparent; }
  30% { box-shadow: 0 0 0 6px var(--c); }
}
</style>
