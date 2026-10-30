---
layout: default
transition: fade
---

###### Hard part 2 · Modelling your application

# Model it, and <span class="green">the API does the work.</span>

<div class="model">
<div class="yaml">

```yaml
apiVersion: examples.configbutler.ai/v1alpha1
kind: Seat
metadata:
  name: mission2-6-6     # plan-row-column
spec:
  seatingPlanRef: { name: mission2 }
  row: 6                 # immutable
  column: 6              # immutable
  claimedBy:             # immutable
    displayName: simon-on-stage
    username: demo:Cg5zaW1v…
  color: '#a8e05f'       # may change
  emoji: 🐧              # one of 24
```

</div>
<ul>
  <li v-click><strong>The seat is in the name.</strong> Two phones claim one seat: the second gets <code>409 AlreadyExists</code>. That is the whole locking story</li>
  <li v-click><strong>Fixed where it must be.</strong> Row, column and owner never change: a CEL rule, <code>self == oldSelf</code></li>
  <li v-click><strong>A list, not free text.</strong> 24 emoji that read well on a projector. Nothing unexpected gets through</li>
  <li v-click><strong>Spec is the intent.</strong> That is what goes to Git; secrets go in their own Secret</li>
</ul>
</div>

<p v-click class="punch">It's real design work. But it's <strong>your app's model</strong>, not another settings table.</p>

<Sources :items="[{ name: 'ConfigButler skills', href: 'https://github.com/ConfigButler/skills', note: 'homemade, for you and your AI agents' }]" />

<!--
Hard part 2. The CRD is the design. Get it right and the API server does the work for you.

[click] The seat is in the name. No controller, no race: the API server refuses the second create.

[click] What never changes is held by a CEL rule in the CRD.

[click] An enum of emoji. Validation before anything is stored.

[click] Spec is what you meant, and that is what goes to Git. Secrets never sit in plain config.

[click] It takes a few rounds to get right. That's the hard part. But you'd design this model anyway.
-->

<style>
.model { display: grid; grid-template-columns: 640px 1fr; gap: 56px; align-items: start; }
.model .yaml :deep(pre) { font-size: 17px !important; line-height: 1.45 !important; padding: 20px 24px !important; border-radius: 12px; }
.model .yaml :deep(pre code) { background: none; padding: 0; }
.model li { font-size: 22px; line-height: 1.4; margin: 0 0 20px; }
.punch { margin-top: 20px; font-size: 26px; line-height: 1.4; }
</style>
