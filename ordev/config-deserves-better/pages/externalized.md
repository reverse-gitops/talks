---
eyebrow: The same road, for configuration
clicks: 2
transition: fade
---

# A second stream <span class="green">next to the code</span>

<div class="stage">
  <div class="at kicker" style="left: 64px; top: 262px">CODE</div>
  <div class="box lane dev" style="left: 64px; top: 290px"><b>Devs</b></div>
  <Arrow points="254,345 292,345" />
  <div class="box lane" style="left: 294px; top: 290px"><b>Git</b></div>
  <div class="box lane" style="left: 474px; top: 290px"><b>CI</b></div>
  <Arrow points="434,345 472,345" />
  <Arrow points="614,345 662,345" />

  <div class="fade" :class="{ off: $clicks < 1 }">
    <div class="at kicker green" style="left: 64px; top: 492px">CONFIGURATION</div>
    <div class="box lane user" style="left: 64px; top: 520px"><b>End users</b><span class="tag">settings screen<br>no Git needed</span></div>
    <div class="box lane cfg" style="left: 294px; top: 520px"><b>Git</b><span class="tag">another repository</span></div>
    <div class="box lane cfg" style="left: 474px; top: 520px"><b>CI</b></div>
    <Arrow points="254,575 292,575" color="var(--amber)" />
    <Arrow points="434,575 472,575" color="var(--good)" />
    <Arrow points="614,575 662,575" color="var(--good)" />
  </div>

  <div class="box reg">
    <b>Registry</b>
    <div class="ref code">shop:1.4</div>
    <div class="ref cfg fade" :class="{ off: $clicks < 1 }">shop-settings:43</div>
  </div>

  <div class="zone pod fade" :class="{ off: $clicks < 2 }">
    <div class="kicker">ONE POD, TWO VERSIONS</div>
    <div class="box part code"><b>The app</b><span class="tag">shop:1.4</span></div>
    <div class="box part cfg"><b>A read-only folder</b><span class="tag">shop-settings:43</span></div>
  </div>
  <Arrow class="fade" :class="{ off: $clicks < 2 }" points="924,445 998,445" />
</div>

<Story>

- **externalised** You already keep configuration outside your code. That's why one build runs everywhere.
- **a second stream** Give it its own stream: own commits, own build, own versions, same registry. End users keep their settings screen: no Git needed.
- **one pod** The pod states exactly what it runs: this version of the code, and this version of the settings.

</Story>

<!--
13:00. You already externalise configuration. That's the good part: one build, every environment.

[click] But it falls off the road: it never gets the commit, the build or the version. So give it its own stream, with the same tools you already have. And your end users stay in front of it: they keep their settings screen and never need to know Git.

[click] And then the pod says exactly what it runs. Hold that thought, we'll get there. First we have to make configuration something you can put in Git.
-->

<style>
.lane { width: 140px; height: 110px; gap: 4px; }
.lane b { font-size: 24px; line-height: 30px; }
.lane .tag { font-size: 13px; line-height: 18px; }
.lane.cfg { border-color: #2E6B4E; }
.lane.dev { width: 190px; }
.lane.user { width: 190px; border-color: var(--amber); }
.lane.user .tag { color: var(--amber); }
.reg { left: 664px; top: 290px; width: 260px; height: 340px; gap: 18px; border-color: var(--accent); }
.reg b { font-size: 26px; line-height: 32px; }
.ref {
  width: 100%; box-sizing: border-box; padding: 10px 12px; border-radius: 8px;
  font-family: var(--mono); font-size: 16px; line-height: 24px;
}
.ref.code { color: var(--accent); background: #0F1A26; border: 1px solid #2D5D85; }
.ref.cfg { color: var(--good); background: #101C17; border: 1px solid #2E6B4E; }
.pod { left: 1000px; top: 250px; width: 536px; height: 420px; padding: 24px; }
.part { position: relative; width: 100%; height: 140px; gap: 6px; margin-top: 16px; }
.part b { font-size: 26px; line-height: 32px; }
.part .tag { font-size: 15px; line-height: 20px; }
.part.code { border-color: #2D5D85; }
.part.cfg { border-color: #2E6B4E; }
</style>
