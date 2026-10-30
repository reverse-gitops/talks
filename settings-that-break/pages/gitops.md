---
layout: default
transition: fade
---

###### Hard part 4 · Explaining it to GitOps people

<div class="gitops">
  <div>
    <h1>You know this.</h1>
    <PollResult :preview="60" />
  </div>
  <div v-click class="principles">
    <h2>The four principles</h2>
    <ol>
      <li><strong>Declarative</strong>: desired state, not steps</li>
      <li><strong>Versioned and immutable</strong>: every change kept, with its author</li>
      <li><strong>Pulled automatically</strong> by an agent</li>
      <li><strong>Continuously reconciled</strong></li>
    </ol>
    <p>Hold on to these. They are the yardstick in a few minutes.</p>
  </div>
</div>

<p v-click class="punch">End users don't need to be in Git. <span class="green">But their actions should be.</span></p>

<!--
3:30 · No explaining what GitOps is. Show their own answers from the door question: "you know this".

[click] Recap the four principles in one breath. They are the yardstick for the reveal.

[click] Nobody expects end users to open a pull request. That's not the point: what they do should still end up in Git. Not against IaC: this makes it easier, not impossible.
-->

<style>
.gitops { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; margin-top: 8px; }
.principles h2 { margin: 12px 0 8px; }
.principles p { font-size: 22px; color: var(--muted); }
.punch { margin-top: 40px; font-size: 36px; font-weight: 600; }
</style>
