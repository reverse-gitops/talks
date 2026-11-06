---
eyebrow: The most important concept in Kubernetes
clicks: 4
---

# The control loop: <span class="green">it never stops checking.</span>

<div class="stage">
  <i v-if="$clicks >= 4" class="at dot loop" />

  <div class="fade" :class="{ off: $clicks < 1 }"><Arrow points="620,290 975,290" /></div>
  <div class="fade" :class="{ off: $clicks < 2 }"><Arrow points="1190,380 1190,465" /></div>
  <div class="fade" :class="{ off: $clicks < 3 }"><Arrow points="980,560 625,560" /></div>
  <div class="fade" :class="{ off: $clicks < 4 }"><Arrow points="410,470 410,385" /></div>

  <div class="box step want" style="left: 200px; top: 200px"><b>What do you want?</b><code>spec</code><span>thermostat: set to 21°</span></div>
  <div class="box step" :class="{ off: $clicks < 1 }" style="left: 980px; top: 200px"><b>What's really there?</b><code>observe</code><span>the room is 18°</span></div>
  <div class="box step" :class="{ off: $clicks < 2 }" style="left: 980px; top: 470px"><b>Close the gap</b><code>act</code><span>turn the heating on</span></div>
  <div class="box step report" :class="{ off: $clicks < 3 }" style="left: 200px; top: 470px"><b>Report back</b><code>status</code><span>19° and heating</span></div>

  <div class="at again fade" :class="{ off: $clicks < 4 }">and again,<br>and again</div>

  <p v-if="$clicks >= 4" class="at punch">You say what you want. <span class="green">The loop keeps making it true.</span></p>
</div>

<!--
If you remember one concept from Kubernetes, make it this one. And you already own one: a thermostat.

You set what you want: 21 degrees. That's the spec. You don't say "heat for ten minutes".

[click] It measures what's really there: 18 degrees.

[click] It closes the gap: the heating goes on.

[click] And it reports back: it's 19 now, and I'm heating. That's the status. Spec is written by you, status by the loop.

[click] And then it does it again. Forever. Open a window, and it just sees a bigger gap.

The document calls this level-based. It doesn't react to a list of events that it might miss: it looks at the difference between desired and observed. Missed an update? Doesn't matter, the next round sees the gap.

Now the link with today: your workload can be this loop. It reads its spec from the API, does its work, and writes what happened to status. That's the giving back. The chair's status holds the commit and its why, and our coffee settings report whether each key has a value.
-->

<style>
.dot { left: 0; top: 0; z-index: 0; width: 20px; height: 20px; border-radius: 50%; background: var(--amber); offset-path: path('M 410 290 L 1190 290 L 1190 560 L 410 560 Z'); offset-rotate: 0deg; animation: go-round 6s linear infinite; }
@keyframes go-round { to { offset-distance: 100%; } }
.diagram .step { width: 420px; height: 180px; gap: 4px; z-index: 1; }
.diagram .step b { font-size: 34px; line-height: 42px; }
.diagram .step code { font-family: var(--mono); font-size: 24px; line-height: 32px; color: var(--accent); }
.diagram .step span { font-size: 24px; line-height: 32px; color: var(--soft); }
.diagram .step.want { border-color: var(--good); }
.diagram .step.want code { color: var(--good); }
.diagram .step.report { border-color: var(--accent); }
.again { left: 640px; top: 372px; width: 320px; text-align: center; font-family: 'Caveat', cursive; font-size: 54px; line-height: 1.05; font-weight: 600; color: var(--amber); }
.slidev-layout .punch { left: 64px; top: 700px; width: 1472px; margin: 0; text-align: center; font-size: 46px; line-height: 1.2; font-weight: 700; color: var(--text); opacity: 1; }
</style>
