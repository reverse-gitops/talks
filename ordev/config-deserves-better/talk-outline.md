# Talk outline: Configuration Deserves a Software Delivery Process Too

Øredev, Thu 5 Nov, 14:55, Stamp, 40 minutes. This combines [structure.md](structure.md) with the
[abstract](../one/readme-config-deserves-process.md). Minutes add up to 38, which leaves 2 for questions.

**The one sentence:** package what the user configured into an image, so the desired state is one
complete, versioned thing you can point at, and promote it the way you promote code.

**The deck:** [slides.md](slides.md) follows this order, opens and closes with the TLDR slide, and ends on the closing ask.

**On "slowing down":** the goal in structure.md is to slow down configuration changes. Nobody in the
room wants slower changes, and the Cloudflare story wants a faster way back. Suggested wording:
*the settings screen stays fast; the road from "saved" to "live in production" gets longer, and the
road back gets shorter.*

## The talk

### 1. You just changed a setting (0–7)

- Title slide with the chairs. "You've all just changed a setting. Remember that."
- `infra + config + code = production`, one still slide. This is the place for my personal frustration: who did
  it? How do I roll it back? Why?
- The failing API key: nothing crashes and every email bounces. Who did it? Can we go back?
- Christine Pinto's talk yesterday: "we don't need to test that". Configuration is where we say that most.
- My own Cloudflare DNS change. Yes, a better runbook would have helped. But why is there no button
  to revert the last 10 minutes when I'm panicking?
- Which configuration: infra, environment-specific values and connection strings stay as you are used to. This talk
  is end-user self-service. Transaction data: let's agree not to talk about that today.
- **Slides:** `title`, `about`, `equation`, `which-config`, `problem`. **New:** Cloudflare, with the Pinto reference.

### 2. The reveal, part one: your commits (7–10)

- Reveal the seat map, then the commits with people's names and messages. Someone changes a colour live.
- No Kubernetes yet. The log leaves out the bot batches, so the wow is people's own words.
- "Every person who made a change is in here, and you never saw Git."
- The turn: "This is an audit log. Recorded afterwards is a different guarantee than approved
  beforehand. It's a good start, but it isn't delivery yet."
- **Slides:** `seats`, `commits`.

### 3. How we already do this for code (10–14)

- First the picture everyone recognises: Git → CI → artifact in a registry → CD → environments.
- A word on promoting: we build once, and we move the same thing through test and production.
- A word on ingredients: "I don't know your system. As a good consultant once said: it all depends."
- Then the picture with configuration externalised, sitting beside the code as its own stream.
- The registry stores artifacts of any kind, and it is sitting right below our configuration.
- The question for the rest of the talk: what does that take, and is it worth it?
- First the code lane, then configuration in the same picture: new version, test, then production, twice.
- **Slides:** `externalized`.

### 4. Model it as files, then the reveal, part two (14–20)

- To reuse all of this, configuration has to become text files. "Oef, that's two steps back, isn't it?"
- "Oh dear, what is he proposing? How do we let people change that?" We split edits from using.
- Not a script: a description of what it should be. The desired state, a specification.
- Store only the desired state, in several files that reference each other. Secret values get a special place.
- We have plenty of good formats: INI, XML, JSON, YAML, and also the pictures people upload as an avatar.
  So why not store them in an artifact?
- The jump: for the structured ones I picked one shape, KRM. Only mention it.
- The twist: the room's own answers to the GitOps question at the door. You already know these files.
- "YAML is just JSON that is afraid of curly braces." The real chairs in the terminal, and throw `yq` at them.
- **Slides:** `desired-state`, `formats`, `krm`, `gitops-people`, `chairs`.

### 5. From API to Git, and the Kubernetes disclaimer (20–21:30)

- We still want a nice settings screen, and an API that gives AI tools fast answers: validated intent.
- gitops-reverser lets you edit a folder of files through an API. Users don't see Git, and you get the audit log.
- This is the boundary from the abstract: **authoring** ends here and **delivery** starts.
- There is a Kubernetes API behind this, and that magic stays for tomorrow. Two important things: don't dismiss
  this if you dislike Kubernetes, the idea stands, because you can push a representation as an artifact. And be
  explicit about the process around it.
- **Slides:** `api-to-git`, `kubernetes-tomorrow`.

