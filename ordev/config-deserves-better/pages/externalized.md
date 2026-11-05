---
eyebrow: The road we already know
clicks: 7
transition: fade
---

# <span v-if="$clicks < 4">You know this picture</span><span v-else>A second stream <span class="green">next to the code</span></span>

<!--
  Code:     click 1 new build, 2 to test, 3 to production.
  Settings: click 4 the row appears, 5 new version, 6 to test, 7 to production.
  The second row's space is kept empty from the start, so nothing moves when it arrives.
  A version swaps when its flying pill lands: see .late.
  The e2e chip belongs to the Test environment: it runs when a version lands there (clicks 2 and 6), on the same click.
-->
<div class="stage">

  <!-- the big containers first, so the arrows land on top of them -->
  <div class="box reg"><b>Registry</b></div>
  <div class="box cd"><b>CD</b><span class="tag">rolls it out</span></div>
  <div class="zone env" style="left: 1036px"><b>Test</b></div>
  <div class="zone env" style="left: 1311px"><b>Production</b></div>

  <!-- the code lane -->
  <div class="at kicker" style="left: 64px; top: 246px">CODE</div>
  <div class="box lane who" style="left: 64px; top: 270px"><b>Devs</b></div>
  <div class="box lane" style="left: 281px; top: 270px"><b>Git</b><span class="tag">a commit, reviewed</span></div>
  <div class="box lane" style="left: 448px; top: 270px"><b>CI</b><span class="tag">build and test</span></div>
  <Arrow points="234,325 279,325" />
  <Arrow points="401,325 446,325" />
  <Arrow points="568,325 613,325" />
  <Arrow points="845,325 907,325" />
  <Arrow points="989,325 1048,325" />
  <Arrow points="1249,325 1323,325" :color="$clicks === 3 ? 'var(--good)' : 'var(--arrow)'" :dash="$clicks === 3 ? '6 6' : undefined" />

  <!-- the configuration lane: its place is kept from the first frame -->
  <div class="fade" :class="{ off: $clicks < 4 }">
    <div class="at kicker green" style="left: 64px; top: 496px">CONFIGURATION</div>
    <div class="box lane who user" style="left: 64px; top: 520px"><b>End users</b><span class="tag">settings screen<br>no Git needed</span></div>
    <div class="box lane cfg" style="left: 281px; top: 520px"><b>Git</b><span class="tag">another repository</span></div>
    <div class="box lane cfg" style="left: 448px; top: 520px"><b>CI</b></div>
    <Arrow points="234,575 279,575" color="var(--amber)" />
    <Arrow points="401,575 446,575" color="var(--good)" />
    <Arrow points="568,575 613,575" color="var(--good)" />
    <Arrow points="845,575 907,575" color="var(--good)" />
    <Arrow points="989,575 1048,575" color="var(--good)" />
    <Arrow points="1249,575 1323,575" :color="'var(--good)'" :dash="$clicks === 7 ? '6 6' : undefined" />
  </div>

  <!-- the versions in the registry, each level with its lane -->
  <div class="at ref code" style="top: 285px">shop:1.3</div>
  <div class="at ref code fade late" :class="{ off: $clicks < 1 }" style="top: 335px">shop:1.4</div>
  <div class="at ref cfg fade" :class="{ off: $clicks < 4 }" style="top: 535px">shop-settings:42</div>
  <div class="at ref cfg fade late" :class="{ off: $clicks < 5 }" style="top: 585px">shop-settings:43</div>

  <!-- one pod per environment: the code on top, the settings below -->
  <div class="box slot late" :class="{ fresh: $clicks === 2 }" style="left: 1050px; top: 275px">
    <b>The app</b>
    <span class="ver"><span class="fade late" :class="{ off: $clicks >= 2 }">shop:1.3</span><span class="fade late now" :class="{ off: $clicks < 2 }">shop:1.4</span></span>
  </div>
  <div class="box slot late" :class="{ fresh: $clicks === 3 }" style="left: 1325px; top: 275px">
    <b>The app</b>
    <span class="ver"><span class="fade late" :class="{ off: $clicks >= 3 }">shop:1.3</span><span class="fade late now" :class="{ off: $clicks < 3 }">shop:1.4</span></span>
  </div>

  <div class="fade" :class="{ off: $clicks < 4 }">
    <div class="box slot settings late" :class="{ fresh: $clicks === 6 }" style="left: 1050px; top: 525px">
      <b>A read-only folder</b>
      <span class="ver"><span class="fade late" :class="{ off: $clicks >= 6 }">shop-settings:42</span><span class="fade late now" :class="{ off: $clicks < 6 }">shop-settings:43</span></span>
    </div>
    <div class="box slot settings late" :class="{ fresh: $clicks === 7 }" style="left: 1325px; top: 525px">
      <b>A read-only folder</b>
      <span class="ver"><span class="fade late" :class="{ off: $clicks >= 7 }">shop-settings:42</span><span class="fade late now" :class="{ off: $clicks < 7 }">shop-settings:43</span></span>
    </div>
  </div>

  <!-- the e2e tests run against the Test environment, whichever stream just landed there -->
  <div class="at e2e fade late" :class="{ off: $clicks < 2, run: $clicks === 2 || $clicks === 6 }">
    <span class="busy">e2e tests running…</span>
    <span class="pass">✓ e2e tests passed</span>
  </div>

  <!-- the words that belong to one step -->
  <div class="at once fade" :class="{ off: $clicks !== 3 }">build once, move the same thing</div>
  <div class="at depends fade" :class="{ off: $clicks !== 3 }">Your ingredients will differ. It all depends.</div>
  <div class="at pod-note fade" :class="{ off: $clicks < 7 }" style="left: 1036px">ONE POD, TWO VERSIONS</div>
  <div class="at pod-note fade" :class="{ off: $clicks < 7 }" style="left: 1311px">ONE POD, TWO VERSIONS</div>

  <!-- one-shot motions: what is moving along the road on this click -->
  <div v-if="$clicks === 1" class="fly code" style="--x0: 90px; --y0: 310px; --x1: 460px; --y1: 310px">a commit</div>
  <div v-if="$clicks === 2" class="fly code" style="--x0: 640px; --y0: 340px; --x1: 1085px; --y1: 340px">shop:1.4</div>
  <div v-if="$clicks === 3" class="fly code" style="--x0: 1085px; --y0: 340px; --x1: 1360px; --y1: 340px">shop:1.4</div>
  <div v-if="$clicks === 5" class="fly cfg" style="--x0: 90px; --y0: 560px; --x1: 460px; --y1: 560px">a setting</div>
  <div v-if="$clicks === 6" class="fly cfg" style="--x0: 640px; --y0: 590px; --x1: 1070px; --y1: 590px">shop-settings:43</div>
  <div v-if="$clicks === 7" class="fly cfg" style="--x0: 1070px; --y0: 590px; --x1: 1345px; --y1: 590px">shop-settings:43</div>
