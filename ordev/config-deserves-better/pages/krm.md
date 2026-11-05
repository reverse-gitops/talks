---
layout: default
transition: fade
---

###### For the structured ones

# One shape: <span class="green">KRM</span>

<div class="krm">
<div class="yaml">

```yaml
apiVersion: examples.configbutler.ai/v1alpha1
kind: Seat
metadata:
  name: ordev-1-stamp-6-6
spec:
  row: 6
  column: 6
  color: '#a8e05f'
  emoji: 🐧
```

</div>
<dl>
  <div><dt>apiVersion</dt><dd>which schema it follows</dd></div>
  <div><dt>kind</dt><dd>what it is</dd></div>
  <div><dt>metadata</dt><dd>what it's called</dd></div>
  <div><dt>spec</dt><dd>the desired state</dd></div>
</dl>
</div>

<p class="punch">The Kubernetes Resource Model: a description, in a shape many tools already read.</p>

<!--
13:00. Now I can make the jump. For the structured ones I picked one shape: KRM, the Kubernetes Resource Model.

Just mention it. No CRDs, no API server, no validation rules: that's tomorrow.

Four fields, and spec is the part we were just talking about.
-->

<style>
.slidev-layout h1 .green { color: var(--good); }
.krm { display: grid; grid-template-columns: 760px 1fr; gap: 56px; align-items: center; margin-top: 16px; }
.krm .yaml :deep(pre) { font-size: 24px !important; line-height: 1.5 !important; padding: 24px 28px !important; border-radius: 12px; }
.krm .yaml :deep(pre code) { background: none; padding: 0; }
dl { margin: 0; display: flex; flex-direction: column; gap: 24px; }
dt { font-family: var(--mono); font-size: 28px; font-weight: 600; color: var(--accent); }
dd { margin: 0; font-size: 28px; line-height: 1.25; color: var(--soft); }
.punch { margin-top: 44px; font-size: 32px; line-height: 1.3; color: var(--soft); }
</style>
