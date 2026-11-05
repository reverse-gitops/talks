---
layout: default
transition: fade
---

###### Which configuration do I mean?

# Is this <span class="red">infra</span>?

<div class="spectrum">
  <div class="bar" />
  <div class="ends"><span>your platform team changes it</span><span>your end users change it</span></div>
  <div class="columns">
    <div class="group">
      <h3>Infra</h3>
      <b>Servers</b><b>Networks</b><b>Certificates</b>
    </div>
    <div v-click="1" class="group">
      <h3>Environment-specific</h3>
      <b>Hostnames</b><b>Replica counts</b><b>Log levels</b>
      <span>differs per environment</span>
    </div>
    <div v-click="1" class="group">
      <h3>Connection strings</h3>
      <b>To your databases</b>
      <span>how the app reaches its own data</span>
    </div>
    <div v-click="2" class="group self">
      <h3>End-user self-service</h3>
      <div class="chips"><b>Your chair's colour</b><b>Feature flags</b><b>Business rules</b><b>API keys for external services</b></div>
      <span>changed live, by people using your system</span>
    </div>
    <div v-click="3" class="group">
      <h3>Transaction data</h3>
      <b class="db">Orders</b><b class="db">Payments</b>
      <span>what your database is for</span>
    </div>
    <div v-click="1" class="verdict usual">Do that like you are used to.</div>
    <div v-click="2" class="verdict today">This talk.</div>
    <div v-click="3" class="verdict skip">Let's agree not to talk about that today.</div>
  </div>
</div>

<!--
Configuration is a big word, so let me be clear about which part I mean. On the left: infra.

[click] Environment-specific values: hostnames, replica counts. And connection strings to your databases: those are two different things, but neither is what I'm here for. Do that like you are used to.

[click] This talk is about end users doing self-service in your system. Your chair's colour, feature flags, business rules, the API key for an outside service.

[click] And on the far right: transactions. Orders, payments. Let's agree to not talk about that today.

Into the example: let me show you how fast that goes.
-->

<style>
.spectrum { margin-top: 12px; }
.spectrum .bar { height: 10px; border-radius: 5px; background: linear-gradient(90deg, var(--accent) 0%, var(--violet) 50%, var(--good) 72%, var(--amber) 100%); filter: blur(1px); }
.spectrum .ends { display: flex; justify-content: space-between; margin: 12px 0 36px; font-family: var(--mono); font-size: 16px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
.columns { display: grid; grid-template-columns: 200px 260px 220px 420px 260px; column-gap: 28px; row-gap: 44px; }
.group { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; }
.group h3 { margin: 0 0 6px; font-family: var(--mono); font-size: 16px; font-weight: 600; line-height: 1.3; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
.group b { padding: 12px 16px; font-size: 26px; line-height: 1.25; font-weight: 500; background: var(--panel); border: 1px solid var(--accent); border-radius: 10px; }
.group > span { font-family: var(--mono); font-size: 17px; line-height: 1.35; color: var(--soft); }
.group b.db { border-color: var(--line-strong); color: var(--soft); }
.self { padding: 18px; margin: -18px 0 0; background: #101C17; border: 1px solid var(--good); border-radius: 14px; }
.self h3 { color: var(--good); }
.self .chips { display: flex; flex-wrap: wrap; gap: 14px; }
.self b { border-color: var(--good); }
.verdict { font-size: 40px; line-height: 1.25; font-weight: 700; }
.verdict.usual { grid-column: 1 / 4; color: var(--accent); }
.verdict.today { color: var(--good); font-size: 56px; }
.verdict.skip { font-size: 30px; color: var(--amber); }
</style>
