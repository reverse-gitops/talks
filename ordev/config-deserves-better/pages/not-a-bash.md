---
layout: default
transition: fade
---

###### To be clear

# This talk is <span class="hl">not a bash</span> on:

<div class="not">
  <div>config-as-code</div>
  <div>databases</div>
  <div>legacy applications</div>
</div>

<p class="but"><strong>But</strong> I do dislike it if I just can't <span class="hl">hunt back what has been changing my system.</span></p>

<!--
This talk is not a bash on config-as-code, databases or legacy applications.

But I do dislike it if I just can't hunt back what has been changing my system.
-->

<style>
h1 .hl { color: var(--bad); }
.not { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-top: 56px; }
.not div { padding: 44px 24px; text-align: center; font-size: 42px; font-weight: 600; line-height: 1.2; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 16px; }
.but { margin: 80px 0 0; font-size: 52px; line-height: 1.25; color: var(--soft); opacity: 1; }
.but strong { color: var(--text); font-weight: 700; }
.but .hl { color: var(--amber); font-weight: 600; }
</style>