### 6. The main point: package it (21–29)

This is the part to spend time on.

- Any file can go in: YAML, XML, INI, JPG. Your app doesn't have to change its format.
- The image holds **the complete model of the desired state as the end user configured it**.
- **It gives you a clear place to point at.** "What is production running?" has a one-line answer: this digest.
- Same files, same digest. It holds no base image or shell, and nothing in it executes.
- Sideload it next to the app with an image volume. New settings mean new pods replacing old pods, so the
  rolling update protects you: if the new pods don't get ready, the old ones keep serving.
- **Demo:** see below. The wait for the image is when `delivery` explains the mechanism.
- **Slides:** `package`, `coffee`, `delivery`, `coffee-image`. `delivery` keeps Alice's fictional shop on
  purpose: it closes the opening story, and the demo right after it shows the real thing.

### 7. Promote it (29–32)

- The same digest moves through environments: test first, then production when someone agrees.
- This is where "slowing down" happens, and this is where review lives.
- Going back means pointing at the previous digest. That is the Cloudflare button from section 1.
- **New slide:** promotion picture. It is a slide unless the second environment gets built (see "Before going on stage").

### 8. Secrets, one minute (32–33)

- A registry is not a secret store. In Git and in the image, a secret is ciphertext.
- It is opened very late, in the pod's memory, using the workload's own identity.
- "Git, CI and the registry only see ciphertext. The API key from the start now has a version too."
- The secret word in the demo already showed this, so don't walk through it again. If someone wants more,
  it's a hallway conversation. Don't claim nobody can read it: the files have two recipients, and one is yours.

### 9. Loose ends (33–36)

See the slide content below. Say this plainly: **none of these parts are easy.**

### 10. Is it worth it? (36–38)

- Honest answer: not for everything. Orders stay in the database. Settings that change every minute or per
  tenant probably don't belong here either.
- Worth it when a bad change can take production down, and you can't answer who, what, when and how to go back.
- Take-aways:
  1. Treat configuration as a delivery problem, not only a storage problem.
  2. Separate authoring from delivery. Direct mutation of what's deployed is the wrong default.
  3. Your registry can already hold this. Try it with one folder.
- Pointer: this uses Kubernetes, but only for its API and for writing back to Git. Tomorrow's talk,
  *(Ab)using the Kubernetes API as a Configuration Backend*, asks if that is contrarian, and if there's a
  chance it's right. That also circles back to Wednesday's Neo4j keynote.
- **Slides:** `closing`, maybe `pros-cons`.

## Demo

Four moves. The word in move 3 takes a while, so the talk carries on during it.

| # | Show | Point |
|---|---|---|
| 1 | A chair colour → commit in `k8s-trail`, with the person's name and message | A change has an author and a reason |
| 2 | The chair files in the same repo, through `yq`, also as JSON | They are plain files you can throw tools at |
| 3 | A secret word, typed by you or someone in the room → commit in `coffee-settings` → workflow → image | The commit becomes an image, and the word is ciphertext all the way |
| 4 | The commit, the ciphertext, the files in the image, the digest in the Deployment, then the word on the page | One complete thing, one place to point at |

The commands are in [commits.yaml](pages/demo-scripts/commits.yaml), [chairs.yaml](pages/demo-scripts/chairs.yaml)
and [coffee-image.yaml](pages/demo-scripts/coffee-image.yaml). `git pull` aside they only read, and they never
print a decrypted value.

**Chairs and image are two different repos.** Seats go to `k8s-trail`, which publishes nothing. Only
`coffee-settings` becomes an image. Say out loud: "same mechanism, different folder", so nobody expects the
chair colours to appear in the image.

**Safety net:** keep a finished result ready in case the word hasn't arrived or the network fails.

## The real chain

