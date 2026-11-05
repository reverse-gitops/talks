---
layout: default
transition: fade
---

###### Back to text files

# Oh dear, <span class="red">what is he proposing?</span>

<div class="objections">
  <blockquote>But what about my nice relational database?</blockquote>
  <blockquote>And how do you handle merge conflicts?</blockquote>
  <blockquote>How do we let people change that?</blockquote>
</div>

<p v-click class="split">We split <span class="ok">edits from using.</span></p>

<p class="answer">I do advise you to have <span class="ok">a temporary database in front of it, and a very nice API.</span></p>

<!--
Back to text files: oh dear, what is he proposing?

But what about my nice relational database?

And how do you handle stuff around merge conflicts?

And how do we let people change that?

[click] We split edits from using.

I do advise you to have a temporary database in front of it, and a very nice API.
-->

<style>
h1 .red { color: var(--bad); }
.objections { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-top: 48px; }
.slidev-layout .objections blockquote { margin: 0; padding: 32px; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 16px; font-size: 36px; line-height: 1.25; font-weight: 600; font-style: normal; color: var(--text); }
.split { margin: 56px 0 0; font-size: 72px; line-height: 1.15; font-weight: 700; color: var(--text); opacity: 1; }
.split .ok { color: var(--good); }
.answer { margin: 48px 0 0; font-size: 38px; line-height: 1.3; color: var(--soft); opacity: 1; }
.answer .ok { color: var(--good); }
</style>
