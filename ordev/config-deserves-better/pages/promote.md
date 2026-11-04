---
eyebrow: Promote it
clicks: 2
transition: fade
---

# Move the digest. <span class="green">Not the settings.</span>

<div class="stage">
  <div class="box reg">
    <b>Registry</b>
    <div class="v">sha256:74c70885…</div>
    <div class="v new">sha256:90dfd3b9…</div>
  </div>
  <Arrow points="500,440 618,440" />

  <div class="box env" style="left: 620px">
    <b>Test</b>
    <div class="v new">sha256:90dfd3b9…</div>
    <span class="tag">gets every change straight away</span>
  </div>

  <div class="fade gate" :class="{ off: $clicks < 1 }">
    <Arrow points="1020,440 1116,440" color="var(--amber)" />
    <div class="at who">someone agrees</div>
  </div>

  <div class="box env" :class="{ good: $clicks === 1, bad: $clicks === 2 }" style="left: 1136px">
    <b>Production</b>
    <div class="slot">
      <div class="v old fade" :class="{ off: $clicks === 1 }">sha256:74c70885…</div>
      <div class="v new fade" :class="{ off: $clicks !== 1 }">sha256:90dfd3b9…</div>
    </div>
    <span class="tag fade" :class="{ off: $clicks !== 2 }">back on the previous version</span>
  </div>
</div>

<Story>

- **test first** The registry keeps every version. Test takes the newest one straight away.
- **promote** Production waits until someone agrees. Then it takes the very same digest: nothing is rebuilt.
- **go back** Something's wrong? Point at the previous digest. That's the button I wanted in my Cloudflare panic.

</Story>

<Sources slim :items="[{ name: 'settings-image', href: 'https://github.com/ConfigButler/settings-image' }, { name: 'Flux', href: 'https://fluxcd.io/flux/components/image/' }, { name: 'Kargo', href: 'https://kargo.akuity.io' }]" />

<!--
29:00. The picture for promoting. On my cluster there's one environment today, so this part is a picture. Say that. Flux writes the digest for me today. For moving it between environments, Kargo is one tool built for that: it's installed on my cluster, but not set up yet.

Test gets every change straight away.

[click] Production waits for someone to agree. Here is the "slowing down": the settings screen stays fast, the road to production gets longer. And what goes to production is exactly what test has seen.

[click] And the road back gets shorter. Something's wrong: point at the previous digest. New pods replace the old pods, and that's the 10-minute button.
-->

<style>
.reg { left: 64px; top: 300px; width: 436px; height: 280px; gap: 16px; }
.env { top: 300px; width: 400px; height: 280px; gap: 16px; }
.reg b, .env b { font-size: 30px; line-height: 36px; }
.env .tag { min-height: 20px; font-size: 15px; line-height: 20px; }
.v {
  width: 100%; box-sizing: border-box; padding: 10px 14px; border-radius: 8px;
  font-family: var(--mono); font-size: 22px; line-height: 30px; color: var(--soft);
  background: var(--panel-deep); border: 1px solid var(--line-strong);
}
.v.new { color: var(--good); background: #101C17; border-color: #2E6B4E; }
.slot { position: relative; width: 100%; height: 52px; }
.slot .v { position: absolute; left: 0; top: 0; }
.who { left: 996px; top: 368px; width: 144px; text-align: center; font-family: 'Caveat', cursive; font-size: 30px; line-height: 1; font-weight: 600; color: var(--amber); }
</style>
