---
layout: default
transition: fade
---

###### Demo time

# This runs live. <span class="green">Look it up yourself.</span>

<ol class="steps">
  <li><b>1</b>A change is saved in the room</li>
  <li><b>2</b>It becomes a commit, then an image</li>
  <li><b>3</b>Test takes it by itself</li>
  <li><b>4</b>Production waits until a person clicks Promote</li>
</ol>

<a class="card kargo" href="https://kargo.k8s.koudijs.dev/project/demo-kargo" target="_blank">
  <span class="what">Kargo <em>· the tab I'll show you</em></span>
  <span class="url">kargo.k8s.koudijs.dev/project/demo-kargo</span>
</a>

<div class="links">
  <a class="card" href="https://demo.koudijs.dev/room" target="_blank">
    <span class="what">The room</span>
    <span class="url">demo.koudijs.dev/room</span>
    <span class="why">make the change here</span>
  </a>
  <a class="card" href="https://github.com/ConfigButler/coffee-settings" target="_blank">
    <span class="what">The commits</span>
    <span class="url">github.com/ConfigButler/coffee-settings</span>
    <span class="why">its workflow builds the image</span>
  </a>
  <a class="card" href="https://demo-test.koudijs.dev/" target="_blank">
    <span class="what">Test</span>
    <span class="url">demo-test.koudijs.dev</span>
    <span class="why">image on /dont-do-this</span>
  </a>
  <a class="card" href="https://demo-production.koudijs.dev/" target="_blank">
    <span class="what">Production</span>
    <span class="url">demo-production.koudijs.dev</span>
    <span class="why">image on /dont-do-this</span>
  </a>
</div>

<!--
30:00. Demo time. This is all running right now, and these are the real addresses: look them up on your phone. I'm only showing one tab, Kargo.

Switch to the Kargo tab. Each new image is one piece of Freight. Test already has the newest one: nobody touched it. Production doesn't.

Click Promote to production. The same digest moves on, nothing gets rebuilt.

Then going back: promote the previous Freight. That's the 10-minute button I wanted in my Cloudflare panic.

If a promotion fails, Kargo won't retry it for that Freight: press Promote by hand. Each promotion restarts the app on that stage, so its orders are forgotten.

Next: that sounds great, so now the honest part.
-->

<style>
.slidev-layout .green { color: var(--good); }
.slidev-layout .steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin: 40px 0 0; padding: 0; list-style: none; }
.slidev-layout .steps li { display: flex; align-items: flex-start; gap: 14px; margin: 0; padding: 0; font-size: 26px; line-height: 1.25; color: var(--text); }
.steps li::before { content: none; }
.steps b { flex: none; width: 44px; height: 44px; border-radius: 22px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: var(--bg); background: var(--good); }
.slidev-layout a.card { display: flex; flex-direction: column; gap: 6px; padding: 20px 24px; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 14px; text-decoration: none; }
.what { font-size: 28px; line-height: 1.2; font-weight: 700; color: var(--text); }
.what em { font-style: normal; font-weight: 500; color: var(--good); }
.url { font-family: var(--mono); font-size: 18px; line-height: 1.35; color: var(--accent); overflow-wrap: anywhere; }
.why { font-size: 20px; line-height: 1.3; color: var(--soft); }
.slidev-layout a.kargo { margin-top: 44px; border: 2px solid var(--good); }
.kargo .what { font-size: 36px; }
.kargo .url { font-size: 28px; }
.links { display: grid; grid-template-columns: 290px 490px 290px 360px; gap: 14px; margin-top: 20px; }
</style>
