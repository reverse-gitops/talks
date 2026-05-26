---
marp: true
theme: default
paginate: true
title: What If Every Cozystack Change Became a Commit?
author: Simon Koudijs
---

# What If Every Cozystack Change Became a Commit?

**Reverse GitOps for platform changes**

Simon Koudijs

<!--
Hook: open with the question. Don't answer it yet.
-->

---
![bg right:38%](./images/simon-portret.jpg)

# Who am I?

`[Software | Product | Cloud | AI ] engineer`

- Bachelor in Electrical Engineering
- Worked in startups, consultancy, and SaaS
- Left my job to pursue building my own company

<!--
Since last summer: working open source, speaking to spread the word
-->

---

# What do I do?

- [koudijs.dev](https://koudijs.dev/) (consultancy, training)
- [ConfigButler](https://configbutler.ai/) (startup)
    * Tooling to build high quality configuration
    * Open source first
- [Reverse GitOps](https://reversegitops.dev/) pioneer

---

# Why here?

- I love API first
- I didnt know Cozystack
- Wouldnt that be a great?

---

## Who am I

- Building [gitops-reverser](https://github.com/ConfigButler/gitops-reverser)
- Left full-time work last summer to pursue this
- Came from the pain of moving customer settings through stages with SQL

<!--
Short. Establish why you care, not full CV.
-->

---

## The setup

Cozystack exposes platform services as Kubernetes API resources:

- Postgres
- Redis
- Bucket
- Kubernetes (clusters as a resource)

Users interact via **kubectl**, the **dashboard**, or even an **MCP** feeding an AI agent.

---

## But...

> Who made this change?
> Why?
> When?
> Promotion?

Git seems far away.

<!--
Land the pain. Pause here.
Who added this huge resource? Why did he/she do this?
How can we land this thing into production?
-->

---

## Valid answers

- **Accept it**
- **Periodic reset** — wipe and reapply from a known state
- **Limited access** — only a few people can change anything
    - **runbooks** — every change goes through a documented procedure
    - **manual changelogs**
- Audit activity into files ([kube-api](https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/) to the rescue)

<!--
Accept it: "it's not important, we can live with uncertainty, it's for experiments, people don't do weird stuff
Periodic reset: wipe it every night to a known state, it's only for shorter experiments.
Limited acces: only a select group of people with good docs, run books, manual changelogs are making adjustments
Configur audit logs: kube-api has a lot of options to push important resources, and changes into audit log files. They do provide answers: but it does take skills to find what you need.

These work, but they trade autonomy for control. Could be fine, but it could also be painfull
-->

---

## Valid answers — GitOps

Flip the interface: **Git is the only way in**.

- Users write valid YAML and open a PR
- A controller (Argo, Flux) reconciles Git → cluster
- Every change is already a commit, by construction

The catch: no kubectl, no dashboard, no MCP. The GUI and the API stop being the front door. Git is your `interface`.

<!--
This is the classic answer. It works — but it asks every user to speak YAML.
-->

---

## GitOps the downsides

* GitOps: Git as 'interface'
* The nice GUI and API first strategy of Cozystack becomes hard
* Not evertbody likes writing YAML

---

### Let's ask

* interactive demo
* your answers are recorded in my kube-api server as a CRD
* It's Cozystack like: kube-api first
* meet voter-app
* does this handle your ingress?
* You scan to code or enter the url, and you pick your own e-mail and display name. I won't send you e-mails, and I won't make it public (except for what I might show on screen during the presentation).

<!--
Add the QR code to demo.configbutler.ai
Show the incomming CRs
-->

---

# The answers

Show kubectl output?
Show one example answer
But who gave the answer? Did he made changes aftwards?

You can program it

---

# What if?

You gave me a display name and some e-mail. What if we we would take these actions and write them as git commits?

Let's see

---

## What if?

What if **every platform change** automatically appeared as clean YAML in Git?

- Fully automated
- A silent layer
- API activity → durable, readable history of intent

---

## Reverse GitOps

Classic GitOps: **Git → Platform**

Reverse GitOps: **Platform → Git**

Git stops being the *interface*.
Git becomes the *memory*.

---

## Why Cozystack fits

- Platform intent already lives in the Kubernetes API
- High-level resources (Postgres, Bucket) → small, meaningful diffs
- Operator workflow doesn't change — the capture is silent

---

# Demo

<!--
Live: make a change in the dashboard → show commit appear in Git.
Have a fallback recording ready.
-->

---

## How can this work?

| Option | Phase | Identity | Why not enough |
|---|---|---|---|
| Watch | Post | No | Sees resulting state, not who changed it. |
| Admission webhook | Pre | Yes | Sees the request, not the final persisted outcome. |
| [Audit webhooks](https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/) | Post-ish | Yes | Best fit: who did what, to which resource, and how the API server responded. |

<!--
Audit policy is the closest fit — but configuration isn't easy and aggregated API bodies aren't written by default.
-->

---

## Meet GitOps Reverser

* Translating audit webhooks into git commits
* Configurable by CRD
* Inspired by great tools like Flux

---

## What you gain

- **Auditability** — versioned, diffable, shareable
- **Easier on-ramp to GitOps** — no YAML fight, the API answers fast
- **GUI without guilt** — click in the dashboard, still get a commit
- **Non-engineers can propose changes** — through the tools they already use
- **Test-cluster → PR → prod** — promote what worked

---

## The honest part

- You need to get a lot right: TLS at every stage, identity, RBAC
- Today: an **api-audit-proxy** is required — k8s audit logs are too shallow
- Secrets need care — Cozystack should keep them in dedicated resources, not inline fields
- Git is beautiful, but it asks for some engineering mindset

<!--
Don't hide the rough edges. Credibility comes from naming them.
-->

---

## Why not just one big file?

- No history of *who* and *why*
- No diffs across time
- No review workflow
- No promotion path between environments

Git already solved this.

---

## Where this could go

- gitops-reverser as a Cozystack add-on
- Staging Cozystack → PR → production Cozystack
- Policy checks and human review *before* a change lands (ConfigButler)
- Security: which ServiceAccount changed what, and when

---

## Takeaways

1. The Kubernetes API is already a record of intent — capture it
2. Reverse GitOps gives auditability without changing how operators work
3. Cozystack's high-level resources make the diffs *human-readable*

---

# Thank you

- [github.com/ConfigButler/gitops-reverser](https://github.com/ConfigButler/gitops-reverser)
- Find me after the talk

**Questions?**
