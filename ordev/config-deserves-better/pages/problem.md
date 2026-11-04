---
eyebrow: The problem
diveOut: 950px 460px
clicks: 3
---

# One typo. <span class="red">No more customer emails.</span>

Settings often live in the app’s database, next to the orders. One small edit can break production, and it is not always clear what happened.

<script setup>
import { ref, watch } from 'vue'

// On click 1 the world stops once Alice's edit has landed (straight away when you step back to it).
// ($clicks and $nav are provided by Slidev in every slide's script setup.)
const frozen = ref(false)
let timer
watch($clicks, (clicks) => {
  clearTimeout(timer)
  frozen.value = false
  if (clicks === 1) timer = setTimeout(() => (frozen.value = true), $nav.value.clicksDirection < 0 ? 0 : 1800)
}, { immediate: true })
</script>

<!-- from click 2 the emails fail -->
<div class="stage" :class="{ frozen, failing: $clicks >= 2 }">

<!-- infra cluster with the workload -->
<div class="zone" style="left: 288px; top: 200px; width: 832px; height: 520px" />
<div class="at" style="left: 312px; top: 218px; font-size: 13px; line-height: 18px; color: var(--soft)">
  <span class="kicker">INFRA CLUSTER</span>
</div>
<div class="zone dashed" style="left: 304px; top: 340px; width: 772px; height: 236px" />
<div class="at" style="left: 318px; top: 546px; font-size: 13px; color: var(--soft)">
  <span class="kicker">WORKLOAD</span>
</div>

<Arrow points="224,430 319,430" />
<Arrow points="470,460 559,460" />
<Arrow points="740,460 839,460" />
<Arrow points="650,510 650,640 1179,640" />
<Arrow points="1340,640 1399,640" />
<Arrow points="224,576 272,576 272,490 319,490" />
<div class="at tag" style="left: 676px; top: 612px; color: var(--muted)">order confirmation email · uses <span style="color: var(--text)">sendgrid.apiKey</span></div>
<div class="at tag" style="left: 478px; top: 432px; color: var(--accent)">/api/orders · constant</div>

<div class="box" style="left: 64px; top: 374px; width: 160px; height: 112px; align-items: flex-start; text-align: left">
  <div class="faces"><i style="background: #5AB8FF" /><i style="background: #8A96A8" /><i style="background: #2D5D85" /><i style="background: #A3AEBE" /><i style="background: #4A5668" /><i style="background: #5AB8FF" /></div>
  <b>Customers</b><span class="tag">ordering all day</span>
</div>
<div class="box" style="left: 64px; top: 540px; width: 160px; height: 72px; align-items: flex-start; text-align: left">
  <b><i class="alice" /> Alice</b><span class="tag" style="color: #CFC8B8">power user</span>
</div>
<div class="box" style="left: 320px; top: 410px; width: 150px; height: 100px"><b>Ingress</b><span class="tag">stroopwafel.nl</span></div>
<div class="box" style="left: 560px; top: 410px; width: 180px; height: 100px"><b>API</b><span class="tag">orders · settings · email</span></div>
<div class="box" style="left: 840px; top: 360px; width: 220px; height: 200px; justify-content: flex-start; align-items: flex-start; padding: 16px"><b>PostgreSQL</b></div>
<div class="row" style="top: 420px; border-color: #2D5D85"><span>table</span> orders</div>
<div class="row" style="top: 470px" :class="{ bad: $clicks >= 1, late: $clicks === 1 }"><span>table</span> settings</div>

<!-- the setting itself: the value swaps when the typo lands -->
<div class="setting" :class="{ bad: $clicks >= 1, late: $clicks === 1 }">
  settings · sendgrid.apiKey
  <div class="value">
    <span v-if="$clicks < 1">SG.Hk3p…wQ9</span>
    <span v-else>SG.Hk3<u class="red">o</u>…wQ9</span>
  </div>
</div>

