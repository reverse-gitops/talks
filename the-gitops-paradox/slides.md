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
Hello everyone, I'm Simon Koudijs.

This talk is about a very simple idea.

GitOps gave us something genuinely valuable: reproducibility, auditability, promotion, rollback, and a shared declarative model for change.

But I think one assumption inside GitOps is starting to crack a bit — not the assumption that declarative state is good, not that versioned history is good, not that reconciliation is good.

The assumption that is starting to fail is this: that Git itself should be the primary front door for every change.

I want to show you a different operating model. One where humans and AI agents make validated changes through a typed API, while Git still records the result cleanly in the background.

That is what I call Reverse GitOps.
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
* 39 years old

## Experience

* Sofware engineer
* Platform team
* Last job: smaller company (~30), creating a full self-service product
* I missed this: the beatiful transparant file based approach also must be possible without even knowing it?

## Founder

* Quit my fulltime job to work on this fulltime
* Implementing this idear in the open
* ConfigButler

---
src: ./pages-new/0-intro.md

---

---
src: ./pages-new/1-vote.md

---

---
src: ./pages-new/2-api-first.md


---

---
src: ./pages-new/3-abstractions.md

---

---
src: ./pages-new/4-gitops.md

---

---

# Thanks for watching

Contact info
This will be live for a while

---


--- #6

# GitOps Gives You

| Capability | GitOps |
| --- | --- |
| Reproducable | <mdi-check /> |
| Process | :white_check_mark: |
| Full history | :white_check_mark: |
| Rollbacks | :white_check_mark: |
| Easy to change | |

---

layout: default
class: h-full




---

<<< snippets/test.yaml {2|3|7|12}{maxHeight:'200px'}

---

```ts {monaco}
console.log('HelloWorld')
```

---
layout: two-cols
---
# Let's do a cloud native

::right::

<<< ./demo-repo/adam/rai/8f/examples.configbutler.ai/v1alpha1/quizsessions/vote/demo.yaml yaml {2|3|7|12}{maxHeight:'200px'}


---

# This is what you will commit?

<<< ./demo-repo/adam/rai/8f/examples.configbutler.ai/v1alpha1/quizsubmissions/vote/example.yaml yaml

---
src: ./pages/8-questions.md
---

# this is ignored
