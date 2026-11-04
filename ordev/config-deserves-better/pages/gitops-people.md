---
layout: center
transition: fade
---

<div class="coffee-bg" />

###### What you answered at the door

# Where is GitOps going?

<div class="four">
  <PollResult :preview="60" :question="false" />
</div>

<blockquote v-click class="quote">End users don't need to be in Git.<br><span class="green">But their actions should be.</span></blockquote>

<Sources slim :items="[{ name: 'Reverse GitOps', href: 'https://reversegitops.dev' }]" />

<!--
17:30 · The twist. Remember the question at the door? "Where is GitOps going?" These are your own answers, live. No explaining what GitOps is.

Now it's your chair, and your settings.

[click] Nobody expects end users to open a pull request. What they do should still end up in Git. And you just saw that it did.
-->

<style>
.coffee-bg {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(ellipse at center, rgba(0,0,0,.78) 0%, rgba(0,0,0,.88) 80%),
    url('/images/coffee-raw.jpg') center 55% / cover no-repeat;
}
h6, h1, .four, .quote { position: relative; z-index: 1; }
h6, h1 { text-align: center; }
.four { width: 1200px; margin: 48px auto 0; }
.slidev-layout blockquote.quote {
  width: fit-content; margin: 80px auto 0; padding: 8px 0 8px 36px;
  border: none; border-left: 6px solid var(--good); background: none;
  font-size: 36px; line-height: 1.3; font-weight: 600; font-style: normal; color: var(--text);
}
.quote::before { content: '“'; position: absolute; left: -84px; top: -20px; font-size: 116px; line-height: 1; color: var(--good); opacity: .5; }
</style>
