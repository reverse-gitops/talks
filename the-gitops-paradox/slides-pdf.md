---
theme: default
background: /images/door-old.jpg
title: The GitOps Paradox
author: Simon Koudijs
info: |
  ## Reverse GitOps
  The API comes first. Git remembers.
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left
# enable Comark Syntax: https://comark.dev/syntax/markdown
comark: true
# duration of the presentation (5 minutes for questions)
duration: 20m
monaco: false # It can only write, and does not work yet together with the terminal itself
addons:
  - web-terminal
  - qrcode
  - excalidraw-renderer
---

# The GitOps Paradox
## Why Your Devs Need an API You Don't Want to Build

<!--
GitOps gave us something genuinely valuable.<br/>
I do not want to replace GitOps.<br/>
I want to challenge one assumption inside it:<br/>
that Git itself must be the front door for every change.
-->

---
layout: image-left
image: /images/simon.jpg
class: two-third

---

<style>
div.grid.grid-cols-2.w-full.h-full.auto-rows-fr:has(> .two-third) {
  grid-template-columns: 2fr 3fr;
}
</style>

## Who am I?

* Simon Koudijs
* ConfigButler

## Experience

* Sofware engineer / DevOps engineer

## Founder

* Quit my fulltime job to work on this fulltime
* Implementing this idear in the open
* ConfigButler

<!--
I have worked as a software engineer and on platform teams.<br/>
A lot of that work was about self-service.<br/>
And I kept feeling this tension:<br/>
why do we keep rebuilding APIs around workflows that Kubernetes already models so well?
-->

---
src: ./pages/0-intro.md

---

---
src: ./pages/1-vote-frozen.md

---

---
src: ./pages/2-paradox.md


---

---
src: ./pages/3-1-api-first.md

---

---
src: ./pages/3-2-capture-intent.md

---

---
src: ./pages/3-3-gitops-frozen.md

---

---

<div class="w-full h-full grid grid-cols-[minmax(0,1fr)_380px] gap-8 items-center">
  <div>
    <h1 class="!mb-4">That's it</h1>
    <div class="text-2xl leading-relaxed opacity-90">
      I would love your feedback.
    </div>
    <div class="mt-6 text-lg opacity-75">
      This QR stays live for a while after the talk.
    </div>
    <div class="mt-10 text-base opacity-70">
      https://calendar.app.google/FgYaoZog1dFpRG9Z7
    </div>
  </div>

  <div class="flex justify-center">
    <VoteQRCode
      session="feedback"
      :showCountdown="false"
      linkClass="text-xs font-mono text-gray-400 break-all text-center max-w-sm leading-tight tracking-tight"
    />
  </div>
</div>
