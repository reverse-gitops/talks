---

# What actually happens when you vote

A vote is captured as intent

<div class="mt-8 flex items-center justify-center gap-4 text-lg">
  <div class="px-4 py-3 bg-blue-100 rounded-lg text-center">📱<br/>Phone UI</div>
  <div class="text-2xl">→</div>
  <div class="px-4 py-3 bg-blue-100 rounded-lg text-center">🔌<br/>API</div>
  <div class="text-2xl">→</div>
  <div class="px-4 py-3 bg-yellow-100 rounded-lg text-center">📋<br/>Typed Intent<br/>Object</div>
  <div class="text-2xl">→</div>
  <div class="px-4 py-3 bg-green-100 rounded-lg text-center">⚙️<br/>gitops-reverser</div>
  <div class="text-2xl">→</div>
  <div class="px-4 py-3 bg-orange-100 rounded-lg text-center">📁<br/>Git Commit</div>
</div>

<div v-click class="mt-8 text-center text-xl">

The front door is no longer Git — but **Git is still getting the durable record.**

</div>

<!--
What happens next is the whole point of the talk.

That vote is not treated as an ad hoc UI event. It is not just going straight into some hidden database row that nobody can inspect.

It is captured as intent.

The phone talks to an API. That API creates or updates a typed object. A controller observes that object and writes it back into Git as clean declarative state.

So the front door is no longer Git. But Git is still getting the durable record.

That is the core move in Reverse GitOps.

The user interacts with a natural interface. The system preserves the GitOps properties in the background.

So instead of Git being the place where people must author change, Git becomes the place where change is remembered.
-->

---

# Principle 1: API First

<div class="grid grid-cols-2 gap-8 mt-6">
<div>

```yaml
apiVersion: demo.reversegitops.dev/v1
kind: Vote
metadata:
  name: vote-abc123
spec:
  option: api-first
```

</div>
<div class="mt-4">

**Validation happens at write time:**

- Wrong type → rejected immediately
- Unknown field → rejected immediately
- Policy violation → rejected immediately

<div v-click class="mt-4">

Humans use it through a UI, CLI, or IDE.
AI agents use it programmatically.

**The interface is typed. The feedback is early.**

</div>
</div>
</div>

<!--
This is Principle 1: API first.

Humans use it through a UI, CLI, IDE, maybe a dashboard. AI agents use it programmatically.

The important property is that the interface is typed.

That means validation happens at write time. Wrong type, wrong field, unknown field, policy violation — those things can be caught much earlier.

And that feedback loop matters. Because it is not just about convenience. It is about moving validation closer to the moment of intent.

That is something Kubernetes has spent years getting good at.

And it is a much better fit for both humans and agents than asking everyone to directly manipulate Git as the first step.
-->


---

# Headerw

<<< ./test.yaml yaml

Why is that?