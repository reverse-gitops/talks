---

# My name is Simon

* Software engineers for years, last 5 years platform engineering / infra
* Very happy to be welcome for a talk: and even more happy to hear your thoughts (both good and bad)
* I quit my fulltime job to pursue this idea

---

# 3 Layers 

* The pattern has it's own org and domain: I don't want to limit this to only what I could do as an entrepeuneur (that would be a shame)
* ConfigButler is my company: it's backing the idea, but please join and come up with other perspectives. The companys goal is to make it easier to apply the pattern (SaaS). All very early stage.
* gitops-reverser is my open source implementation: certainly not the best operator, but to my knowing the only one that does something like this. And yes the name is a bit reversed.

---

# Today it's again time to vote

* This talk is build arround a demo
* Don't enter stuff you don't want to share, use a fake name, use a fake e-mail adres
* It will end up in a public git repo, I will delete it afterwards
* As always: don't put personal information on shabby websites
* Well here is a shabby website: it's open source so you can trust it

---

# Let's investigate together where this holds and where it's failing

* Brace yourself -> I'm going to suggest some infra nightmares, users doing git commits on every click and publicly avaialble Kubernetes APIS
* Perhaps I like GitOps a bit to much
* Perhaps it's a great new idea
* Please let me know what you think!

---

# GitOps is beatiful ❤️

* Reverse GitOps is not meant to replace GitOps in any way. It's augmenting it.
* Both FluxCD and ArgoCD are beatful tools

---

# What's next?

---

# In demo's you can do nasty stuff

* Publicly accessible kubeapi server
* Writing to git without pull request

---
layout: diagram-story-frame
transition: view-transition
drawFilePath: /story.excalidraw.json
frame: "1"
---

# Simple GitOps

---
layout: diagram-story-frame
transition: view-transition
drawFilePath: /story.excalidraw.json
frame: "2a"
---

# (actually)

<!--
Operators mostly run from within the cluster and 'query' git, sometimes helped by a webhook to make it faster. The big benefit is that you have multiple clusters.
-->

---
layout: diagram-story-frame
transition: view-transition
drawFilePath: /story.excalidraw.json
frame: "2b"
---

# Simpler clusters

---
layout: diagram-story-frame
transition: view-transition
drawFilePath: /story.excalidraw.json
frame: "2c"
---

# Fat arrow shows direction

---
layout: diagram-story-frame
transition: view-transition
drawFilePath: /story.excalidraw.json
frame: "3"
---

# Imagine: the 'cluster' is a public API

---
layout: diagram-story-frame
transition: view-transition
drawFilePath: /story.excalidraw.json
frame: "4"
---

# 'Users' can simply <span v-mark.circle.orange="0">read</span>

<!--
Some notes are very handy to add here as well
-->

---
layout: diagram-story-frame
transition: view-transition
drawFilePath: /story.excalidraw.json
frame: "5"
---

# DevOps experts can write

---
layout: diagram-story-frame
transition: view-transition
drawFilePath: /story.excalidraw.json
frame: "6"
---

# What if we could sync back?

---
layout: diagram-story-frame
transition: view-transition
drawFilePath: /story.excalidraw.json
frame: "7"
---

# configbutler/gitops-reverser

The orang arrow is gitops-reverser


# Cleaning up a bit {.view-transition-title}

---
layout: diagram-story-frame
transition: view-transition
drawFilePath: /story.excalidraw.json
frame: "7a"
---

# And a simple logo

---
layout: diagram-story-frame
transition: view-transition
drawFilePath: /story.excalidraw.json
frame: "7c"
---

# Or even simpler
