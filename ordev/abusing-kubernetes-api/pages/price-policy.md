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

<!--
Let's make a change in the coffee webshop. RBAC already decides who may edit the menu. But may someone set a coffee to 11 euros?

This is a policy, and look at its shape: apiVersion, kind, metadata, spec. The rule is KRM as well. Simplified for the slide: the real one only looks at prices that this request changes, so an old price doesn't block every other edit.

[click] A rule about the data, not about who you are.

[click] It runs inside the API server. In CEL, so there's no webhook and no server to keep running.

[click] And it holds for everyone: when Flux applies a €12 coffee from Git, that's refused with the same message.

[click] Live: open the coffee editor, set a coffee to 11 euros, and save. The editor shows this message in its "Admin request failed" panel. I didn't write that check in my app.
-->

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
