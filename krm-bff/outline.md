# Be BFFs with the Kubernetes API — outline

Frontmania 2026 · Mission 2 · Wed 11:00–11:45 (45 min)

## The line in one sentence

Frontenders build settings screens all the time. The Kubernetes API gives those screens a foundation with schemas, live updates, conflict detection, access control and history, as long as you're honest about where it stops.

## Running devices

- **Weird / brilliant / dangerous vote** after every feature, on the audience's phones. The scoreboard comes back in the conclusion.
- **Network tab.** Every concept is shown in the browser first, and in YAML second (if at all).
- **The idiotic parts get called out right away**, not hidden until the Q&A.

## 0–4 · Chaos (hook)

- QR code on screen. Everyone gets admin rights in the coffee app. Go.
- First interaction is a poll: "Have you ever typed `kubectl`?" Use the result to decide how deep to go.
- Let the room change the shop live for a minute. It should get messy.

## 4–9 · Settings matter (the frame)

- "Who here has built a settings page?" Every hand goes up.
- **Audience question on their phones:** "Name an app with a really good configuration experience." Free-text answers stream onto the screen live (a word cloud, which is also a sneak preview of watch). Apple counts, of course. Come back to the answers in the closing: what do the winners have in common?
- Before you can build that screen, you have to decide:
  - Which concepts exist, and what are they called?
  - Which combinations make sense, and which do you reject?
  - Who owns a setting, and who may change it?
  - What does a change mean for an app that is already running?
  - How does all of this evolve as the code changes?
- The screen is where users run into all that work. The backend usually gives you a boring REST endpoint and nothing else.
- Boundary to state early: better foundations take care of validation, access, history and concurrency. **You still design what the configuration means.**

## 9–12 · What just happened? (the reveal)

- Open devtools → network tab. It's a `fetch` plus a long-lived watch stream of JSON.
- Reveal: this is the Kubernetes API.
- One slide: cross out pods, nodes, containers and scheduling until only the API server is left. "No pods were harmed in this demo."
- "YAML is just JSON that's afraid of curly braces. The API speaks JSON."

## 12–24 · Four ideas, each one tied to something you already know

Each idea gets about 3 minutes: concept → analogy → live in the demo → vote.

1. **Define a type, get an API** (CRD ≈ Prisma/OpenAPI codegen, validation ≈ Zod enforced on the server)
   Show the `CoffeeConfig` CRD → an endpoint exists instantly → send something invalid → rejected → generated TS types.
2. **Desired state** (≈ React: `UI = f(state)`, the reconciler even shares the name)
   spec = what you asked for, status = what actually happened (≈ optimistic UI vs server-confirmed). The frontend writes spec, the backend writes status: clean ownership.
3. **Watch** (≈ Firebase/Supabase realtime, but standardized, with schemas and auth)
   Network tab streaming while the room edits.
4. **Optimistic concurrency** (`resourceVersion` ≈ ETag / `If-Match` → `409 Conflict`)
   Sets up the next section.

Rule: no fifth idea. Labels, finalizers, admission webhooks etc. go to the Q&A or a backup slide.

## 24–31 · Conflict and control (the memorable part)

- **Conflict demo:** split the room in two and have both halves change the same field. One side gets a 409. Show how the UI handles it: what makes this useful rather than just cool.
- **RBAC demo:** revoke the whole room's admin rights live. "Who may change *what*", not just who may log in.

## 31–36 · The idiotic parts, scored honestly

Go through them one by one; each gets a vote.

- **etcd is not your database.** Objects are capped around 1.5 MB, there are no joins, querying is weak. Control-plane data (menus, settings, flags, tenant config): yes. Data-plane data (orders, events, logs): no.
  - Prepare for "so the coffee orders are in etcd?" — the abstract says *ordering* demo.
