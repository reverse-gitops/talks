---
layout: default
transition: fade
---

###### AI changes config · recorded

# Same API, <span class="green">same limits.</span>

<div class="steps">
  <div class="step"><span class="kind">1 · the prompt</span><div class="shot">TODO: screenshot</div></div>
  <div v-click class="step"><span class="kind">2 · the result</span><div class="shot">TODO: screenshot</div></div>
  <div v-click class="step"><span class="kind">3 · the PR, opened by hand</span><div class="shot">TODO: screenshot</div></div>
</div>

<p v-click><strong>RBAC</strong> limits what it may touch · the <strong>schema</strong> checks it · the <strong>commit</strong> carries its name</p>

<!--
16:00 → 18:00 · Pre-recorded, no live AI.
[click] Fast feedback: the result.
[click] The PR. Opened by hand: say so.
[click] The agent goes through the same API as people: RBAC, schema, its own name on the commit.
-->

<style>
.steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin: 24px 0 32px; }
.step .kind { font-family: var(--mono); font-size: 15px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }
.shot {
  height: 360px; margin-top: 12px; display: flex; align-items: center; justify-content: center;
  border: 2px dashed var(--line-strong); border-radius: 14px;
  font-family: var(--mono); font-size: 16px; color: var(--amber);
}
</style>
