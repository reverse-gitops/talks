I'm Simon, have been an software engineer for years. Worked at companies big and small, and in the last 6 years I switched to DevOps and platform engineering in a smaller sized company: where we made the switch the Kubernetes. I don't work there anymore, since I learned that I was missing something. Something that I'm now trying to build. I'm here for 2 things: Telling and showing what I envision, and I would love to get your feedback. Don't spare me with your quistions: it's all not written in stone, so if you dare to dream with me than we certainly can make it better together.

I would like to show you this little movie first: my sun agreed that I would show it, but I had to promise that I would tell you that he build it all by himself. Which is now did: well there are parallels. To me showing this idear here, showing the protoyp feels akward but also very liberating. I have a working prototpy and I have an idea.

I like files, I like everything beeing a file. No need to use custom tool, editor choice yours. Turns out that LLMs also like files.

So naturally, I also like git. And I like the process that you get with it: get feedback of others, have full transparancy, again no need to use custom tools. 

But as a human (and others) I also like visuals: a nice user interface, clicking around to get things quickly. Easier and faster paths to set things up, most of these things actually somehow require an API -> a server that quickly responds, validates and also shields users from the actual core. We have internal developer platforms in all kind of different ways: and most of them use an API. And I believe that it is an important direction as well. But somehow we every time need to loose our beatiful simple world: our files are gone, and some database is buzzing.

That's not bad in itself, but for things that don't change to often I like the process and transparancy of files much better. I see the need for the API but I'm believing and advocating that I would like to have both. I like files, and I like an API. Well certainly not every API: but the Kubernetes API is pretty cool. 

But wait, the Kubernetes API is very important to our workloads, we need to protect it from people touching it. What if they do bad stuff?

Humanity has invented GitOps for a reason didnt they? So that we never touch our Kubernetes API by hand, the clusters feed themselves with git state. Git is the single source of truth.

Behind the Kubernetes API is the Kubernetes Resource Model (KRM). A very interesting design principle is that KRM resources are describing desired state. They have spec (and status). Most rest APIs that I worked with have both a url and body that need to be viewed togheter (make a curl call to the live weather in Adam). The inventors of the Kubernetes API took another route: they decided to decode both the body and the location in the body (make a live call to the Kubernetes API).

Let it sink in: the location of your file doesnt matter, the name doesnt matter. It's just the content that matters. Which is also why you can place multiple files in a single file. kubectl apply -f and GitOps for that matter are your friends.

This is perfect: and this is also allowd me to sketch the actual GitOps paradox. I have been overly protecting my precious production workloads, and I've been trying to add API's and I've been feeling guily of not adding both. But why can't we do GitOps in the other direction? What refrains us from doing that? What if we just place the Kubernetes API in front of our git repo? We keep the good old gitops process (and other properties). But we gain all the goodness of the Kubernetes API.

I've been searching: but I failed to find something that totally does this: I also noticed that doing this inside a small companies engineering team was to distracting: it's not serving both ends. So that's why I decide to quit my full time job. And to work on this fulltime. Bringing KRM to the masses, helping people to use the Kubernetes API for their configuration.

The core of this is luckly simple: place an extra Kubernetes cluster in front of the GitOps repo. And have an operator that translates the Kuberetes audit API into readable git commits. 

Last week wednsday we had to vote in the Netherlands: it's a nice foto on a beatiful day, and I also have a voting app for this day. The demo is embedded in this presentation so we should be able to follow along pretty quickly. I, together with my AI, wrote a nice little operator that is going to open up a part of the Kubernetes API to you. Right now. Almost exactly as I'm advocating, except that I'm now not doing that in a seperate cluster. For production loads I would suggest you to do it differntly.

Let's first practice what I preach: here you can see the questions definition that I used. It might be boring, but it's stored in the Kubernetes API. And yes it does have a status field. Which is indicating to you the actual code that you can use to login.
> show btwebterminal and show a kubectl get quizsession demo-1 | yq

I have created a special subdomain on configbutler.ai to showcase what could happen.

If you guys scan the QR code then your phone will download a nice little frontend that directly talks to the Kubernetes API. At this moment the authetnication is done by the rolling code that is embedded in the QR code. You might note that the QR code is changing every 30 seconds -> its live fetching the code from the Kubernetes API in the background. Thanks slidev for that power in the presentation.

So let's see what's going to happen. Show the QR code and immeditatly show the command sequnce that is already in that slide.

You will see the votes are comming in. But wait, they are now just in a Kubernetes API. I can still go arround and delete them for example. 

Let's take a look at one of the votes, and see whats in there.

Show the first vote object on the next slide is marked up yaml. How could I do that? Should I just use a terminal? Perhaps it's nice to show k9s for this specific thing, then I can enter it

But now wait -> this is all not to much I hope, but we are doing GitOps. Where is the repo? In the background the gitops-reverser is hopefully humming along and will show you something. For the sake of speed I have a local checkout in my terminal here, and in the background I have another process running a git pull every 3 seconds.

So let me cd into that dir and show you a gitlog

So what we see here is not yet your fullname or e-mail adres. It's not that hard to get that in as well. Kubernetes API supports OIDC and also impersonation: but for a demo you don't require a login. And showing random names also felt a bit uneasy.

If now look a bit deeper in a git commit then you see support for this usecase. There is an author and on behalf off. Can you feel where this is going if you would use something like this as a platform?
> Show a terminal, and show the latest commit. It should show gitops-reverser and the storage account.

There is a few uneasy truths if you want to make it so fluently going back and forth (between file and API resource). Let's go by them, and let's hope that you don't come up with more than I anticipated.

