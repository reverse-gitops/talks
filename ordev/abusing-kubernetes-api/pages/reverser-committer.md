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

<!--
And here's one of those objects: a GitProvider, the real one from my cluster, shortened. You configure the committer, and the signing, as plain YAML.

Git already has two names on every commit, and that's perfect for this.

[click] The author: whoever changed it in the API. That's what the two streams are for.

[click] The committer: my bot, the one with access to the repo.

[click] And the commit is signed. Be precise here, especially if there's a lawyer in the room: the signature proves the bot wrote the commit. That the author is really Alice comes from her token and the audit log. So you trust that chain.

Nice detail: the operator publishes the public key in status. Add it to your Git host, and you get the verified badge.
-->

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
