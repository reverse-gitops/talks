Yes — if you slow down and let the demo breathe, this is enough for 20 minutes.

The risk is actually the opposite: if you rush, you will finish in 12–14 minutes.
So the trick is:

do not overload slides with text

speak in full sentences

let the audience scan the QR code

pause when you show the Git write-back

give one or two concrete examples

leave a small buffer for laughs, latency, or applause

A good 20-minute KubeCon talk usually needs:

a clear arc

one memorable demo

a few strong conceptual slides

one takeaway people can repeat afterward

You have that now.

My suggested pacing

Slides 1–3: 4 minutes

Slides 4–8: 10 minutes

Slides 9–10: 4 minutes

Buffer: 2 minutes

That is healthy.

Below is the full spoken draft I would use.

Slide 1 — Title
Reverse GitOps: The API Comes First, Git Remembers

What’s on the slide:
Title + your name + maybe a simple diagram faintly in the background.

What I would say:

Hello everyone, I’m Simon Koudijs.

This talk is about a very simple idea.

GitOps gave us something genuinely valuable: reproducibility, auditability, promotion, rollback, and a shared declarative model for change.

But I think one assumption inside GitOps is starting to crack a bit.

Not the assumption that declarative state is good.
Not the assumption that versioned history is good.
Not the assumption that reconciliation is good.

The assumption that is starting to fail is this: that Git itself should be the primary front door for every change.

And I want to show you a different operating model.

One where humans and AI agents make validated changes through a typed API, while Git still records the result cleanly in the background.

That is what I call Reverse GitOps.

Slide 2 — GitOps got something very right
Git is a fantastic memory

What’s on the slide:
A few short words:

Audit

History

Promotion

Recovery

Distribution

What I would say:

Let me start by being very clear.

This is not an anti-GitOps talk.

In fact, I think GitOps got one of the most important things exactly right: Git is an incredibly good memory.

It gives us a history of change.
It gives us diffs.
It gives us promotion flows.
It gives us rollback.
It gives us disaster recovery.
It gives us a mechanism to distribute desired state.

That is a huge achievement.

So I am not here to argue that GitOps was wrong.

I am here to argue that Git may be the wrong interface for more and more of the people and systems that need to make changes.

Git is still extremely valuable.
I just think it works better as the memory than as the front door.

Slide 3 — The problem is the front door
Git is a great memory, but a poor primary interface

What’s on the slide:
Left side: Git PR, YAML, CI, late failure
Right side: typed API, validation, immediate feedback

What I would say:

Git was built for source code collaboration.

That gives it a set of properties that are excellent for code:
line-oriented editing, text diffs, review-driven workflows.

Those are virtues for software development.

But they are often friction for infrastructure operations.

When Git is the front door, feedback is often delayed.
You push.
You open a PR.
CI runs.
A controller reconciles.
Something fails later and farther away from the point where the change actually began.

For platform engineers, that is survivable.

But think about the broader audience now:
developers using self-service platforms,
operators making small changes,
and increasingly AI agents trying to work through tools safely.

Those users do not want to hand-author low-level YAML in Git for every action.
They want a smaller, safer, typed interface.

And the nice thing is: Kubernetes already knows how to do this.

Slide 4 — Demo setup
Let’s let the audience make a change

What’s on the slide:
Big QR code.

What I would say:

So instead of just talking about that, let’s try it.

You can scan this QR code.

On your phone, you’ll get a tiny voting interface.

Please actually do it.

Because what I want to show is not just a cute demo.

I want to show what it feels like when the front door is a user-friendly API-backed interface, while Git still remains in the loop.

So go ahead and vote.

And while you do that, notice what you are not doing.

You are not cloning a repo.
You are not editing YAML.
You are not opening a PR.
You are not waiting for CI to tell you whether your shape was wrong.

You are just expressing intent.

[Pause here. Give them time.]

Slide 5 — What actually happens
A vote is captured as intent

What’s on the slide:
Phone UI → API → typed object → controller → Git

What I would say:

What happens next is the whole point of the talk.

That vote is not treated as an ad hoc UI event.
It is not just going straight into some hidden database row that nobody can inspect.

It is captured as intent.

The phone talks to an API.
That API creates or updates a typed object.
A controller observes that object and writes it back into Git as clean declarative state.

So the front door is no longer Git.

But Git is still getting the durable record.

That is the core move in Reverse GitOps.

The user interacts with a natural interface.
The system preserves the GitOps properties in the background.

So instead of Git being the place where people must author change, Git becomes the place where change is remembered.

Slide 6 — Principle 1
API First

What’s on the slide:
Tiny example object, maybe:

apiVersion: demo.reversegitops.dev/v1
kind: Vote
spec:
  option: api-first

What I would say:

This is Principle 1: API first.

Humans use it through a UI, CLI, IDE, maybe a dashboard.
AI agents use it programmatically.

The important property is that the interface is typed.

That means validation happens at write time.

