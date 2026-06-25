# GitOps Reverser × Cozystack — state of play and pitch notes

> Status: pitch prep / positioning note
> Date: 2026-06-25
> Audience: internal (decide what to pitch this afternoon)
> Related:
> [Watch-only ingestion architecture](watch-only-ingestion-architecture.md),
> [Sensitive resource classification plan](sensitive-resource-classification-plan.md),
> [GitTarget lifecycle and repo architecture](gittarget-lifecycle-and-repo-architecture.md),
> [reversegitops.dev](https://reversegitops.dev)

## The one reframe to lead with

The whole "watch-only" investigation exists to dodge the single biggest install-friction
point on **managed** clusters: you can't configure the kube-apiserver audit webhook there.

**Cozystack is the opposite environment. It owns its own kube-apiserver.** That flips the
positioning entirely:

- The high-fidelity **audit path** — the one that gave the per-click, OIDC-attributed-commit
  demo — is fully available, because the distro can wire the audit webhook itself. The thing
  that makes us a "poor fit for managed control planes" is a non-issue here.
- So for Cozystack, **don't pitch the compromise mode. Pitch the strong mode.** Watch-only is
  a market we want for managed clusters; for Cozystack its payoff is narrower and additive
  (kills the aggregated-API proxy, gives a faithful state-mirror/backup), not a reason to give
  up author attribution.

Net: Cozystack is close to an ideal-fit environment for the product as it already exists.

## Where we are today

- **Live capture → Git, attributed.** Every API mutation becomes a sanitized YAML commit.
  The demo proved the headline: every GUI click → one commit, authored by the OIDC-logged-in
  user. That works today on the audit path.
- **Sanitization + safe ordering.** Runtime noise stripped; per-type ordered ingestion via
  Valkey/Redis; checkpoint LIST reconcile as integrity backstop.
- **Secret handling (coarse).** `Secret` and opted-in Secret-shaped CRDs are encrypted with
  SOPS + age before commit. Commits can be SSH-signed via `GitProvider.spec.commit.signing`.
- **Flexible Git config.** `GitProvider` + `GitTarget` CRDs; path scoping; multiple targets.
- **Path back works in e2e** (edit in Git → reconcile back), but is intentionally **not**
  pitched yet — see below.

### Two dependencies that are on their way out

1. **`apiservice-audit-proxy` is nearly unnecessary.**
   [ConfigButler/apiservice-audit-proxy](https://github.com/ConfigButler/apiservice-audit-proxy)
   exists only to recover **object bodies for resources behind an aggregated API server**,
   because the official audit event for those is body-less/name-less. The mutation-capture
   corpus (Row 15) proves the **watch** carries the full aggregated object including `spec`.
   So we can use watch as the *body source* for aggregated types while keeping audit for
   *attribution* — and the proxy drops to optional. For Cozystack (which leans on aggregated
   APIs / many CRDs) this removes a whole sidecar from the install story.

2. **Audit-policy coupling is understood and ownable.** The clean audit stream depends on a
   curated audit policy (drops `*/status`, HPA `/scale`, leases, heartbeats). Because Cozystack
   owns the apiserver, we can **ship a curated audit policy as part of the integration** rather
   than hope each cluster has one. That is an asset, not a risk, in a distro.

## The "return state via an API call" ask

This was the audience question and it's the right one to prepare. There are two readings, both
served by **one small read API on the operator** — and crucially, **without writing anything
back into the cluster.**

The operator already knows, for every captured resource, its **file path** and the **last
commit SHA** that touched it — it maintains that mapping on *both* the live path and the
reconcile path, for free, because it's the thing doing the writing. So expose it:

```
GET /v1/resources/{group}/{version}/{resource}/{namespace}/{name}
  → { gitPath, lastCommitSha, lastCommitTime, author, historyUrl, blameUrl }
GET /v1/resources/{...}/history        → recent commits for that file
GET /v1/resources/{...}?content=true   → the committed (sanitized) YAML itself
```

- "Last SHA that touched a resource" = `lastCommitSha`.
- The GUI **history link** = `gitPath` + the configured git host's URL template. Trivial.
- It doubles as the read-only backup view: `?content=true` returns what's in Git.

### Why an API, not the annotation write-back you floated

You raised writing `gitops-reverser/path` (and last-SHA) as **annotations on the live object**.
It's tempting and easy, but it has three costs the API approach avoids:

- **It makes us a writer in the cluster.** The product's whole position is "observe, don't
  mutate"; our own README lists "two always-on writers fighting over the same resources" as a
  poor fit. Writing annotations crosses that line.
- **It creates a feedback loop.** An annotation write bumps `resourceVersion` and produces an
  audit/watch event — our own. We'd have to filter our own writes by actor to avoid committing
  the annotation churn. That's exactly the kind of "raises the bar the wrong way" complexity
  you want to avoid.
- **You'd maintain it in two places** (live + reconcile), which was your stated dislike. The
  API reuses state the operator already has in both paths — there is nothing to duplicate.

**Recommendation:** ship the read API. If some users specifically want provenance visible in
`kubectl get -o yaml`, keep the annotation as an explicit **opt-in** later, eyes open about the
writer/loop cost. For the Cozystack GUI (which you control) the API is strictly better: it's
literally "return something about that state by an API call," and it stays read-only.

## Your open questions

### Where do we host Git?

For a distro, prefer an **in-cluster, auto-provisioned git host** (e.g. Gitea if Cozystack
already ships one) over an external GitHub/GitLab. Reasons: self-contained, air-gap-friendly,
no egress/credential setup, and the GUI's history links resolve in-cluster. Keep external
remotes supported (we already do) for teams that want their history off-box.

Caveat to name in the pitch: if Git is in-cluster and also our "backup," that backup must have
its **own** backup, or it's circular. The operator's Redis queue buffers commits while the git
host is down, so transient git outages cost freshness, not data — but the git host's storage
still needs DR like any stateful component.

### How do we configure it properly (without raising the setup bar)?

The flexibility is the friction. For a distro, **ship one opinionated profile** that the
Cozystack install wires up, instead of exposing the full CRD surface on day one:

- one `GitProvider` + one `GitTarget` pre-created by the integration;
- the audit webhook wired by the distro (Cozystack's advantage — it owns the apiserver);
- a curated default audit policy tuned for Cozystack's own controllers;
- a default **capture set**: the tenant-facing / user-intent CR types, **not** internal
  plumbing. Cozystack has a lot of CRDs; demand/followability already gates which types we
  watch, so the win is choosing a sane default list, not capturing everything.

Power users keep the full CRD surface; everyone else gets a working install with no decisions.

### The path back (Git → cluster)

Agree: **defer it.** It works in e2e but it's premature, and it has a real trap — once Flux
(which Cozystack ships) applies the same resources we capture, you have the "two always-on
writers" anti-pattern unless there's a crisp ownership rule (which resources are
git-authoritative vs API-authoritative). Frame it for the pitch as: *the repo is
Flux-reconcilable by construction, so round-trip is a future capability, not a rewrite* — and
ship the read-only mirror first.

## Secrets — "only use secrets for secrets"

The honest answer to *"isn't it common to not have secrets in specs?"*: it's a **best
practice**, not a guarantee. Plenty of operators inline credentials (connection strings,
basic-auth, tokens) directly into a CR `spec`, and a bundled distro will contain some of those.
So you can lean on the convention, but not silently.

Recommended position for the pitch (no field-level encryption needed at launch):

1. **Keep the contract explicit:** "sensitive data belongs in `Secret` objects; those are
   SOPS-encrypted wholesale." That's already built and covers the common case.
2. **Coarse escape hatch, not subfield surgery.** For a CR type known to carry secrets inline,
   allow marking the **whole type** sensitive → encrypt it wholesale like a Secret (reuses the
   existing SOPS path), *or* **redact/skip** those fields/types entirely. See
   [sensitive-resource-classification-plan.md](sensitive-resource-classification-plan.md).
3. **Fail closed.** If a type is classified sensitive and can't be encrypted, **skip or
   redact — never commit plaintext.** For a distro, a leaked secret in Git is the one
   unacceptable outcome; coarse-but-safe beats precise-but-fragile.

Field-level encryption stays a later opt-in. You're right that it raises the bar the wrong way;
it shouldn't be a launch blocker, and the wholesale-encrypt-the-type lever gets you most of the
safety for almost none of the complexity.

## Other things worth taking into account

- **Multi-tenancy.** Cozystack is multi-tenant. Decide the repo/branch/path mapping per tenant
  (GitTarget path-scoping already supports this) and the RBAC for who can read which history.
  This is a strong fit but needs a tenancy-mapping slide, not an afterthought.
- **Named non-human authors.** Cozystack's own controllers (Flux et al.) will make changes.
  Attribute those commits to the **named service account** (`kustomize-controller`), not
  "unknown" — so the history reads cleanly as *human edits (OIDC) vs controller reconciles*.
  This is already the direction in the watch-only attribution policy.
- **Identity mapping OIDC → git author.** The demo worked, so the audit `user` already carries
  the OIDC identity. Confirm the email/username claim maps cleanly to a stable git author
  email, since that's what shows up in `git blame` forever.
- **Backup framing — be precise.** The repo is a continuously-updated, human-readable backup of
  **desired state** (sanitized, no status/runtime), not an etcd snapshot. Great for "what was
  configured," not a verbatim cluster restore — until path-back lands, at which point it becomes
  restore-capable via Flux. Say this honestly; it's still a compelling secondary value prop.
- **HA expectations.** Start single-replica (leader-elected). The seams for HA exist (state is
  in Redis, demand is a self-healing lease) but single-writer-per-type ownership is still a
  deferred item. Don't oversell HA in the pitch.
- **Project home / licensing.** Both Apache-2.0, so license-compatible. Worth deciding up front
  whether this lives as a Cozystack component and who maintains it.

## What to pitch this afternoon

1. **It already does the headline on Cozystack's home turf:** API-first writes → clean,
   OIDC-attributed Git history, on a distro that can wire the audit webhook itself.
2. **The read API** answers "give me state via an API call": path, last SHA, history link,
   and the committed YAML — read-only, no writes back into the cluster.
3. **Fewer moving parts than before:** aggregated-API proxy is on its way out (watch carries
   the body); install is one opinionated profile.
4. **Honest scope:** read-only mirror + backup-of-desired-state now; path-back and field-level
   secret encryption are deferred, on purpose.
