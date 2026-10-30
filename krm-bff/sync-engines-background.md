# Sync engines: background and terms

Background for the "Where this sits in the frontend world" section of the outline. This is my working understanding, written down so people who know these projects better can correct it. The things I'm least sure about are marked with **(verify)**.

## The picture in one paragraph

Most web apps fetch data when a screen opens and fetch it again when they think it's stale. A **sync engine** turns that around: the browser keeps a local copy (a *replica*) of the slice of data it needs, a stream keeps that copy current, and the UI reads from the local copy. krm-stream does this for Kubernetes resources: list, then watch. What makes it different from most sync engines is the editing model. A local edit is a **draft**, not a write. Saving is a separate, deliberate step that the server can refuse (409). For configuration, that refusal is a feature.

## Three layers

| Layer | Job | In krm-stream terms |
| --- | --- | --- |
| Sync | Keep an authorized, scoped local replica current | list + watch, `resourceVersion`, namespace/label scope, reconnects, permission changes |
| Edit | Hold drafts, merge incoming changes, show conflicts | live object + local draft, "changed underneath you" detection |
| Submit | Send a versioned change and track the outcome | PATCH with `resourceVersion` → 200 or 409, then `status` for what actually happened |

Most libraries cover one layer, and only a few cover all three. That's the most useful way to compare them.

## How to handle two people changing the same thing

This is the question that separates the projects most clearly. From "the computer decides" to "a human decides":

| Strategy | What happens | Who uses it |
| --- | --- | --- |
| **Last write wins (LWW)** | The later write overwrites the earlier one, silently | Most REST APIs without versioning, many realtime databases by default |
| **CRDT merge** | Both edits are kept and merged by fixed rules, so there is never a conflict to show | Automerge, Yjs |
| **Operational transformation (OT)** | A server transforms concurrent edits so they still make sense together | Google Docs (classic) |
| **Server rebase** | Pending local changes are replayed on top of the new server state | Replicache, Zero |
| **Optimistic concurrency** | The write carries the version it was based on; if that version is outdated, the server rejects it | Kubernetes (`resourceVersion` → 409), HTTP `If-Match` → 412 |
| **Locking** | Only one person can edit at a time | CMSes, old file servers |

For text, merging is great: two people typing in different paragraphs should never see an error. For configuration it's dangerous: two people changing the price of a flat white "merge" into whichever value happened to win, and nobody notices. That's why the talk's line is **CRDTs merge, KRM refuses and asks a human.**

## Terms

### General

