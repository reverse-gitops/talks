---
layout: default
transition: fade
---

###### The real settings of the coffee shop

# Three files. <span class="green">Safe to commit.</span>

<div class="three">
  <div class="file"><b>coffeeconfig.yaml</b><span class="role">refers to the secrets by name</span><pre v-pre>kind: CoffeeConfig
metadata:
  name: demo-coffee
spec:
  shopName: Coffee order system
  mail:
    apiKeySecretRef:
      <mark>name: coffee-mail</mark>
  payments:
    apiKeySecretRef:
      <i>name: coffee-payments</i></pre></div>
  <div class="links"><span class="to-mail">→</span><span class="to-payments">→</span></div>
  <div class="secrets">
    <div class="file secret"><b>coffee-mail.sops.yaml</b><pre v-pre>kind: Secret
<mark>name: coffee-mail</mark>
apiKey: <em>ENC[AES256_GCM,data:Qdw1fCKT…</em></pre></div>
    <div class="file secret"><b>coffee-payments.sops.yaml</b><pre v-pre>kind: Secret
<i>name: coffee-payments</i>
apiKey: <em>ENC[AES256_GCM,data:m93YmS91…</em></pre></div>
  </div>
</div>

<p class="punch">The config says which secret it needs. The secret itself stays encrypted.</p>

<Sources slim :items="[{ name: 'coffee-settings', href: 'https://github.com/ConfigButler/coffee-settings' }]" />

<!--
So this is what we end up with, and these are the real files of the coffee shop. Three files.

One CoffeeConfig. It doesn't hold the API keys: it refers to two Secrets by name, coffee-mail and coffee-payments.

And those two Secrets, encrypted in place, like we just saw. All three are safe to commit.

Remember these three files: we'll see them again when we package them.
-->

<style>
.slidev-layout h1 .green { color: var(--good); }
.three { display: grid; grid-template-columns: 660px 1fr 700px; align-items: stretch; margin-top: 24px; }
.file { display: flex; flex-direction: column; gap: 4px; box-sizing: border-box; padding: 20px 26px; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 12px; }
.file b { font-family: var(--mono); font-size: 24px; line-height: 32px; font-weight: 600; color: var(--accent); }
.file.secret b { color: var(--amber); }
.role { font-size: 20px; line-height: 28px; color: var(--soft); }
.file pre { margin: 10px 0 0; font-family: var(--mono); font-size: 22px; line-height: 32px; color: var(--soft); background: none; white-space: pre; }
.file mark { color: var(--good); background: none; font-weight: 600; }
.file i { font-style: normal; color: var(--accent); font-weight: 600; }
.file em { font-style: normal; font-weight: 600; color: var(--amber); }
.secrets { display: flex; flex-direction: column; justify-content: space-between; gap: 20px; }
.secrets .file { flex: 1; justify-content: center; }
.links { display: flex; flex-direction: column; justify-content: space-around; align-items: center; font-size: 44px; }
.to-mail { color: var(--good); }
.to-payments { color: var(--accent); }
.punch { margin-top: 28px; font-size: 32px; line-height: 1.3; color: var(--soft); }
</style>
