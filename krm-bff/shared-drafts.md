# Shared drafts: a CRDT pre-branch for Kubernetes resources

An idea that came out of preparing the talk. Not part of the talk itself, apart from a possible closing tease. Terms are explained in [sync-engines-background.md](sync-engines-background.md). Claims I haven't checked yet are marked **(verify)**.

## The idea in one paragraph

Today the demo lets one person edit one Kubernetes resource: incoming changes show up live, and Save sends a PATCH with a commit message. The idea is to put a **shared draft** in front of that Save. Everyone edits the draft together as a CRDT, so nothing is refused and every change keeps its author. Changes from the cluster flow into the same draft, as if the cluster were one more editor. When the group is happy, someone with the right permission **commits**: one PATCH, one message, with everyone who contributed as co-author. The CRDT is for working together; KRM stays the place where decisions are validated, authorized and recorded.

It's a **pre-branch**: lighter than a git branch and a pull request, meant for the changes that happen often.

## Why

- **The 409 is right for decisions, but rough for collaboration.** When five people work on the autumn menu together, each of them hitting a conflict on Save is friction, not safety.
- **Commits should be decisions.** One commit per decision, with `Co-authored-by:` lines, tells the history far better than 200 tiny commits. The CRDT keeps the fine-grained story; git keeps the decisions.
- **Provenance comes for free.** A CRDT records who made each change, so the UI can show where every value came from and how a conflict was resolved.
- **It fills a gap on the "it depends" scale.** Between "direct write, live" and "pull request with review" there's nothing today. A shared draft is that middle position.

## The model: two documents, one merge direction

Use the same model as git: a main branch and a feature branch.

```
                         watch                         
  Kubernetes API  ─────────────────▶  live doc (CRDT)        mirrors the cluster, written only by the bridge
        ▲                                   │
        │                                   │ merge (live → draft), after every watch event
        │                                   ▼
        │                             draft doc (CRDT)  ◀──  everyone in the room edits here
        │                                   │
        └──────── commit: PATCH + resourceVersion + message + co-authors
```

- **live doc**: a CRDT copy of the resource as it is in the cluster. Only the bridge writes to it, and only from watch events.
- **draft doc**: starts as a copy of the live doc. Humans edit only this one.
- After every watch event, the bridge applies the change to the live doc and merges the live doc **into** the draft. Never the other way round.

Why two documents instead of writing cluster changes straight into the draft: a CRDT decides "who wins" by causal history. If the bridge wrote into the draft directly, a cluster change would always be *newer* than the draft edits and would silently overwrite them. Because the live doc never sees the draft's edits, a cluster change is **concurrent** with any draft edit made since the last merge. For the same field, that's a real conflict the CRDT keeps and the UI can show:

> `price`: €3.50 (Anna, in the draft) ↔ €3.40 (cluster, changed by `kubectl` 2 minutes ago)

A draft edit made *after* the draft has seen a cluster change simply overrides it, which is what the person meant: they saw the new value and changed it anyway.

### Attribution of cluster changes

Every Kubernetes object carries `managedFields`: which field manager last set which field (`kubectl`, a controller, the coffee app, gitops-reverser). The bridge can use that to label cluster changes in the draft's history: "changed by `kubectl-edit`" instead of just "changed by the cluster". With audit logs you could even get the user, but `managedFields` is the cheap first step.

### What a conflict looks like

When two concurrent changes set the same field, Automerge picks a winner deterministically, but keeps the losing values so you can read them (`getConflicts`) **(verify)**. That gives three UI states per field:

- **clean**: draft equals live.
- **proposed**: the draft has a different value than live, with the authors of that value.
- **conflict**: concurrent values exist. Show all of them with their authors and let a human pick. Picking is just one more edit, so it resolves the conflict for everyone.

One quirk to handle: after a commit, the watch brings the committed value back into the live doc. That's concurrent with the draft edit that proposed it, so it's technically a conflict, but with identical values. Treat "all concurrent values are equal" as clean.

## Commit

1. Take a snapshot of the draft. People can keep editing during the commit; their edits simply remain as a new proposal afterwards.
2. Compute the difference between the snapshot and the live doc, only for `spec`.
3. Optionally do a **server-side dry run** first (`?dryRun=All`): the API server runs validation and admission without storing anything. This can also run continuously in the background to show "this draft would be accepted" while people edit.
4. Send the PATCH with the live doc's `resourceVersion`, the commit message and the co-authors (from the draft's history, for the changed fields only).
5. On success, the watch brings the new state into the live doc, it merges into the draft, and the committed fields turn clean.
6. On 409, someone committed or changed something in between. The watch will deliver that change, it merges into the draft like any other, and you commit again. Because the draft already follows the cluster live, this should only happen in a small race window.

**Who sends the PATCH:** the browser of the person who commits, with their own token. Then Kubernetes RBAC and the audit log see the real committer, and the bridge doesn't need write access to the cluster at all.

**Patch format:** JSON merge patch is the simplest, but it replaces whole lists. Server-side apply is more precise and gives field ownership, but releasing fields you removed is subtle. Start with merge patch plus `resourceVersion`; revisit if lists hurt.

## Mapping a CRD onto a CRDT

