---
layout: default
transition: fade
---

###### Two edits at once

# Last writer wins, <span class="green">per field.</span>

<div class="edits">
  <div class="edit">
    <div class="who">Alice saves</div>
    <div class="l">spec:</div>
    <div class="l in blue">color: '#a8e05f'</div>
  </div>
  <i>+</i>
  <div class="edit">
    <div class="who">Bob saves</div>
    <div class="l">spec:</div>
    <div class="l in amber">emoji: 🐧</div>
  </div>
  <i>=</i>
  <div class="edit result">
    <div class="who">The object</div>
    <div class="l">spec:</div>
    <div class="l in blue">color: '#a8e05f'</div>
    <div class="l in amber">emoji: 🐧</div>
  </div>
</div>

<ul class="points">
  <li v-click><strong>For editing, that's enough.</strong> You only send the fields you changed</li>
  <li v-click><strong>A watch keeps everyone current.</strong> Your screen shows the other edit right away</li>
  <li v-click><strong>Need it stricter?</strong> Send the <code>resourceVersion</code> and get a <code>409</code>, like my coffee editor</li>
</ul>

<p v-click class="punch">My advice: <span class="green">make your edits through the API.</span></p>

<style>
.slidev-layout h1 { margin-bottom: 28px; }
.edits { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; align-items: center; gap: 24px; }
.edits i { font-style: normal; font-size: 56px; color: var(--arrow); }
.edit { height: 190px; box-sizing: border-box; padding: 18px 28px; font-family: var(--mono); font-size: 26px; line-height: 1.4; color: var(--soft); background: var(--panel); border: 1px solid var(--line); border-radius: 14px; }
.edit.result { border-color: var(--good); }
.who { margin-bottom: 8px; font-family: var(--sans); font-size: 28px; font-weight: 700; color: var(--text); }
.l.in { padding-left: 1.2em; }
.slidev-layout ul.points { list-style: none; margin: 36px 0 0; padding: 0; }
.slidev-layout .points li { margin: 0 0 18px; padding: 0; font-size: 30px; line-height: 1.25; }
.punch { position: absolute; left: 64px; right: 64px; bottom: 56px; margin: 0; text-align: center; font-size: 46px; line-height: 1.2; font-weight: 700; opacity: 1; }
</style>

<!--
**9:00 · 1:00**

Asked yesterday: how can several people change one screen without hurting each other? Last writer wins, per field.

Alice colour, Bob emoji: small merge patches, both survive.

[click] Only the same field collides. For settings, that's enough.

[click] Watches: everyone's screen is live, so you rarely work on old data.

[click] Stricter? resourceVersion, 409, my coffee editor. Optimistic concurrency, for free.

[click] Edits through the API. Git knows lines and merge conflicts, not fields.
-->
