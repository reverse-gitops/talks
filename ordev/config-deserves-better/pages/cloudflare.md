---
layout: default
transition: fade
---

###### It happens to me too

# My own Cloudflare DNS change

<div class="grid">
  <ul>
    <li>I could have written a better runbook</li>
    <li>I could have scripted the right values</li>
    <li v-click class="ask">But when I'm panicking, why isn't there a button for this?</li>
  </ul>
  <div v-click="1" class="undo">
    <span class="kicker">DNS › RECORDS</span>
    <button>↩ Revert the last 10 minutes</button>
  </div>
</div>

<!--
My own example: I changed my DNS in Cloudflare. Tell it as it happened.
Yes, I could have made a better runbook and scripts that put in the right values.

[click] But why isn't there a button to revert the last 10 minutes of actions, for when I'm really panicking?
-->

<style>
.grid { display: grid; grid-template-columns: 1fr 620px; gap: 56px; align-items: center; margin-top: 20px; }
.grid li { font-size: 32px; }
.grid li.ask { color: var(--text); font-weight: 600; margin-top: 32px; }
.undo { display: flex; flex-direction: column; gap: 22px; padding: 40px; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 16px; }
.kicker { font-family: var(--mono); font-size: 16px; letter-spacing: .1em; color: var(--muted); }
.undo button { padding: 26px; border-radius: 12px; background: var(--good); color: var(--bg); font-size: 34px; font-weight: 700; }
</style>
