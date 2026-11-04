---
layout: default
transition: fade
---

# Where this applies

<div class="applies">
  <div class="card no">
    <h2>This does NOT apply to:</h2>
    <ul>
      <li>Transactional data like new orders</li>
    </ul>
  </div>
  <div class="card yes">
    <h2>This does apply to:</h2>
    <ul>
      <li>Your legacy business app with a very old screen: it probably can read a file, can't it?</li>
      <li>Any software that needs settings and that would rather just define the things it needs</li>
    </ul>
  </div>
</div>

<p class="di">Think of it as <span class="green">DI for config on steroids.</span></p>

<!--
We are going to package configuration, and put it in an artifact registry just like most of you do with code. What does that take, and is it worth it?

This is not for transactional data like new orders.

It is for your legacy business app with a very old screen: it probably can read a file, can't it? And for any software that needs settings and would rather just define the things it needs.

Think of it as DI for config on steroids.
-->

<style>
.applies { display: grid; grid-template-columns: 1fr 1.5fr; gap: 40px; margin-top: 56px; }
.card { padding: 36px; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 16px; }
.card.no { border-color: var(--bad); }
.card.yes { border-color: var(--good); }
.card h2 { margin: 0 0 24px; font-size: 36px; }
.card.no h2 { color: var(--bad); }
.card.yes h2 { color: var(--good); }
.card ul { margin: 0; padding-left: 28px; }
.card li { margin: 0 0 24px; font-size: 36px; line-height: 1.3; color: var(--text); }
.card li:last-child { margin-bottom: 0; }
.di { margin: 72px 0 0; font-size: 56px; font-weight: 700; line-height: 1.2; color: var(--text); }
.di .green { color: var(--good); }
</style>
