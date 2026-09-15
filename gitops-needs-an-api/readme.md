Swiss Cloud Native Day 2026
GitOps Needs an API

# The short

GitOps works well. Well enough that high-level business intent ends up in Git too: customer tenants, feature rollouts, access policies. The hard part is not storing it there. The hard part is expecting business stakeholders or customers to manage it through pull requests and raw YAML.

Reverse GitOps is an API-first pattern for exactly this problem. A typed Kubernetes API in front of your repo accepts structured intent through CRDs, without giving callers direct access to Git. A controller turns that intent into YAML files and commits them to Git. From there you keep the GitOps workflow you already trust: review, policy checks, CI, and a full audit trail.

I’ll demo this live using the open-source `gitops-reverser` operator, and close with an honest checklist: where this pattern shines (low-churn, high-impact configuration that needs review and audit), and where it is the wrong tool (high-frequency writes, tight latency requirements, or anything that belongs in a normal database).

# The demo

This is longer than I ever did: 45 minutes, so I can put a bit more into this. I should also expect a high base level on cloud native tech.

I also promised level: advanced, so I can give an overview but I should really expect a deeper knowledge of things like kube-api server and what it can do for us

I would love to the the barcode trick again: let them vote on something silly, or let them create resources in my small kubernetes cluster. As long as they are not allowed to merge to main then I should be fine.

Mention that I'm working on a prototype github app that allows you to edit your repo folder as an API -> quick an easy just firing up a KCP workspace, no workloads but you could configure the checks that you like to be done and use it as input for GitOps workflows.


For the demo:
* Let people login through OIDC, but let's make it a bit special, they just use that single QR code for validating that they are here and can be trusted. Explain a bit on that route.
    What do I have on this already? What should I open source more?
    What are thee normal domain requirements that I apperently already impleemnted for my other demos? And also for my GH stuff?
* Explain that the 'normal' mode of operation is a company flow, gh flow, or google flow (external identity).
* This offcourse is demo only: would it be cool to even allow them to use GH identity voluntarely? And then show theme someething extra? Wouldnt it also be cool to show some metrics / some live dashboard in the slide? Just to get it warm together?
* The main goal is to get every incomming http request authetnicated and authorized: let's give it the right properties so that we indeed can enjoy the flexibility of the Kubernetes API itself.

Then we just show that it works on a simple API -> which only goal is to just show how came in, count them, and return the headers that you send in (so that you can see your own session data). Thats good, now we can do more cool stuff




# My intro

Software Engineer, Trainer, and Open-Source Builder
Simon Koudijs is a software engineer and trainer working at the boundary between software, infrastructure, and configuration. He has worked across startups and the pension industry, with a focus on improvements that are measurable and useful in practice.

He speaks and teaches about Git workflows, Kubernetes, configuration, and internal platforms, with a particular focus on how shared infrastructure shapes software behaviour. He presented an early version of the Reverse GitOps pattern at Platform Engineering Day Europe 2026, co-located with KubeCon, and currently builds the open-source `gitops-reverser` operator (github.com/ConfigButler/gitops-reverser).

# Overall what I want to tell

API: Application Programming Interface
What is an application? Is that AI? Or a nice and handy tool? A command line tool? Some Saas products that allows you to interact with git in an easier way?

How can we work with GitOps?

GitOps is kind of a pipeline, lot's of bells and whisles, you can expand, you have applicationsets, based on things in the world you can expand/install things and it's automatically applied (if configured darefull).

Sometimes it's more a machine that needs delicate care, you need to know which order, how details wokr out, deploying without downtime is certainly possible and you could call this engineering.

But you can also overdo it: who dares to change it? And do you have time to review PRs that people can make in the blink of an eye? Do you spin up ephemeral environments? It's all adding up and also adding complexity.

As a programmer:
DRY
KISS

They can be hard to combine, and again it takes well known requiremnets, and sometimes some gut to decide when you want to DRY and when you want to DRY. Because in my opinion it's not always simple. And it's certianly not always the right choice to not repeat yourself. If you have 3 simple enviroments, and there is a lot of differences between them. Should you try to commodizee them? You do want to keep production and acceptance as much equal as possible don't you. Argghhh

And your most important goal is that you want a predicatble path to production.

So I now I'm here to tell you that Reverse-gitops: an idea that requires us to review your hard manufactured pipeline, and to see if you really need all pieces. But before you do that: let's first see what it might bring you.

The point of reversing gitops is to actually do what you have been told not to for years

You can use kubectl apply in your pre-production environments. And instead of finding yourself drifting away from the source of truth: you will see that the source of truth just moves along with you. Both git and your cluster are working together in perfect harmony.

So if the machine is complex and has lot's of machinery and pieces then reversing it can become impossible. 

But let's first together assume for the sake of argument what would happen if we would keep things simple.

