---
layout: center
class: text-center
---

# And here it is in Git

<div class="mt-8 text-left max-w-2xl mx-auto">

```diff
commit a3f9e12
Author: gitops-reverser <bot@reversegitops.dev>
Date:   Wed Mar 18 14:23:01 2026

    feat: record vote from audience session

+++ b/votes/vote-abc123.yaml
@@ -0,0 +1,8 @@
+apiVersion: demo.reversegitops.dev/v1
+kind: Vote
+metadata:
+  name: vote-abc123
+spec:
+  option: api-first
```

</div>

<div v-click class="mt-8 text-xl">

Nobody in the audience had to think in Git — but **Git still recorded it.**

</div>

<!--
And here is the payoff.

The audience made a change from their phone. And here it is in Git.

That is the whole model in one moment.

Git still gives us the things we like: auditability, history, diffability, promotion if we need it, distribution if we need it.

But nobody in the audience had to think in Git in order to participate.

That is why I like the phrase:

The API comes first. Git remembers.

Because Git is still doing something important here. It is just no longer being forced to act as the primary authoring surface for every kind of change.

[Pause here. Let the audience look.]

This is also the moment where I'd want people to notice: this feels natural. That matters.

Because if we want self-service platforms to work, and if we want AI agents to act safely, the front door has to feel smaller and more structured than a raw repo.
-->
