---
---

<div class="at tldr-label">TLDR;</div>

# An API and files. <span class="green">At the same time.</span>

<Tldr>Today I'll show the trick.</Tldr>

<!-- The one click: not this talk. -->
<svg v-click class="cross" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-label="not this talk">
  <line class="a" x1="80" y1="60" x2="1520" y2="840" />
  <line class="b" x1="1520" y1="60" x2="80" y2="840" />
</svg>

<style>
.tldr-label { left: 64px; top: 26px; font-family: var(--mono); font-size: 34px; font-weight: 600; line-height: 1.5; color: var(--accent); }
.cross { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 10; pointer-events: none; overflow: visible; }
.cross line { stroke: var(--bad); stroke-width: 56; stroke-linecap: round; filter: drop-shadow(0 0 24px rgba(255, 60, 60, .55)) drop-shadow(0 6px 18px rgba(0, 0, 0, .7)); }
/* Each stroke slashes in from its own corner, then the whole cross lands with a thud. */
.cross:not(.slidev-vclick-hidden) { animation: thud .25s .5s ease-out both; transform-origin: center; }
.cross:not(.slidev-vclick-hidden) .a { animation: slash-a .22s ease-in both; }
.cross:not(.slidev-vclick-hidden) .b { animation: slash-b .22s .28s ease-in both; }
@keyframes slash-a { from { clip-path: inset(-60px 100% 100% -60px); } to { clip-path: inset(-60px); } }
@keyframes slash-b { from { clip-path: inset(-60px -60px 100% 100%); } to { clip-path: inset(-60px); } }
@keyframes thud { 0% { transform: scale(1); } 40% { transform: scale(1.04) rotate(-.6deg); } 100% { transform: scale(1); } }
</style>

<!--
**0:15 · 0:30**

The TLDR I made for today. Don't explain the boxes.

Thanks for the feedback yesterday. Sincere confusion about all that YAML.

[click] Not this talk. Open to your thoughts, and I want to live up to the abstract.
-->
