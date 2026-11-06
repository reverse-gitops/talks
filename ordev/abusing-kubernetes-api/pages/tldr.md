---
clicks: 3
---

<div class="at tldr-label">TLDR;</div>

# An API and files. <span class="green">At the same time.</span>

<Tldr :step="$clicks">Today I'll show the trick.</Tldr>

<p v-if="$clicks === 0" class="at why"><span class="blue">Make it easy:</span> that's the API.</p>
<p v-if="$clicks === 1" class="at why"><span class="green">Leave me in control:</span> that's the files.</p>
<p v-if="$clicks === 2" class="at why"><span class="amber">Undo:</span> revert in Git, and it flows back.</p>

<!--
2:30. Consumers want both, and providers don't want to build it all. Here's the summary of how you can do that.

Make it easy: that's the API. This is how you changed your chair. You logged in, and your token goes to the API server. It decides who may change what, and it checks what you send.

[click] Leave me in control: that's the files. gitops-reverser turns each change into a commit with your name, so who changed what is simply in Git.

[click] Undo: there's a step back, and that's just normal GitOps. Revert in Git, and Flux or Argo CD moves the files back into the kube-apiserver.

[click] All of this works because of one shape, KRM, in the API and in the files. Yesterday I said: be happy with the magic. Today I'll show the trick.
-->

<style>
.tldr-label { left: 64px; top: 26px; font-family: var(--mono); font-size: 34px; font-weight: 600; line-height: 1.5; color: var(--accent); }
.slidev-layout .why { left: 64px; top: 640px; width: 1472px; margin: 0; text-align: center; font-size: 46px; line-height: 1.2; font-weight: 700; color: var(--text); opacity: 1; }
</style>
