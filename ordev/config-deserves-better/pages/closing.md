---
layout: default
transition: fade
---

###### Back to Alice

<div class="closing">
  <div>
    <h1>Her typo is now <span class="green">a commit.</span></h1>
    <ul>
      <li><strong>Who did it?</strong> The commit author</li>
      <li><strong>Roll it back?</strong> <code>git revert</code></li>
      <li><strong>Where was it checked?</strong> The schema, and the test environment first</li>
      <li><strong>Prod DB access to see it?</strong> No: it's in Git</li>
      <li><strong>What is production running?</strong> This digest</li>
    </ul>
  </div>
</div>

<!--
32:30, 30 seconds.
Back to Alice: the questions from the problem slide, answered.
Next: that sounds great, so now the honest part.
-->

<style>
.closing { display: flex; justify-content: space-between; gap: 64px; }
.closing .green { color: var(--good); }
.closing li { font-size: 34px; margin: 22px 0; }
</style>
