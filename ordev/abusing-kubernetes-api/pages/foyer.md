---
layout: default
transition: fade
---

###### The same API, in a browser

# Machines get a token. <span class="green">People just log in.</span>

<div class="foyer">
  <img class="shot" src="/images/seat.png" alt="A browser showing a Seat as JSON at demo.koudijs.dev/k8s">
  <div class="parts">
    <div class="part">
      <b>Room Pass</b>
      <span>A room code and a name: no accounts. This is how you got in today</span>
    </div>
    <div v-click class="part">
      <b>krm-foyer</b>
      <span>Login and session on your app's own domain: a same-origin cookie, no CORS. Forwards <code>/k8s</code>, or <code>/settings</code>, or whatever you like</span>
    </div>
    <div v-click class="part api">
      <b>kube-apiserver</b>
      <span>Still decides everything. Neither of the two decides what you may do</span>
    </div>
  </div>
</div>

<Sources slim :items="[
  { name: 'krm-foyer', href: 'https://github.com/ConfigButler/krm-foyer' },
  { name: 'Room Pass', href: 'https://github.com/sunib/room-pass' },
]" />

<style>
.slidev-layout h1 { margin-bottom: 24px; }
.foyer { display: grid; grid-template-columns: 800px 1fr; gap: 44px; align-items: start; }
.shot { display: block; width: 800px; height: auto; border: 1px solid var(--line-strong); border-radius: 12px; }
.parts { display: flex; flex-direction: column; gap: 22px; }
.part { padding: 20px 26px; background: var(--panel); border: 1px solid var(--line); border-radius: 14px; }
.part.api { border-color: var(--accent); }
.part b { display: block; margin-bottom: 6px; font-size: 34px; line-height: 1.2; font-weight: 700; color: var(--text); }
.part span { font-size: 25px; line-height: 1.3; color: var(--soft); }
</style>

<!--
**16:30 · 1:30**

Tokens are for machines. Same chair, normal browser, normal URL.

Room Pass: room code and a name. For your product: your normal login, OIDC.

[click] krm-foyer: identity-aware proxy and BFF. Sealed cookie, page scripts never see a token. Same origin, no CORS. /settings, /whatever-you-like.

[click] The API server decides, with your identity. No authorization code from me.

Honest: both are young. krm-foyer is a working prototype, one replica.
-->
