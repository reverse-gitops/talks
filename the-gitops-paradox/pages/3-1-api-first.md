---
layout: image-right
image: /images/door-nice.jpg
transition: fade

---

# 1. API First

* Use Kubernetes as the front door
* Give humans, GUIs, and AI one typed write path
* Keep it separate from your workload clusters
* Reuse auth, authz, CRDs, status, and controllers

<!--
This is principle one.<br/>
If we need an API anyway, building yet another one is often wasteful.<br/>
Kubernetes already gives us typing, validation, auth, status, and controller patterns.<br/>
I am not saying: expose your production clusters to everyone.<br/>
I am saying: use a small, focused Kubernetes control plane as the front door for intent.
-->
