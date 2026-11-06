---
eyebrow: Cornerstone 4 of 7
---

# Every change <span class="green">becomes a commit.</span>

<div class="stage">
  <img class="at overview" src="/images/gitops-reverser-overview.svg" alt="Humans, kubectl and AI agents change resources through the Kubernetes API server. GitOps Reverser watches for changes and commits them to a branch in Git, and it is configured with CRDs.">
  <p class="at say">With the name of whoever saved it.</p>
</div>

<!--
18:00. gitops-reverser, my open source operator.

Start on the left: humans with a GUI, kubectl, and AI agents through MCP. They all write to the same API server, with the same rules.

gitops-reverser watches that API for changes, and commits them to a branch in Git. It's an operator, and it's configured with CRDs: the green box, and we'll come back to those.

This is where I show the trick from yesterday: how did the admin screen turn every edit into a commit with my name?
-->

<style>
.overview { left: 215px; top: 150px; width: 1170px; height: auto; border-radius: 14px; }
.slidev-layout .say { left: 64px; top: 804px; width: 1472px; margin: 0; text-align: center; font-size: 38px; line-height: 1.3; color: var(--text); opacity: 1; }
</style>
