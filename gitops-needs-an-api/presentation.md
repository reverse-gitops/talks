---
marp: true
html: true
theme: default
paginate: true
size: 16:9
---

<style>
section {
  font-size: 29px;
  line-height: 1.3;
}

h1 {
  color: #16324f;
}

h2, h3 {
  color: #1f4e5f;
}

strong {
  color: #16324f;
}

code {
  background: #eef3f7;
  color: #16324f;
  padding: 0.08em 0.22em;
  border-radius: 0.2em;
}

.lead {
  font-size: 1.2em;
  font-weight: 700;
  color: #16324f;
}

.subtle {
  font-size: 0.74em;
  color: #506070;
}

.small {
  font-size: 0.78em;
}

.tiny {
  font-size: 0.64em;
}

blockquote {
  border-left: 8px solid #1f4e5f;
  background: #f3f8fb;
  padding: 0.55rem 0.8rem;
  border-radius: 12px;
  margin: 0.7rem 0 0;
  color: #16324f;
}

blockquote p {
  margin: 0;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.78em;
}

table th {
  background: #16324f;
  color: #fff;
  padding: 0.45rem 0.55rem;
  text-align: left;
}

table td {
  background: #f7fafc;
  padding: 0.45rem 0.55rem;
  border-bottom: 2px solid #d9e3ea;
}

.note {
  font-size: 0.64em;
  color: #7a5b11;
  margin-top: 0.6rem;
}
</style>

<!-- _class: lead -->
# GitOps Needs an API

## Reverse GitOps: typed intent in, reviewable commits out

<div class="subtle">
Swiss Cloud Native Day 2026<br>
Simon Koudijs
</div>

<!--
Presenter notes:
- Title slide. Set the frame: GitOps works, the storage is not the problem.
- The problem is who is expected to write YAML and open pull requests.
-->

---

![bg right:38%](./images/simon-portret.jpg)

# Who am I?

`[Software|Product|Cloud|AI] engineer`

- Bachelor in Electrical Engineering
- Worked in startups, consultancy, and SaaS
- Left my job 14 months ago to build my own company

<!--
Presenter notes:
- Keep it short, the audience is here for the pattern, not for me.
- Since last summer: working open source, speaking to spread the word.
-->

---

# What do I do?

- [koudijs.dev](https://koudijs.dev/)
  - consultancy, training, speaeking
- [ConfigButler](https://configbutler.ai/)
  - startup, open source first
  - helps you build high quality configuration
- [Reverse GitOps](https://reversegitops.dev/) pioneer
  - the [gitops-reverser](https://github.com/ConfigButler/gitops-reverser) operator
  - manifest, feel free to comment! :slightly_smiling_face:

<!--
Presenter notes:
- Presented an early version of this pattern at Platform Engineering Day Europe 2026.
- Point at the manifest: this is an invitation, not a finished doctrine.
-->

---

![bg contain](./1-gitops.excalidraw.svg)

<!--
Diagram 1 - the baseline.
- Your GitOps repo feeding cluster 1, 2, n.
- Two writers: you writing files, and your AI writing files.
- Commits land in the repo, the repo is the source of truth.
- Nothing controversial yet: this is the picture everyone recognises.
-->

---

![bg contain](./2-ai.excalidraw.svg)

<!--
Diagram 2 - what the PR gives you, and what it costs.
- Adds the Pull Request / Merge Request box between writers and repo.
- Plus: checks, ephemeral test environment, clear history, audit trail (who, why, when).
- Minus: reviews take time, impact is hard to predict, who reads every line,
  requires understanding of Git and the repo structure.
- Also shows `kubectl apply -f my-quick-fix.yaml` - the shortcut everyone takes.
- Say out loud: this part is not what I'm going to touch.
-->

---

![bg contain](./3-team-boundry.excalidraw.svg)

<!--
Diagram 3 - the work arrives from outside the team.
- Programmer, business person, customer all ask you for things.
- Add a new environment, solve a memory issue, do updates, handle alerts.
- The "API" today is a Slack message, an e-mail, a support ticket.
- Question for the room: what part of that work could we do better?
-->

---

![bg contain](./4-abstractions.excalidraw.svg)

<!--
Diagram 4 - find the repeating intent.
- What can be automated? What is their actual intent?
- Examples: a new "tenant" for a new customer, a new application install of a
  new container image, a bigger instance for full self-service.
- The point: these are not arbitrary edits, they are a small set of shapes.
-->

---

![bg contain](./5-api.excalidraw.svg)

<!--
Diagram 5 - name that shape: an API for supported intent.
- One box in front of the repo, fed by GUI / online form, CLI tool, AI agent.
- You can still throw the rest in a ticket system and do it yourself.
- You only pick the part that is asked often.
- This is a business problem first: draw the line where it pays off.
-->

---

![bg contain](./6-api-tooling.excalidraw.svg)

<!--
Diagram 6 - so what does that API have to do?
- Fast, transparent on the state of the intent, flexible for new questions.
- AuthN and AuthZ need a lot of attention.
- Good governance and auditability: who did what?
- Self-service portals exist, you can buy your way out - maybe a good option.
- But: who is going to build and maintain that?
-->

---

![bg contain](./7-git.excalidraw.svg)

<!--
Diagram 7 - the API has to end up in Git.
- The intent becomes `git commit -m "customer x config tweak"`.
- Git stays the source of truth, the GitOps flow downstream is untouched.
-->

---

![bg contain](./8-git-direct.excalidraw.svg)

<!--
Diagram 8 - the obvious option: let the API commit straight to Git.
- Of course this can be done, you have PRs.
- "If you dare" - it works, but it does not solve all your problems.
- Your API now owns Git credentials, repo layout, templating, conflicts.
-->

---

![bg contain](./9-kube-api.excalidraw.svg)

<!--
Diagram 9 - you already run an API that does all of this.
- Replace the generic API box with kube-api-server.
- Authentication (OIDC), Authorization (RBAC), flexible (CRDs),
  typed / schemas (CRDs), common - the tools already exist.
- Open question on the slide: publicly available?
- This is the pivot of the talk.
-->

---

![bg contain](./10-git-commit.excalidraw.svg)

<!--
Diagram 10 - the one thing it does not do.
- It can do a lot, but can it do `git commit` in a generic way?
- The missing arrow from kube-api-server to the repo.
- This is exactly the gap gitops-reverser fills.
-->

---

![bg contain](./11-git-commit-bi.excalidraw.svg)

<!--
Diagram 11 - and it has to work both ways.
- git commit AND git pull: the loop closes.
- Cluster state and repo state move together instead of drifting.
- Lands the promise: kubectl apply in pre-production without losing the source of truth.
-->
