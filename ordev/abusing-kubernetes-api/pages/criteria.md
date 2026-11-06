---
layout: default
transition: fade
---

###### Practical criteria

# Should you <span class="green">do this?</span>

<div class="sides">
  <div class="side">
    <div class="head green">Good fit</div>
    <ul>
      <li>Small objects</li>
      <li>Changes now and then</li>
      <li>You need to know who changed it</li>
      <li>Permissions per type and per team</li>
    </ul>
  </div>
  <div v-click class="side">
    <div class="head red">Bad fit</div>
    <ul>
      <li>Transaction data: orders, payments</li>
      <li>Rich queries and joins</li>
      <li>Changes across objects, all or nothing</li>
      <li>Big objects, or changes every second</li>
    </ul>
  </div>
</div>

<style>
.sides { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 44px; }
.side { padding: 36px 40px; background: var(--panel); border: 1px solid var(--line); border-radius: 16px; }
.head { margin-bottom: 20px; font-size: 42px; line-height: 1.2; font-weight: 700; }
.side ul { margin: 0; padding-left: 1.1em; }
.slidev-layout .side li { margin: 16px 0; font-size: 32px; line-height: 1.25; color: var(--text); }
</style>

<!--
**31:30 · 1:00**

I promised criteria. Small, now and then, who changed it, permissions per type and team.

[click] Orders and payments stay in a database. No joins. "No atomic transactions across multiple resources." etcd: about 1.5 MB per request.

At scale: a small kube-apiserver per team is my plan, not proven.
-->
