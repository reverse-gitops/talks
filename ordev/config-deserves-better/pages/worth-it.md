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
  </div>
  <div v-click>
    <h2><span class="green">Worth it when</span></h2>
    <ul>
      <li>One bad change can take production down</li>
      <li>You can't say who changed what, or when</li>
      <li>You can't say how to go back</li>
      <li>Settings per tenant, at scale</li>
    </ul>
  </div>
</div>

<!--
36:00. Back to the question I asked: what does it take, and is it worth it? The honest answer is: not for everything.

This isn't a dig at databases: for your orders they're exactly right. Settings that change every minute or per tenant probably don't belong here either: every change is a rollout.

[click] But when a bad change can take production down, and you can't say who, what, when and how to go back, it's worth it.
-->

<style>
.cols { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; margin-top: 24px; }
.cols h2 { margin: 0 0 12px; font-weight: 700; }
.cols h2 .red { color: var(--bad); }
.cols h2 .green { color: var(--good); }
.cols li { font-size: 30px; line-height: 1.3; margin: 22px 0; }
</style>
