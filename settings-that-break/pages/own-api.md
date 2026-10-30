---
layout: default
transition: fade
---

###### Where this started · a confession

# My plan: <span class="red">Git as the database</span>, my own API on top

<div class="plan">
  <div class="stack">
    <div class="node">GUI</div>
    <i>↓</i>
    <div class="node mine">my own API<span>to build</span></div>
    <i>↓</i>
    <div class="node">Git<span>the database</span></div>
  </div>
  <div class="todo">
    <h2>The to-do list</h2>
    <ul>
      <li v-click>Who are you? <span>login, tokens, service accounts</span></li>
      <li v-click>May you do this? <span>per type, per object, per action</span></li>
      <li v-click>Is this valid? <span>schemas, rules, defaults</span></li>
      <li v-click>Two edits at once? <span>locking, conflicts</span></li>
      <li v-click>Tell me when it changes <span>push, not polling</span></li>
      <li v-click>Who did what, when? <span>an audit trail</span></li>
      <li v-click>Clients <span>CLI, SDKs, a GUI</span></li>
    </ul>
  </div>
</div>

<!-- Click 8, after the list: not the way. -->
<svg v-click="8" class="cross" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-label="not the way">
  <line class="a" x1="80" y1="60" x2="1520" y2="840" />
  <line class="b" x1="1520" y1="60" x2="80" y2="840" />
</svg>

<!--
≈1:00 · Confession: this started as "let's make Git a database and put a nice API on top".

[click] First thing an API needs: who are you?

[click] Then: are you allowed to do this?

[click] Is what you send valid?

[click] Two people saving at the same time.

[click] Apps want to know when something changes, without polling.

[click] And an audit trail of who changed what.

[click] Plus clients: a CLI, SDKs, a GUI.

[click] So: not this. No Git as a database, no API of my own.

I actually picked a direction that might trigger a reaction from all the GitOps lovers in this room. Let's have our users use the kube-apiserver.
-->

<style>
.plan { display: grid; grid-template-columns: 420px 1fr; gap: 80px; align-items: start; margin-top: 8px; }
.stack { display: flex; flex-direction: column; align-items: stretch; gap: 8px; }
.stack i { font-style: normal; font-size: 32px; text-align: center; color: var(--arrow); }
.stack .node { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 22px 0; font-size: 26px; font-weight: 600; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 14px; }
.stack .node span { font-family: var(--mono); font-size: 15px; font-weight: 400; color: var(--soft); }
.stack .node.mine { border: 1px dashed var(--bad); }
.cross { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 10; pointer-events: none; overflow: visible; }
.cross line { stroke: var(--bad); stroke-width: 56; stroke-linecap: round; filter: drop-shadow(0 0 24px rgba(255, 60, 60, .55)) drop-shadow(0 6px 18px rgba(0, 0, 0, .7)); }
/* Each stroke slashes in from its own corner, then the whole cross lands with a thud. */
.cross:not(.slidev-vclick-hidden) { animation: thud .25s .5s ease-out both; transform-origin: center; }
.cross:not(.slidev-vclick-hidden) .a { animation: slash-a .22s ease-in both; }
.cross:not(.slidev-vclick-hidden) .b { animation: slash-b .22s .28s ease-in both; }
@keyframes slash-a { from { clip-path: inset(-60px 100% 100% -60px); } to { clip-path: inset(-60px); } }
@keyframes slash-b { from { clip-path: inset(-60px -60px 100% 100%); } to { clip-path: inset(-60px); } }
@keyframes thud { 0% { transform: scale(1); } 40% { transform: scale(1.04) rotate(-.6deg); } 100% { transform: scale(1); } }
.todo h2 { margin: 0 0 4px; font-size: 32px; }
.todo li { font-size: 24px; margin: 10px 0; color: var(--text); }
.todo li span { margin-left: .5em; font-family: var(--mono); font-size: 16px; color: var(--muted); }
</style>
