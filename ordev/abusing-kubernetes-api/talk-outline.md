# Talk outline: (Ab)using the Kubernetes API as a Configuration Backend

Øredev, Fri 6 Nov, 11:15, Turing, 40 minutes. The abstract is in [abstract.md](abstract.md).

**What the audience says afterwards:**

1. "I don't have to build a configuration backend: kube-apiserver already has typed objects, validation,
   authorization per field, audit and watches, and my users never see it."
2. "GitOps keeps its job and loses its front door: people and agents edit through the API, Git records who did
   what and why, and normal GitOps ships it."

**The deck:** [slides.md](slides.md) follows this order. The four parts are the rows of the new TLDR ([Contents.vue](components/Contents.vue)). Times are estimates and have not been rehearsed. Each slide's speaker notes start with its start time and budget.

| Min | Part | Slides |
|---|---|---|
| 0 | Opening | `title`, `belief`, `tldr` (the big red cross), `breath-not-infra`, `tldr-contents`, `about`, `poll-crd`, `yesterday`, `provider-expectations` |
| 3:30 | 1. It's just an API | `part-api`, `breath-chair`, `curl`, `breath-database`, `krm-shape`, `crd`, `crd-seat`, `modelling-crds`, `last-writer`, `krm-philosophy`, `control-loop`, `solid`, `self-host` |
| 13:30 | 2. Identity is kept | `part-identity`, `api-key` (live), `foyer`, `pipeline`, `price-policy` (live) |
| 20:30 | 3. The API forgets, Git remembers | `part-history`, `reverser`, `both-ways`, `breath-remembers`, `breath-who`, `two-streams`, `commit-request`, `reverser-committer`, `breath-story` |
| 28:30 | 4. It doesn't always fit | `part-limits`, `webshop`, `criteria`, `pros-cons`, `adult` |
| 33:30 | What I don't know yet | `managed`, `breath-contrarian`, `tldr-end` |
| 35:30 | Questions | `ask` |
| | *Backup* | `one-writer`, `tldr-workload`, `reverser-model`, `inside-apiserver`, `seats-list`, `consumers`, `expectations` |

Not in the deck anymore: `screen`, `auth`, `api`, `git`, `back`, `krm`. They walked through the crossed-out picture.

## Not placed yet

- **The live `kubectl get seats`**, which could fit in `api`. [ScriptedTerminal.vue](components/ScriptedTerminal.vue) is ready.
- **Agents as API users**, and **desired state and 409 conflicts**, which could fit in `api`.
