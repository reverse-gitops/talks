---
marp: true
html: true
theme: default
paginate: true
size: 16:9
---

# GitOps is great

* Desired state
* History
* Rollback
* Great tools like ArgoCD and FluxCD

---

# Every change answers

Who
When
What
Why (intent!)

---

# Business intent

* Which apps does my specific customer want to run
* Network ranges for my cluster
* Self-servicing clusters
* Etc.

---

# But GitOps also has problems

Complex constructs are possible, and if you give people the option...

---

# Then they do it!

* layers (app-of-apps-of-apps-of-apps)
* custom CD pipelines
* complex helm templates
* referencing other sources of truth 
    * open PRs in your repo with an ApplicationSet
    * specific helm charts in an online repo

---

# GitOps has an hard API

No everybody knows Git

Do you expect customers to open up a PR?

Conflicts are annoying

Small typo in your file contents results in a failed deployment (can take a while!)

---

# Dream mode

* For now: forgot about complex structures
* Just have a flat folder
* Just put "intent" in plain manifests

---

# Dream mode (2)

* Keynote: KRO, Kratix or Crossplane are your friends!
* You can create and delete helm instals (ArgoCD application or HelmDeployment): but you don't edit the actual helm charts (that's a bad dream)
* Little bit of Kustomize is ok-ish, but be carefull

---

# The revelation

> The Kubernetes API was designed so that every API resource has a standard, serializable representation that can be stored in a file and submitted back to the API.

---

# So they are the same?

Why do we only sync from Git to Cluster?

Why dont we sync Cluster into Git?

And why can't we just sync in two directions?

---

# N cluster, and you want to "guard" changesets

Don't forgot that n cluster can watch your GitOps folder.

Most changes should also first happen on a branch, so that you can create your PR. 

You should have the freedom to delete and create as you want. 

But it should only be released on merge to main

---

# Create a single data-only cluster per branch

* Load all existing manifests as starting point (t=0)
* Make your change in Git
    * ArgoCD syncs to your data-only cluster
* Make a change in your intent objects
    * gitops-reverser converts your changes into commits
* Remove your data-only cluster at merge

---

# So why again?

* Leave your production clusters alone
* The data-only cluster can sit in a different network (also more acceptable on the public internet)
* Off course you can only enter with your own identity (OIDC)

---

# Won't that create an infinite loop?

* gitops-reverser, ArgoCD and FluxCD stop when the spec is as desired
* No looping
* gitops-reverser controls when the sync is done 

---

# Good fit

* Full GitOps love: Who, When, What and Why
* Identify clear CRD based high level resources that reflect intent

---

# Don't

* Try to reverse advanced GitOps stuff (you will fail)
* Use it for your really transactional data

---

# In short

* gitops-reverser reconciles API resources to Git
* Combine it with ArgoCD or FluxCD to sync from Git to API
* Branching requires a fresh data-only environment (or namespace*)

> It's just rsync on steroids

---

# Other options

* You could have something that quickly creates OCI artifacts from a commmit on main
* Automatic "push" of someone click-ops-ing in ArgoCD's GUI
* What if every configuration API in the world would use KRM?

---

# Next

* reversegitops.dev
* Let me know what you think
* I'm fully comitted: so I can make time to do training and consulting when needed

---

# Questions?
