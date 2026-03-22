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


--- #7
layout: fact

---
# I <mdi-heart /> GitOps

---
layout: full
---

<RenderWhen context="slide">
  <SlidevVideo class="w-full h-full object-cover" autoplay controls>
    <source src="/images/rc-short.mp4" type="video/mp4" />
  </SlidevVideo>
</RenderWhen>

<RenderWhen context="presenter">
  <h2>Short movie</h2>
  <p>The live presentation shows a video of self-build rc plane taking off and landing</p>
</RenderWhen>

--- #5

# Reverse Gitops

* Augmenting GitOps
* You are among the first to see this
* Will it take off?

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

<div
  style="position: absolute; inset: 18px 24px 24px; display: grid; grid-template-columns: minmax(240px, 300px) minmax(0, 1fr); gap: 24px; align-items: stretch;"
>
  <div style="display: flex; align-items: center; justify-content: center;">
    <VoteQRCode :showCountdown="false" />
  </div>

  <div style="min-width: 0; min-height: 0; display: flex; flex-direction: column;">
    <WebTerminal
      backendUrl="http://host.docker.internal:10001"
      sessionId="reverse-gitops-demo-terminal"
      :fontSize="14"
    />
  </div>
</div>

<div
  v-click="[1, 2]"
  class="clickable-code"
  data-terminal-session="reverse-gitops-demo-terminal"
  data-terminal-command="kubectl get nodes"
  style="display: none;"
></div>


<div
  v-click="[3, 4]"
  class="clickable-code"
  data-terminal-session="reverse-gitops-demo-terminal"
  data-terminal-command='watch -n 2 "kubectl get quizsubmissions -A"'
  style="display: none;"
></div>

<div
  v-click="[7, 8]"
  class="clickable-code"
  data-terminal-session="reverse-gitops-demo-terminal"
  data-terminal-command="cd ~/demo"
  style="display: none;"
></div>

<div
  v-click="[5, 6]"
  class="clickable-code"
  data-terminal-session="reverse-gitops-demo-terminal"
  data-terminal-command='git log --oneline --graph --decorate --all --color=always | head -20'
  style="display: none;"
></div>



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

<<< ./demo-repo/adam/rai/8f/examples.configbutler.ai/v1alpha1/quizsessions/vote/kubecon-2026.yaml yaml {2|3|7|12}{maxHeight:'200px'}


---

# This is what you will commit?

<<< ./demo-repo/adam/rai/8f/examples.configbutler.ai/v1alpha1/quizsubmissions/vote/kubecon-2026-sample.yaml yaml

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