</div>

<Story>

- **the picture** Commit, build, store, roll out. Every step leaves something you can look at.
- **new build** A new commit becomes shop:1.4 in the registry. Nothing is running it yet.
- **to test** CD rolls shop:1.4 out to test and the e2e tests run against it. Production stays on shop:1.3.
- **to production** The very thing test has seen moves on to production. Nothing gets rebuilt.
- **a second stream** Configuration gets its own commits, its own build, its own versions. Same registry.
- **a change** An end user saves a setting on their screen. No Git needed: it becomes shop-settings:43.
- **to test** Same road: test gets the new settings first, and the same e2e tests run. Production stays on shop-settings:42.
- **to production** No new build of the code. The pod states exactly what it runs: shop:1.4 and shop-settings:43.

</Story>

<!--
27:00. We can point at a digest now, and one pod is running it. Remember the commits: an audit log, not delivery yet. So how do we deliver? The normal, regular process. Everybody here recognises this: Git, CI, an artifact in a registry, CD, your environments. The empty space is for later.

[click] New code. A commit, a build, and a new version in the registry. Nothing runs it yet.

[click] It goes to test first, and we run our e2e tests against that environment: does it work like we intended? Production is still on the old version.

[click] Then production. We build once: what reaches production is the very thing test has seen. A word on ingredients: I don't know your exact system, and as a good consultant once said: it all depends.

[click] You already externalise configuration. That's the good part: one build, every environment. But it falls off the road: it never gets the commit, the build or the version. So give it its own stream, with the same tools you already have. And your end users stay in front of it: they keep their settings screen and never need to know Git.

[click] Now somebody changes a setting. A new version of the settings, in the same registry.

[click] To test first. Exactly the same step as the code, and the same e2e tests run again: now they check the new settings too.

[click] And to production, without a new build of the code. The pod says exactly what it runs: this version of the code, and this version of the settings. Let's see that live.
-->

