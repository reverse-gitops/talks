---
layout: default
transition: fade
---

###### Policy, for the coffee webshop

# Nobody pays more than <span class="green">€10 for a coffee.</span>

<div class="policy">
<div class="yaml">

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: voter-coffee-price
spec:
  matchConstraints:
    resourceRules:
      - apiGroups: [examples.configbutler.ai]
        apiVersions: ['*']
        resources: [coffeeconfigs]
        operations: [CREATE, UPDATE]
  validations:
    - expression: >-
        object.spec.products.all(p,
          p.priceCents <= 1000)
      message: Nobody pays more than €10 for a coffee
```

</div>
<ul>
  <li v-click><strong>A rule about the data.</strong> RBAC says if you may edit the menu. This says if the edit makes sense</li>
  <li v-click><strong>Inside the API server.</strong> A CEL expression: no webhook, and no server to run</li>
  <li v-click><strong>For everyone.</strong> A €12 coffee from Git is refused too</li>
</ul>
</div>

<p v-click class="refused"><b>422</b> Nobody pays more than €10 for a coffee: Cappuccino.</p>

<style>
.slidev-layout h1 { margin-bottom: 20px; }
.policy { display: grid; grid-template-columns: 840px 1fr; gap: 44px; }
.yaml { --slidev-code-font-size: 24px; --slidev-code-line-height: 34px; --slidev-code-padding: 20px 24px; }
.yaml .slidev-code { border-radius: 14px; }
.yaml :deep(pre code), .yaml :deep(code) { background: none; padding: 0; }
.policy ul { margin: 0; padding-left: 1em; }
.slidev-layout .policy li { margin: 0 0 26px; font-size: 27px; line-height: 1.3; }
.refused { position: absolute; left: 948px; right: 64px; top: 560px; margin: 0; padding: 20px 24px; font-size: 30px; line-height: 1.25; font-weight: 700; color: var(--bad); background: var(--panel); border: 1px solid var(--bad); border-radius: 14px; opacity: 1; }
.refused b { display: block; margin-bottom: 6px; font-family: var(--mono); }
</style>

<!--
**19:00 · 1:30**

Coffee webshop. RBAC decides who edits the menu. May a coffee cost 11 euros?

A policy, and it's KRM too. Simplified for the slide.

[click] About the data, not about you.

[click] CEL inside the API server. No webhook.

[click] For everyone: a €12 coffee from Git is refused too.

[click] Live: coffee editor, 11 euros, save. "I didn't write that check in my app."

Behind? Skip the editor, show the slide.
-->
