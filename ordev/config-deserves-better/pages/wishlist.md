---
layout: default
transition: fade
---

###### What we want instead

# A settings change should be…

- **recorded and reviewable**, like every other change to production
- **attributed**: you know exactly who did it
- **explained**: a short message on why somebody made it
- **reversible** in one step, without touching a database
- **visible** without production DB access

<p v-click class="punch">Isn't this just a <strong class="green">git commit</strong>?</p>

<!--
These answer the four questions from the previous slide.

Recorded, like any other production change. Attributed: who. Explained: a short why, from the person making it. Reversible in one step. And you can see it without access to the production database.

[click] Isn't this just a git commit?
-->

<style>
.punch { margin-top: 40px; font-size: 40px; font-weight: 600; }
</style>
