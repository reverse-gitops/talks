---
layout: default
transition: fade
---

###### You answered this at the door

# What is a <span class="green">CRD?</span>

<div class="answers">
  <PollResult :preview="60" :question="false" />
</div>

<style>
.slidev-layout h1 { margin-bottom: 44px; }
.answers :deep(.poll) { gap: 28px; }
.answers :deep(.bar) { grid-template-columns: 640px 1fr 80px; font-size: 32px; }
.answers :deep(.track) { height: 64px; }
.answers :deep(.foot) { margin-top: 12px; font-size: 18px; }
</style>

<!--
**1:45 · 0:30**

Your answers from the door. Read them out.

Many who write them: "Correct me during the talk, please."
Many "no idea": "You're who this is for. In ten minutes you'll know."

Footer says "preview data"? Skip this slide.
-->
