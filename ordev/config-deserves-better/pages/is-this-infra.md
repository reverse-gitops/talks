---
layout: default
transition: fade
---

###### Hard part 3a · Convincing architects

# Is this <span class="red">infra</span>?

<div class="spectrum">
  <div class="bar" />
  <div class="ends"><span>platform team owns it</span><span>app team owns it</span></div>
  <div class="chips">
    <div class="group"><b>Namespace</b><b>Deployment</b><b>Ingress</b><b>Certificate</b></div>
    <div v-click class="group middle"><b class="here">Seat</b><b class="here">SeatingPlan</b><span>your place · the size of the room</span></div>
    <div v-click class="group"><b class="stored">Feature flags</b><b class="stored">Business rules</b><b class="stored">API keys for external services</b><span>today: a database table</span></div>
    <div v-click class="group"><b class="db">Transaction data</b><span>stays in a database</span></div>
    <!-- The line we draw: after the infra today; on the last click it slides right, up to the transaction data. -->
    <div class="line" :class="{ moved: $clicks >= 4 }"><i>← →</i></div>
  </div>
</div>

<p v-click><strong>kube-api doesn't care.</strong> It stores declarative desired state, whoever it belongs to. The line is a habit, not a limit.</p>

<Sources label="read more" :items="[{ name: 'Config Deserves Better', href: 'https://configdeservesbetter.dev', note: 'the pattern, zoomed out: 13 principles for config' }]" />

<!--
≈1:00 · Left: what we all agree is infra and already put in Kubernetes.

[click] Your Seat, and the SeatingPlan it sits on: the size of the room. Infra? App? It sits in the middle and nobody blinks.

[click] One step further: feature flags, business rules, API keys for external services like SendGrid. Today: a database table behind a settings screen.

[click] And the far end: transaction data. Orders, payments. That stays in a database, and it should.

[click] The API server makes no distinction. The line we draw is convention: watch it move. Everything left of it can live in kube-api; transaction data stays where it is.
-->

<style>
.spectrum { margin: 40px 0 48px; }
.spectrum .bar { height: 10px; border-radius: 5px; background: linear-gradient(90deg, var(--accent) 0%, var(--accent) 25%, var(--violet) 50%, var(--amber) 75%, var(--amber) 100%); filter: blur(1px); }
.spectrum .ends { display: flex; justify-content: space-between; margin: 10px 0 28px; font-family: var(--mono); font-size: 15px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
.spectrum .chips { position: relative; display: grid; grid-template-columns: 300px 300px 440px 300px; gap: 44px; }
.spectrum .group { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
.spectrum .group:nth-child(2), .spectrum .group:nth-child(3) { align-items: center; text-align: center; }
.spectrum .group:nth-child(4) { align-items: flex-end; text-align: right; }
.spectrum b { padding: 10px 18px; font-size: 22px; font-weight: 500; background: var(--panel); border: 1px solid var(--accent); border-radius: 10px; }
.spectrum b.here { font-size: 30px; border-color: var(--violet); box-shadow: 0 0 28px color-mix(in srgb, var(--violet) 45%, transparent); }
.spectrum b.stored { border: 1px dashed var(--bad); }
.spectrum b.db { border-color: var(--line-strong); color: var(--soft); }
/* the line between "in kube-api" and "in a database": dotted, movable */
.spectrum .line { position: absolute; top: -12px; bottom: -12px; left: 322px; border-left: 2px dotted var(--muted); transition: left 1.2s cubic-bezier(.5, 0, .2, 1); }
.spectrum .line.moved { left: 1150px; }
.spectrum .line i { position: absolute; top: -26px; left: 0; transform: translateX(-50%); font-style: normal; font-family: var(--mono); font-size: 16px; letter-spacing: .2em; color: var(--muted); white-space: nowrap; }
.spectrum .group span { font-family: var(--mono); font-size: 15px; color: var(--soft); }
.spectrum + p { line-height: 1.4; }
</style>
