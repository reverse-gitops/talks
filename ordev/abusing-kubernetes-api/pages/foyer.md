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
      <span>Handles the login and the session, then forwards <code>/k8s</code> with your own credential. Page scripts never see a token</span>
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

<!--
That was a token, for machines. But a person doesn't want to handle tokens. So this is the same chair, in a normal browser, on a normal URL. Logged in, and that's all it took.

Two small open source projects of mine make that work.

Room Pass: a room code and a name, and you have an identity. That's what you did with your phone at the start. It's made for audiences like you. For your own product you'd use your normal login, through OIDC.

[click] krm-foyer is an identity-aware proxy for the Kubernetes API, and also a backend for frontend. It owns the login and the session. The browser only holds a sealed cookie, so scripts on the page never see a token.

[click] And then the API server decides, with your own identity. I didn't write any authorization code. How easy can it be?

And look at the screenshot: managedFields. The API server keeps track of who last set which field. That's the per-field idea from a few slides back.

Be honest: both are young. krm-foyer's own README says it's a working prototype, not yet for a cluster that matters. It runs one replica. Same for Room Pass.
-->

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
