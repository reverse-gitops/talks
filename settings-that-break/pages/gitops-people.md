---
layout: center
transition: fade
---

<div class="coffee-bg" />

###### Hard part 4 · Explaining it to GitOps people

# You know GitOps.

<div class="four">
  <PollResult :preview="60" :question="false" />
</div>

<blockquote v-click class="quote">End users don't need to be in Git.<br><span class="green">But their actions should be.</span></blockquote>

<!--
≈1:00 · The bridge to the rest of the talk. GitOps is the final ingredient. Their own answers from the door question, "How familiar are you with GitOps?": "you know this". No explaining what GitOps is.

[click] Nobody expects end users to open a pull request. What they do should still end up in Git.

Let's see if it did: pull the repo.
-->

<style>
.coffee-bg {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(ellipse at center, rgba(0,0,0,.78) 0%, rgba(0,0,0,.88) 80%),
    url('/images/coffee-raw.jpg') center 55% / cover no-repeat;
}
h6, h1, .four, .quote { position: relative; z-index: 1; }
h6, h1 { text-align: center; }
.four { width: 860px; margin: 48px auto 0; zoom: .85; }
.slidev-layout blockquote.quote {
  width: fit-content; margin: 80px auto 0; padding: 8px 0 8px 36px;
  border: none; border-left: 6px solid var(--good); background: none;
  font-size: 36px; line-height: 1.3; font-weight: 600; font-style: normal; color: var(--text);
}
.quote::before { content: '“'; position: absolute; left: -84px; top: -20px; font-size: 116px; line-height: 1; color: var(--good); opacity: .5; }
</style>
