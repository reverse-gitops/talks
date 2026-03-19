---

# Principle 2: Capture Intent, Not Implementation

<div class="grid grid-cols-2 gap-8 mt-6">
<div>

**What the user submits:**
```yaml
kind: Vote
spec:
  option: api-first
```

<div class="mt-4 text-center text-2xl">↓</div>

**What the platform renders:**
```
storage record
git commit
downstream state
```

</div>
<div class="mt-4">

<div class="border-l-4 border-yellow-400 pl-4 italic text-lg mb-6">
"I want an app at this hostname."
</div>

<div v-click>

Not:

> "Please let me handcraft the Deployment, Service, Ingress, Certificate, ConfigMap, and NetworkPolicy."

</div>

<div v-click class="mt-4 font-bold">

Users declare intent.
The platform renders it.

</div>

</div>
</div>

<!--
This is the second principle, and I think it is the most important one.

Capture intent, not implementation.

The user should submit the stable, user-facing abstraction. Not all the rendered machinery that exists downstream.

In this voting demo, the interesting thing is not some internal storage format or generated output. The interesting thing is the vote as a clean, typed expression of intent.

More generally, in platform engineering, the user should say something like "I want an app at this hostname." Not: "Please let me handcraft the Deployment, Service, Ingress, Certificate, ConfigMap, and NetworkPolicy."

Users declare intent. The platform renders it.

And behind that abstraction boundary, the platform team keeps freedom. You can use Helm, Kustomize, Crossplane, custom controllers. You can change those things later.

The constraint is on the interface, not the implementation.

Because if you get the interface right, you can evolve the machinery behind it without breaking the user's mental model.
-->
