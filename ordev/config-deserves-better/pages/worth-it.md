---
layout: default
transition: fade
---

###### Is it worth it?

# Not for everything.

<div class="cols">
  <div>
    <h2><span class="red">Leave it</span></h2>
    <ul>
      <li>Orders and other transactions: that's what your database is for</li>
      <li>Settings that change every minute</li>
    </ul>
    <div v-click="2" class="pain">
      <h2><span class="amber">Still a pain</span></h2>
      <ul>
        <li>You need to update both your frontend and backend</li>
        <li>Upgrading your model: very good support, but still a pain</li>
      </ul>
    </div>
  </div>
  <div v-click="1">
    <h2><span class="green">Worth it when</span></h2>
    <ul>
      <li>One bad change can take production down</li>
      <li>You can't say who changed what, or when</li>
      <li>You can't say how to go back</li>
      <li>You're required to have much more auditing</li>
      <li>Settings per tenant, at scale</li>
    </ul>
  </div>
</div>

<!--
36:00. Back to the question I asked: what does it take, and is it worth it? The honest answer is: not for everything.

This isn't a dig at databases: for your orders they're exactly right. Settings that change every minute or per tenant probably don't belong here either: every change is a rollout.

[click] But when a bad change can take production down, and you can't say who, what, when and how to go back, it's worth it. The same goes when you're required to have much more auditing in your systems.

[click] It still costs you something. You need to update both your frontend and your backend, which is annoying. And upgrading your configuration model: the support is very good, but it's still a pain.
-->

<style>
.cols { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; margin-top: 24px; }
.cols h2 { margin: 0 0 12px; font-weight: 700; }
.cols h2 .red { color: var(--bad); }
.cols h2 .green { color: var(--good); }
.cols h2 .amber { color: var(--amber); }
.pain { margin-top: 36px; }
.cols li { font-size: 30px; line-height: 1.3; margin: 22px 0; }
</style>
