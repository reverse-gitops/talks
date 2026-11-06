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

<!--
What happens when two people edit at the same time? People expect locks, or something clever. I just do last writer wins, per field.

Alice changes the colour, Bob the emoji, at the same moment. Both are small merge patches, so both survive.

[click] Only the same field can collide, and then the last one wins. For editing settings, that's enough.

[click] And that's because of watches. Everyone's screen is live, so you see the other edit straight away. You're rarely working on old data.

[click] And if you want it stricter, it's already there. That's how the coffee editor works: every save carries the resourceVersion. Different fields: it re-reads and saves again. The same price: it stops and shows the conflict. That's optimistic concurrency, for free.

[click] This only works in one place. So: edits go through the API. Not in Git. Git doesn't know about fields, it knows about lines and merge conflicts.
-->

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
