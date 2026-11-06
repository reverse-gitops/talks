---
layout: default
transition: fade
---

###### You answered this at the door

# What is a <span class="green">CRD?</span>

<div class="answers">
  <PollResult :preview="60" :question="false" />
</div>

<!--
Live: these are your answers from when you logged in. Read them out, and adjust to the room.

Lots of people who write them? "Then correct me during the talk, please."

Lots of "no idea"? "Good, you're who this is for. You don't need to know, and in about ten minutes you will."

The bars are themselves read from the Kubernetes API, and each answer is a group on your login. Don't explain that yet.

If the footer says "preview data", nobody has joined: skip this slide.
-->

<style>
.slidev-layout h1 { margin-bottom: 44px; }
.answers :deep(.poll) { gap: 28px; }
.answers :deep(.bar) { grid-template-columns: 640px 1fr 80px; font-size: 32px; }
.answers :deep(.track) { height: 64px; }
.answers :deep(.foot) { margin-top: 12px; font-size: 18px; }
</style>
