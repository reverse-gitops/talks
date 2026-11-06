---
eyebrow: What modelling can look like
clicks: 1
---

# gitops-reverser is <span class="green">configured the same way.</span>

<div class="stage">
  <Arrow points="364,245 610,245 610,346" />
  <Arrow points="364,415 456,415" />
  <Arrow points="760,415 852,415" />
  <Arrow points="1156,415 1232,415" />
  <Arrow points="560,484 560,576" />
  <Arrow points="700,484 700,530 1006,530 1006,576" />

  <div class="box kind" style="left: 64px; top: 180px"><b>CommitRequest</b><span>Why did I change this?</span></div>
  <div class="box kind" style="left: 64px; top: 350px"><b>WatchRule</b><span>Which types do I follow?</span></div>
  <div class="box kind hub" style="left: 460px; top: 350px"><b>GitTarget</b><span>Which folder, and which files?</span></div>
  <div class="box kind" style="left: 856px; top: 350px"><b>GitBranch</b><span>Which branch?</span></div>
  <div class="box kind" style="left: 1236px; top: 350px"><b>GitProvider</b><span>Which repo? Who commits, and how is it signed?</span></div>
  <div class="box kind" style="left: 410px; top: 580px"><b>KubeProvider</b><span>Which cluster?</span></div>
  <div class="box kind" style="left: 856px; top: 580px"><b class="pair">FluxClaim · ArgoCDClaim</b><span>Who applies it back?</span></div>

  <p class="at punch fade" :class="{ off: $clicks < 1 }">Small objects that point at each other. <span class="green">Each one a kubectl get away.</span></p>
</div>

<style>
.diagram .kind { width: 300px; height: 130px; gap: 8px; }
.diagram .kind b { font-size: 26px; line-height: 32px; font-family: var(--mono); font-weight: 600; }
.diagram .kind span { font-size: 19px; line-height: 25px; color: var(--soft); }
.diagram .kind b.pair { font-size: 19px; }
.diagram .kind.hub { border-color: var(--good); }
.slidev-layout .punch { left: 64px; top: 750px; width: 1472px; margin: 0; text-align: center; font-size: 42px; line-height: 1.2; font-weight: 700; color: var(--text); }
</style>

<!--
What does modelling look like when it's more than a chair? gitops-reverser is itself a configuration product. So I eat my own cooking: this is its model, and most of these objects are running on my cluster right now. The Flux and Argo CD claims are the exception: they're opt-in. If you want to know about them, ask me afterwards.

Each box is a small type that answers one question. The arrows are references: a WatchRule points at a GitTarget, a GitTarget at a GitBranch, a GitBranch at a GitProvider.

Different people can own different boxes. A platform team owns the GitProvider and the credentials. An app team gets its own WatchRule, and RBAC per type makes that split work.

[click] And I got all of it for free: validation, RBAC, status, watches, kubectl. I never built a settings screen for my own settings product.
-->
