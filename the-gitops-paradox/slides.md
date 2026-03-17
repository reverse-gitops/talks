---
# try also 'default' to start simple
theme: default
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://cover.sli.dev
# some information about your slides (markdown enabled)
title: Welcome to Slidev
info: |
  ## Slidev Starter Template
  Presentation slides for developers.

  Learn more at [Sli.dev](https://sli.dev)
# https://sli.dev/features/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left
# enable Comark Syntax: https://comark.dev/syntax/markdown
comark: true
# duration of the presentation (5 minutes for questions)
duration: 20m
addons:
  - web-terminal
  - qrcode
  - excalidraw-renderer
---

# The GitOps Paradox

Why Your Devs Need an API You Don't Want to Build

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <button @click="$slidev.nav.openInEditor()" title="Open in Editor" class="slidev-icon-btn">
    <carbon:edit />
  </button>
  <a href="https://github.com/slidevjs/slidev" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
The last comment block of each slide will be treated as slide notes. It will be visible and editable in Presenter Mode along with the slide. [Read more in the docs](https://sli.dev/guide/syntax.html#notes)
-->

---
src: ./pages/0-intro.md
---

# this is ignored

---
src: ./pages/1-voting.md
---

# this is ignored

---
src: ./pages/2-problems.md
---

# this is ignored

---
src: ./pages/3-api-first.md
---

# this is ignored

---
src: ./pages/4-abstractions.md
---

# this is ignored

---
src: ./pages/5-gitops-compatbile.md
---

# this is ignored

---
src: ./pages/6-to-reverse-or-not.md
---

# this is ignored

---
src: ./pages/7-feedback.md
---

# this is ignored

---
src: ./pages/8-questions.md
---

# this is ignored
