---
layout: default
transition: fade
---

###### Tomorrow, 11:15, Turing

# (Ab)using the Kubernetes API<br><span class="hl">as a Configuration Backend</span>

<p class="trick">Today it's magic. <span class="hl">Tomorrow I'll show you the trick.</span></p>

<ul class="teaser">
  <li>How one thing can be <strong>an API and files</strong> at the same time</li>
  <li>More detail on <strong>GitOps</strong>, <strong>Reverse GitOps</strong>, and even <strong>bi-directional GitOps</strong></li>
  <li>How can you run this <strong>at scale</strong>?</li>
  <li>Why is Kubernetes a good fit for <strong>modelling your configuration</strong>?</li>
</ul>

<p class="no-k8s"><strong>Don't want to run Kubernetes?</strong> It's useful for you too. Self-hosting is fine, but managed solutions should arise soon.</p>

<!--
17:00. Today it's magic, tomorrow I'll show you the trick: how one thing can be an API and files at the same time.

We'll also get into more detail on GitOps, Reverse GitOps, and even bi-directional GitOps.

How can you run this at scale? And why is Kubernetes a good fit for modelling your configuration?

This is also useful if you don't want to run Kubernetes: self-hosting is fine, but managed solutions should arise soon.

Back to today. We have the files and the log. Now, how do we deliver them?
-->

<style>
.hl { color: var(--good); }
.trick { margin: 28px 0 0; font-size: 44px; line-height: 1.2; font-weight: 700; color: var(--text); opacity: 1; }
.teaser { margin: 28px 0 0; }
.teaser li { margin: 14px 0; font-size: 32px; line-height: 1.3; color: var(--soft); }
.teaser strong { color: var(--text); font-weight: 700; }
.no-k8s { margin: 32px 0 0; padding: 22px 32px; font-size: 28px; line-height: 1.35; color: var(--soft); opacity: 1; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 16px; }
.no-k8s strong { color: var(--text); font-weight: 700; }
</style>
