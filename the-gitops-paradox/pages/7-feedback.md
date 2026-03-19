---

# Reverse GitOps is still GitOps

<div class="grid grid-cols-2 gap-8 mt-6">
<div>

**The four properties still hold:**

- ✅ Declarative
- ✅ Versioned
- ✅ Pulled automatically
- ✅ Continuously reconciled

</div>
<div v-click>

**What changes:**

<table class="w-full text-sm mt-2">
  <thead><tr><th class="text-left pb-1">Before</th><th class="text-left pb-1">After</th></tr></thead>
  <tbody>
    <tr><td>Git first</td><td>API first</td></tr>
    <tr><td>Validation later</td><td>Validation early</td></tr>
    <tr><td>Users author Git</td><td>Users express intent</td></tr>
    <tr><td>Git = front door</td><td>Git = memory</td></tr>
  </tbody>
</table>

</div>
</div>

<div v-click class="mt-8 text-center text-2xl font-bold">

The API comes first. Git remembers.

</div>

<!--
So to close:

I do not think Reverse GitOps replaces GitOps. I think it extends GitOps into a world where more users — and more agents — need a better front door than raw Git.

The state is still declarative. It is still versioned. It is still pulled automatically. It is still continuously reconciled.

The difference is simply this:

Users and agents express intent through a typed interface. A controller captures that intent cleanly. Git remains the durable memory.

So the model changes from "Git first, validation later" to "API first, validation early, Git recorded."

And that is the whole thesis.

The API comes first. Git remembers.

Thank you.

Speaking tip 1: do not read the script exactly as written. Use it as your base rhythm. Keep your own voice.

Speaking tip 2: your most important job on stage is not speed — it is clarity. A talk like this wins when the audience can repeat one sentence afterward:

"Git is a great memory, but a bad front door."

That is the line to land.

[Pacing note: Slides 9–10 target 4 minutes. 2 minute buffer for questions or latency in the demo.]
-->

---

# Let's talk

<div class="grid grid-cols-2 gap-8 mt-8">
<div>

**I'm at KubeCon and very happy to chat.**

- The most valuable thing right now is feedback: am I on the right track?
- Please push back if something doesn't hold

</div>
<div>

**Find me:**

- 📧 simon@configbutler.ai
- 🐙 github.com/configbutler/gitops-reverser
- ⭐ Give the repo a star if this resonated

</div>
</div>

<!--
Keep it brief. Invite conversation.
-->
