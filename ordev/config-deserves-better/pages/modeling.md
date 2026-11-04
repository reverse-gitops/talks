---
eyebrow: Reverser · Config as KRM
diveIn: 300px 330px
diveOut: 820px 420px
clicks: 3
---

# Design it so it can <span class="violet">remember</span>.

Config as Kubernetes resources (KRM): not just the value, but the why, the expiry, the last test.

<!-- elements with .fade + --d appear at a click, --d seconds after arriving on it -->
<div class="stage">

<!-- arrows between the cards, and the decrypt path -->
<Arrow points="524,368 555,368" color="var(--good)" class="fade" :class="{ off: $clicks < 1 }" style="--d: .2s" />
<Arrow points="1080,368 1115,368" color="var(--amber)" class="fade" :class="{ off: $clicks < 1 }" style="--d: 1.1s" />
<div class="fade" :class="{ off: $clicks < 3 }">
  <Arrow points="1328,396 1328,431" color="var(--amber)" dash="6 6" />
  <Arrow points="1250,532 1250,595" color="var(--amber)" />
  <Arrow points="1410,600 1410,537" color="var(--good)" />
  <div class="at tag amber" style="left: 1176px; top: 556px">decrypt</div>
  <div class="at tag green" style="left: 1420px; top: 556px">key</div>
  <div class="card plain" style="left: 1120px; top: 436px; width: 416px; height: 96px; display: flex; align-items: center">
    <span><b class="pod">Pod</b> <span class="sub">· orderer</span><br><span class="tag">serviceAccountName: orderer · workload identity</span></span>
  </div>
  <div class="card amber-card kms" style="left: 1120px; top: 600px; width: 416px; height: 68px">
    <span><b>Cloud KMS</b> <span class="sub">· key orderer-config</span><br><span class="sub">only the app’s identity may decrypt</span></span>
  </div>
</div>

<!-- EmailSettings: the secret field turns into a reference -->
<div class="card green-card" style="left: 64px; top: 220px; width: 460px; height: 176px">
<div class="head"><b>EmailSettings</b> <span>· StroopwafelOrderer config, in KCP</span></div>
<div><span class="k">kind:</span> <span class="v">EmailSettings</span></div>
<div><span class="k">metadata:</span> { <span class="k">name:</span> <span class="v">order-confirmations</span> }</div>
<div><span class="k">spec:</span></div>
<div class="i1"><span class="k">sender:</span> <span class="v">orders@stroopwafel.nl</span></div>
<div class="i1"><span class="k">templateId:</span> <span class="v">order-confirmed</span></div>
<div class="keyline" :class="{ swapped: $clicks >= 1 }">
  <div class="i1 old"><span class="k">apiKey:</span> <s class="red">SG.Hk3p…wQ9</s> <span class="red">&nbsp;# a secret in config</span></div>
  <div class="i1 new"><span class="k">apiKeyRef:</span> <span class="v">sendgrid</span></div>
</div>
</div>

<!-- the four points -->
<div class="at point fade" :class="{ off: $clicks < 1 }" style="top: 420px; --d: .7s"><b class="blue">spec</b> <span>· what we <i>meant</i>: rights, expiry, the ticket</span></div>
<div class="at point fade" :class="{ off: $clicks < 2 }" style="top: 466px; --d: .5s"><b class="violet">status</b> <span>· what <i>happened</i>: last tested, last used</span></div>
<div class="at point fade" :class="{ off: $clicks < 2 }" style="top: 512px; --d: 1.2s"><b>the why</b> <span>· in the commit message</span></div>
<div class="at point" style="top: 558px"><b class="amber">the value</b> <span>· lives in a Secret: other RBAC, other eyes</span></div>

