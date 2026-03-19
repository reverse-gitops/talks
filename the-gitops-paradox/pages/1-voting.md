---

# GitOps got something very right

Git is a fantastic memory

<div class="grid grid-cols-2 gap-8 mt-8">
<div>

**What Git gives us:**

- Audit trail
- History & diffs
- Promotion flows
- Rollback & recovery
- Distribution of desired state
- Reproducibility

</div>
<div v-click>

**And that is a huge achievement.**

FluxCD and ArgoCD are beautiful tools.
This talk is not here to change that.

</div>
</div>

<!--
Let me start by being very clear: this is not an anti-GitOps talk.

In fact, I think GitOps got one of the most important things exactly right: Git is an incredibly good memory.

It gives us history, diffs, promotion flows, rollback, disaster recovery, a mechanism to distribute desired state.

That is a huge achievement.

I am not here to argue that GitOps was wrong. I am here to argue that Git may be the wrong interface for more and more of the people and systems that need to make changes.

Git is still extremely valuable. I just think it works better as the memory than as the front door.
-->

---

# But Git is a bad front door for many users

<div class="grid grid-cols-2 gap-8 mt-8">
<div>

**The Git PR workflow:**

1. Edit YAML in your editor
2. Open a pull request
3. Wait for CI
4. Controller reconciles
5. Something fails — far from where the change began

</div>
<div v-click>

**What users actually want:**

1. Use a UI / CLI / IDE / agent
2. Hit a typed API
3. Get validation **immediately**
4. Done

</div>
</div>

<div v-click class="mt-8 text-lg">

Git was built for source code collaboration. Those virtues are **friction** for infrastructure operations.

</div>

<!--
Git was built for source code collaboration. That gives it line-oriented editing, text diffs, review-driven workflows.

Those are virtues for software development. But they are often friction for infrastructure operations.

When Git is the front door, feedback is delayed. You push, you open a PR, CI runs, a controller reconciles, something fails later and farther away from the point where the change actually began.

For platform engineers, that is survivable.

But think about the broader audience now: developers using self-service platforms, operators making small changes, and increasingly AI agents trying to work through tools safely.

Those users do not want to hand-author low-level YAML in Git for every action. They want a smaller, safer, typed interface.

And the nice thing is: Kubernetes already knows how to do this.
-->