| Step | Tool | On the slide |
|---|---|---|
| Change through the API, commit in Git | [GitOps Reverser](https://github.com/ConfigButler/gitops-reverser) | `commits`, `chairs`, `api-to-git` |
| Build and push the image from CI | GitHub Actions with [settings-image](https://github.com/ConfigButler/settings-image), logging in with the run's OIDC token | `package`, `delivery`, `coffee-image` |
| Registry | [zot](https://zotregistry.dev), which tells Flux about each push | `externalized`, `delivery` |
| Keep watching the registry, commit the digest to the GitOps repo (`ConfigButler/k8s`), and apply it | [Flux image automation](https://fluxcd.io/flux/components/image/) | `delivery`, `coffee-image`, `promote` |
| Mount it | A Kubernetes image volume | `delivery` |
| Secrets | [SOPS](https://getsops.io), [age](https://age-encryption.org), [OpenBao](https://openbao.org) | `secrets` |
| Promotion | [Kargo](https://kargo.akuity.io) is installed on the cluster but not set up, so only the notes mention it as an option | `promote` |

## Slide: Loose ends

Title: **What I haven't solved**

1. **Different values per environment.** Promoting the same digest and having different values pull against
   each other. One image per overlay means you no longer promote the same thing. Values from outside mean the
   model is no longer complete. All environments in one image, with the pod picking a folder, means test can
   see production's values. No option is clean.
2. **Testing it as a whole.** One file can be checked. Does this configuration work with this version of the
   code and this infra? That needs a real environment and a candidate digest.
3. **Code and config moving apart.** Two streams with two versions, so which combinations are valid?
4. **Going back when the API disagrees.** If I roll back the image, the object behind the settings screen
   still holds the new value. The next save may bring it straight back. Which one is the truth?
5. **Secrets over time.** Rolling back to a key you already revoked doesn't help. And names stay readable.

Closing line: "These are hard questions. With a settings table you often can't even ask them, because there is
no version to point at. We have to find a way to improve this, and I think this is an important ingredient."

Spoken only, if there is time:

- A settings change means a rollout, which takes minutes and restarts pods.
- A panic rollback needs a practised path.
- The pull request step between "recorded" and "approved" isn't built yet.

## What we promised, and where it is delivered

| Abstract | Where | Status |
|---|---|---|
| Lives in databases, admin screens, no review, mixed with secrets | §1 | Covered |
| A delivery problem, not just storage | §3, §10 | Covered |
| Capture validated intent through an API | §5 | Covered: schema and admission |
| Turn it into concrete configuration | §5 | Live |
| **Tested** | §9 | **Weakest.** Build checks and the readiness gate only. Whole-system testing is a loose end, so say that |
| Packaged | §6 | Live |
| Versioned | §6 | Live: commit and digest |
| **Signed** | §5, §6 | **Half.** The commits are signed. The image's provenance is an unsigned claim. Say so: `cosign` is the standard next step |
| **Promoted through environments** | §7 | **Slide only today.** One consumer on the cluster |
| Where Git still fits | §2, §5 | Covered |
| Why OCI is a useful packaging boundary | §3, §6 | Live |
| Separating authoring from delivery | §5 | Covered |
| Practical ideas and trade-offs | §9, §10 | Covered |
| Direct mutation is the wrong default | §1, §10 | Covered |

## Before going on stage

- [ ] **Decide on promotion.** Either state plainly that it's a picture, or add a second Deployment pinned to
      an older digest and bump it by hand on stage. The second option is small and delivers the promise.
- [ ] **Add non-YAML files, or say it's a picture.** The real image holds only three YAML files, and the demo
      lists them right after the `package` slide shows XML, INI and JPG. `coffee/.gittargetignore` doesn't list
      `raw/` yet, and the operator refuses files it doesn't manage, so add `raw/` there before committing to
      `coffee/raw/`. `public/images/coffee-raw.jpg` would be a nice one. The limit is 10 MiB.
- [ ] **Don't use `kubectl rollout undo` as the rollback.** The Deployment is managed by Flux, so I expect the
      next reconcile to put it back. Not tested. Rehearse going back by digest or through Git.
- [ ] **Rehearse the rollback with the API in the loop** (loose end 4), so it can't surprise you on stage.
- [ ] **Warn whoever types the secret word.** It goes in as a coffee key on `/room`, and `/decrypted/` shows it
      publicly. That is on purpose: the coffee keys are made-up values (see `2-gitops/coffee-settings/app.yaml`).
- [ ] **Time the secret word once.** A menu edit took 1 min 32 s from save to new pod (`docs/settings-image-loop.md`
      in `external/k8s`), which should fit the `delivery` slide. A coffee key hasn't been timed.
- [ ] **Check that commits show Verified** on GitHub before claiming "signed".
