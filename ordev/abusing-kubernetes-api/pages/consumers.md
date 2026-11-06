---
layout: default
transition: fade
---

###### Let's define it

# Who is the <span class="green">API consumer</span>?

<div class="forms">
  <div class="form">
    <div class="name">Self-service platform</div>
    <div class="who"><span>consumer</span><b>app teams</b></div>
    <div class="who"><span>provider</span><b>platform engineers</b></div>
    <div class="wants">“I need a database for my app.”</div>
  </div>
  <div v-click class="form">
    <div class="name">SaaS product</div>
    <div class="who"><span>consumer</span><b>customers</b></div>
    <div class="who"><span>provider</span><b>SendGrid</b></div>
    <div class="wants">“Configure the e-mail footer.”</div>
  </div>
</div>

<p v-click class="punch">Both want to change something <span class="green">they don't run.</span></p>

<!--
Before anything else: who is this API for? It comes in different forms.

One: self-service on an internal platform. Platform engineers provide it, and app teams use it.

[click] Two: a SaaS product, like SendGrid. SendGrid provides it, and you're the customer who wants to configure the e-mail footer.

[click] Different companies, same position: you want to change something that you don't run. And you were one a minute ago: you coloured a chair in a system you don't run.
-->

<style>
.forms { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 48px; }
.form { padding: 36px 40px; background: var(--panel); border: 1px solid var(--line); border-radius: 16px; }
.name { margin-bottom: 28px; font-size: 42px; line-height: 1.2; font-weight: 700; }
.who { display: flex; align-items: baseline; gap: 20px; margin: 10px 0; }
.who span { width: 130px; font-family: var(--mono); font-size: 20px; color: var(--muted); }
.who b { font-size: 32px; font-weight: 500; color: var(--text); }
.wants { margin-top: 28px; font-size: 30px; line-height: 1.3; color: var(--accent); }
.punch { position: absolute; left: 64px; right: 64px; bottom: 76px; margin: 0; text-align: center; font-size: 46px; line-height: 1.2; font-weight: 700; opacity: 1; }
</style>
