---
layout: default
transition: fade
---

###### Back to text files

# Oh dear, <span class="red">what is he proposing?</span>

<div class="objections">
  <blockquote>But what about my nice relational database?</blockquote>
  <blockquote>And how do you handle merge conflicts?</blockquote>
</div>

<p class="answer"><strong>Come see that tomorrow.</strong> I do advise you to have <span class="ok">a temporary database in front of it, and a very nice API.</span></p>

<!--
Back to text files: oh dear, what is he proposing?

But what about my nice relational database?

And how do you handle stuff around merge conflicts? Come see that tomorrow. I do advise you to have a temporary database in front of it, and a very nice API.
-->

<style>
h1 .red { color: var(--bad); }
.objections { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 56px; }
.slidev-layout .objections blockquote { margin: 0; padding: 40px; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 16px; font-size: 42px; line-height: 1.25; font-weight: 600; font-style: normal; color: var(--text); }
.answer { margin: 72px 0 0; font-size: 44px; line-height: 1.3; color: var(--soft); opacity: 1; }
.answer strong { color: var(--text); font-weight: 700; }
.answer .ok { color: var(--good); }
</style>