<!-- ApiKey: spec (reviewed in Git) and status (written by a controller) -->
<div class="card plain green-line pop fade" :class="{ off: $clicks < 1 }" style="left: 560px; top: 200px; width: 520px; height: 450px; --d: .1s">
<div class="region spec-region fade" :class="{ off: $clicks < 1 }" style="--d: .5s" />
<div class="region status-region fade" :class="{ off: $clicks < 2 }" style="--d: .1s" />
<div class="badge blue-badge fade" :class="{ off: $clicks < 1 }" style="left: 356px; top: 144px; --d: 1.5s">in Git · reviewed</div>
<div class="badge violet-badge fade" :class="{ off: $clicks < 2 }" style="left: 334px; top: 264px; --d: .5s">controller · never in Git</div>
<div class="head"><b>ApiKey</b> <span>· its own CRD, in KCP</span></div>
<div><span class="k">apiVersion:</span> <span class="v">orderer.stroopwafel.nl/v1</span></div>
<div><span class="k">kind:</span> <span class="v">ApiKey</span></div>
<div><span class="k">metadata:</span></div>
<div class="i1"><span class="k">name:</span> <span class="v">sendgrid</span></div>
<div><span class="k">spec:</span></div>
<div class="i1"><span class="k">secretRef:</span></div>
<div class="i2"><span class="k">name:</span> <span class="v">sendgrid-api-key</span></div>
<div class="i1"><span class="k">scopes:</span> <span class="v">[mail.send]</span></div>
<div class="i1"><span class="k">expiresAt:</span> <span class="v">"2026-11-20"</span></div>
<div class="i1"><span class="k">requestedIn:</span> <span class="v">OPS-1234</span></div>
<div class="i1"><span class="k">owner:</span> <span class="v">team-checkout</span></div>
<div class="status-lines" :class="{ dim: $clicks < 2 }">
  <div><span class="st">status:</span></div>
  <div class="i1"><span class="st">lastTestedAt:</span> <span class="v">"2026-10-30T13:55:00Z"</span></div>
  <div class="i1"><span class="st">lastSuccessfulUseAt:</span> <span class="v">"2026-10-30T14:01:12Z"</span></div>
  <div class="i1"><span class="st">conditions:</span></div>
  <div class="i1">- <span class="st">type:</span> <span class="v">Ready</span></div>
  <div class="i2"><span class="st">status:</span> <span class="v">"True"</span></div>
  <div class="i1">- <span class="st">type:</span> <span class="v">ExpiringSoon</span></div>
  <div class="i2"><span class="st">status:</span> <span class="v">"True"</span></div>
  <div class="i2"><span class="st">message:</span> <span class="v">Expires in 21 days</span></div>
</div>
</div>

<!-- Secret: the value, encrypted with SOPS -->
<div class="card amber-card pop fade" :class="{ off: $clicks < 1 }" style="left: 1120px; top: 200px; width: 416px; height: 196px; --d: 1.2s">
<div class="badge amber-badge fade" :class="{ off: $clicks < 1 }" style="left: 262px; top: 14px; --d: 1.7s">in Git · SOPS</div>
<div class="head"><b>Secret</b> <span>· other RBAC, other eyes</span></div>
<div><span class="k">apiVersion:</span> <span class="v">v1</span></div>
<div><span class="k">kind:</span> <span class="v">Secret</span></div>
<div><span class="k">metadata:</span> { <span class="k">name:</span> <span class="v">sendgrid-api-key</span> }</div>
<div><span class="k">stringData:</span></div>
<div class="i1 enc" :class="{ flash: $clicks === 1 }"><span class="k">apiKey:</span> <span class="amber">ENC[AES256_GCM,data:q9Xr…]</span></div>
<div><span class="k">sops:</span> { <span class="k">gcp_kms:</span> <span class="v">…/orderer-config</span> }</div>
</div>

<div class="mem pop fade" :class="{ off: $clicks < 3 }" style="--d: 1.5s">the plaintext key only exists in the app’s memory</div>
<!-- the key's round trip: Pod → KMS → Pod -->
<i v-if="$clicks === 3" class="decrypt-dot" />

</div>

<Story>

- **the rule** Model StroopwafelOrderer’s config as Kubernetes resources (KRM). One rule: any secret field goes into its own Secret.
- **what we meant** The ApiKey records what we meant: its rights, its expiry, the ticket. The value sits in a SOPS-encrypted Secret.
- **what happened** A controller writes what happened: last tested, last used. Spec is reviewed in Git; status never goes there.
- **decrypt** The app decrypts with its own workload identity. Anyone may read the ApiKey; only the app reads the key.

</Story>

<!--
We model StroopwafelOrderer's config as Kubernetes resources. One rule: a secret field never sits in plain config, it goes into its own Secret.

[click] The API key becomes its own resource. The ApiKey records what we meant: scopes, expiry, the ticket it was requested in. The value itself lives in a SOPS-encrypted Secret.

[click] A controller fills in status: when the key was last tested, last used, whether it expires soon. Spec gets reviewed in Git; status never goes there.

[click] The app decrypts with its own workload identity via KMS. Anyone may read the ApiKey; only the app ever sees the key.
-->

<style>

/* appear with a per-element delay (--d) when arriving; disappear at once when going back */
.fade:not(.off) { transition-delay: var(--d, 0s); }
.pop { transition: opacity .5s ease, transform .5s ease; }
.pop.off { transform: scale(.96); }