1. Who owns the truth?

> Include the photograph of schietterein-close-up.jpg 

I've designed the implementation to be as fast as it can get: so it's assuming that it's the most used write path. I could go into details, but I won't make it if I did. If it detects a write from the git side then it should be asking flux or argo to reconicle, and only then it will 'replay' the audit events that it pushed into a queue. If by some weird coindance the same change came in then the event won't result in a commit. It will be silently dropped. If the intent has changed of a resource: then you are unlucky, the git working tree is set the latest commit and all events are replayed (and resulting in commits) as is. (I'm wondering if this part is to technical, but it should help to give the idea some credability).

2. You need bi-directionality.

> Include the photograph of the train -> it can drive in both directions without turning it around.

For as far I can currently see this concept is augmenting GitOps: it's adding an easy way to indicate intent, but it comes at a cost. Every resource that you want to manage this way needs to be syncable in two directions. This especially gets tricky with multiple environments and helm and kustomize. At this very moment I only support 'raw' Kuberetens YAMLS, I'm tinkering with the tought to do some experiments on Kustomize but it will be hard. For helm impossible: think abbout it, you make actually want to get the values.yaml -> one helm chart could have a randomizer build in. 

This is why I feel that Reverse GitOps should be augementing: the 'interface' to your end users should be expresssed in nice clean KRM compatabile yaml. E.g. you create your CRDs. Just like I did in the demo. This might sound hard and stupid: but an interface was never easy in the first place: and you get back a lot of great stuff. And it least you don't get to build the actual API yourself. I hope that it didnt sound like that it was going to be easy.

I do believe that last years we have seen a few more parties embracing KRM as a very clean and nice way to technical communication. Also abstraction has been re-invented in different good ways. It all started with Helm and Kustomize but Crossplane and KRO certainly deserve a mention here as well.

When preparing this I felt that this was not finished yet without actually bringing some workload in the air. Showing what it could look like. And I have to be honest. The airplane from the start is prettier. At this moment gitops-reverser has fixed file paths: so every resource always gets written to the same path pattern. Nothing to troublesome but it might make you feel a bit uneasy if you are going watch closely. This problem is nothing fundamental: I also would love to stream the same objects into the same files (you now with `---` between them). What you also will notice is that I'm relying on FluxCD: I've been using ArgoCD a lot as well, and I don't see any reason why that wouldnt work.

So for this demo I'm using KRO: but it can be any platform tool you like, as long as it's able to work with plain KRM resources. Every Kubecon is amazing from that perspective, it allows me to learn a lot of new things as well. I won't explain more than needed: it has one definition, and then you can make one or more instances. We are deploying podinfo, and we can only adjust the color and shown text. 

KRO allows you to define a 'template' and creates a new CRD out of it automatically. It's a real CRD under the hood (fact check). And you can work with them, just like we did earlier.

For this demo I went a bit further: let's create a pull request and we will do that by instructing gitops-reverser to watch for our new type. gitops-reverser can off course be instructed by KRM itself. I inspired it's design on the great work that FluxCD is doing on this (I'm a proud fan, perhaps I should make a picture of it in front of kubecon with my cap as fun joke?).

So we have a git-creds-demo secret, a GitDestination, a GitTarget and a WatchRule. Together they prepare gitops-reverser to do it's work. Every event is picked up and written to git. Do note that on startup it's also reconicling the current set of matching resources into git. Only if that is needed of course. I spend serious time to get the GitTarget in the right shape (vibe coding didnt helped me there!): it's now implemented in such a way that it will create the branch at the very first moment that a relevant commit needs writing. It will also bootstrap a .sops.yaml and README.md in the path that you defined. For everybody that doesnt know sops, it's a great CNCF project that allows you to store YAML encrypted. Which I only do for secrets. It's certainly not the only way that conceptually is possible, other implementations are certainly possible. But this has proven itself to be very reliable and fast.

So we have an podinfos-intent namespace, this is where we will manage our intent. Let's create our first wave of intent. By throwing in a few different colors, for the sake of fun I made it a bit more visual appealing. To keep it simple I'm just applying these manifests: if your end users are technical they could do it as well. I've considered to also creae a little app for this, but the talk is dense enough as it is already.
> Make a few colored circles with a dutch word in it, also include a deliberate typo.

Now show immediatly that it actually works: create qr codes out of them and show the public it works.

The next slide will correct the spelling mistakes and I will again show the same slide, and their corrections.

This is the power of staging off course: you can correct whats wrong before you go to production.

So let's create that pull request and let's merge it, let's also enjoy that we can see the process. Making the pull request is not yet on my radar: I think the concept is already dense enough without it. Very curious to your thoughts on it. So I show the gitea screenshot of this evening. And I will do a quick merge commit on the command line on main, which also works for the moment.

Now I'm also skipping a few steps, and creating scripts just to speed the demo up a bit. We don't have forever.

I can also select all and then remove them, I also could revert it if my bi-directionaly support was already totally finsihed.

(Note to self -> make sure to include the .gitkeep in the folder, if I'm removing the all the environments then it would break on stage).

So this is all very cool: and I'm happy that it came this far. For the last slide I have some questions, I'm very aware that the world is moving rapidly, I do need your feedback. Let me know your thoughts: especially if you feel the dream of getting both your file based openness with spledid API. A lot is possible.

You can help me:
Connect on LinkedIn
Star one of the repos
Get into the ConfigButler slack channel
Meet me irl at Kubecon: I have an open booking page
Fill in my final more serious questionary (please be honest!).

QA
