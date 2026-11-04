---
eyebrow: The main point
clicks: 3
transition: fade
---

# Any file. <span class="green">One image.</span>

<div class="stage">
  <div class="at files">
    <div class="file"><i>YAML</i>settings.yaml</div>
    <div class="file"><i>XML</i>tax-rules.xml</div>
    <div class="file"><i>INI</i>legacy-printer.ini</div>
    <div class="file"><i>JPG</i>avatars/simon.jpg</div>
  </div>

  <div class="fade" :class="{ off: $clicks < 1 }">
    <Arrow points="470,430 568,430" color="var(--good)" />
    <div class="box image">
      <b>shop-settings</b>
      <span class="digest">sha256:7f3a91c2…</span>
      <span class="tag">no base image, no shell, nothing executes</span>
    </div>
  </div>

  <div class="at claim fade" :class="{ off: $clicks < 2 }">
    <strong>The complete model</strong>
    <span>of the current desired state, as your end users configured it</span>
  </div>

  <div class="at claim second fade" :class="{ off: $clicks < 3 }">
    <strong>A clear place to point at</strong>
    <span>“What is production running?”<br><em>This digest.</em></span>
  </div>
</div>

<Story>

- **any file** Your app doesn't have to change its format: YAML, XML, INI, or a JPG.
- **an image** It's all packaged into a plain container image, stored right next to your code. The same files always give the same digest.
- **the model** Not a pile of changes on top of a table, but everything in one thing.
- **point at it** One line answers what's running. It also answers what was running an hour ago.

</Story>

<Sources slim :items="[{ name: 'settings-image', href: 'https://github.com/ConfigButler/settings-image' }]" />

<!--
21:30. This is the part to take your time on.

You can package whatever your application already reads. YAML, XML, INI files, even the JPG of someone's avatar. Your app doesn't have to change.

[click] It all goes into a container image. No base image, no shell: just your files. The same files give the same digest, on any machine.

[click] And that image is the complete model of the current desired state, as an end user configured it.

[click] Which gives you a clear place to point at. What is production running? This digest. Remember my 10-minute button? You can only build that if there's something to go back to.
-->

<style>
.files { left: 64px; top: 240px; width: 400px; display: flex; flex-direction: column; gap: 16px; }
.file {
  display: flex; align-items: center; gap: 14px; height: 80px; box-sizing: border-box; padding: 0 16px;
  background: var(--panel); border: 1px solid var(--line-strong); border-radius: 12px;
  font-family: var(--mono); font-size: 18px; color: var(--soft);
}
.file i { flex: none; width: 76px; font-style: normal; font-weight: 600; font-size: 20px; color: var(--accent); }
.image { left: 570px; top: 300px; width: 400px; height: 260px; gap: 16px; border: 2px solid var(--good); }
.image b { font-size: 32px; line-height: 38px; }
.digest { font-family: var(--mono); font-size: 24px; color: var(--good); }
.image .tag { font-size: 14px; line-height: 20px; }
.claim { left: 1030px; top: 250px; width: 506px; display: flex; flex-direction: column; gap: 10px; }
.claim.second { top: 470px; }
.claim strong { font-size: 40px; line-height: 46px; }
.claim span { font-size: 25px; line-height: 34px; color: var(--soft); }
.claim em { font-style: normal; font-weight: 700; color: var(--good); }
</style>
