# Learning note: bidirectional GitOps, promotion, WET vs DRY

Prompted by Artem Lajko and Koray Oksay's [The Evolution of GitOps in Platform Engineering](evolution-of-gitops-lajko-oksay.md). Artem gives the same talk at Øredev, Thu 5 Nov 13:55, an hour before my config talk.

## 1. "Bidirectional GitOps" vs Reverse GitOps

Artem uses "bidirectional GitOps" for tools like Kargo: you click "promote" in a UI and a controller commits to Git. On stage he says it "writes back from your cluster to Git", but that is loose. Kargo runs in the cluster, but what it writes is **new desired state**, not the state the cluster is in.

| | Where changes are written | What Git is | Flow |
|---|---|---|---|
| Classic GitOps | Git | the source of intent | human → Git → cluster |
| Flux image automation | Git, by a controller, when a new tag matches a policy | still the source of intent | registry → controller → Git → cluster |
| Argo CD Image Updater | Git (`git` write-back) or the Application object (`argocd` write-back) | the source of intent, *unless* write-back goes to the Application, which bypasses Git | registry → controller → Git or Application → cluster |
| Kargo ("bidirectional") | Git, also by a controller | still the source of intent; the UI is a Git client | UI → controller → Git → cluster |
| Reverse GitOps (mine) | the Kubernetes API of a small, data-only editing cluster | the record of decisions, and the input to delivery | UI → API → Git → delivery |

The image updaters are the simplest form of "a controller commits to Git": one artifact type (an image tag), one trigger (a new tag in the registry), no stages and no verification.

- **Flux:** `ImageRepository` scans the registry, `ImagePolicy` picks the tag (semver, regex, alphabetical), and `ImageUpdateAutomation` rewrites the YAML fields marked with `# {"$imagepolicy": "<ns>:<name>"}` comments, then commits and pushes.
- **Argo CD Image Updater:** the same idea, but with two write-back modes. The `argocd` mode changes the Application's parameters through the Kubernetes API, and the change never reaches Git. That is precisely the kind of change made through the API that Reverse GitOps would record.

