---
marp: true
html: true
theme: default
paginate: true
size: 16:9
---

<!-- _class: lead -->

<style scoped>
section { text-align: center; }
h1, h2, p { color: #fff; text-shadow: 0 2px 14px rgba(0, 0, 0, 0.55); }
</style>

![bg brightness:0.85](./images/niessen.jpg)

# GitOps Needs an API

Swiss Cloud Native Day 2026 &nbsp;·&nbsp; Simon Koudijs

<!--
CLOCK 11:30 — the slot is 11:30–12:15. Content ends at 12:10, then 5 minutes of questions.

RUN SHEET (wall clock, not elapsed)

  11:30  title + bio ........................ 2 min
  11:32  GitOps is great → business intent .. 5 min
  11:37  the problems ....................... 2 min
  11:39  GitOps has a hard API (1-5 → 1-8) .. 5 min
  11:44  dream mode ......................... 2 min
  11:46  the revelation ..................... 2 min
  11:48  both directions (1-10 → 1-12) ...... 3 min
  11:51  guarding changesets ................ 2 min
  11:53  a data-only cluster per branch ..... 5 min
  11:58  observing kube-apiserver ........... 5 min
  12:03  why again / loop / commits ......... 3 min
  12:06  good fit, don't, in short .......... 3 min
  12:09  websites + next .................... 1 min
  12:10  QUESTIONS .......................... 5 min

Diagram slides are builds, roughly 30 seconds each. Only the text slides are worth a minute.

If you are behind at 11:58, drop 16-watch-cells and 17-join — they are the deepest
slides in the deck and the only ones the story still holds without.
-->

---

![bg right:34%](./images/simon-portret.jpg)

# Simon Koudijs

`[Software|Product|Cloud|AI] engineer`

* Left my job 14 months ago to build my own company
* [koudijs.dev](https://koudijs.dev): consultancy, training, speaking
* [reversegitops.dev](https://reversegitops.dev): the pattern, and a manifest
* [ConfigButler](https://configbutler.ai]): hosted product of this idea

<!--
CLOCK 11:31 — 60 seconds, hard stop. Nobody is here for the bio.
-->

---

# GitOps is great

* Desired state
* History
* Rollback
* Great tools like ArgoCD and FluxCD

<!--
CLOCK 11:32 — you have 5 minutes for slides 3–8. Three claims, three diagrams, keep moving.
-->

---

![bg contain](./1-1-gitops.excalidraw.svg)

---

# Every commit answers

Who ✅
When ✅
What ✅
Why ✅ (intent, message)

---

![bg contain](./1-2-ai.excalidraw.svg)

---

# Business intent

* Which apps does my specific customer want to run
* Network ranges for my cluster
* Self-servicing clusters
* Etc.

---

![bg contain](./1-3-team-boundry.excalidraw.svg)

---

# But GitOps also has problems

Complex constructs are possible, and if you give people the option...

<!--
CLOCK 11:37 — 2 minutes for both problem slides. This is the setup, not the argument.
-->

---

# Then they do it!

* layers (app-of-apps-of-apps-of-apps)
* custom CD pipelines
* complex helm templates
* referencing other sources of truth
    * open PRs in your repo with an ApplicationSet
    * specific helm charts in an online repo

---

# GitOps has a hard API

* Not everybody knows Git
* Do you expect customers to open up a PR?
* Conflicts are annoying
* Small typo in your file contents results in a failed deployment (can take a while!)

<!--
CLOCK 11:39 — 5 minutes, slides 11–15. The 1-5 → 1-8 build is the core of the problem arc:
API in front of the repo, what that API must do, it ends in Git, and the obvious
"just commit straight to Git" — which is the one you already tried.
-->

---

![bg contain](./1-5-api.excalidraw.svg)

---

![bg contain](./1-6-api-tooling.excalidraw.svg)

---

![bg contain](./1-7-git.excalidraw.svg)

---

![bg contain](./1-8-git-direct.excalidraw.svg)

---

# Dream mode

* For now: forget about complex structures
* Just keep a flat folder
* "intent" in plain manifests

<!--
CLOCK 11:44 — 2 minutes for both dream-mode slides.
-->

---

# Dream mode (2)

* Keynote: KRO, Kratix or Crossplane are your friends!
* You can create and delete helm installs (ArgoCD application or HelmDeployment): but you don't edit the actual helm charts (that's a bad dream)
* Little bit of Kustomize is ok-ish, but be careful

---

# The revelation

> The Kubernetes API was designed so that every API resource has a standard, serializable representation that can be stored in a file and submitted back to the API.

<!--
CLOCK 11:46 — 2 minutes. The intellectual centre of the talk. Slow down, let the quote sit.
-->

---

![bg contain](./1-9-kube-api.excalidraw.svg)

---

![bg contain](./1-11-git-commit-bi.excalidraw.svg)

---

![bg contain](./1-12-git-commit-who.excalidraw.svg)

---

# N clusters, and you want to "guard" changesets

Don't forget that n clusters can watch your GitOps folder.

Most changes should also first happen on a branch, so that you can create your PR.

You should have the freedom to delete and create as you want.

But it should only be released on merge to main

<!--
CLOCK 11:51 — 2 minutes. Set up why branching needs its own environment.
-->

---

# Create a single data-only cluster per branch

* Load all existing manifests as a starting point (t=0)
* Make your change in Git
    * ArgoCD syncs to your data-only cluster
* Make a change in your intent objects
    * gitops-reverser converts your changes into commits
* Remove your data-only cluster at merge

<!--
CLOCK 11:53 — 5 minutes, slides 25–31. The branch builds (1-13) then zoom out (2-0 → 2-2).
If you are past 11:56 here, take 2-0 and 2-1 in one breath.
-->

---

![bg contain](./1-13-branch-1.excalidraw.svg)

---

![bg contain](./1-13-branch-2.excalidraw.svg)

---

![bg contain](./1-13-branch-merged.excalidraw.svg)

---

![bg contain](./2-0-start-overview.excalidraw.svg)

---

![bg contain](./2-1-normal.excalidraw.svg)

---

![bg contain](./2-2-intent.excalidraw.svg)

---

# Demo 1

## Who you are, who decides what you may do, and what a vote actually is

Scan. Pick a nickname you are happy for a room full of strangers to read.

<!--
Runbook: demo-runbook.md, demo 1.

Git is not mentioned once, and definitely not SHOWN. Check your browser tabs.
The multi-select bars ARE the argument: GitOps and kubectl both lit up.
"You are all doing both, and only one of them leaves a story."
-->

---

# How do you observe kube-apiserver?

| Mechanism | Tells you *who* | Fires | Guaranteed | AKS/EKS/... |
|---|---|---|---|---|
| **Watch stream** | No | after commit | No | **Yes** |
| **Audit webhook** | Yes | after commit | No | No |
| Mutating webhook | Yes | *before* commit | No | Yes |
| Validating webhook | Yes | *before* commit | No | Yes |
| Audit file | Yes | after commit | No | No |

<div class="note">
The watch says <strong>what</strong> changed.
The audit webhook says <strong>who</strong> changed it. They "merge" on <code>uid + resourceVersion</code>.
</div>

<!--
CLOCK 11:58 — 5 minutes: the table, 14-gitops-reverser, 16-watch-cells, 17-join.
The table is the slide that earns the talk.
BEHIND? Cut 16-watch-cells and 17-join here and go straight to "So why again?".
-->

---

![bg contain](./14-gitops-reverser.excalidraw.svg)

---

![bg contain](./16-watch-cells.svg)

---

![bg contain](./17-join.svg)

---

# So why again?

* Leave your production clusters alone
* The data-only cluster can sit in a different network (also more acceptable on the public internet)
* Of course you can only enter with your own identity (OIDC)

<!--
CLOCK 12:03 — 1 minute.
-->

---

# Won't that create an infinite loop?

* gitops-reverser, ArgoCD and FluxCD stop when the spec is as desired
* No looping
* gitops-reverser controls when the sync is done

<!--
CLOCK 12:04 — 1 minute. Expect this as a question anyway; answering it here saves Q&A time.
-->

---

# So you have commits

Who ✅
When ✅
What ✅
Why ❌ -> gitops-reverser CommitRequest

<!--
CLOCK 12:05 — 1 minute. Callback to "Every commit answers". The ❌ is the punchline.
-->

---

# What a commit looks like

```
Author:     Simon7 <simon7@koudijs.dev.test>
AuthorDate: Wed Sep 16 03:51:25 2026 +0000
Commit:     ConfigButler Bot <bot@configbutler.ai>
CommitDate: Wed Sep 16 03:51:25 2026 +0000

    chore(demo1): 1 change from demo:CgZzaW1vbjcSCXJvb20tcGFzcw

    - [CREATE] quizsubmissions/demo1-simon7
```

The author is the human. The committer is the bot.

<!--
`git show --format=fuller` — plain git log hides the committer, and the whole
story is invisible without it.
-->

---

# Demo 2

## The same actions, in Git — and the one place the room works together

You are still signed in. You do not have to join again.

<!--
Runbook: demo-runbook.md, demo 2.

`--type=json`, NEVER `--type=merge` — a merge patch eats the whole voucher list.
Containment line, say it before you are asked: nothing reconciles from that repo.
An attendee's commit cannot reach a cluster.
-->

---

# Good fit

* Full GitOps love: Who, When, What and Why
* Identify clear CRD-based, high-level resources that reflect intent

<!--
CLOCK 12:06 — 2 minutes for Good fit and Don't together. Be honest about the limits.
-->

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

<!--
CLOCK 12:07 — 1 minute.
-->

---

# Other options

* You could have something that quickly creates OCI artifacts from a commit on main
* Automatic "push" of someone click-ops-ing in ArgoCD's GUI
* What if every configuration API in the world used KRM?

<!--
CLOCK 12:08 — 1 minute. Keep it speculative and short.
-->

---

[![](images/web-reverse-gitops-dev.png)](https://reversegitops.dev)

---

# Next

* [reversegitops.dev](https://reversegitops.dev)
* Useful in any way? Fill a few questions on how I did.

---

# Questions?

<!--
CLOCK 12:10 — 5 minutes of questions, hard stop at 12:15.
-->
