---
layout: center
class: text-center
---

# Q&A

<!--
Leave plenty of room for questions. Common ones to prepare for:
-->

---

# Is Git the source of truth?

Yes — in Reverse GitOps, Git is still the authoritative record.

The controller writes intent objects into Git. That is your source of truth. The Kubernetes cluster is derived from it, same as standard GitOps.

---

# How do you handle authentication?

The Kubernetes API has native OIDC support. You can hook up your existing auth system and know exactly who submitted each intent object.

RBAC applies at the API level — before anything reaches Git.

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

---

# Does it work with ArgoCD / Flux?

Yes. The controller writes clean YAML into Git. Any GitOps reconciler picks it up from there — it has no idea the change came from an API rather than a human editing a file.

That is the point.
