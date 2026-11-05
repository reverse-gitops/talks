---
eyebrow: The main point
clicks: 3
transition: fade
---

# Your files. <span class="green">One image.</span>

<div class="stage">
  <div class="at files">
    <div class="file"><b>coffeeconfig.yaml</b><pre v-pre>kind: CoffeeConfig
shopName: Coffee order system
mail:
  apiKeySecretRef:
    name: coffee-mail</pre></div>
    <div class="file secret"><b>coffee-mail.sops.yaml</b><pre v-pre>kind: Secret
name: coffee-mail
apiKey: ENC[AES256_GCM,data:Qdw1fCKT…</pre></div>
    <div class="file secret"><b>coffee-payments.sops.yaml</b><pre v-pre>kind: Secret
name: coffee-payments
apiKey: ENC[AES256_GCM,data:m93YmS91…</pre></div>
  </div>

  <div class="fade" :class="{ off: $clicks < 1 }">
    <Arrow points="510,430 568,430" color="var(--good)" />
    <div class="box image">
      <b>coffee-settings</b>
      <span class="digest">sha256:00b28189…</span>
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

- **your files** A real example: the coffee shop's settings, and its two secrets, encrypted.
- **an image** It's all packaged into a plain container image, stored right next to your code. The same files always give the same digest.
- **the model** Not a pile of changes on top of a table, but everything in one thing.
- **point at it** One line answers what's running. It also answers what was running an hour ago.

</Story>

<Sources slim :items="[{ name: 'coffee-settings', href: 'https://github.com/ConfigButler/coffee-settings' }, { name: 'settings-image', href: 'https://github.com/ConfigButler/settings-image' }]" />

<!--
19:30. This is the part to take your time on.

This is a real example: the files of the coffee shop you'll see later. One CoffeeConfig, which points at two Secrets. Those two stay encrypted. You can package whatever your application already reads, so your app doesn't have to change.

[click] It all goes into a container image. No base image, no shell: just your files. The same files give the same digest, on any machine: I changed this menu and changed it back, and that image got this exact digest again.

[click] And that image is the complete model of the current desired state, as an end user configured it.

[click] Which gives you a clear place to point at. What is production running? This digest. Remember my 10-minute button? You can only build that if there's something to go back to.
-->

<style>
.files { left: 64px; top: 205px; width: 440px; display: flex; flex-direction: column; gap: 14px; }
.file { display: flex; flex-direction: column; gap: 6px; box-sizing: border-box; padding: 12px 16px; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 12px; }
.file b { font-family: var(--mono); font-size: 18px; line-height: 24px; font-weight: 600; color: var(--accent); }
.file pre { margin: 0; font-family: var(--mono); font-size: 16px; line-height: 23px; color: var(--soft); background: none; white-space: pre; }
.file.secret b { color: var(--amber); }
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
