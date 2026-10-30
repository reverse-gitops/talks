---
layout: default
transition: fade
---

###### Config deserves better

# Code has a delivery process. <span class="red">Settings don't.</span>

<div class="lanes">
  <div class="lane">
    <span class="kind">code</span>
    <b>Developer</b><i>→</i><b>Pull request · review</b><i>→</i><b>CI · tests</b><i>→</i><b>Test</b><i>→</i><b>Production</b>
  </div>
  <div v-click class="lane bare">
    <span class="kind">settings</span>
    <b>Admin user</b><i>→</i><b>Settings screen</b><i>→</i><b>Database table</b><i>→</i><b>Production</b>
  </div>
</div>

<p v-click>Feature flags, business rules, API keys and domain settings change production <strong>just as much as code</strong>.</p>

<!--
1:30
Code: review, history, tests, a test environment.

[click] Settings: straight from a screen into a table into production. No review, no history, no rollback, no test.

[click] And these change production just as much as code does. Alice just showed us.
-->

<style>
.lanes { display: flex; flex-direction: column; gap: 32px; margin: 48px 0; }
.lane { display: flex; align-items: center; gap: 16px; font-size: 24px; }
.lane .kind { width: 140px; font-family: var(--mono); font-size: 15px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }
.lane b { padding: 14px 20px; background: var(--panel); border: 1px solid var(--good); border-radius: 12px; font-weight: 500; }
.lane.bare b { border-color: var(--bad); }
.lane i { font-style: normal; color: var(--arrow); }
</style>
