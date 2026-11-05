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

<div v-click>
  <p class="split">We split <span class="ok">edits from using.</span></p>
  <p class="answer">Have <span class="ok">a very nice API for editing the files.</span></p>
  <p class="hint">Hint: don't try to build that API directly on top of Git. I failed trying.</p>
</div>

<!--
Back to text files: oh dear, what is he proposing?

But what about my nice relational database?

And how do you handle stuff around merge conflicts?

And how do we let people change that?

[click] We split edits from using.

Have a very nice API for editing the files. That's simple enough.

And a hint: don't try to build that API directly on top of Git. I failed trying.
-->

<style>
h1 .red { color: var(--bad); }
.objections { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-top: 48px; }
.slidev-layout .objections blockquote { margin: 0; padding: 32px; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 16px; font-size: 36px; line-height: 1.25; font-weight: 600; font-style: normal; color: var(--text); }
.split { margin: 56px 0 0; font-size: 72px; line-height: 1.15; font-weight: 700; color: var(--text); opacity: 1; }
.split .ok { color: var(--good); }
.answer { margin: 48px 0 0; font-size: 38px; line-height: 1.3; color: var(--soft); opacity: 1; }
.answer .ok { color: var(--good); }
.hint { margin: 28px 0 0; font-family: 'Caveat', cursive; font-size: 50px; line-height: 1.1; font-weight: 600; color: var(--amber); opacity: 1; }
</style>
