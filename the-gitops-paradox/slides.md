---
# try also 'default' to start simple
theme: default
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://cover.sli.dev
# some information about your slides (markdown enabled)
title: "Reverse GitOps: The API Comes First, Git Remembers"
author: Simon Koudijs

info: |
  ## Reverse GitOps
  The API comes first. Git remembers.
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

# Reverse GitOps

The API Comes First, Git Remembers

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <button @click="$slidev.nav.openInEditor()" title="Open in Editor" class="slidev-icon-btn">
    <carbon:edit />
  </button>
  <a href="https://github.com/configbutler/gitops-reverser" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Hello everyone, I'm Simon Koudijs.

This talk is about a very simple idea.

GitOps gave us something genuinely valuable: reproducibility, auditability, promotion, rollback, and a shared declarative model for change.

But I think one assumption inside GitOps is starting to crack a bit — not the assumption that declarative state is good, not that versioned history is good, not that reconciliation is good.

The assumption that is starting to fail is this: that Git itself should be the primary front door for every change.

I want to show you a different operating model. One where humans and AI agents make validated changes through a typed API, while Git still records the result cleanly in the background.

That is what I call Reverse GitOps.
-->

---

# Not live?

<<< ../shared/demo/adam/rai/8f/examples.configbutler.ai/v1alpha1/quizsubmissions/vote/ccow-1.yaml yaml

---

# Perhaps this then?

# Not live?

<<< ~/shared/demo/adam/rai/8f/examples.configbutler.ai/v1alpha1/quizsubmissions/vote/ccow-1.yaml yaml

--- #3

# Is live

<<< ./pages/test.yaml

---
src: ./pages/terminal.md
---

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
