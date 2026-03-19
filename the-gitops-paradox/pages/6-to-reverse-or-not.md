---

# The ecosystem is already moving this way

Different abstractions, similar lowered results

<div class="mt-6">
<!-- <ExcalidrawRenderer drawFilePath="/three-libs.excalidraw.json" /> -->
<!-- TODO: fix component name — should be <Excalidraw> not <ExcalidrawRenderer> -->
</div>

<!--
Now, this voting demo is small. But the pattern is not small.

In fact, I think the ecosystem is increasingly moving in this direction.

Take a few examples: Crossplane compositions, KRO resource graphs, Flux ResourceSet-style templating.

They differ in scope and design, but they all share a common shape.

The platform defines some cookbook, composition, graph, or template. The user provides a much smaller intent object. And the system lowers that intent into a larger set of concrete resources.

And here is the interesting part: those lowering pipelines are often one-way.

You can take three different abstractions and produce a very similar operational result: a Deployment, a Service, an Ingress, a Certificate, some policy objects.

And once you are staring at those rendered resources, you often cannot reliably say which abstraction produced them.

That means the rendered resources are a good reconciliation target. But they are often a bad place to recover original user intent from.

So if you care about preserving intent cleanly, the thing worth recording is the user-facing abstraction — not just the lowered result.
-->