Off course we have the happy trio: deployment, service and ingress -> we can just kubectl apply it. We can also just put them in plain KRM in a kustomize folder and apply that. Now we can apply it on different environemnts as well. But what if we wanted to change it?



In the demo wee can take the time to show that we just can easiy add new things and that we can adjust things: and that it can lead to a PR

In the demo we can also let the public particiapte by doing a QR code based what do you think.

We will show them that a CRD can contain more than only the "happy trio".

Also mention the movenent that is going on here, tools are moving into a KRM-native way of thinking.


But also mention the downsides
* The whole world delivers Helm charts: you can configure which helm chart you want to install, which values. But you cant go back in a reasonable way. The actual files are annoying templates that have so many things in them that you can't predict in most cases whats happening


AI can edit our files, if you give it skills it's pretty good at it.
But it doesnt know your clusters, and it cant know exactly which crds versions are installed
You can give it read access
But why don't you just let it use CLI tools to talk to it? And why cant we just convert back these actions? And review them as a PR?
Git stays the ulimate source of truth: and we can use GUI, we can use AI and anyone in the organisation to talk and do the stuff...
How about showing all of these? Showing the macine, also showing the cascading that can be in it. Cluster of clusters, managing other clusters / installations.



The checklist to end with, or start with?:

Do you see any use in giving a part of your GitOps repo an API? Does it fit the mentioned usecases? Or is something else?
    -> Let me know!
Can you select a small part of your GitOps repo to start with, only certain CRs, or a single simple folder
    -> You can even manage it from two sides, bi-directional GitOps is possible
