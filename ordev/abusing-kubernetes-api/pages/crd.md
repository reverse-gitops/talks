---
layout: default
transition: fade
clicks: 3
---

###### Your own types

# One schema. <span class="green">Many instances.</span>

<div class="crd">
  <div class="shot">
    <img src="/images/types.png" alt="Freelens showing six Seat objects in a table, with Seat listed in the sidebar next to built-in types">
    <i class="mark rows" :class="{ on: $clicks === 1 }" />
    <i class="mark head" :class="{ on: $clicks === 2 }" />
    <i class="mark side" :class="{ on: $clicks === 2 }" />
  </div>
  <div class="defs">
    <div class="def cr" :class="{ on: $clicks >= 1 }">
      <b>Custom Resource</b>
      <em>an instance</em>
      <span>One chair: <code>ordev-2-turing-7-1</code></span>
      <div class="owner"><strong>Consumer</strong> fills it in, using the app</div>
    </div>
    <div class="def crd-def" :class="{ on: $clicks >= 2 }">
      <b>Custom Resource Definition</b>
      <em>the interface, the schema</em>
      <span>What every <code>Seat</code> must look like: a row, a colour, an emoji</span>
      <div class="owner"><strong>Provider</strong> defines it, during application development</div>
    </div>
  </div>
</div>

<p class="punch" :class="{ on: $clicks >= 3 }">Freelens knows nothing about chairs. <span class="green">It reads the CRD.</span></p>

<style>
.slidev-layout h1 { margin-bottom: 24px; }
.crd { display: grid; grid-template-columns: 880px 1fr; gap: 40px; align-items: start; }
.shot { position: relative; width: 880px; border: 1px solid var(--line-strong); border-radius: 12px; overflow: hidden; line-height: 0; }
.shot img { display: block; width: 100%; height: auto; }
.mark { position: absolute; box-sizing: border-box; border: 4px solid var(--good); border-radius: 6px; background: rgba(126, 224, 161, .14); opacity: 0; transition: opacity .3s; }
.mark.on { opacity: 1; }
.mark.rows { left: 32.3%; top: 17.3%; width: 66.4%; height: 22.2%; }
.mark.head { left: 32.3%; top: 13.5%; width: 66.4%; height: 3.8%; border-color: var(--accent); background: rgba(90, 184, 255, .16); }
.mark.side { left: 7.2%; top: 44%; width: 6%; height: 2.7%; border-color: var(--accent); background: rgba(90, 184, 255, .16); }
.defs { display: flex; flex-direction: column; gap: 22px; }
.def { padding: 20px 24px; background: var(--panel); border: 1px solid var(--line); border-radius: 14px; opacity: 0; transition: opacity .3s; }
.def.on { opacity: 1; }
.def.cr { border-color: var(--good); }
.def.crd-def { border-color: var(--accent); }
.def b { display: block; font-size: 30px; line-height: 1.2; font-weight: 700; color: var(--text); }
.def em { display: block; margin: 4px 0 10px; font-style: normal; font-size: 26px; font-weight: 600; }
.def.cr em { color: var(--good); }
.def.crd-def em { color: var(--accent); }
.def span { font-size: 24px; line-height: 1.3; color: var(--soft); }
.owner { margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--line); font-size: 24px; line-height: 1.3; color: var(--text); }
.punch { position: absolute; left: 64px; right: 64px; bottom: 56px; margin: 0; text-align: center; font-size: 44px; line-height: 1.2; font-weight: 700; opacity: 0; transition: opacity .3s; }
.punch.on { opacity: 1; }
</style>

<!--
**6:30 · 1:00**

Freelens: an ordinary GUI I didn't write. My types next to what Kubernetes ships.

[click] A row is a Custom Resource: one chair. Consumer fills it in: you, on your phone.

[click] Custom Resource Definition: interface, schema. Class and instance. Provider defines it, during application development: me.

[click] Freelens knows nothing about chairs. Closed for modification, open for extension.
-->
