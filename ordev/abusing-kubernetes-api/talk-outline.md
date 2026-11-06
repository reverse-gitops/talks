# Talk outline: (Ab)using the Kubernetes API as a Configuration Backend

Øredev, Fri 6 Nov, 11:15, Turing, 40 minutes. The abstract is in [readme-abusing-k8s.md](../two/readme-abusing-k8s.md).

**What the audience says afterwards:**

1. "I don't have to build a configuration backend: kube-apiserver already has typed objects, validation,
   authorization per field, audit and watches, and my users never see it."
2. "GitOps keeps its job and loses its front door: people and agents edit through the API, Git records who did
   what and why, and normal GitOps ships it."

**The deck:** [slides.md](slides.md) follows this order. Each cornerstone is one block of the TLDR picture.
The material column lists slides in `../config-deserves-better/pages/` that can be brought in; each brings one idea.

| Min | Slide | Cornerstone | Material to bring in |
|---|---|---|---|
| 0 | `title` | | |
| 0:15 | `about` | Who am I, with the join QR for latecomers | |
| 0:30 | `poll-crd` | The door question: what is a CRD? | |
| 0:30 | `yesterday` | Yesterday's TLDR, and today's difference: the workload gives back | |
| 0:30 | `consumers` | Who the API is for | |
| 1:30 | `expectations` | Make it easy, and leave me in control | |
| | `provider-expectations` | What providers expect: tooling, AI, conflicts, watches, RBAC, audit | |
| 2:30 | `tldr` | The whole picture: the API makes it easy, the files give control | |
| | `breath-database` | *Pause* | |
| 3 | `screen` | 1. Settings screen | `own-api`, `get-seats` |
| | `breath-chair` | *Pause* | |
| 6 | `auth` | 2. Auth for users | `public-access`, `cluster-admins` |
| 10 | `api` | 3. Public kube-apiserver | `kube-api`, `modelling-crds`, `modeling` |
| | `krm-shape` | KRM: kind, metadata, spec | |
| | `crd` | Custom Resource (instance) vs Custom Resource Definition (schema), in Freelens | |
| | `modelling-crds` | Your chair as a resource: schema, CEL rules, 409 on create | |
| | `price-policy` | Admission: a policy in YAML, nobody pays more than €10 | |
| | `last-writer` | Last writer wins per field, watches, and edit through the API | |
| | `curl` | It's just an API: kube-apiserver and etcd in a small data-only cluster, not in your infra clusters | |
| | `api-key` | Live: create a token, read a seat, and get refused on delete | |
| | `foyer` | People just log in: Room Pass, krm-foyer and the API server | |
| | `seats-list` | Leave off the name, and the URL returns a list | |
| | `krm-philosophy` | KRM: the design, in quotes from the KRM document | |
| | `control-loop` | The control loop: spec, observe, act, status | |
| | `breath-who` | *Pause* | |
| 18 | `reverser` | 4. gitops-reverser | |
| | `inside-apiserver` | Inside the data-only cluster: every change goes through the kube-apiserver | |
| | `two-streams` | What changed, joined with who changed it | |
| | `commit-request` | Say why, and the commit carries it | |
| | `reverser-model` | What modelling looks like: the gitops-reverser CRDs | |
| | `reverser-committer` | Author, committer and signing, in a GitProvider | |
| 24 | `git` | 5. Files in Git | `gitops-people`, `api-to-git` |
| | `breath-remembers` | *Pause* | |
| 28 | `back` | 6. The way back | |
| 30 | `krm` | 7. KRM | `chairs` |
| 33 | `pros-cons` | Where it breaks: the trade-offs | |
| | `criteria` | Should you do this? | |
| | `managed` | The plan: you bring a Git repo and CRDs, I run the Kubernetes stuff | |
| | `breath-contrarian` | *Pause* | |
| 37 | `tldr-end` | The whole picture | |
| 38 | `ask` | | |
| | `both-ways` | *Backup:* Bi-directional GitOps: edit through the API, promote and revert through Git | |
| | `one-writer` | *Backup:* The race, and one writer per branch that decides when Flux or Argo CD applies | |
| | `tldr-workload` | *Backup:* a kube-apiserver and workload per stage, promoted through Git branches | |

## Not placed yet

- **The live `kubectl get seats`**, which could fit in `api`. [ScriptedTerminal.vue](components/ScriptedTerminal.vue) is ready.
- **Agents as API users**, and **desired state and 409 conflicts**, which could fit in `api`.