- **Browser → API server:** end-user auth (OIDC, not cookie sessions), CORS, rate limiting. A dedicated API server, never your production cluster.
- **Operating cost and skills:** someone has to run it, and someone on the team needs Kubernetes knowledge.
- **It's on the edge:** a lot is still missing; say what you had to build yourself.
- Why do it anyway: high-quality open source, modern standards, and an API model that platform engineers have tested at huge scale.

## 36–39 · Payoff: every change is a document

- Because every change is a declarative document with an author, you can stream it into git.
- Show the commits the audience just produced: who did what, and when.
- Next step: review those changes and promote them to production.
- One beat, not a section. Link to reversegitops.dev.
- Bridge: "So should every change go through review? That depends on who you ask."

## 39–42 · The "it depends" scale

- Visual: the "it depends" scale, four sliders plus a cost meter (see "The \"it depends\" scale visual" below).
- Different people in the organization push the sliders in different directions:
  - **Security officer:** oversight and safety.
  - **Architect:** central standards, strict schemas.
  - **Product manager:** simplicity for users, speed for experiments.
  - **Big enterprise:** safety and oversight, with an audit trail for everything.
  - **Team validating an idea:** speed, freedom, autonomy. Ship today, learn tomorrow.
- Nobody is wrong. Each of them answers a different question.
- The key point: **the position is per setting, not per company.** In the coffee app, the menu text can go live directly, a price change gets a review, and the payment provider needs security sign-off.
- The Kubernetes API is just my model for this, and the bigger idea is to think about these axes. But this is where KRM shines: you move a slider by changing configuration, not by rewriting the app. Direct write + watch (speed), validation rules (strictness), RBAC (oversight), and a git review path (safety) all work on the same resource.
- **Then the honest part: implementation cost.** Moving any slider towards safety, oversight, simplicity or central standards costs engineering time. And settings, permissions and audit logs never win the prioritization against features customers pay for.
  - So most teams don't *choose* their position on the scale. Their budget chooses it for them, and they end up on the left by default.
  - That is the real argument for commodity plumbing: if the foundation is cheaper, teams can afford the position they actually want.
  - Be honest that KRM *moves* the cost (operations, skills, see the idiotic parts) instead of removing it.
- Optional interaction (instead of one weird/brilliant/dangerous vote): "Changing the coffee price: live, or reviewed first?" Show the split in the room.

## 42–45 · When (not) to use it, and what's next

- **When it fits:** platform teams building self-service; companies already on Kubernetes; config-heavy products. Backenders and architects need to be on board, not only an enthusiastic frontend team.
- **When it doesn't:** transactional data, teams without Kubernetes skills or support, high-volume user data.
- **Run it yourself:** one-command repo (QR code).
- **Closing:** revisit the audience's "good configuration experience" answers, then show the final weird/brilliant/dangerous scoreboard → configdeservesbetter.dev → "Configuration deserves deliberate design. Developers deserve better tools to build it."
- Managed version: one line, last slide at most.

## The "it depends" scale visual

Text sketch, to be designed properly later:

```
                 SPEED ●────────○──────── SAFETY          live change  ↔  tested & reviewed first
               FREEDOM ●──────────────○── SIMPLICITY      many settings ↔  few, opinionated settings
              AUTONOMY ○──●────────────── OVERSIGHT       anyone may change ↔ approvals & least privilege
                 LOCAL ●───────────○───── CENTRAL         team decides  ↔  one platform standard

  presets:  [ Team validating an idea ]  [ Product manager ]  [ Architect ]  [ Security officer ]  [ Enterprise ]

    IMPLEMENTATION COST  ▓▓▓▓▓▓▓▓▓░░░░░░░░░░░  "can we afford this next to the paying features?"
```

- Click a preset → the sliders move. Clicking presets one after another shows how far apart the roles are.
- Second step: replace the presets with three coffee-app settings (menu text, price, payment provider) and show that the sliders move *within one product*.
- Third step: the cost meter. Every slider moved to the right fills the meter. Show it twice, "build it all yourself" vs "on a shared foundation", and let the meter fill more slowly the second time. Cost is not a fifth slider: it is the price of every position on the other four.
- Each axis maps to manifesto principles: speed/safety → 4 and 10, freedom/simplicity → 2, autonomy/oversight → 9, local/central → 8.
- Could be a live web page using the same API: the sliders themselves are a watched resource.

