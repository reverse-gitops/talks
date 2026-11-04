# The Evolution of GitOps in Platform Engineering

| | |
|---|---|
| **Speakers** | Artem Lajko (Head of Platform Engineering, iits-consulting; CNCF Kubestronaut; co-author of *Implementing GitOps with Kubernetes*) and Koray Oksay (consultant at Kubermatic; CNCF and platform engineering ambassador; organizer of DevOps Istanbul) |
| **Event** | Cloud Native Summit Munich 2026 |
| **Video** | https://www.youtube.com/watch?v=Ko2IIWk5RPE |
| **Published** | 19 July 2026 |
| **Length** | 30 min |
| **Abstract** | Same abstract as Artem's Øredev 2026 talk (Thu 5 Nov, 13:55, TURING), so expect largely the same story there |
| **Raw transcript** | [evolution-of-gitops-lajko-oksay.raw.md](evolution-of-gitops-lajko-oksay.raw.md) (auto-generated, with timestamps) |

## Summary

The talk walks through nine years of GitOps in 30 minutes, in two halves: Koray covers the history and mechanics, Artem covers platform engineering, adoption and what comes next.

**From scripts to GitOps.** Before 2010-era automation, HA setups meant hand-editing config on host after host, with drift and typos. Configuration management (Ansible, Puppet, Chef) and then infrastructure as code (Terraform, now OpenTofu) wrote everything down, but the mindset stayed push-based: first an engineer running a playbook locally, then a CI pipeline doing the same. GitOps, named by Alexis Richardson at Weaveworks in 2017, changed who initiates the change: an agent (Argo CD, Flux) on the target pulls declared state from Git and keeps the system in sync. The four principles: declarative, versioned and immutable, pulled, continuously reconciled.

