---
layout: default
transition: fade
---

###### Hard part 4 · The API already holds everything

<div class="room">
<div class="yaml">

```yaml
apiVersion: room-pass.koudijs.dev/v1alpha1
kind: Room
metadata:
  name: mission2
  namespace: voter
spec:
  title: Room Pass
  appearance:
    tagline: Dutch Cloud Native Day · Mission 2
  question:
    prompt: How familiar are you with GitOps?
    answers:
    - { group: demo:gitops-never, label: Never used it }
    - { group: demo:gitops-idea,  label: I know the idea }
    - { group: demo:gitops-use,   label: I use it }
    - { group: demo:gitops-run,   label: I run it }
  joinCode: { length: 6, rotateEvery: 30s, validFor: 120s }
  maxParticipants: 300
  enrollment: Open
  endsAt: "2026-10-30T23:00:00Z"
status:           # written by the controller
  conditions: [{ type: Ready, status: "True" }]
```

</div>
<div class="points">
  <h1>This YAML <span class="green">is</span> the room.</h1>
  <ul>
    <li v-click>The question you answered at the door, the join code, the 300 seats: <strong>all of it</strong></li>
    <li v-click>No database behind it. <strong>GET the object and you have the whole thing.</strong></li>
  </ul>
  <a v-click class="live" href="https://demo.koudijs.dev/k8s/apis/room-pass.koudijs.dev/v1alpha1/namespaces/voter/rooms/mission2" target="_blank">demo.koudijs.dev/k8s/apis/room-pass.koudijs.dev/v1alpha1/namespaces/voter/rooms/mission2</a>
  <p v-click class="fine"><code>status</code>, <code>resourceVersion</code> and <code>managedFields</code> belong to the server. <code>spec</code> is the intent, and that is what goes to Git.</p>
</div>
</div>

<!--
≈1:00 · The Room you all joined through at the door. Not infra: an app with a question, answers, a tagline.

[click] Everything you saw on your phone is in here.

[click] There is no database behind it. This document is the complete state.

[click] Open the link: the live object, right now. (Scroll past managedFields to spec.)

[click] Honest footnote: the server adds its own fields. Strip those and what remains is pure intent. Next: that's why it works both ways.
-->

<style>
.room { display: grid; grid-template-columns: 760px 1fr; gap: 56px; align-items: start; }
.room .yaml :deep(pre) { font-size: 17px !important; line-height: 1.45 !important; padding: 20px 24px !important; border-radius: 12px; }
.room .yaml :deep(pre code) { background: none; padding: 0; }
.points h1 { font-size: 56px; margin-top: 0; }
.points li { font-size: 24px; }
.points .live { display: block; margin: 24px 0; padding: 14px 18px; font-family: var(--mono); font-size: 15px; word-break: break-all; color: var(--accent); background: var(--panel); border: 1px solid var(--accent); border-radius: 10px; text-decoration: none; }
.points .fine { font-size: 18px; color: var(--muted); }
</style>