- **Sync engine**: A system that keeps a client-side replica of server data current, so the UI reads locally and updates arrive by themselves.
- **Local-first**: A movement (started by Ink & Switch's 2019 essay) arguing that the primary copy of your data should live on your device, with the server as a peer for sync and backup. Sync engines are its plumbing. Note that krm-stream is *not* local-first: the API server stays authoritative.
- **Replica**: A copy of (part of) the data, kept in sync with the source.
- **Server state vs client state**: TanStack Query's framing. Server state is owned by the server and you only have a cached copy of it (the resource). Client state is owned by the browser (the open tab, an unsaved draft). They need different tools, and mixing them is a common source of bugs.
- **Optimistic update**: Showing a change in the UI before the server has confirmed it, and rolling it back if the server refuses.
- **Cache invalidation**: Marking cached data as stale so it gets fetched again. TanStack Query's default way of staying current.
- **Stale-while-revalidate**: Show the cached (possibly old) data immediately, fetch fresh data in the background, then swap. SWR is named after this HTTP caching strategy.
- **Normalized cache**: A cache that stores each object once by ID, so updating it in one place updates it everywhere it appears. Apollo Client does this; TanStack Query doesn't (it caches per query).
- **Draft**: A local, uncommitted edit. Immer uses the same word for the mutable copy you edit before it produces a new state.
- **Intent**: *Why* a change was made ("raise the price for the autumn menu"), not just *what* changed. Useful for review and history; something a submission layer could carry.

### Conflicts

- **CRDT (Conflict-free Replicated Data Type)**: A data structure designed so that copies can be edited independently, even offline, and then merged in any order with the same result every time. That guarantee comes from making the merge operation commutative (order doesn't matter), associative (grouping doesn't matter) and idempotent (merging twice is the same as once). Simple examples:
  - *Grow-only counter*: every replica counts its own increments, and the total is the sum. Merging is taking the max per replica.
  - *LWW register*: a single value with a timestamp; the newest wins.
  - *Observed-remove set*: add and remove items concurrently without losing adds.
  - *Sequence CRDTs*: lists and text where every character has a stable ID, so concurrent inserts land in a predictable order. This is what Yjs and Automerge are mostly used for.

  The price: a CRDT can't refuse. It always produces *a* result, even when that result breaks a business rule ("at most 3 specials on the menu") or isn't what either person meant.
- **Operational transformation (OT)**: The older alternative to CRDTs for collaborative text. It needs a central server to transform operations against each other.
- **Optimistic concurrency**: Don't lock; instead check at write time whether someone else changed the data since you read it. Cheap when conflicts are rare, which they usually are for settings.
- **ETag / `If-Match`**: The HTTP version of optimistic concurrency. The server returns a version tag; you send it back with your write; a mismatch gives `412 Precondition Failed`.

### Kubernetes

- **`resourceVersion`**: An opaque version string on every object. Send it with an update and the API server rejects the write with **409 Conflict** if the object changed in the meantime. Also used as the starting point for a watch.
- **List + watch**: Fetch the current objects (the list returns a `resourceVersion`), then open a watch from that version to receive `ADDED`, `MODIFIED` and `DELETED` events. Starting the watch from the list's version guarantees you don't miss anything in between.
- **Watch list / `sendInitialEvents=true`**: A newer way to do the same in one request. The watch starts by sending the current state as `ADDED` events, then a bookmark that marks "initial state complete", then live changes. This is the "streaming the current state first" behaviour. **(verify: which Kubernetes version enables it by default)**
- **Bookmark**: A watch event that carries only a newer `resourceVersion`, so a client can resume from a recent point after reconnecting.
- **410 Gone**: The `resourceVersion` you want to resume from is too old (history was compacted). The client has to list again. A sync engine has to handle this quietly.
- **Informer / reflector**: client-go's implementation of list + watch + local cache, used by every Kubernetes controller. This is Kubernetes' own sync engine. krm-stream is essentially an informer for the browser.
- **JSON Patch / JSON Merge Patch / strategic merge patch**: Three formats for sending only a change instead of the whole object. Merge patch is the simplest ("here are the fields I'm setting"); JSON Patch is a list of operations; strategic merge patch understands Kubernetes list semantics.
- **Server-side apply / field managers**: The API server tracks which client "owns" which field. If another manager tries to change your field, it gets a conflict unless it forces it. This answers "who owns which setting" at field level, which is a great follow-up to the conflict demo.

### Project-specific

- **Shape** (ElectricSQL): A subscription to a subset of a Postgres table, defined by a table, a `where` clause and columns. Closest equivalent in KRM: resource type + namespace + label selector.
- **Mutator** (Zero, Replicache): A named function that changes data. It runs optimistically in the browser first and then authoritatively on the server, which may produce a different result or reject it.
- **Collection** (TanStack DB): A typed set of objects in the browser, filled by a sync source (TanStack Query, ElectricSQL, …), that you query with live queries.

## The projects

- **client-go informers**: Kubernetes' list + watch + cache in Go. The origin of the pattern krm-stream brings to the browser.
- **TanStack Query** (React, Vue, Solid, Svelte, Angular) and **SWR** (React): Server-state caches keyed by query. By default they stay current by refetching and invalidating, not by streaming. They can hold streamed state just fine, though: see the next section.
- **Pinia**: Vue's official store. Plain reactive state; it knows nothing about servers. **Pinia Colada** is the Vue data-fetching layer on top of it, comparable to TanStack Query.
- **TanStack DB**: Reactive collections in the browser with live queries (including joins) and optimistic mutations that are rolled back if the persist handler fails. The sync source is pluggable. A "KRM collection" fed by krm-stream is a plausible integration. **(verify: how transactions and rollback work exactly)**
- **Zero** (Rocicorp): Sync engine on Postgres. Queries run against a local replica, writes go through mutators that the server re-runs. Successor to **Replicache**. **(verify: current mutator model)**
- **ElectricSQL**: Read-path sync for Postgres via shapes over plain HTTP. Writes go through your own API. Closest peer to krm-stream's read side.
- **PowerSync**: Syncs Postgres/MongoDB/MySQL into SQLite in the browser or on mobile, with an upload queue to your own backend.
- **Automerge**: A CRDT library with JSON-like documents and full change history. Every edit is a write; there's no authoritative server.
- **Yjs**: The most widely used CRDT in the frontend world, mostly for collaborative text editors.
- **Firebase / Supabase Realtime**: Hosted realtime data. Firebase is a document database with live listeners; Supabase streams Postgres changes. Neither has a schema-first API like a CRD.
- **Also in this space**: Liveblocks, Convex, InstantDB, Jazz, LiveStore, Triplit, RxDB.

## Can TanStack Query or SWR sit on top of krm-stream?

Yes. My earlier table undersold this. A watch stream delivers the current state first and then changes, and a query cache is a perfectly good place to keep the result. TanStack Query's own docs and TkDodo's blog describe exactly this for WebSockets: either invalidate on each event, or write the event into the cache with `setQueryData`.

A sketch (not krm-stream's real API):

```ts
const queryKey = ['coffeeconfigs', namespace]

useQuery({
  queryKey,
  queryFn: () => listCoffeeConfigs(namespace), // initial state, includes a resourceVersion
  staleTime: Infinity, // the stream keeps it fresh: no refetch on focus or mount
})

useEffect(() => {
  // one watch per scope, starting from the list's resourceVersion
  return watchCoffeeConfigs(namespace, (event) => {
    queryClient.setQueryData(queryKey, (list) => applyWatchEvent(list, event))
  })
}, [namespace])
```

There are also ready-made hooks:

- **SWR**: `useSWRSubscription` is built for exactly this: subscribe to a source and push each new value into the cache.
- **TanStack Query**: `experimental_streamedQuery` turns an async iterable into a query. It was designed for appending chunks (think AI chat), so check whether your version lets you fold events into a list instead of only appending them. **(verify)**

So what does that leave for krm-stream? The parts a generic cache doesn't know about:

- **Watch correctness**: starting the watch at the right `resourceVersion` (or using `sendInitialEvents`), bookmarks, reconnecting, relisting quietly after a 410, and noticing when an object leaves the scope or the user loses permission.
- **Per-object identity**: a query cache stores "the result of this query". The watch speaks in objects. Mapping one onto the other is code you write once, in krm-stream.
- **The editing model**: drafts are *client state*, so by TanStack Query's own rules they don't belong in its cache. The clean split is:
  - the query cache holds the live server truth (filled by krm-stream),
  - the form holds the draft plus the `resourceVersion` it started from,
  - a conflict is "the cache now has a newer `resourceVersion` than my draft's base", shown *before* Save,
  - Save is a mutation (PATCH with `resourceVersion`), and a 409 is shown *after* Save.

That makes TanStack Query, SWR, Pinia and TanStack DB all the same kind of thing: **integration targets**, places where krm-stream's state can live in whatever the team already uses. Zero and ElectricSQL are the **peers**, and Automerge/Yjs are the **contrast**.

## Questions worth asking the people who know

- TanStack: "Is a watch stream + `setQueryData` the recommended pattern, or should this be a TanStack DB collection?"
- Electric / Zero: "How do you handle a client losing access to rows it already has?" (Same problem as an RBAC change mid-watch.)
- Local-first people: "Is there a name for 'sync engine with explicit commit'?" Most sync engines treat every local edit as a write.
- Kubernetes people: "Is server-side apply a better default than `resourceVersion` + 409 for a UI that edits a few fields?"

## Further reading

- Ink & Switch, *Local-first software*: https://www.inkandswitch.com/local-first/
- Kubernetes API concepts (watch, `resourceVersion`, bookmarks, watch list): https://kubernetes.io/docs/reference/using-api/api-concepts/
- TkDodo, *Using WebSockets with React Query*: https://tkdodo.eu/blog/using-web-sockets-with-react-query
- crdt.tech, an overview of CRDT research and implementations: https://crdt.tech/
- krm-stream: https://github.com/ConfigButler/krm-stream