<div class="at kicker" style="left: 1148px; top: 560px; font-size: 11px">EXTERNAL</div>
<div class="box" style="left: 1180px; top: 600px; width: 160px; height: 80px; line-height: 22px" :class="{ bad: $clicks >= 2 }"><b>SendGrid</b><span style="font-size: 12px; color: var(--soft)">email API</span></div>
<div class="box" style="left: 1400px; top: 600px; width: 136px; height: 80px; line-height: 22px"><b>Customers</b><span style="font-size: 12px; color: var(--soft)">inbox</span></div>
<div class="pill fade" :class="{ off: $clicks < 2 }">401 Unauthorized</div>
<div class="failing-count fade" :class="{ off: $clicks < 2 }">emails failing <Counter :from="2" /></div>
<div class="at tag inbox fade green" :class="{ off: $clicks >= 2 }">delivered</div>
<div class="at tag inbox fade red" :class="{ off: $clicks < 2 }" style="transition-delay: .6s">nothing arrives</div>

<!-- order traffic: always flowing -->
<i v-for="n in 8" :key="n" class="dot traffic loop" :style="{ animationDelay: `${-0.3 * n}s` }" />
<!-- confirmation emails: delivered, or bounced at SendGrid -->
<i v-for="n in 3" :key="n" class="mail loop" :style="{ animationDelay: `${-n}s` }" />
<!-- Alice's edit travels to the settings table -->
<i v-if="$clicks === 1" class="dot alice-edit" />
<!-- the flash marks the moment the world freezes -->
<div v-if="frozen" class="flash" />

<div class="questions">
  <div v-click="3">Did anyone make a change?</div>
  <div v-click="3">Who did it?</div>
  <div v-click="3">Why did they do it?</div>
  <div v-click="3">Can we roll back?</div>
  <div v-click="3">Are secrets encrypted?</div>
  <div v-click="3">Can we access the database logs?</div>
  <p v-click="3">Some apps get this right. Many don’t.</p>
</div>

</div>

<Story>

- **emails flow** Every order sends a confirmation email through SendGrid, with an API key stored in the app’s settings.
- **one typo** A power user updates the key on the settings page. One character is off.
- **silent failure** Orders still succeed. But every email now fails with <span class="red">401 Unauthorized</span>, and customers hear nothing.
- **no answers** Some apps handle this well. Many don’t, and you find out in production.

</Story>

<!--
Every order sends a confirmation email; the SendGrid key lives in the app's own settings table.

[click] Alice, a power user, edits the key. One character off.

[click] Nothing crashes. Orders still go through. But every email bounces with a 401.

[click] So: did anyone even make a change? Who did it, and why? Can we roll back? And is that key stored encrypted at all? Can we even get at the database logs?
-->

