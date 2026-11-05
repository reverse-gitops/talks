---
layout: default
transition: fade
---

###### Some of you recognised this

# Don't dismiss this <span class="green">if you dislike Kubernetes.</span>

<div class="three">
  <div class="card"><strong>Strong modelling</strong><span>Typed objects, validation rules, and references between them.</span></div>
  <div class="card"><strong>Authz / RBAC</strong><span>Already built in: who may change what, per kind and per namespace.</span></div>
  <div class="card"><strong>A well-known format</strong><span>Many tools already read it, so there's a lot available to help you.</span></div>
  <div class="card ai">
    <strong>AI can help</strong>
    <span>It knows this format. My skill reviews your model:</span>
    <a href="https://github.com/ConfigButler/skills" target="_blank">github.com/ConfigButler/skills</a>
  </div>
</div>

<p class="dream">My dream: so common that you can buy these steps as a managed service (or self-host), while your data stays in your own Git repo.</p>

<div class="promo">
  <span class="when">Tomorrow, 11:15, Turing</span>
  <span class="what">(Ab)using the Kubernetes API as a Configuration Backend</span>
  <span class="teaser">Teaser: <strong>bi-directional GitOps</strong></span>
</div>

<Sources slim :items="[{ name: 'ConfigButler skills', href: 'https://github.com/ConfigButler/skills' }, { name: 'Reverse GitOps', href: 'https://reversegitops.dev' }]" />

<!--
16:30. Some of you will recognise this as Kubernetes. It is, and I use it for its API and for writing back to Git. If you dislike Kubernetes, don't dismiss the idea: you can push a representation as an artifact, however you produce it.

Why I picked it: the modelling features are strong. Typed objects, validation rules, references between them.

RBAC and authorization are already there: who may change what, per kind and per namespace. You don't have to build that yourself.

It's a well-known format, so there's a lot available to help you.

And AI can help: it knows this format. I made a skill that reviews your model, it's in ConfigButler/skills.

My dream is that this gets so common that you can also buy these steps as a managed service, or self-host them, while keeping your data in your own Git repo.

Tomorrow, 11:15, Turing, and a teaser: bi-directional GitOps. Git to the API, and the API back to Git.

Back to today. We have the files and the log. Now, how do we deliver them?
-->

<style>
.three { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 48px; }
.card { display: flex; flex-direction: column; gap: 14px; padding: 24px; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 16px; }
.card strong { font-size: 30px; line-height: 1.15; white-space: nowrap; }
.card span { font-size: 24px; line-height: 1.3; color: var(--soft); }
.card a { font-family: var(--mono); font-size: 17px; line-height: 1.3; color: var(--accent); text-decoration: none; border: none; white-space: nowrap; }
.card.ai { border-color: var(--good); }
.dream { margin: 32px 0 0; text-align: center; font-family: 'Caveat', cursive; font-size: 46px; line-height: 1.1; font-weight: 600; color: var(--amber); opacity: 1; }
.promo { display: flex; flex-direction: column; gap: 6px; margin-top: 32px; padding: 26px 32px; background: var(--panel); border: 1px solid var(--accent); border-radius: 16px; }
.promo .when { font-size: 36px; line-height: 1.2; font-weight: 700; color: var(--accent); }
.promo .what { font-size: 28px; line-height: 1.3; color: var(--text); }
.promo .teaser { font-size: 28px; line-height: 1.3; color: var(--soft); }
.promo .teaser strong { font-weight: 700; color: var(--good); }
</style>
