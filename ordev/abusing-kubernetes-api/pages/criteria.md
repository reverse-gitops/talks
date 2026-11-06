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

<p v-click class="punch">Is it <span class="green">configuration</span>, or is it <span class="red">data</span>?</p>

<!--
I promised you criteria, so here they are.

Good fit: small objects that change now and then. You care who changed them. And permissions per type and per team are good enough.

[click] Bad fit: orders and payments stay in a database. No rich queries or joins. The design document says it plainly: no "atomic transactions across multiple resources". And no big objects: etcd's default limit is about 1.5 MB per request, and it isn't built for constant writes.

[click] So that's the question: is it configuration, or is it data?

At scale: my plan is a small kube-apiserver per team. That's the direction, and I haven't proven it yet. Don't want to run any of this? I hope managed options appear. That's part of why I'm here.
-->

<style>
.sides { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 44px; }
.side { padding: 36px 40px; background: var(--panel); border: 1px solid var(--line); border-radius: 16px; }
.head { margin-bottom: 20px; font-size: 42px; line-height: 1.2; font-weight: 700; }
.side ul { margin: 0; padding-left: 1.1em; }
.slidev-layout .side li { margin: 16px 0; font-size: 32px; line-height: 1.25; color: var(--text); }
.punch { position: absolute; left: 64px; right: 64px; bottom: 60px; margin: 0; text-align: center; font-size: 50px; line-height: 1.2; font-weight: 700; opacity: 1; }
</style>