<style>
.lane { width: 120px; height: 110px; gap: 4px; }
.lane b { font-size: 24px; line-height: 30px; }
.lane .tag { font-size: 13px; line-height: 18px; }
.lane.who { width: 170px; }
.lane.cfg { border-color: #2E6B4E; }
.lane.user { border-color: var(--amber); }
.lane.user .tag { color: var(--amber); }

.reg { left: 615px; top: 210px; width: 230px; height: 460px; justify-content: flex-start; padding-top: 18px; border-color: var(--accent); }
.reg b { font-size: 26px; line-height: 32px; }
.ref {
  left: 631px; width: 198px; height: 40px; box-sizing: border-box; display: flex; align-items: center; justify-content: center;
  border-radius: 8px; font-family: var(--mono); font-size: 16px;
}
.ref.code { color: var(--accent); background: #0F1A26; border: 1px solid #2D5D85; }
.ref.cfg { color: var(--good); background: #101C17; border: 1px solid #2E6B4E; }

.cd { left: 909px; top: 210px; width: 80px; height: 460px; gap: 6px; padding: 8px; }
.cd b { font-size: 24px; line-height: 30px; }
.cd .tag { font-size: 12px; line-height: 16px; }

.env { top: 210px; width: 225px; height: 460px; padding-top: 16px; text-align: center; }
.env b { font-size: 24px; line-height: 30px; }
.slot { width: 197px; height: 100px; gap: 6px; padding: 8px; border-color: #2D5D85; }
.slot.settings { border-color: #2E6B4E; }
.slot b { font-size: 18px; line-height: 26px; white-space: nowrap; }
.slot.fresh { border-color: var(--good); box-shadow: 0 0 0 4px rgba(126, 224, 161, .25); }
.ver { position: relative; width: 100%; height: 20px; font-family: var(--mono); font-size: 15px; line-height: 20px; color: var(--accent); }
.slot.settings .ver { color: var(--good); }
.ver span { position: absolute; left: 0; right: 0; }
.slot .ver .now { color: var(--good); }

/* a new version shows up when its flying pill lands */
.late.late { transition-delay: .9s; }

/* The chip shows the last result until the new version lands, then runs: same timing on clicks 2 and 6. */
.e2e { left: 1050px; top: 388px; width: 197px; height: 36px; }
.e2e span {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; white-space: nowrap;
  border-radius: 8px; font-family: var(--mono); font-size: 15px;
}
.e2e .busy { opacity: 0; color: var(--amber); background: #1F1A10; border: 1px solid var(--amber); }
.e2e .pass { color: var(--good); background: #101C17; border: 1px solid var(--good); }
.e2e.run .busy { animation: e2e-busy 2.8s linear both; }
.e2e.run .pass { animation: e2e-pass 2.8s linear both; }
@keyframes e2e-busy {
  0%, 37% { opacity: 0; }
  38%, 88% { opacity: 1; }
  89%, 100% { opacity: 0; }
}
@keyframes e2e-pass {
  0%, 37% { opacity: 1; }
  38%, 88% { opacity: 0; }
  89%, 100% { opacity: 1; }
}

.once { left: 1036px; top: 684px; width: 500px; text-align: center; font-family: var(--mono); font-size: 18px; color: var(--good); }
.depends { left: 64px; top: 410px; width: 520px; font-family: 'Caveat', cursive; font-size: 48px; line-height: 1; font-weight: 600; color: var(--amber); transform: rotate(-1.5deg); }
.pod-note { top: 436px; width: 225px; text-align: center; font-family: var(--mono); font-size: 12px; letter-spacing: .1em; color: var(--good); }

.fly {
  position: absolute; left: 0; top: 0; z-index: 5; height: 30px; box-sizing: border-box; padding: 0 10px;
  display: flex; align-items: center; white-space: nowrap; border-radius: 8px;
  font-family: var(--mono); font-size: 14px; animation: fly 1.1s ease-in-out both;
}
.fly.code { color: var(--accent); background: #0F1A26; border: 1px solid var(--accent); }
.fly.cfg { color: var(--good); background: #101C17; border: 1px solid var(--good); }
@keyframes fly {
  0% { opacity: 0; transform: translate(var(--x0), var(--y0)); }
  12% { opacity: 1; transform: translate(var(--x0), var(--y0)); }
  88% { opacity: 1; transform: translate(var(--x1), var(--y1)); }
  100% { opacity: 0; transform: translate(var(--x1), var(--y1)); }
}
</style>
