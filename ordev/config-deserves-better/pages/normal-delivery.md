---
eyebrow: How we do this for code
clicks: 2
transition: fade
---

# You know this picture

<div class="stage">
  <Arrow points="244,380 298,380" />
  <Arrow points="480,380 534,380" />
  <Arrow points="716,380 770,380" />
  <Arrow points="952,380 1058,380" />
  <Arrow points="1240,380 1354,380" />

  <div class="box step" style="left: 64px"><b>Git</b><span class="tag">a commit, reviewed</span></div>
  <div class="box step" style="left: 300px"><b>CI</b><span class="tag">build and test</span></div>
  <div class="box step hero" style="left: 536px"><b>Registry</b><span class="tag">a versioned artifact</span></div>
  <div class="box step" style="left: 772px"><b>CD</b><span class="tag">rolls it out</span></div>
  <div class="box step" style="left: 1060px"><b>Test</b></div>
  <div class="box step" style="left: 1356px"><b>Production</b></div>

  <div class="fade" :class="{ off: $clicks < 1 }">
    <div class="at pill" style="left: 536px">shop:1.4</div>
    <div class="at pill" style="left: 1060px">shop:1.4</div>
    <div class="at pill" style="left: 1356px">shop:1.4</div>
    <Arrow points="716,500 1058,500" color="var(--good)" dash="6 6" />
    <Arrow points="1240,500 1354,500" color="var(--good)" dash="6 6" />
    <div class="at note" style="left: 760px; top: 524px">build once, move the same thing</div>
  </div>

  <div class="at depends fade" :class="{ off: $clicks < 2 }">Your ingredients will differ. It all depends.</div>
</div>

<Story>

- **the process** Commit, build, store, deploy. Every step leaves something you can look at.
- **promote** We build once, and move that same artifact through the environments.
- **ingredients** I don't know your exact system, and that's fine: the shape is what counts.

</Story>

<!--
10:00. The normal, regular process. Everybody here recognises this.
Git, CI, an artifact in a registry, CD, your environments.

[click] A word on promoting: we build once. What reaches production is the very thing test has seen.

[click] A word on ingredients. I don't know your exact system, and as a good consultant once said: it all depends.
-->

<style>
.step { top: 310px; width: 180px; height: 140px; gap: 8px; }
.step b { font-size: 26px; line-height: 32px; }
.step .tag { font-size: 13px; line-height: 18px; }
.hero { border-color: var(--accent); }
.pill {
  top: 480px; width: 180px; height: 40px; display: flex; align-items: center; justify-content: center;
  background: #101C17; border: 1px solid #2E6B4E; border-radius: 8px;
  font-family: var(--mono); font-size: 18px; color: var(--good);
}
.note { font-family: var(--mono); font-size: 16px; color: var(--good); }
.depends { left: 64px; top: 620px; font-family: 'Caveat', cursive; font-size: 54px; line-height: 1; font-weight: 600; color: var(--amber); transform: rotate(-1.5deg); }
</style>