/* YAML cards */
.card {
  position: absolute; box-sizing: border-box; padding: 12px 18px; border-radius: 12px; border: 1px solid;
  font-family: var(--mono); font-size: 12px; line-height: 20px; color: var(--soft);
}
.card > div:not(.region):not(.badge) { white-space: pre; min-height: 20px; }
.card .head { height: 26px; font-family: var(--sans); font-size: 15px; color: var(--text); }
.card .head span { font-size: 12px; color: var(--muted); }
.card .i1 { padding-left: 2ch; }
.card .i2 { padding-left: 4ch; }
.card.plain { background: var(--panel); border-color: var(--line); color: var(--text); font-family: var(--sans); font-size: 18px; line-height: 22px; }
.card.green-line { background: var(--panel-deep); border-color: #2E6B4E; font-family: var(--mono); font-size: 12px; line-height: 20px; }
.green-card { background: #101C17; border-color: #2E6B4E; }
.amber-card { background: #17140F; border-color: #5A4520; }
.kms { display: flex; align-items: center; padding: 10px 18px; font-family: var(--sans); font-size: 16px; line-height: 20px; color: var(--text); }
.sub { font-size: 12px; color: var(--soft); }
.pod + .sub { font-size: 13px; }
.k { color: var(--accent); }
.v { color: var(--text); }
.st { color: var(--violet); }

/* the apiKey line: red while it is a secret in config, green once it is a reference */
.keyline { position: relative; height: 20px; border-radius: 4px; background: rgba(255, 138, 128, .18); animation: red-in .4s 1.2s both; transition: background-color .4s; }
.keyline.swapped { background: rgba(126, 224, 161, .12); animation: none; }
.keyline > div { position: absolute; inset: 0; transition: opacity .3s; }
.keyline .new, .keyline.swapped .old { opacity: 0; }
.keyline.swapped .new { opacity: 1; }
@keyframes red-in { from { background-color: rgba(255, 138, 128, 0); } }

.point { left: 64px; width: 460px; font-size: 16px; line-height: 22px; }
.point span { color: var(--soft); }

/* ApiKey regions and badges */
.region { position: absolute; left: 8px; width: 502px; box-sizing: border-box; border-radius: 6px; border: 1px dashed; }
.spec-region { top: 138px; height: 122px; background: rgba(90, 184, 255, .06); border-color: #2D5D85; }
.status-region { top: 258px; height: 182px; background: rgba(201, 166, 255, .06); border-color: #5B4A7A; }
.status-lines { transition: opacity .5s .1s; }
.status-lines.dim { opacity: .18; transition-delay: 0s; }
.badge {
  position: absolute; height: 20px; box-sizing: border-box; padding: 0 8px; display: flex; align-items: center;
  border: 1px solid; border-radius: 10px; font-size: 10px; white-space: nowrap;
}
.blue-badge { background: #0F1A26; border-color: var(--accent); color: var(--accent); }
.violet-badge { background: #1A1526; border-color: var(--violet); color: var(--violet); }
.amber-badge { background: #2A1F0C; border-color: var(--amber); color: var(--amber); }

/* the encrypted value lights up once the Secret is there */
.enc { border-radius: 4px; background: rgba(242, 169, 59, .1); }
.enc.flash { animation: enc-flash .9s 1.6s both; }
@keyframes enc-flash {
  0% { background-color: rgba(242, 169, 59, 0); }
  35% { background-color: rgba(242, 169, 59, .3); }
  100% { background-color: rgba(242, 169, 59, .1); }
}

.mem {
  position: absolute; left: 1120px; top: 684px; width: 416px; height: 40px; box-sizing: border-box; padding: 0 16px;
  display: flex; align-items: center; background: #101C17; border: 1px solid #2E6B4E; border-radius: 10px;
  font-size: 14px; color: var(--good);
}

/* the key's round trip on click 3: down to KMS, across, back up as the key */
.decrypt-dot {
  position: absolute; left: 0; top: 0; width: 10px; height: 10px; border-radius: 5px;
  background: var(--amber); box-shadow: 0 0 10px rgba(242, 169, 59, .8);
  animation: decrypt 1.8s linear both;
}
@keyframes decrypt {
  0%, 49.9% { opacity: 0; transform: translate(1245px, 536px); }
  50% { opacity: 1; transform: translate(1245px, 536px); }
  66% { transform: translate(1245px, 594px); }
  75% { transform: translate(1405px, 594px); }
  92% { opacity: 1; transform: translate(1405px, 536px); }
  96%, 100% { opacity: 0; transform: translate(1405px, 536px); }
}
</style>
