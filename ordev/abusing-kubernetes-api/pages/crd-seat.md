---
layout: default
transition: fade
---

###### The real one, shortened

# The definition of your chair: <span class="green">also just YAML.</span>

<div class="def">
<div class="yaml" :class="{ plural: $clicks === 1 }">

```yaml {1-3,5|7|11-14,16,20,21|15,17-19|all}
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: seats.examples.configbutler.ai
spec:
  group: examples.configbutler.ai
  names: { kind: Seat, plural: seats }
  versions:
    - name: v1alpha1
      schema:
        openAPIV3Schema:
          properties:
            spec:
              properties:
                row:
                  type: integer
                  x-kubernetes-validations:
                    - rule: self == oldSelf
                      message: 'A seat does not move: row is immutable.'
                color: { type: string, pattern: '^#[0-9a-fA-F]{6}$' }
                emoji: { type: string, enum: [🦊, 🐙, 🦄, …] }
```

</div>
<ul>
  <li><strong>It's an object too.</strong> Apply it, and the API speaks <code>Seat</code></li>
  <li v-click="1"><strong>It names the type.</strong> That's where <code>/seats</code> in the URL comes from</li>
  <li v-click="2"><strong>It says what's valid.</strong> A pattern for the colour, and 24 emoji that read well on a projector</li>
  <li v-click="3"><strong>Rules live here too.</strong> A CEL rule makes row, column and owner immutable. No webhook, no server to run</li>
</ul>
</div>

<p v-click="4" class="punch">The provider writes this. <span class="green">The consumer fills it in.</span></p>

<style>
.def { display: grid; grid-template-columns: 860px 1fr; gap: 48px; align-items: start; margin-top: 8px; }
.def .yaml :deep(pre) { font-size: 19px !important; line-height: 1.35 !important; padding: 20px 24px !important; border-radius: 12px; }
.def .yaml :deep(pre code) { background: none; padding: 0; }
.def .yaml.plural :deep(.line:nth-child(7) span:nth-child(6)), .def .yaml.plural :deep(.line:nth-child(7) span:nth-child(10)) { padding-bottom: 5px; background-image: repeating-linear-gradient(to right, var(--accent) 0 9px, transparent 9px 15px); background-size: calc(100% - 1ch) 3px; background-position: right bottom; background-repeat: no-repeat; }
.def .yaml :deep(.line.slidev-code-dishonored) { opacity: .55; }
.def ul { margin: 0; padding-left: 1.1em; }
.slidev-layout .def li { margin: 0 0 22px; font-size: 27px; line-height: 1.3; color: var(--text); }
.punch { position: absolute; left: 64px; right: 64px; bottom: 28px; margin: 0; text-align: center; font-size: 46px; line-height: 1.2; font-weight: 700; opacity: 1; }
</style>

<!--
**7:30 · 1:00**

Don't read the YAML. The real one, about 230 lines with its comments.

Same shape as your chair. Apply it, and the API speaks Seat.

[click] Seat, plural seats: the dashed one from the URL. This line is the translation.

[click] What's valid: colour pattern, 24 emoji. Checked before storing. I didn't write that.

[click] self == oldSelf is CEL: immutable. Runs inside the API server. No webhook, no server.

[click] Provider owns the interface. Next: what the consumer filled in.
-->
