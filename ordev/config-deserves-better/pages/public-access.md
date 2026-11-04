---
layout: default
transition: fade
---

###### Hard part 1 · Public access

# You just did it. <span class="green">From your phone.</span>

<div class="path">
  <div class="node">your phone<span>Room Pass · join code</span></div>
  <i>→</i>
  <div class="node foyer">krm-foyer<span>IAP · login · /k8s</span></div>
  <i>→</i>
  <div class="node">kube-apiserver<span>your own token</span></div>
</div>

<ul class="points">
  <li v-click><strong>Your own token</strong><a class="live" href="https://demo.koudijs.dev/auth/whoami" target="_blank">demo.koudijs.dev/auth/whoami</a></li>
  <li v-click><strong>RBAC on a group</strong><a class="live" href="https://demo.koudijs.dev/k8s/apis/examples.configbutler.ai/v1alpha1/namespaces/voter/seats" target="_blank">demo.koudijs.dev/k8s/…/voter/seats</a></li>
  <li v-click><strong>Admission</strong></li>
  <li v-click><strong>One watch for the room</strong></li>
</ul>

<Sources :items="[
  { name: 'krm-foyer', href: 'https://github.com/ConfigButler/krm-foyer', note: 'an identity-aware proxy (IAP) for the Kubernetes API' },
  { name: 'Room Pass', href: 'https://github.com/sunib/room-pass', note: 'OIDC with your audience: a code, a name, no accounts' },
]" />

<!--
Hard part 1. Putting kube-apiserver in front of strangers sounds scary. You all just did it.

The phone logs in through Room Pass; krm-foyer is an identity-aware proxy (IAP): it holds the session and forwards /k8s to the API server, as you. Any ingress in front of it will do.

[click] Your own token: Dex OIDC, checked by the API server. No shared service account, no impersonation. That's also what makes the commit author honest.
Link: whoami, open it on your phone. The API server telling you who it thinks you are (a SelfSubjectReview).

[click] RBAC on a group: one RoleBinding covers the whole room. Remove it, and nobody writes anymore.
Link: every seat. The same list as kubectl get, as JSON, with your own login.

[click] Admission: only your own seat, only colour and emoji, and a why of 3 to 80 characters.

[click] One watch for the room: krm-foyer shares it, and checks every subscriber (a SubjectAccessReview) before it shows them anything.
-->

<style>
.path { display: flex; align-items: center; gap: 20px; margin: 8px 0 36px; }
.path i { font-style: normal; font-size: 32px; color: var(--arrow); }
.path .node { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 18px 32px; font-size: 26px; font-weight: 600; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 14px; }
.path .node span { font-family: var(--mono); font-size: 15px; font-weight: 400; color: var(--soft); }
.path .node.foyer { border-color: var(--good); }
.slidev-layout ul.points { list-style: none; padding: 0; margin: 0; }
.points li { display: flex; align-items: baseline; gap: 24px; margin: 0 0 18px; font-size: 28px; }
.points strong { color: var(--text); }
.live { font-family: var(--mono); font-size: 18px; line-height: 1.2; color: var(--accent); text-decoration: underline; text-underline-offset: 5px; }
</style>