<style>
.faces { display: flex; margin-bottom: 4px; }
.faces i { width: 18px; height: 18px; margin-left: -6px; border-radius: 9px; border: 2px solid var(--panel); }
.faces i:first-child { margin-left: 0; }
.alice { display: inline-block; width: 18px; height: 18px; border-radius: 9px; background: #DDD6C6; vertical-align: -3px; }

.row {
  position: absolute; left: 856px; width: 188px; height: 36px; box-sizing: border-box; padding: 0 12px;
  display: flex; align-items: center; gap: .6em;
  background: #0F1A26; border: 1px solid var(--line); border-radius: 8px;
  font-family: var(--mono); font-size: 12px; transition: border-color .4s;
}
.row span { color: var(--dim); }
.setting {
  position: absolute; left: 840px; top: 252px; width: 260px; height: 76px; box-sizing: border-box; padding: 10px 14px;
  background: var(--panel); border: 1px solid var(--line); border-radius: 10px;
  font-family: var(--mono); font-size: 11px; line-height: 16px; color: var(--muted); transition: border-color .4s;
}
.setting .value { margin-top: 8px; font-size: 16px; line-height: 24px; color: var(--text); white-space: nowrap; }
/* on click 1 the glow waits for Alice's edit to arrive */
.late { transition-delay: 1.5s; animation-delay: 1.5s !important; }
.setting.late .value span { animation: swap .3s 1.6s both; }
@keyframes swap { from { opacity: 0 } to { opacity: 1 } }
.row.late, .setting.late { transition: border-color .4s 1.5s; }

.pill {
  position: absolute; left: 1180px; top: 692px; height: 22px; box-sizing: border-box; padding: 0 9px;
  display: flex; align-items: center; background: #3A1716; border: 1px solid var(--bad); border-radius: 11px;
  font-family: var(--mono); font-size: 11px; color: var(--bad);
}
.failing-count {
  position: absolute; left: 1180px; top: 724px; height: 36px; box-sizing: border-box; padding: 0 12px;
  display: flex; align-items: center; gap: 10px; background: #2A1414; border: 1px solid var(--bad); border-radius: 10px;
  font-family: var(--mono); font-size: 12px; color: var(--bad);
}
.failing-count .counter { font-size: 18px; font-weight: 600; }
.inbox { left: 1400px; top: 694px; width: 136px; text-align: center; }

.dot { position: absolute; left: 0; top: 0; width: 8px; height: 8px; border-radius: 4px; background: var(--accent); }
.traffic { animation: traffic 2.4s linear infinite both; }
@keyframes traffic {
  0% { opacity: 0; transform: translate(219px, 425px); }
  4% { opacity: .85; }
  26% { transform: translate(390px, 455px); }
  60% { transform: translate(645px, 455px); }
  94% { opacity: .85; }
  100% { opacity: 0; transform: translate(945px, 433px); }
}
.mail { position: absolute; left: 0; top: 0; width: 12px; height: 9px; border-radius: 2px; background: var(--text); animation: mail-ok 3s linear infinite both; }
.failing .mail { animation-name: mail-fail; }
@keyframes mail-ok {
  0% { opacity: 0; transform: translate(644px, 506px); }
  5% { opacity: 1; }
  20% { transform: translate(644px, 636px); }
  70% { transform: translate(1254px, 636px); }
  95% { opacity: 1; transform: translate(1462px, 636px); }
  100% { opacity: 0; transform: translate(1462px, 636px); }
}
@keyframes mail-fail {
  0% { opacity: 0; transform: translate(644px, 506px) scale(1); background-color: var(--text); }
  5% { opacity: 1; }
  20% { transform: translate(644px, 636px) scale(1); }
  64% { transform: translate(1168px, 636px) scale(1); background-color: var(--text); }
  70% { transform: translate(1174px, 636px) scale(1.5); background-color: var(--bad); }
  88% { opacity: 1; transform: translate(1174px, 668px) scale(1); background-color: var(--bad); }
  100% { opacity: 0; transform: translate(1174px, 690px) scale(1); background-color: var(--bad); }
}
.alice-edit {
  width: 10px; height: 10px; border-radius: 5px; background: #DDD6C6; box-shadow: 0 0 10px rgba(221, 214, 198, .85);
  animation: alice-edit 1.6s ease-in-out both;
}
@keyframes alice-edit {
  0% { opacity: 1; transform: translate(219px, 571px); }
  12% { transform: translate(267px, 571px); }
  24% { transform: translate(267px, 485px); }
  36% { transform: translate(390px, 455px); }
  60% { transform: translate(645px, 455px); }
  94% { opacity: 1; transform: translate(945px, 483px); }
  100% { opacity: 0; transform: translate(945px, 483px); }
}
.flash { position: absolute; inset: 0; background: #fff; pointer-events: none; animation: flash .6s ease-out both; }
@keyframes flash { 0% { opacity: .55 } 100% { opacity: 0 } }

.questions { position: absolute; left: 1180px; top: 252px; width: 356px; font-size: 19px; line-height: 26px; font-weight: 500; }
.questions div { height: 36px; }
.questions p { margin: 12px 0 0; font-size: 14px; line-height: 20px; font-weight: 400; color: var(--soft); }
.questions > :nth-child(2) { transition-delay: .35s; }
.questions > :nth-child(3) { transition-delay: .7s; }
.questions > :nth-child(4) { transition-delay: 1.05s; }
.questions > :nth-child(5) { transition-delay: 1.4s; }
.questions > :nth-child(6) { transition-delay: 1.75s; }
.questions > :nth-child(7) { transition-delay: 2.1s; }
</style>
