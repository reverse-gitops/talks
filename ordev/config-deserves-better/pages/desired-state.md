---
layout: default
transition: fade
---

###### What is in those commits?

# Back to text files. <span class="red">Oef, two steps back?</span>

<div class="versus">
<div class="side spec">
<h2>A specification</h2>
<p>What it should be</p>

```yaml
row: 6
column: 6
claimedBy: simon
color: "#a8e05f"
```

</div>

<ul class="rules">
  <li><strong>Only the desired state.</strong> Nothing that happened at runtime</li>
  <li><strong>Several small files that reference each other,</strong> for what's complex</li>
  <li><strong>A special place for secret values.</strong> We don't want them in sight</li>
</ul>
</div>

<Sources slim :items="[{ name: 'Config Deserves Better', href: 'https://configdeservesbetter.dev' }]" />

<!--
10:00. So what is in those commits? Text files. That's how we treat source code, so model configuration as text files, as much as possible.
Oef. That's two steps back, isn't it?

A description of what it should be. The desired state, a specification. You can read it, compare it, and go back to it.

Only store the desired state.

Model complex configuration in several files that reference each other.

And keep a special place for secret values.
-->

<style>
.versus { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; margin-top: 40px; }
.side h2 { margin: 0; font-weight: 700; }
.side p { margin: 0 0 14px; font-size: 24px; color: var(--soft); }
.spec h2 { color: var(--good); }
.side :deep(pre) { height: 196px; box-sizing: border-box; font-size: 22px !important; line-height: 1.45 !important; padding: 18px 24px !important; border-radius: 12px; }
.side :deep(pre code) { background: none; padding: 0; }
.rules { margin: 0; }
.rules li { font-size: 32px; line-height: 1.3; margin: 28px 0; }
</style>
