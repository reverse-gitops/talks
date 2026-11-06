---
---

<div class="at tldr-label">TLDR;</div>

# One block per stage. <span class="green">Git branches in between.</span>

<div class="stage">
  <div class="box hero screen"><b>Settings screen</b><span class="tag">people, scripts, AI</span></div>
  <Arrow points="304,455 342,455 342,300 378,300" />
  <Arrow points="342,455 342,610 378,610" />

  <div class="at stage-name" style="top: 182px">Test</div>
  <div class="zone dashed block" style="top: 212px" />
  <div class="box api" style="top: 240px"><b>kube-apiserver</b></div>
  <Arrow points="700,285 788,285" color="var(--good)" />
  <Arrow points="788,315 700,315" color="var(--good)" />
  <div class="box load" style="top: 240px"><b>Workload</b><span class="tag">reads spec, reports status</span></div>

  <div class="at stage-name" style="top: 492px">Production</div>
  <div class="zone dashed block" style="top: 522px" />
  <div class="box api" style="top: 550px"><b>kube-apiserver</b></div>
  <Arrow points="700,595 788,595" color="var(--good)" />
  <Arrow points="788,625 700,625" color="var(--good)" />
  <div class="box load" style="top: 550px"><b>Workload</b><span class="tag">reads spec, reports status</span></div>

  <div class="at way commit" style="top: 248px">commit</div>
  <Arrow points="1142,285 1268,285" color="var(--good)" />
  <Arrow points="1268,315 1142,315" color="var(--amber)" />
  <div class="at way apply" style="top: 324px">apply</div>
  <div class="box git" style="top: 235px"><b>Files in Git</b><code>branch: test</code></div>

  <div class="at way commit" style="top: 558px">commit</div>
  <Arrow points="1142,595 1268,595" color="var(--good)" />
  <Arrow points="1268,625 1142,625" color="var(--amber)" />
  <div class="at way apply" style="top: 634px">apply</div>
  <div class="box git" style="top: 545px"><b>Files in Git</b><code>branch: main</code></div>

  <Arrow points="1403,367 1403,541" color="var(--amber)" />
  <div class="at promote">promote<br>by merging</div>

  <div class="at magic">It goes both ways, so Git can promote.</div>
</div>

<style>
.tldr-label { left: 64px; top: 26px; font-family: var(--mono); font-size: 34px; font-weight: 600; line-height: 1.5; color: var(--accent); }
.diagram .screen { left: 64px; top: 385px; width: 240px; height: 140px; gap: 8px; }
.diagram .hero { background: var(--good); border-color: var(--good); }
.diagram .hero b, .diagram .hero .tag { color: var(--bg); }
.diagram .box b { font-size: 28px; line-height: 34px; }
.diagram .box .tag { font-size: 17px; line-height: 22px; }
.stage-name { left: 380px; font-family: var(--mono); font-size: 20px; line-height: 26px; letter-spacing: .1em; text-transform: uppercase; color: var(--text); }
.block { left: 380px; width: 760px; height: 176px; }
.diagram .api { left: 410px; width: 288px; height: 120px; border-color: var(--accent); }
.diagram .load { left: 790px; width: 320px; height: 120px; gap: 6px; border-color: var(--good); }
.diagram .git { left: 1270px; width: 266px; height: 130px; gap: 8px; background: var(--good); border-color: var(--good); }
.diagram .git b { color: var(--bg); }
.diagram .git code { font-family: var(--mono); font-size: 18px; line-height: 24px; font-weight: 600; color: var(--bg); background: none; }
.way { left: 1142px; width: 126px; text-align: center; font-family: var(--mono); font-size: 18px; line-height: 26px; }
.way.commit { color: var(--good); }
.way.apply { color: var(--amber); }
.promote { left: 1416px; top: 424px; font-family: var(--mono); font-size: 20px; line-height: 26px; color: var(--amber); }
.magic { left: 64px; top: 748px; width: 1472px; text-align: center; font-family: 'Caveat', cursive; font-size: 62px; line-height: 1.1; font-weight: 600; color: var(--amber); }
</style>

<!--
BACKUP, after the ask: for when someone asks how promotion or slowing down works.

One settings screen. And then a block, and that block you can simply copy: a kube-apiserver, with a workload connected to it. The workload reads its spec and reports back in status.

Each block is connected to Git in two directions. A change in the API becomes a commit, and a commit gets applied to the API.

[pause] And because it goes both ways, promotion is just Git. Test has its own branch, production is main. Merge test into main, and production's API gets the change. Want to slow down? Don't merge yet.

And something changed directly in production? That becomes a commit on main as well, so it's not lost.

Be honest: this is a sketch. My demo doesn't run it like this.
-->
