---
layout: default
transition: fade
---

###### We're in the architecture track

# Good design <span class="green">is still SOLID.</span>

<div class="rows">
  <div class="row">
    <span class="letter">S</span>
    <div><b>Single responsibility</b><p>A data-only control plane. It stores and serves your settings, and nothing else.</p></div>
  </div>
  <div v-click class="row">
    <span class="letter">O</span>
    <div><b>Open/closed</b><p>Add your own types with a CRD. The API server itself doesn't change.</p></div>
  </div>
  <div v-click class="row">
    <span class="letter">D</span>
    <div><b>Dependency inversion</b><p>The app defines the interface: the CRD. Others fill it in: the CR. It's injected, and status reports back.</p></div>
  </div>
</div>

<style>
.rows { display: flex; flex-direction: column; gap: 24px; margin-top: 36px; }
.row { display: flex; align-items: center; gap: 44px; padding: 28px 44px; background: var(--panel); border: 1px solid var(--line); border-radius: 16px; }
.letter { flex: none; width: 90px; text-align: center; font-family: var(--mono); font-size: 96px; line-height: 1; font-weight: 600; color: var(--good); }
.row b { font-size: 40px; line-height: 1.2; font-weight: 700; }
.row p { margin: 8px 0 0; font-size: 30px; line-height: 1.3; color: var(--soft); opacity: 1; }
</style>

<!--
**12:00 · 1:00**

Architecture track, so in our own words. Funny that SOLID comes back.

S: one job, your settings.

[click] O: open for extension, closed for modification. Freelens, chairs.

[click] D: skimmed too fast yesterday. Provider defines the interface, consumer sets the values, injected as a package or live. Way back on status.

"I'll spare you the L and the I."
-->
