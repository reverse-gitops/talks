---
layout: default
transition: fade
---

###### The provider

# What do API providers <span class="green">expect these days?</span>

<div class="grid">
  <div class="item"><b>Tooling support</b><span>CLIs and GUIs that just work</span></div>
  <div class="item"><b>Help with AI</b><span>A format that agents already know</span></div>
  <div class="item"><b>Conflict resolution</b><span>Two edits at once, without losing one</span></div>
  <div class="item"><b>Live watches</b><span>Push the change, no polling</span></div>
  <div class="item"><b>Great RBAC</b><span>Who may change what</span></div>
  <div class="item"><b>Audit log</b><span>Who did what, and when</span></div>
</div>

<p v-click class="punch">And I don't want to <span class="green">build all of that myself.</span></p>

<style>
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; margin-top: 44px; }
.item { display: flex; flex-direction: column; gap: 10px; padding: 32px 30px; background: var(--panel); border: 1px solid var(--line); border-radius: 16px; }
.item b { font-size: 38px; line-height: 1.2; font-weight: 700; color: var(--text); }
.item span { font-size: 27px; line-height: 1.3; color: var(--soft); }
.punch { position: absolute; left: 64px; right: 64px; bottom: 64px; margin: 0; text-align: center; font-size: 46px; line-height: 1.2; font-weight: 700; opacity: 1; }
</style>

<!--
**2:45 · 0:45**

You, the provider. Tooling, AI, conflicts, watches, real RBAC, audit.

"The list every configuration backend ends up rebuilding."

[click] A lot of work that isn't your product. Can you get it from somewhere?
-->
