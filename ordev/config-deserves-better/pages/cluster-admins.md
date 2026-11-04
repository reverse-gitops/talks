---
layout: default
transition: fade
---

###### Hard part 3c · Convincing cluster admins

# Not your workload cluster.<br><span class="green">One per change, from production state.</span>

<div class="qa">
  <div v-click><b>“Strangers on my API server?”</b><span>A temporary, data-only kube-apiserver: nothing runs there. One per change, starting from the production state every time.</span></div>
  <div v-click><b>“Who may do what?”</b><span>RBAC per group, admission policies per kind. One RoleBinding to take it all back.</span></div>
  <div v-click><b>“How do the CRDs get there?”</b><span>Through Flux, like everything else you run. Reviewed in Git.</span></div>
  <div v-click><b>“What does it cost me?”</b><span>Small objects that change rarely, and one shared watch per kind. Plus: audit flags on the API server, for real authors.</span></div>
</div>

<Sources label="config clusters" :items="[
  { name: 'kcp', href: 'https://github.com/kcp-dev/kcp', logo: '/images/logos/kcp.svg' },
  { name: 'Kamaji', href: 'https://github.com/clastix/kamaji', logo: '/images/logos/kamaji.svg' },
  { name: 'vCluster', href: 'https://github.com/loft-sh/vcluster', logo: '/images/logos/vcluster.svg' },
]" />

<!--
Hard part 3, part three: the people who run the clusters.

[click] Not in the workload cluster. A temporary, data-only API server: no pods. One per change, and every one starts from the production state. (Don't explain where it lives yet: that's the reveal in part 4.)

[click] The tools they already know: RBAC and admission. Revoking is one RoleBinding.

[click] CRDs ship through GitOps, like everything else.

[click] Load is small. Honest con: real authors need audit flags, and most managed control planes can't set them.
-->

<style>
.qa { display: flex; flex-direction: column; gap: 18px; margin-top: 8px; }
.qa div { display: grid; grid-template-columns: 460px 1fr; gap: 32px; align-items: baseline; padding: 18px 24px; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 14px; }
.qa b { font-size: 26px; }
.qa span { font-size: 22px; line-height: 1.4; color: var(--soft); }
</style>
