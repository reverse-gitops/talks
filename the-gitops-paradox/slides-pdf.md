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

# Key takeaways

- Reverse GitOps: API first, Git remembers
- Git and GitOps keep working as they do today
- Simple changes can happen via API, GUI, or `kubectl`

Questions or feedback: [koudijs.dev](https://koudijs.dev) or [LinkedIn](https://www.linkedin.com/in/simonkoudijs/)

More: [reversegitops.dev](https://reversegitops.dev) or the OSS prototype [ConfigButler/gitops-reverser](https://github.com/ConfigButler/gitops-reverser)