Can you create a small "intent" cluster that captures only that intent? And can you handout public oidc access to it, there is plenty of ways to do this
Do you need attribution (knowing who changed what), I would always want it
Do you need pull requests for these changes? Or could they just be pushed to main right away (could be perfectly right for databases that are created for a test cluster?, and most self-serivce portals also don't create PRs?)

Call Simon
Be happy and allow people to make the change themselves: no need to raise issues or create direct changes on scarry GitOps repos


The bigger dream behind:
* Giving KRM a bigger interaction surface: let's show the world what it could do.
* Wouldnt it be beatiful?
    * Any intent could be easily indicated, well abstracted just giving enough things to usefully indicate your needs
    * Any SaaS would be configured with KRM: you can just GitOps these nice side tools
    * There is a lot to say on this, I just started building and learning the hard parts that are certainly in this as well.
    * You could build your own operators, you can also use whatever you need
    * Application devs would just speciify together their configuration surface: and they don't need to spend any time on thinking about how to store secrets safely, how to indicate intent, how to provide an MCP, how to create an TF module out of it?
    * A lot of it isnt there: and I'm looking for validation. Is this dream usefull? Would you see a place for it in your workplace? Let me know.

Tell my own story: just define what the tenant of a customer should look like; and all is arange. Custom domain, custom amount of storage, which applications are installed, the whole island is automatically deployed: they can just onboard themselves on a website by providing their intent. -> This is where I come from! Where are we going to?


Mention the things that I won't touch:
* Using SOPS to encrypt secrets
* Brownfield discovery: reconile into objects
* Deep knowledge on configuring kube-api server
* Build your own GUI -> voter is all open source, and off course you could build any GUI yourself with AI, the actual authn and authz is not yours to write, and I would hook it up to your GH org or your real company OIDC


 Design boundries:
 * Very fixated on getting ordering and attribution right: so two authros at the same time will really record how they have been changing a single object
 * You select / configure for a selection of what happens in your cluster: only the real intent. There shouldnt be need to log all pods actions (technically you could, but I don't see why).
 * We can group API activtiy based on time, because of nr 1 I've decided to "split" in seperate commits when two people are doing changes at the same time.
 * gitops-reverser does NOT sync from git to your intent cluster, so you have to configure your FluxCD or ArgoCD application yourself to do that (preferably on a webhook). Please do make gitops-reverser the "boss" of the reconciling. Syncing in two directions is a top prio, so also configure the webhooks that are possible. Conflicts get harder when you give them time (a general truth).



 The bigger line:
* Introduce myself, my dream and my company, explain that I don't know everything and that I'm looking for feedback, I can give help, change things, all is open source
    * Keep an eye on things that don't add up: feel free to ask questions
    * The demo is pretty interactive, and there is enough things that can go wrong
    * Name the open source components that we have today:
        * reversegitops.dev
            talks (room-pass for now)
            manifest
        * reverse-gitops
        * krm-stream
            * For live streaming Kubernetes watches into browsers
        * voter (the demo component that you will see live)
        * more to follow
* The big picture for today (one slide and let that be the one to show auth, intent and gitops-reverser)
    * Intent cluster: the API that everybody can talk to, your abstractions are in here.
        * Let's immediaty address the elephant in the room, we wil go back as well!
    * Your GitOps repo: the intent cluster actions are immediatly translated into that
    * Your clusers: GitOps is used, just like your are used to sync from the GitOps repo in your cluster. Nothing different there: ArgoCD and FluxCD are friends.
* GitOps enthusiasm
    * Explain problems that I see: I just like GitOps very much, very good properties. Files are transparant, changesets are as well. Having authors timestamps and space to indicate why something was done (commit message) gives a very powerfull and reproducable way of working
    * It kind of stops at the infra side
    * Explain the one problem of having people 
* GitOps needs an API
    * For people that don't want to work with your GitOps repo (no Git knowledge, no GitOps knowledge etc)
    * Only for a bounded piece: you simply can't revert most things
    * Explain the intent cluster: and why I've seperate the two
    * Most people should not have any access to a production cluster: that should be on a shielde corner of your network.
    * But that also hides the beaty of the Kubernetes API itself, and the properties that it gives as well
    * This movement hopfeully can start small: just allow people to self-service an abstraction that is often asked (a certain kind of database, a subdomain, to spin up a certain workload -> that's up to you to decide!)
    * Let's also drop: does it only need to be clusters? Note that actual configuration for applications potenially also could follow the KRM standard, and potenially you would have a folder that is only deployed into a workload (as a mounted OCI artifact for example)
* Demo 1
    * Let's start to explain how the first part of my demo works
    * Should I already explain the bigger picture earlier?
    * I should introduce the KRM resources that I created for this: and the fact that they will also use them
        * The QuizSubmission

    * Let them login, and let them have their own identity insinde my cluster, show how things are mapped and how it's currently placed
    * The fact that your are here is the authn for today (the code changes every x seconds)
* All good and well: 
    * but you have not seen yet what gitops-reverser is actually doing. Let's show that config as well, let's start with the simplified conifg as well
    * Lets explain the need for bundling things: if you do a kubectl apply -f then you don't want to have 56 commits, do you?
    * As an extra service: you can include a CommitRequest: and it will also include that in the commit message. Perhaps it's funny to also show that it's possible for me to add an extra few votes. Reverting that commit woul be even more cool, but let's also skip that for the sake of time
* Demo 2
    * Let's show that it can write into Git
    * Let's also sync CoffeeConfig, and let's show that we can make changes together, and that the watch stream also helps in prevening merge conflicts (on the same branch), and how it's also using the CommitRequest to really give people the option to indicae their intent
* Extras
    * The pictue on bi-directionality, just state that it's possible and shown in the e2e tests of gitops-reverser. It spins up seperate cluster during ci/cd in GH actions, and executes a few scenarios.
    * Placement strategy and choices to make it feel safer
    * Show kustomize support (simple)
    * Show custom commit messages (and bundling)
    * Show encryption and bootstrapping of secrets
    * Show configuration for secret encryption

What is now the big line?
* GitOps is cool, it can do a lot.
* Define your abstractions so that you can point people at a single folder. Could be both application configuration, any CRD is welcome, but keep secrets as seperate referenced resources
* Put these in an "intent cluster" and allow anyone that should be able to express intent (all your company collegas, certain teams, or the whole internet for onboarding scenarios).
* You configure gitops-reverser to push all active / including author information into Git


Checklist:

* Show that an API resource in kube-apiserver is 1:1 with a file, placement is hardly important (beatiful designed if you ask me)
* Show a git commit, show that it has been comitted and authored by two different entities. Your actual identity is included!
* Show the actual configuration surface of gitops-reverser so that people now a bit what to expect.
* Show kubectl-neat, and perhaps also show the other gitops-tool?

Regarding the questions in demo1 and demo2 -> I'm not so sure yet if I should throw in a second round of qeustions.
Perhaps its better for people to throw in some config changes, and to let them see specifically how the merging holds (and yes obviously its annoying to come to an agreement on configuring a simple price page with a lot of people at the same time).


The questions:

demo1
* Helm or Kustomize?
* ArgoCD or Flux?
* Do you work arround GitOps sometimes?
* Do you spend much time tweaking RBAC? Or do you just give plenty of rights?
* Does it feel like your are doing GitOps right now?

demo2
* really giving intent: no commit message is a bit hard to track back at some point
* how do we handle merge conflicts?
* who has the source of truth?
* Can you find your own commit?

When does this fit?
* You need an exact list of changes
* You just like file based a lot

When this doesnt fit
* You can't define abstractions that are KRM compatible, we jsut have a complex GitOps repo
* Your devs just dislike Kubernetes and all that comes with it

What should not get you distracted:
* You don't need Golang experts: all major programming languages have good libraries to communicate with the Kuberentes API
* Auth seems hard: getting it right and specific is very hard. Kubernetes shows where you are
* I dont want any pull request: just push to main, serious -> with the right authz and abstractions you should be safe to have a part of your intent be managed directly. Let's be fair: most configuration screens immediatly 'deploy' when you hit the save button.
* Do you really need to program yourself? Or with other teams?
    * No you can also use KRM native tools to create your abstractions
    * ArgoCD and Helm, but also don't forgot things like Crossplane and KRO
