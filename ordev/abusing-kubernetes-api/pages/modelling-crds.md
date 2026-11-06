---
layout: default
transition: fade
---

###### Your chair, as a resource

# What the consumer sees: <span class="green">just your chair.</span>

<div class="model">
<div class="yaml">

```yaml
apiVersion: examples.configbutler.ai/v1alpha1
kind: Seat
metadata:
  name: ordev-2-turing-7-1  # plan-row-column
spec:
  seatingPlanRef: { name: ordev-2-turing }
  row: 7                 # immutable
  column: 1              # immutable
  claimedBy:             # immutable
    displayName: simon-on-stage
    username: demo:Cg5zaW1v…
  color: '#a8e05f'       # may change
  emoji: 🐧              # one of 24
```

</div>
<ul>
  <li v-click><strong>The seat is in the name.</strong> Two phones claim one seat: the second gets <code>409 AlreadyExists</code>. That is the whole locking story</li>
  <li v-click><strong>Spec is the intent.</strong> That is what goes to Git; secrets go in their own Secret</li>
</ul>
</div>

<p v-click class="punch">It's real design work. But it's <strong>your app's model</strong>, not another settings table.</p>

<Sources :items="[{ name: 'ConfigButler skills', href: 'https://github.com/ConfigButler/skills', note: 'homemade, for you and your AI agents' }]" />

<style>
.model { display: grid; grid-template-columns: 640px 1fr; gap: 56px; align-items: start; }
.model .yaml :deep(pre) { font-size: 17px !important; line-height: 1.45 !important; padding: 20px 24px !important; border-radius: 12px; }
.model .yaml :deep(pre code) { background: none; padding: 0; }
.slidev-layout .model li { font-size: 30px; line-height: 1.35; margin: 0 0 32px; }
.punch { margin-top: 20px; font-size: 26px; line-height: 1.4; }
</style>

<!--
**8:30 · 0:30**

The chair you claimed. The comments are the rules you just saw.

[click] No controller, no race: the API server refuses the second create.

[click] Spec goes to Git. Secrets never sit in plain config.

[click] A few rounds to get right, but you'd design this model anyway.
-->
