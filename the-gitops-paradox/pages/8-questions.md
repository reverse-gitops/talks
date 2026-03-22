---
layout: center
class: text-center
---

# Q&A

<!--
Leave plenty of room for questions. Common ones to prepare for:
-->

---
layout: diagram-story-frame
transition: view-transition
drawFilePath: /story.excalidraw.json
frame: "6"
---

# Moving changes back


---

# Is Git the source of truth?

The hard question, in my designing I have chosen to have the intent cluster as the source of truth. Git as the source of record. But all my engineering is focussed on aligning and syncing both API and git state as much as possible. Rollback in Git? Possible. Editting through Kubernetes API? Possible, immediatly reflected in Git as a commit.

And what happens with merge conflicts? Since the cluster is the ultimate souce of truth:

Yes — in Reverse GitOps, Git is still the authoritative record.

The controller writes intent objects into Git. That is your source of truth. The Kubernetes cluster is derived from it, same as standard GitOps.

---

# Why git as state store?

Well: it's the source of record, I would say that the intent control plane is the state store. All activity is immedialy reconciled to git: but also can go in the other direction. It's an engineering choice: at this moment I'm intervening with a validation webhook. But I'm in the process of switching to the Kubernetes API audit event stream (which is the only fully reliabe way of getting both the users name and what happened).

--- 

# Why not a database?

Databases certainly have their place: but for configuration and high level intent they do not have a commonly known process like the pull request, commit signing etc. Of course you can implent your own: it has been done a lot.

And don't forgot that the Kubernetes API also needs a database.

---

# How do you handle authentication?

The Kubernetes API has native OIDC support. You can hook up your existing auth system and know exactly who submitted each intent object.

RBAC applies at the API level — before anything reaches Git.

<!--
Well OIDC is interesting to mention
-->

---

# Is this a real audit log?

Yes, with the same caveats as any GitOps setup:

- Conceptually, signed commits are fully supported
- As long as your Git provider disallows force-pushes on main, history is tamper-evident
- The author of each commit is the controller, acting on behalf of the authenticated user

---

# What about high-frequency changes?

Reverse GitOps is not designed for high-throughput event streaming.

It works well for **intent-level changes**: app configuration, infrastructure declarations, platform requests. Things that are meaningful enough to record in Git.

Getting all your operational data in KRM is a very interesting thought: but optimising won't be easy, and I'm affraid that it won't scale. But who knows.

---

# Does it work with ArgoCD / Flux?

Yes. The controller writes clean YAML into Git. Any GitOps reconciler picks it up from there — it has no idea the change came from an API rather than a human editing a file.

That is the point.
