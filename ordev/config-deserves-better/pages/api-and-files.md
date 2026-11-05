---
eyebrow: The big jump
clicks: 3
transition: fade
---

# <span v-if="$clicks < 1">An API or files? Usually you pick one.</span><span v-else>An API and files. <span class="green">At the same time.</span></span>

<div class="stage">
  <div class="box side" style="left: 64px">
    <b>An API</b>
    <ul>
      <li>fast answers</li>
      <li>checks every change</li>
      <li>decides who may do it</li>
      <li class="no">no history to point at</li>
    </ul>
  </div>

  <div class="box side" style="left: 1106px">
    <b>Files in Git</b>
    <ul>
      <li>every change has an author</li>
      <li>compare it, go back to it</li>
      <li>package it, promote it</li>
      <li class="no">your users won't open Git</li>
    </ul>
  </div>

  <div class="fade" :class="{ off: $clicks < 1 }">
    <Arrow points="494,285 532,285" color="var(--good)" />
    <Arrow points="1106,285 1068,285" color="var(--good)" />
    <div class="box both"><b>Your chair was both</b><span class="tag">one change: through an API, and a file in Git</span></div>
  </div>

  <div class="fade" :class="{ off: $clicks < 2 }">
    <div class="box part" style="top: 370px"><b>KRM</b><span class="tag">one shape, in the API and in the files</span></div>
    <div class="box part" style="top: 480px"><b>gitops-reverser</b><span class="tag">open source: each API change becomes a commit</span></div>
  </div>

  <div class="at magic fade" :class="{ off: $clicks < 3 }">For today, that's magic. Tomorrow I'll show you the trick.</div>
</div>

<Story>

- **the choice** An API gives you fast, checked changes. Files give you history and delivery. Usually you pick one.
- **both** You just did both: you changed your chair through an API, and it ended up as a file in Git.
- **how** One shape, KRM, and my open source operator, gitops-reverser. That combination is what makes this possible.
- **magic** Don't try to work out how yet. Today, all you need is that it works.

</Story>

<Sources slim :items="[{ name: 'GitOps Reverser', href: 'https://github.com/ConfigButler/gitops-reverser' }]" />

<!--
14:30. This is a big jump, so say that out loud. "If you're thinking: wait, is this a database or a folder of files? Good. Normally it's one or the other."

[click] You've just done both. You changed your chair through an API, and it ended up as a file in Git.

[click] Two things make that possible. KRM, the shape you just saw: the same in the API and in the files. And gitops-reverser, my open source operator, which turns each change in the API into a commit.

[click] For this talk I'll call that part magic, and I'm not going to apologise for it: you only need to know that it works. Tomorrow I'll show you how the trick works.
-->

<style>
.side { top: 215px; width: 430px; height: 400px; gap: 20px; }
.side b { font-size: 34px; line-height: 40px; }
.side ul { margin: 0; padding: 0; list-style: none; text-align: left; }
.side li { margin: 12px 0; padding: 0 0 0 34px; font-size: 22px; line-height: 28px; color: var(--soft); position: relative; }
.side li::before { content: '✓'; position: absolute; left: 0; color: var(--good); font-weight: 700; }
.side li.no::before { content: '✗'; color: var(--bad); }
.both { left: 534px; top: 215px; width: 532px; height: 135px; gap: 8px; border: 2px solid var(--good); }
.both b { font-size: 34px; line-height: 40px; color: var(--good); }
.both .tag, .part .tag { font-size: 16px; line-height: 22px; }
.part { left: 534px; width: 532px; height: 95px; gap: 4px; }
.part b { font-size: 26px; line-height: 32px; }
.magic { left: 64px; top: 640px; width: 1472px; text-align: center; font-family: 'Caveat', cursive; font-size: 52px; line-height: 1; font-weight: 600; color: var(--amber); }
</style>