## Where this sits in the frontend world (visual)

What I'm building with krm-stream is a **sync engine**: a scoped local replica that stays live, with conflict-aware local editing. The one difference from most sync engines is that a draft is not yet a write. Save is a deliberate step.

Three layers:

| Layer | Job | KRM / krm-stream | Frontend world |
| --- | --- | --- | --- |
| **Sync** | Keep an authorized, scoped local replica current | list + watch, `resourceVersion`, label/namespace scope. Same pattern as client-go informers | Zero, ElectricSQL, PowerSync, Firebase/Supabase realtime |
| **Edit** | Hold drafts, merge incoming changes, show conflicts | krm-stream store: live object + local draft | TanStack DB, Pinia, Automerge/Yjs, form libraries |
| **Submit** | Send a versioned change and track the outcome | PATCH with `resourceVersion` → 200 or 409. `status` reports what actually happened | Zero mutators, TanStack DB mutation handlers, plain `fetch` |

Per project (my understanding, which is exactly what I want the room to correct):

| Project | What it is | Overlap with krm-stream | Key difference | Relation |
| --- | --- | --- | --- | --- |
| **client-go informers** | Kubernetes' own list + watch + local cache | The same pattern | Go, server-side | The origin: krm-stream is an informer for the browser |
| **TanStack Query / SWR** | Server-state cache | What most of the room uses today. Can hold the watch stream's state | Refetches by default. No drafts, no conflicts, no watch resume logic | Integration target, and the baseline the audience knows |
| **Pinia** | Vue's official reactive store | Holds the local state | No sync, no server, no conflicts | Integration target: krm-stream fills it |
| **TanStack DB** | Reactive client collections, live queries, optimistic mutations | Local replica plus optimistic writes | The sync source is pluggable; it doesn't own the backend | Integration target: a "KRM collection"? |
| **Zero** (Rocicorp) | Sync engine on Postgres, queries run locally | Architectural peer | Local writes sync in the background instead of an explicit Save | Peer |
| **ElectricSQL** | Read-path sync of Postgres "shapes" | Shapes ≈ namespace + label selector | Writes go through your own API | Peer, closest to the read side |
| **Automerge / Yjs** | CRDTs for local-first apps | Local edits that get merged | Merges automatically: no 409, no authoritative server | Contrast: the opposite choice on conflicts |
| **Firebase / Supabase realtime** | Hosted realtime data | Live updates | Proprietary or database-shaped; no schema-first API like a CRD | Already the analogy for watch |

- The sharpest contrast for the talk: **CRDTs merge, KRM refuses (409) and asks a human.** For configuration, refusing is often the right call.
- Where it fits: backup slide, or the 42–45 "what's next" section. Not a fifth idea.
- Make it an invitation: "This is how I think it maps. Tell me where I'm wrong" + QR code to a GitHub discussion on krm-stream.
- Background and terms: [sync-engines-background.md](sync-engines-background.md).

## Open questions

- Timing is now tight: the "it depends" scale took 3 minutes from the other sections. If rehearsal runs long, cut the "desired state" idea or one of the idiotic parts.
- Too many interactions? Poll, word cloud, votes, conflict, RBAC, and now the price question. Maybe drop some of the weird/brilliant/dangerous votes.

- How many people will actually join from their phones? Plan B if the Wi-Fi fails: a pre-recorded stream, or a second device of your own.
- Conflict demo: how do you make sure two halves of the room really hit the same field within a second? Maybe trigger it with a countdown.
- RBAC revoke: does the UI degrade gracefully (read-only mode), or does it break? Either one makes a point, but choose deliberately.
- Name the custom resource in the talk: is `CoffeeConfig` clear enough for this audience?