Wrong type, wrong field, unknown field, policy violation — those things can be caught much earlier.

And that feedback loop matters.

Because it is not just about convenience.
It is about moving validation closer to the moment of intent.

That is something Kubernetes has spent years getting good at.

And it is a much better fit for both humans and agents than asking everyone to directly manipulate Git as the first step.

Slide 7 — Principle 2
Capture Intent, Not Implementation

What’s on the slide:
Tiny Vote object on top, larger rendered output below, with a boundary labeled interface vs implementation.

What I would say:

This is the second principle, and I think it is the most important one.

Capture intent, not implementation.

The user should submit the stable, user-facing abstraction.

Not all the rendered machinery that exists downstream.

In this voting demo, the interesting thing is not some internal storage format or generated output.
The interesting thing is the vote as a clean, typed expression of intent.

More generally, in platform engineering, the user should say something like:

“I want an app at this hostname.”

Not:
“Please let me handcraft the Deployment, Service, Ingress, Certificate, ConfigMap, and NetworkPolicy.”

Users declare intent.
The platform renders it.

And behind that abstraction boundary, the platform team keeps freedom.

You can use Helm.
You can use Kustomize.
You can use Crossplane.
You can use custom controllers.
You can change those things later.

The constraint is on the interface, not the implementation.

That line matters a lot.

Because if you get the interface right, you can evolve the machinery behind it without breaking the user’s mental model.

Slide 8 — Live payoff
And here it is in Git

What’s on the slide:
Actual Git diff / commit / repo file showing votes or intent written back.

What I would say:

And here is the payoff.

The audience made a change from their phone.

And here it is in Git.

That is the whole model in one moment.

Git still gives us the things we like:
auditability,
history,
diffability,
promotion if we need it,
distribution if we need it.

But nobody in the audience had to think in Git in order to participate.

That is why I like the phrase:

The API comes first. Git remembers.

Because Git is still doing something important here.
It is just no longer being forced to act as the primary authoring surface for every kind of change.

[Pause here. Let the audience look.]

This is also the moment where I’d want people to notice:
this feels natural.
That matters.

Because if we want self-service platforms to work, and if we want AI agents to act safely, the front door has to feel smaller and more structured than a raw repo.

Slide 9 — The ecosystem is already moving this way
Different abstractions, similar lowered results

What’s on the slide:
Three abstractions on top: Crossplane, KRO, Flux ResourceSet
Bottom: similar set of concrete resources

What I would say:

Now, this voting demo is small.

But the pattern is not small.

In fact, I think the ecosystem is increasingly moving in this direction.

Take a few examples:
Crossplane compositions,
KRO resource graphs,
Flux ResourceSet-style templating.

They differ in scope and design, but they all share a common shape.

The platform defines some cookbook, composition, graph, or template.
The user provides a much smaller intent object.
And the system lowers that intent into a larger set of concrete resources.

And here is the interesting part:

those lowering pipelines are often one-way.

You can take three different abstractions and produce a very similar operational result:
a Deployment,
a Service,
an Ingress,
a Certificate,
some policy objects.

And once you are staring at those rendered resources, you often cannot reliably say which abstraction produced them.

That means the rendered resources are a good reconciliation target.

But they are often a bad place to recover original user intent from.

So if you care about preserving intent cleanly, the thing worth recording is the user-facing abstraction.

Not just the lowered result.

Slide 10 — Close
Reverse GitOps is still GitOps

What’s on the slide:
Very short summary:

Declarative

Versioned

Pulled automatically

Continuously reconciled

Bottom line:
The API comes first. Git remembers.

What I would say:

So to close:

I do not think Reverse GitOps replaces GitOps.

I think it extends GitOps into a world where more users — and more agents — need a better front door than raw Git.

The state is still declarative.
It is still versioned.
It is still pulled automatically.
It is still continuously reconciled.

The difference is simply this:

Users and agents express intent through a typed interface.
A controller captures that intent cleanly.
Git remains the durable memory.

So the model changes from:

Git first, validation later

to:

API first, validation early, Git recorded.

And that is the whole thesis.

The API comes first. Git remembers.

Thank you.

My honest take on runtime

Yes, this is enough for 20 minutes.

In fact, spoken calmly with:

one pause for the QR scan

one pause on the Git diff

one real explanation of slide 9

this should land around 17 to 20 minutes.

If you want to make sure you do not come in too short, do these three things:

ask the audience to actually scan and vote

spend a beat on the Git diff when it appears

on slide 9, give one concrete example like “App → Deployment + Service + Ingress”

That will fill the time naturally.

Two final speaking tips

First: do not read this exactly as written.
Use it as your base rhythm. Keep your own voice.

Second: on stage, your most important job is not speed. It is clarity.
A talk like this wins when the audience can repeat one sentence afterward:

Git is a great memory, but a bad front door.

That is the line to land.

I can also condense this into speaker notes per slide in bullet form so it is easier to rehearse.