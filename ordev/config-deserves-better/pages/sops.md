---
layout: default
transition: fade
---

###### One of the possible ways

# A secret, <span class="green">encrypted in place.</span>

<div class="pair">
  <div class="file plain"><b>coffee-mail.sops.yaml</b><span class="role">before: we never commit this</span><pre v-pre>kind: Secret
metadata:
  name: coffee-mail
stringData:
  apiKey: <em>my-plain-password</em></pre></div>
  <div class="link">→</div>
  <div class="file secret"><b>coffee-mail.sops.yaml</b><span class="role">after: the same file, only the value is encrypted</span><pre v-pre>kind: Secret
metadata:
  name: coffee-mail
stringData:
  apiKey: <em>ENC[AES256_GCM,data:Qdw1fCKT…</em>
sops:
  age:
    - recipient: age1cv6yz3f0…</pre></div>
</div>

<p class="command"><span>$</span> sops encrypt --in-place coffee-mail.sops.yaml</p>

<div class="points">
  <div><strong>In place</strong><span>Git still shows the shape. Only the value is hidden.</span></div>
  <div><strong>With a key</strong><span>Encrypt with the public key. Only the private key decrypts.</span></div>
  <div><strong>One possible way</strong><span>This is SOPS with age. It's not the only option.</span></div>
</div>

<Sources slim :items="[{ name: 'SOPS', href: 'https://getsops.io' }, { name: 'age', href: 'https://age-encryption.org' }]" />

<!--
A secret is one of these files too. Keep it simple: encrypting and decrypting are separate steps. Here's one way to do that. Start with a normal Secret object, with the plain password in it. That one is made up, and we are never going to commit this.

Then you encrypt it in place with SOPS. It stays the same file with the same shape, and only the value changes. So a diff still shows that the key changed and who changed it, not what it is. And the name stays readable, so be aware of that.

It's encrypted with a key. The public key is enough to encrypt, and only the private key can decrypt it.

This is one of the possible ways. I use SOPS with age here, and there are other good options. The idea stays the same: encrypted before it reaches Git, decrypted only in your pod.
-->

<style>
.slidev-layout h1 .green { color: var(--good); }
.pair { display: grid; grid-template-columns: 620px 1fr 760px; align-items: center; margin-top: 24px; }
.file { display: flex; flex-direction: column; gap: 4px; box-sizing: border-box; height: 384px; padding: 20px 26px; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 12px; }
.file b { font-family: var(--mono); font-size: 24px; line-height: 32px; font-weight: 600; color: var(--amber); }
.role { font-size: 20px; line-height: 28px; color: var(--soft); }
.file pre { margin: 12px 0 0; font-family: var(--mono); font-size: 22px; line-height: 32px; color: var(--soft); background: none; white-space: pre; }
.file em { font-style: normal; font-weight: 600; color: var(--amber); }
.file.plain { border-color: var(--bad); }
.file.plain .role, .file.plain em { color: var(--bad); }
.link { text-align: center; font-size: 44px; color: var(--good); }
.slidev-layout .command { margin: 22px 0 0; font-family: var(--mono); font-size: 26px; line-height: 36px; color: var(--text); opacity: 1; }
.command span { color: var(--good); }
.points { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-top: 22px; }
.points div { display: flex; flex-direction: column; gap: 4px; }
.points strong { font-size: 30px; line-height: 36px; color: var(--text); }
.points span { font-size: 24px; line-height: 32px; color: var(--soft); }
</style>