The CRD's schema already contains most of the merge rules, because server-side apply needs them too:

| Schema says | CRDT shape | Why |
| --- | --- | --- |
| scalar (`string`, `integer`, `boolean`) | single value (last-writer register, conflicts kept) | A price or a flag is one decision, not something to combine |
| long free text, e.g. a description | text CRDT | Two people editing different sentences should both win |
| `x-kubernetes-list-type: map` with `listMapKeys` | map keyed by the list key | Prevents the same menu item appearing twice after a merge |
| `x-kubernetes-list-type: set` | set | Concurrent adds of the same value collapse into one |
| `x-kubernetes-list-type: atomic` | single value | The list is one decision as a whole |
| `x-kubernetes-map-type: atomic` | single value | Same, for objects |

Two traps:

- **A merge can still produce nonsense.** Two valid edits can combine into an invalid draft ("at most 3 specials": two people each add a fourth). Validate the draft continuously against the OpenAPI schema in the browser, show the dry-run result, and let the server be the final judge on commit.
- **Counters are rarely what you want for settings.** The CRDT counter is a great example to *explain* CRDTs, but a price is not a counter: two people adding €0.10 should not make it €0.20 more. Use registers by default.

## Permissions

The draft needs its own access rules, and it would be nice if they came from Kubernetes RBAC instead of a second permission system.

- RBAC verbs are free-form strings, and a `SubjectAccessReview` can check any verb **(verify)**. So you could grant a custom verb like `propose` on `coffeeconfigs`, and have the draft server check it.
- That gives a clean split:
  - `get` + `watch`: may see the live resource.
  - `propose`: may edit the shared draft.
  - `patch`: may commit.
- That split *is* the autonomy/oversight slider: everyone may propose, only the barista lead may commit.

Watch out for drafts leaking what the cluster hides: if someone loses `get` on the resource, they should lose the draft too. And never put `Secret`s or secret-like fields in a shared draft.

## The CRDT server

This needs a component that isn't Kubernetes: etcd is not built for a high write rate of small edits (the "etcd is not your database" point from the talk).

- **What it stores:** per resource, a live doc and one or more draft docs. Small: a few kilobytes plus history.
- **Building blocks:** Automerge Repo has a sync server and storage adapters; Yjs has y-websocket and hosted options. Both fan out changes to all connected browsers.
- **The bridge:** watches the cluster with read-only access and keeps the live docs current. It can live inside the same server.
- **Lifecycle:** create a draft on the first edit; mark it clean after a commit when everything matches live; delete it after a while if nobody touches it. Multiple drafts per resource are real branches. Start with one.
- **Auth:** the same OIDC token the browser uses for the Kubernetes API, checked with `SubjectAccessReview`.

## How it fits the "it depends" scale

The coffee app example, per setting:

| Setting | Path | Why |
| --- | --- | --- |
| Menu text | Shared draft, auto-commit after a quiet moment | Speed matters, mistakes are cheap |
| Price | Shared draft, explicit commit by the barista lead | The group prepares it, one person decides |
| Payment provider | No shared draft, pull request with security review | Rare, high-risk, needs oversight |

So the shared draft is the pre-branch for the frequent, medium-risk changes. The git review path stays for the rare, high-risk ones. Both end in the same resource and the same history.

## Prior art to look at

- **Figma**: multiplayer editing on the canvas, then *publish* a library with a description. The closest product to "edit together, commit deliberately".
- **Google Docs suggestion mode**: proposals with authors that someone accepts.
- **Ink & Switch, Patchwork**: research on branches, diffs and review on top of Automerge. Probably the closest technical prior art. **(verify: current status and what's published)**
- **git**: main vs feature branch, merging main into the branch to stay current. The two-document model is exactly this.
- **Kubernetes server-side apply and dry run**: field ownership and "would this be accepted?" without writing.

## Open questions

- **Large crowds:** how does a CRDT relay handle 200 phones editing one small document at the same moment? Probably fine for Automerge/Yjs, but measure it.
- **Schema changes:** what happens to an open draft when the CRD gets a new version?
- **Deleting the resource** while a draft is open: keep the draft as a proposal to recreate it, or close it?
- **Who appears as co-author:** everyone who touched a committed field, or only the author of the winning value?
- **Offline:** CRDTs make offline editing possible. Do we want that for configuration, or is "you need to be online to propose" simpler and safer?
- **Is this krm-stream, or a separate project?** krm-stream owns sync and the single-user draft. Shared drafts look like a layer on top that replaces the local draft with a CRDT draft.

## Smallest experiment

1. One resource, one draft, Automerge Repo sync server, no permissions yet.
2. Bridge: watch → live doc → merge into draft.
3. UI: per-field clean / proposed / conflict, with authors.
4. Commit button: merge patch + `resourceVersion` + message + co-authors.
5. Try it with three browsers and a `kubectl edit` in a terminal. If the conflict between a browser edit and the `kubectl` edit shows up with both authors, the core idea works.

## In the talk

Not a feature, just a closing tease in the 42–45 section: "Today a conflict gives you a 409. What if the room built the draft together, and only the decision went through review?" It fits the "tell me where I'm wrong" invitation, and it's a real question for the local-first people in the room: most sync engines have no commit step at all.