Docs: [Flux image update guide](https://fluxcd.io/flux/guides/image-update/) and [Argo CD Image Updater update methods](https://argocd-image-updater.readthedocs.io/en/stable/basics/update-methods/).

Kargo generalizes this: several artifacts bundled into Freight, a pipeline of Stages, and verification between them.

The hallway version: **Kargo turns the UI into a Git client. Reverse GitOps turns Git into the record of the API.**

On naming, I'm keeping *Reverse GitOps* ("The API Comes First, Git Remembers"). "Synced GitOps" clashes with Argo CD's Synced/OutOfSync status, and "API folder editor" sounds like a feature. At Øredev I can use Artem's term as a bridge: "Artem called this bidirectional GitOps. Here's the version where the API is the front door."

## 2. Promotion

### Kargo's model, a good map of the problem

Source: [Kargo core concepts](https://docs.kargo.io/user-guide/core-concepts/).

- **Warehouse:** watches sources (image registries, Git repos, Helm repos) and produces Freight when something new appears.
- **Freight:** a versioned bundle of *exact* artifact references, for example image X at digest Y plus chart Z at version W. This is the unit that gets promoted. It is not a diff and not a branch.
- **Stage:** an environment (dev, staging, prod). It says which Freight it accepts and from which upstream Stage, which gives you a pipeline.
- **Promotion:** moving a Freight into a Stage by running that Stage's steps: clone, update the image tag or Helm values, commit, push, tell Argo CD to sync. See the [promotion steps reference](https://docs.kargo.io/user-guide/reference-docs/promotion-steps).
- **Verification:** checks after a promotion that decide whether the Freight may move on to the next Stage.
- **Auto-promotion:** set per Stage, for example "always take the newest verified Freight".

The key idea to take away: **promote a pinned set of artifacts, not "whatever is on the branch".**

### Where promotion happens

| Approach | How | Upside | Downside |
|---|---|---|---|
| Branch per environment | `dev`, `staging`, `prod` branches; promote by merging | Familiar to developers | Merges carry unrelated changes, branches drift, history is hard to read. The classic anti-pattern |
| Folder per environment | one branch; `envs/dev`, `envs/prod` overlays; promote by copying values between folders | Simple, trunk-based, easy to diff | Many values files at scale (Artem's sprawl), and the final manifests are still hidden behind templates |
| Rendered branches | a controller renders each environment and commits the plain YAML to an environment branch | You see exactly what will be applied | Needs a render step, and the branches are machine-owned |
| OCI artifact tags | package the config as an OCI artifact, promote by moving a tag or digest reference | Immutable, signable, same tooling as images | Less familiar, harder for humans to browse, needs registry tooling |

Background on the first two: Kostis Kapelonis, [Stop Using Branches for Deploying to Different GitOps Environments](https://codefresh.io/blog/stop-using-branches-deploying-different-gitops-environments/) and [How to Model Your GitOps Environments](https://codefresh.io/blog/how-to-model-your-gitops-environments-and-promote-releases-between-them/).

My config talk argues for the last row: config becomes an artifact that is tested, packaged, signed and promoted, the same way an image is. Kargo's Freight is a useful word for the "pinned set of artifacts".

## 3. WET vs DRY

- **DRY ("don't repeat yourself"):** templates plus values, as with Helm charts and Kustomize overlays. There is little duplication. But the final manifests only exist after rendering, so reviewers, auditors and AI tools see the recipe, not the result. This is Artem's "you don't know what comes out".
- **WET:** store every variant fully rendered, as plain manifests per environment. Diffs are obvious, it's easy to scan, sign and query, and it is what the CRA and AI tools need. The cost is duplication and the question of how to change 200 copies at once.
  - Artem expands WET as "write everything twice". ConfigHub's Brian Grant uses **"Write Every Time"**: every variant is stored in its native, fully rendered form.

### The middle ground: rendered manifests

Keep DRY sources for humans, and let a machine commit the WET output that gets deployed.

- [The Rendered Manifests Pattern](https://akuity.io/blog/the-rendered-manifests-pattern) (Akuity): render in CI or at promotion time, commit plain YAML, and let Argo CD or Flux sync only that. Implemented in [kargo-render](https://github.com/akuity/kargo-render).
- [Argo CD Source Hydrator](https://argo-cd.readthedocs.io/en/stable/user-guide/source-hydrator/): built into Argo CD. On an Application, `spec.sourceHydrator` has a `drySource` and a `syncSource`, and Argo CD commits hydrated manifests to the sync branch before syncing. It can push to a staging branch (`hydrateTo`), but it does not promote from there to the sync branch for you. That is left to a PR or a tool like Kargo.
  - Check for my talk: the 3.0 docs list no commit signing and no signature verification for the hydrator. Re-check the current release before saying this on stage.

### Going further: configuration as data

WET is the primary form, and code operates on it.

- **ConfigHub** (Brian Grant, ex-Kubernetes lead architect; Alexis Richardson): fully rendered config stored in a database, with variants managed as data and queryable ("where-data"). See [Introducing ConfigHub](https://itnext.io/introducing-confighub-b127736641c5) and The New Stack's [Tech Veterans' New Approach to Eliminate Configuration Hell](https://thenewstack.io/tech-veterans-new-approach-to-eliminate-configuration-hell/).
- **kpt** (Google): packages of plain KRM manipulated by functions, never by templates. See [The Rationale behind kpt](https://kpt.dev/guides/rationale).

## 4. How this connects to my talks

### My framing: a small, data-only cluster as the editing backend

I run a **small cluster that holds only data**: CRDs, their schemas, RBAC, and the controllers that validate and record changes. No workloads run there. It is where configuration gets *edited*. It is not where it gets *delivered*.

- **What it is not:** a way to bolt GitOps onto the big infrastructure clusters and get a full-fledged GitOps system for free. That would not work, and it is not the goal. Delivery to those clusters stays with the existing pipelines and GitOps tooling (Argo CD, Flux, Kargo, rendered branches, OCI).
- **What it is:** a great backend for **typed configuration values**. The schema validates them, RBAC guards them, watches propagate them live, and history is recorded in Git. The people editing them never need to know Git or YAML; they use a form, a CLI or an API.
- **Where it sits in the flow:** before delivery. The editing cluster turns validated intent into concrete WET config. Git (or an OCI artifact) is the handover point. From there it is promoted like any other artifact.

This also answers the obvious question at both talks, "so you run your config in production Kubernetes?": no. The Kubernetes API is borrowed as a control-plane toolkit in a cluster of its own.

### Per talk

- **Config talk:** my approach is *WET output with the DRY part moved into the API*. Intent is captured once, validated by a schema, and rendered into concrete config that is packaged, signed and promoted. That puts me on Artem's side of "AI and the CRA need plain data", with a different answer to where the templates live: in an API and a controller, not in values files.
- **Kubernetes talk:** CRDs plus controllers are already "code operating on data", which is close to the kpt and ConfigHub line of thinking. The API server is the database, with a schema, RBAC and watches.
- **Reverse GitOps:** Git holds the WET record of what was decided through the editing cluster's API. Promotion of that record can then use the same tools as everyone else (Kargo, rendered branches, OCI).

## 5. Open questions to dig into

- Does Kargo work with Freight that is an OCI config artifact rather than an image? Its Warehouse supports Git, image and chart subscriptions; check whether a generic OCI artifact fits.
- Rendered branches or OCI tags for config: which is easier to sign and verify end to end?
- How does ConfigHub change 200 WET variants at once? Their variants post explains it; read it.
- Where does the Source Hydrator sit next to Reverse GitOps? Both have a machine committing to Git. Could they share conventions (paths, commit trailers)?
- Ask Artem at Øredev: what he means exactly by "bidirectional", and whether he has seen API-first setups.