**Scale and its problems.** With catalogs (umbrella Helm charts, app-of-apps, ApplicationSets, Flux overlays with Kustomize) and hub-and-spoke or agent architectures (including Sveltos), one team can run hundreds or a thousand clusters. The cost: config sprawl across countless values files, lost visibility into what runs where, API server limits (Crossplane's CRD explosion in 2022), and templating that hides the final manifests. Tools like Argo CD diff preview and the source hydrator exist to show what will actually be applied.

**Git is the source of intent, not of truth.** The cluster also pulls images, charts and sub-chart dependencies from elsewhere, and operators create objects that are not in Git. Teams then tell Argo CD to ignore those diffs and lose visibility again. Git (or OCI, or even S3 buckets) holds the desired state; the principle is "pull the desired state from a versioned, immutable source in a loop", not Git itself. Flux has supported OCI artifacts since 2022.

**Platform engineering.** Artem argues "DevOps engineer" was never a well-defined role. Platform engineering reorganised the DevOps tool loop into planes (developer, delivery/GitOps engine, resources). Adoption of internal developer platforms is still low: they take millions and years, need experienced engineers, and need a product mindset. Backstage is a framework, not an IDP, and its adoption as a portal is low. Platform teams rarely asked developers what they wanted; they pushed CRDs, pipelines and GitOps onto them and removed ad-hoc cluster access.

**Branches and bidirectional GitOps.** Platform teams told developers that branches are a GitOps anti-pattern and promotion should go through folders with trunk-based development. Then tools like Kargo showed that branches plus GitOps do work with human interaction: click-ops in a UI that creates branches behind the scenes, with a controller writing back from the cluster to Git. They call this "bidirectional GitOps". Done right, GitOps also enables progressive delivery (with Argo Rollouts or Flagger) and makes disaster recovery of stateless clusters easy. In their survey it is one of the top four platform capabilities.

**Choosing tools.** Argo CD vs Flux is tribal; the consultant answer is "it depends", and they use both, plus Sveltos (which can be combined with Argo CD to scale further). Options for the portal layer: Backstage as a framework, a "platformless" offering such as Choreo, or an operator-driven approach with CRDs. Artem sees real developer adoption only now, for example OpenChoreo turning a developer's request (from their CLI, IDE or agent) into a pull request containing a custom resource that the platform team reviews and applies through GitOps.

**AI and regulation.** Running inference on Kubernetes is easy; multi-tenancy and GPU sharing are hard. AI agents such as HolmesGPT now operate the platform, and AI troubleshooting works well because it has logs, metrics and traces. But AI given templated Helm and overlays produces generic answers: **AI needs plain data**. That is the argument for configuration as data and "write everything twice" (ConfigHub, Alexis Richardson's new company): store the rendered result, not templates plus values. The Cyber Resilience Act points the same way: if you ship a product you are liable for it, so you need the plain manifests, images and everything they reference.

**Unsolved.** Hydration-based abstractions have no clear path yet; Helm has no good schema, maintenance or API-versioning story, so patching a third-party chart (for example to add a security context) means forking it or layering Kustomize on top. Event-driven GitOps was left out for time.

### Relevance for my Øredev talks

- "Git is the source of intent, not the source of truth" and "AI needs plain data / rendered manifests" are close to my config talk's argument for turning intent into concrete, packaged config. Build on it rather than repeat it.
- Their "bidirectional GitOps" (a controller writing from the cluster back to Git) is the GitOps Reverser idea from a different starting point.
- OpenChoreo's flow (request → pull request with a custom resource → review → GitOps) is a concrete example of "capture validated intent through an API".
- The CRA argument (you need the final manifests and everything they reference) supports signed, versioned config artifacts.

## Transcript

Cleaned up from the auto-generated captions: timestamps and filler words removed, sentences restored, and misheard names and tools corrected. Speaker labels are inferred from context. Passages that could not be recovered with confidence are marked *[unclear]*.

### Introduction

**Artem:** We can start. Hello, everyone, and thank you for joining our talk. Today we will present the evolution of GitOps in platform engineering. We try to put nine years of evolution into just 30 minutes; let's see if we can make it.

Before we start, a short word about me. My name is Artem Lajko. I'm head of platform engineering at iits-consulting, a CNCF-certified Kubestronaut, an ambassador for platformengineering.org, and co-author of the book *Implementing GitOps with Kubernetes*. But I'm not alone here, obviously. Koray, can you introduce yourself?

**Koray:** Hello everyone, my name is Koray. I work for Kubermatic as a consultant, and my daily job is working on cloud native and Kubernetes-related things. I also do some community work as an ambassador for the CNCF and for platform engineering, and I organize DevOps Istanbul and some other meetups.

### Evolution of infrastructure

**Koray:** Today's mission is to understand what's coming, and to do that we need to understand what has happened so far. There is some terminology we need to align on first.

The first term is *declarative*: describing the desired state, not the steps to get there. The second is *catalog*: a curated set of applications to be used on your platform. The third is *push versus pull*, which is about who initiates the change. Is it pushed from your CI pipeline to the cluster, or is it pulled by the cluster, or by an agent, from a source like Git or somewhere else?

So how did it all begin? It began with Alexis Richardson, who was working at Weaveworks at the time. He and others were following certain practices for deploying things, and he wrote down some principles around what they were doing and called it GitOps.

But what was the problem at the time? Since the 2000s, enterprise HA setups looked like this: a load balancer, some web servers, and some applications behind them. That was fine, but you also had primary and secondary databases, and you had to create VMs manually. There was a lot of manual work. You had to jump from host to host, edit some httpd.conf files, save them, restart the service, and go to the next one. There could be drift, there could be typos. It worked, but it didn't scale well.

So we started to write things down. First, configuration management tools came along: Ansible, Puppet, Chef. Then we said we could do the same for our infrastructure, creating VMs, load balancers and everything else, and Terraform came into the picture, and nowadays OpenTofu. That lets everything be code: infrastructure as code, network as code, policy as code. Everything becomes more and more declarative.

So we got new tooling, but we kept the same mindset and the same challenge. An engineer would have the Ansible playbook on their laptop and apply it to the servers. That person initiated the change locally, and someone else might be doing the same. The change was pushed to the target. Then we got smarter and said we could use CI, or some other service, to do this automatically. Now we had "pipeline ops", where we put everything in CI and CI pushed it to the server. Same thing, only the initiator changed. The mindset was the same.

### GitOps principles

**Koray:** Then we came to agents, with GitOps. This is not the AI agent we talk about nowadays; it's more like Argo CD or Flux. The user puts the declarations in a Git repository, and an agent running on the target pulls them and applies them to the platform, host or cluster. The agent is also responsible for keeping the environment in sync. You don't make manual changes on the system. You change things in the Git repository: you put the contract there, what you desire to have, your intent. The agent watches for every change and pulls it in a loop, all the time. There is no real event that triggers it; the only event is a change to the contract.

GitOps has four core principles, and they're easy. It has to be declarative: you put your desired state there. It has to be versioned, and the versions have to be immutable, so no one changes them; a new change means a new version. It has to be pull-based: something needs to bring those changes into the environment. They should not be pushed from a laptop or from CI, but pulled by the target environment itself. And it must happen continuously, in a loop: "Do you have any changes? Yes? I'll apply them. Any changes? No? Continue." Those are the four principles.

### Scaling and architecture

**Koray:** Using GitOps, you can manage not just a single cluster and its shipping process, but the whole fleet, in a fairly easy way. One option is a catalog, such as an umbrella Helm chart, in which you put the applications you need: cert-manager, ingress, your own applications. Then you have a control plane cluster running Argo CD, Sveltos or whatever, which watches for changes and applies them to the actual workload clusters through reconciliation.

There are different approaches between tools, and even within the same tool. With Argo CD it's mostly app-of-apps or ApplicationSets; with Flux you would use overlays with Kustomizations. But the idea is the same: don't repeat yourself. You have the chart, or the group of applications you want on your system, and you only change some values and apply them to the cluster. The dev environment has a different number of replicas from production, but they run the same application. That's the main idea. You can have hundreds of clusters with a huge umbrella Helm chart. In this case Argo CD applies all those changes, so the execution happens on the Argo CD side. But that also creates other problems for us.

**Artem:** It scales well, in general. To be honest, it's crazy: you manage something like a thousand clusters now. But with scale come multiple challenges.

### Challenges at scale

**Koray:** Yes, there are other challenges, because this leads to complex configuration: many clusters, different values files, and it becomes hard to track which cluster has what. With five clusters it's easy, but with tens or hundreds of clusters things get really messy.

A known example is Crossplane in 2022. Things have changed since, but at the time Crossplane created tons of CRDs on the Kubernetes API and simply killed it, because the API server couldn't process the incoming requests with that many objects to go through. So yes, it scales well, but there are limits.

Visibility is also lost, because you now have so many config and values files that you may not be able to find what is deployed where, with which settings.

### Source of truth reality

**Koray:** For example, if you deploy a Helm chart with Argo CD or Flux, you don't actually know what the final manifests on the target will look like. You change the values, and Helm's templating produces a different set of manifests. So you may need to render first to check what will actually be applied, and then push the changes to whatever GitOps tool you're using. There is *[unclear: "cooki"]* and Argo CD diff preview, which show you what will actually be applied to the cluster, and with the source hydrator you see what will actually run on the system.

Whenever we talk about GitOps, we say the Git repository is the source of truth. I have said it many times.

**Artem:** Same here. Sorry for teaching you that over the years.

**Koray:** It's not 100% correct. Your intent is there: what you want to have, your desired state, is in Git. But at runtime, on the cluster itself, there are many different components. You get the image from an image registry, the Helm chart probably lives somewhere else, and you might have dependent Helm charts that have changed over time without you being aware of it. So what you want is in Git, but the actual state on the cluster might be different.

### Git versus OCI

**Koray:** So what we say is that Git, or OCI, is the source of *intent*: what you want to have on the cluster. And it's not only about registries. If you deploy an operator, the operator creates its own objects. Then Argo CD starts telling you the application is out of sync, because the operator created an object that isn't in Git. So you start ignoring that difference, and again you lose visibility into what's on the cluster versus what's in Git. Git has your intention and your desired state, but the actual state running on the cluster might be a bit different.

Git is great for human collaboration and for intent. And you can also use OCI instead of Git, even though it's called GitOps.

**Artem:** I think it's a good name. I asked Alexis, and it is a good name. But now we have "Git" in it, and it's become a bit difficult to get rid of.

**Koray:** Because the principle is that you pull the desired state from a versioned, immutable source in a loop. That's the idea. It could be Git, it could be OCI, it could be somewhere else. I think Flux also supports S3 buckets; I'm not 100% sure, but I think so. So the name is GitOps, but it doesn't have to be Git; it's about the principles. Flux has supported OCI since 2022, the "Gitless GitOps" approach, so you can also go in that direction and have artifacts deployed to the cluster.

### GitOps architectures

**Koray:** There are many different architectures. You can have a central hub or control plane that manages the different clusters: the hub pulls the changes and pushes them to the relevant clusters. Or you can have a dedicated instance per cluster, where each one pulls and applies changes on its own cluster. You can also combine hub-and-spoke with dedicated instances: Git is the source, the hub cluster pulls the changes, and the workload clusters pull from the hub. And with hundreds of clusters you should also think about sharding, because with many clusters and many applications, things can get hard to scale.

There are also agent-based architectures, for example Sveltos. I've never used it, but Artem is a fan. You can run Sveltos as a hub cluster that pushes changes to the agents, or the Sveltos agent running in the workload cluster can pull changes from the hub.

So GitOps made it possible to manage secrets, dashboards, infrastructure, budget rules, policies, everything, as code.

### Rise of platform engineering

**Artem:** That was the GitOps part, and it happened over nine years. With AI, everything happens in one week, so we're kind of slow here. Just kidding.

But what happened in the meantime? DevOps was declared dead. To be honest, from my point of view it was never a thing. Maybe the culture, yes. But turning an infinity loop of tools into a role, writing a role description and hiring people as DevOps engineers without defining what you want, whether they do CI pipelines or not, was never a thing for me. Yet we still hire DevOps engineers, and a lot of people still have that title.

What I want to point out is that platform engineering arose. We took the tools from the DevOps infinity loop and organized them into planes. Now, if you as a platform engineering team want to build your internal developer platform, or developer platform, whatever you call it, to provide self-service, you organize it into planes. Here we have the developer control plane, which some people call the developer experience plane; the delivery plane, where the GitOps engine sits; and other planes to create resources. That's what happened, from our point of view: we organized the infinity loop into a much more structured architecture and moved from a bunch of tools to tools with a purpose.

Central platform teams were created to build it with platform engineering. Sorry, rebranded humans: if you look at LinkedIn, a lot of people are system engineers, cloud engineers, DevOps engineers, platform engineers, getting a higher salary but doing the same tasks. Check out the LinkedIn profiles. Same teams, new mission, same mindset. Relabelled DevOps teams are now expected to build a developer platform, improve developer experience, and provide self-service through the right abstraction layer.

And we all know how we failed, and how low adoption is. We've seen a lot of talks and did a lot of surveys about adoption. Some numbers from 2026 say that to build an internal developer platform you spend millions, and the adoption rate is still low. From our point of view, you may need one to two years to build it, but you need five to ten years of engineering experience to build it in one to two years. That's the difficult part people don't see. You can just hire, and at the end of the day developers will bypass the platform. There are multiple reasons, but one is that the same relabelled system engineers now need to build a product. Dominic gave a lot of talks at this conference about the product mindset, and he's not alone. In building a platform, we're building infrastructure for infrastructure. The developers of the platform aren't just software developers; they're also product owners, maybe FinOps. Developers bypass it because platform teams aren't thinking like product teams.

### Improving developer experience

**Artem:** Another reason for low adoption, which we won't go deep into: we also learned that just deploying Backstage doesn't give you an IDP. It's a framework to build your portal; it's not an IDP out of the box. It needs heavy customization. I had a lot of exchanges last year where people said, "We don't like writing React; we scripted a lot of things, and now we need to develop software." Yes, that's what Backstage was built for. Backstage is a really great tool if you understand it and understand the pain at Spotify that led them to build it. But I saw numbers saying the adoption rate of Backstage as a portal is under 10%. I don't know if that's true, but from my exchanges, a lot of people just use it for documentation. It's a really great tool if you understand its purpose.

In building our platforms we talked about improving developer experience, but we, myself included, realized we never asked developers what they wanted. We talk about technologies, go to conferences like this one, see a lot of shiny tools, come back, implement them and tell developers to use them, without solving their problem. We put a lot on them: custom resource definitions, GitOps, pipelines, containers. Maybe that was fine for us as infrastructure teams, or platform engineers as we call ourselves today, because everyone is doing platform engineering.

Then we started talking about culture, because GitOps is about culture. But it's not easy to understand what immutable infrastructure is. We also realized that rebuilding your platform from Git isn't really possible, because you have a lot of references. For CI it becomes much easier, because you can bundle your images, SBOMs and so on, but you still have secrets outside your cluster and controllers that manipulate things.

We started to understand the developers, who said: "In the past we were allowed to make ad-hoc changes on the cluster." Now you say everything is GitOps, everything is a contract: GitOps in, GitOps out. For us that was the point, but I had projects where people said, "No, I want access," and we said no, everything is now in Git or OCI.

### Branches and automation

**Artem:** We also tried to explain to developers that branches in GitOps are an anti-pattern, but developers live in branches and promote via branches. We told them trunk-based development is the new thing, and promotion happens via folders, with only short-lived branches: you have a baseline, and then values for QA, staging and production, and you promote through the folders.

Then we realized that branches plus GitOps actually do make sense with human interaction. Tools like Kargo emerged, and they work really well; I know a lot of projects using them. The idea is that these tools let you do click-ops, but behind the scenes they create branches that are integrated with Argo CD. I don't know if it's an established term, but we call it *bidirectional GitOps*. As a developer you commit and push your changes, and Argo CD applies them. Or, if you promote with Kargo, another controller writes back from your cluster to Git. So you have both directions. I don't know if it's the right term, but it's the easiest way for us to explain it.

We also learned one thing: if you adopt GitOps correctly, everything becomes possible and easy, not just killing APIs, which is the fun part. You can do continuous delivery, progressive delivery, progressive rollouts and zero downtime if you do it the right way.

### Resilience and delivery

**Artem:** You may ask: what is progressive delivery? We know it from Kubernetes rolling updates: you have a new deployment, and pods are replaced one by one as long as they're healthy. But many teams also use blue-green or canary deployments to test a new version before rolling it out. That's not built directly into your GitOps engine, but you can combine it with tools like Argo Rollouts or Flagger, and it integrates with GitOps. We see this in different projects to test a new version or expose it to a small percentage of test users.

Besides progressive delivery, GitOps also helps us build more resilient platforms. This is what I personally like about it: disaster recovery stops being a problem if you implement it the right way for stateless clusters. Of course, if you have state, if you manage databases, you have other pain points to solve.

### Modern platform tooling

**Artem:** If you look back at the reference architecture: based on the surveys we run worldwide, GitOps is one of the top four capabilities every platform uses to provide self-service, manage it and keep it in sync. GitOps has become the heart of modern platforms.

And soon factions started to form. I don't know if you ever played World of Warcraft. At book signings I'm always curious and ask people, "Are you using Flux or Argo CD?", and they want to be on the right side. I don't know what the right side is, but you can see strong communities forming around them.

We also get a lot of questions about which GitOps tool to choose. We're both consultants, so the answer you'll get is "it depends", and this is not a tool comparison. I just want to highlight that at iits-consulting we use all of them, depending on the project. We like Argo CD, we like Flux, and now, of course, Sveltos, because I'm a huge fan. Yesterday we published some numbers showing how far you can scale and how many applications you can manage if you combine Argo CD with Sveltos, and it's crazy. I forgot to put the QR code on the slide, sorry.

After choosing the GitOps engine, Argo CD or Flux or a combination, all the tools are in place, and we finally start building an internal developer platform, this time for real. But now you also need to decide whether to use Backstage as a framework to build your portal. Or, if you don't have a platform team, you can go for a "platformless" experience like Choreo, where a platform engineering team builds it for you and you pay a subscription. Or you can use orchestrator- or operator-driven approaches, where you integrate services as custom resource definitions into an operator that fulfils them.

This was really nice, because after years of failing, this year I have the feeling we finally got adoption from developers. I represented OpenChoreo at CloudLand this year, in collaboration with the CNCF, and developers asked how they could stay in their flow, in their CLI, IDE or whatever they use, and connect to the platform, for example through their agents. OpenChoreo has this built in. I tested it and it looks really great. A developer says, "I want to deploy a new web application component," and it doesn't exist yet. It automatically generates a pull request based on the request. Not a ticket: a pull request containing the custom resource defined by the platform team. The platform team can review it, adjust it and apply it, and it becomes available via GitOps because the custom resource has been applied, and the developer can then use the self-service.

I don't know if it's the right way, or whether it will be called an agentic developer platform or whatever, but I see huge opportunities here to improve how we collaborate on common tools. As a platform engineer I use a lot of agents, developers use them too, and that gives us a common language, common pain points, common token pain points, and so on.

### AI integration and data

**Artem:** Meanwhile, AI is becoming a citizen of your platform. What do we mean by that? Running AI on Kubernetes is the easy part: if you have a catalog, you can put a label on it, it gets deployed, and you can provide an inference service. But integrating AI as a real part of the platform becomes really difficult. Inference services may sound easy, but a lot of people don't think about multi-tenancy, and GPU sharing is really difficult for small GPUs, because it's not like CPU sharing: a small process that uses only part of the GPU will consume the whole GPU context. So a lot of people are now thinking about multi-tenancy approaches.

And it's not just providing an endpoint for developers to consume, like a self-hosted vLLM. You now also have agents running as part of your platform, like HolmesGPT, a CNCF project, and they operate it. They have access to your Kubernetes clusters and everything else and help you operate them, so they also need capabilities from your platform. But we don't want to focus too much on AI agents today. What we want to point out is that AI troubleshooting and site reliability agents work really well, because they have logs, metrics, traces, everything. They have rich context to explain why an application is showing an error.

And remember this part, where we created a lot of complicated overlays? This one is really simple; people do it in much crazier ways. If you now try to use AI to generate parts of your platform, you get generic answers about Helm and so on. So what we want to point out is that AI needs plain data. Configuration data becomes a thing. You can also look at ConfigHub, where Alexis is trying to solve this.

### Regulation and outlook

**Artem:** What does that mean? Write everything twice; what you see is what you get. You can see it on the right side of the slide. If you use templates, you put values on them, the GitOps engine fulfils them, and you don't know what comes out. With configuration as data, you do.

And this isn't only about AI. Regulation is becoming a real thing, and Europe has created plenty of it. Mario Fahlandt has given a lot of talks about the Cyber Resilience Act coming for us, and now it's here. You need to understand your whole chain, and you can only understand it if you have the plain manifests, the images and everything you reference, so that if you provide a product you can patch it, because you will now be liable for it.

We also still have unsolved challenges, which brings us to our last slide. For example, Michael posted on LinkedIn that hydration-based abstraction still has no clear path, and that Helm generally doesn't have a good story for schemas, maintenance or API versioning. How I interpret that: if you use a third-party chart that doesn't set a security context, you can fork it, or put another layer on top, like Kustomize, and patch it, and it becomes really crazy because there is no default. And of course there are other challenges.

If you have questions, we'll need to take them afterwards, sorry. We tried to fit nine years into 30 minutes, and we didn't cover some topics, like event-driven GitOps platforms. Thank you very much. We were asked to point you to the feedback QR code. Thank you very much.
