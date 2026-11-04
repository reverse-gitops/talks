---
layout: default
transition: fade
---

###### Tomorrow, 11:15, Turing

# (Ab)using the Kubernetes API<br><span class="hl">as a Configuration Backend</span>

<ul class="teaser">
  <li>More detail on <strong>GitOps</strong>, <strong>Reverse GitOps</strong>, and even <strong>bi-directional GitOps</strong></li>
  <li>How can you run this <strong>at scale</strong>?</li>
  <li>Why is Kubernetes a good fit for <strong>modelling your configuration</strong>?</li>
</ul>

<p class="no-k8s"><strong>Don't want to run Kubernetes?</strong> It's useful for you too. Self-hosting is fine, but managed solutions should arise soon.</p>

<!--
Tomorrow we'll get into more detail on GitOps, Reverse GitOps, and even bi-directional GitOps.

How can you run this at scale? And why is Kubernetes a good fit for modelling your configuration?

This is also useful if you don't want to run Kubernetes: self-hosting is fine, but managed solutions should arise soon.

Back to today: first, one of those formats.
-->

<style>
h1 .hl { color: var(--good); }
.teaser { margin: 48px 0 0; }
.teaser li { margin: 24px 0; font-size: 38px; line-height: 1.3; color: var(--soft); }
.teaser strong { color: var(--text); font-weight: 700; }
.no-k8s { margin: 56px 0 0; padding: 28px 36px; font-size: 32px; line-height: 1.35; color: var(--soft); opacity: 1; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 16px; }
.no-k8s strong { color: var(--text); font-weight: 700; }
</style>
