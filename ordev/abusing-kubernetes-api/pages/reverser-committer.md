---
layout: default
transition: fade
---

###### How commits get written

# Who wrote this commit? <span class="green">Two answers.</span>

<div class="commit">
<div class="yaml">

```yaml
apiVersion: configbutler.ai/v1alpha3
kind: GitProvider
metadata:
  name: k8s-trail
  namespace: voter
spec:
  url: ssh://git@github.com/ConfigButler/k8s-trail.git
  secretRef:
    name: k8s-trail-git
  commit:
    committer:
      name: ConfigButler Bot
      email: bot@configbutler.ai
    signing:
      secretRef:
        name: k8s-audit-trail-signing
```

</div>
<dl>
  <div v-click><dt>Author</dt><dd>Whoever made the change. It comes from the audit log.</dd></div>
  <div v-click><dt>Committer</dt><dd>The bot that writes to Git. It's set right here.</dd></div>
  <div v-click><dt>Signature</dt><dd>Proves the bot wrote it. The key stays in a Secret, and the public key is in <code>status</code>.</dd></div>
</dl>
</div>

<style>
.slidev-layout h1 { margin-bottom: 20px; }
.commit { display: grid; grid-template-columns: 860px 1fr; gap: 44px; }
.yaml { --slidev-code-font-size: 23px; --slidev-code-line-height: 33px; --slidev-code-padding: 20px 24px; }
.yaml .slidev-code { border-radius: 14px; }
.yaml :deep(pre code), .yaml :deep(code) { background: none; padding: 0; }
.commit dl { margin: 0; display: flex; flex-direction: column; gap: 28px; }
.commit dt { font-size: 38px; line-height: 1.2; font-weight: 700; color: var(--good); }
.commit dd { margin: 4px 0 0; font-size: 26px; line-height: 1.3; color: var(--soft); }
</style>

<!--
**28:00 · 1:00**

The real GitProvider, shortened. Two names on every commit.

[click] Author: whoever changed it in the API.

[click] Committer: my bot.

[click] Signed. Be precise: it proves the bot wrote it. That it was Alice comes from her token and the audit log. You trust that chain.

Public key in status: verified badge.

Behind? Skip this slide, say "the commits are signed".
-->
