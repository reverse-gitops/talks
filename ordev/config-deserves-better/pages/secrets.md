---
layout: default
transition: fade
---

###### What just happened to that word

# Ciphertext <span class="green">until the very last moment.</span>

<div class="road">
  <div class="stop"><b>Git</b><span>ciphertext</span></div><i>→</i>
  <div class="stop"><b>CI</b><span>ciphertext, holds no key</span></div><i>→</i>
  <div class="stop"><b>Registry</b><span>ciphertext</span></div><i>→</i>
  <div class="stop pod"><b>Your pod</b><span>opened in memory, with its own identity</span></div>
</div>

```yaml
kind: Secret
metadata:
    name: coffee-mail                       # the name stays readable
data:
    apiKey: ENC[AES256_GCM,data:gxfeGP4qKRyhDE…]
```

<p class="punch">A registry is not a secret store. <strong>But the API key from the start now has a version too.</strong></p>

<Sources slim :items="[{ name: 'SOPS', href: 'https://getsops.io' }, { name: 'age', href: 'https://age-encryption.org' }, { name: 'OpenBao', href: 'https://openbao.org' }]" />

<!--
≈1:00, no more. You just saw it, so don't walk through it.

Git, CI and the registry only ever see ciphertext. Very late, the pod's init container logs in to OpenBao with its own ServiceAccount token, gets the key, and opens the file into a memory-only volume.

And that closes the story from the start: Alice's API key now has a commit, a version and a way back.

Someone asks about key management: hallway conversation. Don't claim nobody can read it: the file has two recipients, the operator's key and my own.
-->

<style>
.road { display: flex; align-items: stretch; gap: 16px; margin: 20px 0 30px; }
.road i { align-self: center; font-style: normal; font-size: 30px; color: var(--arrow); }
.stop { flex: 1; display: flex; flex-direction: column; gap: 6px; padding: 18px 22px; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 12px; }
.stop b { font-size: 30px; line-height: 1.2; }
.stop span { font-size: 22px; line-height: 1.3; color: var(--soft); }
.stop.pod { flex: 1.3; border-color: var(--good); }
.slidev-layout :deep(pre) { font-size: 22px !important; line-height: 1.5 !important; padding: 20px 26px !important; border-radius: 12px; }
.slidev-layout :deep(pre code) { background: none; padding: 0; }
.punch { margin-top: 30px; font-size: 32px; line-height: 1.3; color: var(--soft); }
</style>
