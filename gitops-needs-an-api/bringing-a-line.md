Why is GitOps important?

* It tells a good story on what happened: or at least what we wanted to happen. Our desired state, spec.
* Git gives you the story that a Kubernetes cluster alone can't
* Every commit is like an alinea/chapter.
    * Who
    * When
    * What
    * Why
* You express your intent over time
* As said in the text: it's getting more important, we also can express bigger and more imporant business things in git. A new tenant for a cusomter, configuration etc.

Why do I claim that it needs an API?

Git isnt easy, people get scared, they say it to each other and it gives them uneasy feelings 

Picture "mufassa, mufasss, mufassa" meme from the Lion King

It's easy to fall back to the "what" -> just fix it now and here, click around and see it happen. And let's be honest a lot of tooling and configuaration screen work like this today. How many of you manage their SaaS providers with GitOps?

What if we could let that these worlds co-exist? Integrate? That does take some serious effort. 

When I stared 14 months ago I came from a 30 people company that creates a SaaS product: the dream was to onboard new cusomters let them self-service their configuration. And boy did we put work in storing their secrets in a safe way, creating a nice GUi, discussing what kind of beatiful API we would create; and that is where it started for me. I was also doing the platform / Kubernetes clusters and I really thought why isnt GitOps only for that? Why can't I see what our cusomters changed in their settings over time? And more importantly, why they did it?

I knew there was something in there and we builded effectively an API that used Git as a database: that turned out to be way to hard in our context: and in itself, it doesnt bring money. People often justen want to configure. They want it to work right now. Off course you can build a log with who did what, why do you need GitOps?

Long story short: we just couldnt build a cloud native company in that context: but it kept shouting a me. Why cant we use GitOps for more things in the world? It's such a nice process. It's so nice to read that story.

But what makes it nice? Why would you be so attached? And what IS the right API if you want to have a GitOps like experience for people?

Turns out that I overlooked it: and it's so obivous that it sounds stupid to say it. Especially among all these experts, why don't we use the Kubernetes API to let the rest of world configure anything they like? They surely can express their needs in KRM can't they?

What hit me when I was doing research is the beaty of KRM. It has that beatiful property that exactly is that propery that makes it possible to do `kubectl apply -f`. The API resource that is stored in etcd is essentailly exactly described by file content only. So where the file itself is stored is not important (I know: not always always), but it has been an important architectural point when they designed it back then. And it's exactly what my dream needs.

So:
* We love kubectl since it can turn files into API calls (and the other way arround)
* But it's still a bit dark on the terminal
* How can you make it so easy that people like to use it?

Well I tried pretty hard to educate myself on that matter in the last 14 months. Let's do a live example of this together. I wanted to make this a demo that is really live and off course we all cary a phone arroud. So I thought: let's build a fully cloud native voting app for audiances.

examples.configbutler.ai
    QuizSession
    QuizSubmission

I've designed two CRDs for it that allows me to define which questions we will have. And it will allow me to enable/disable the questions. This will be the actual API surface. There is a sepcial cluster for this on demo.koudijs.dev and I will show you a QR code

This works by an OIDC provider that I connected to Dex. I've created a special provider that is called room-pass, since it's everybody in this room that I would like to give access. room-pass is an operator: so I thought -> let's add another set of CRDs as well so that we can use that to communciate with it.

roompass.configbutler.ai
    Room
    Participant

What I'm asking you is to come up with a nice unique nickname. Could be your firstname, as long as you reconize it. You will see that I'm generating an nice e-mail adres for you.

Obviously this normally could also be a GitHub OIDC or your companies single sign on mechanism. This talk is not about auth, but it's one of these things that I've come to appreciate much more inside Kubernetes.

Questions:
How to pronounce Kubectl
Helm or Kustomize
ArgoCD or Flux
Do you know kubectl neat
How does work come to you?
Did you design a CRD in the last 12 months?

Let's just open up lens and see the answers floating in. Let's also appreaciate that we have that label so that we know who has entered. Please do note that this frontend app is quering the Kubernetes API directly. You are vote ends up in etcd as it's own CR.

This is also one of these moments to show another open source library that I have been creating: if you want to talk to the Kubernetes API from a frontend then you will find that you can't use watches. And if there is something that you want for your frontend: then it's watches. I love it when things change immediatly. There is a little helper library for that as well: https://github.com/ConfigButler/krm-stream 

Now this will bring us to the more excting part: togheter we learned that GitOps is so cool. Let's put checkmarks on what we have accomplished:
* Who (yellow checkmark)
* When
* What
* Why

Well it's all kind of bolted on top but it's there, and for this specific use case you could also argue that intent is pretty clear, there is not commit message to show why someone filled the thing. But what about git? Could we have these resources in Git as well? And how would you get them there?

This is where that reverse-gitops operator comes in. It's sole purpose is to watch whats happening in kube-apiserver, and to convert it to a 'neat'/cleaned file. We only want spec and usefull metadata. Nothing should point back to actual cluster where it came from.

Since I filled this topic as advanced I thouht that it would be good to stand still with this little graph. How can you actually get information about whats happening inside a Kubernetes cluster? And which mechanisms do I use?

I've actually rewritten my operator to switch over, since it turns out that the watch has another very nce properyy: it's really focussing on the actual resources -> and these detaisl matter. If someone send in a scale command then you have to "map" that back to an object yourself if you only would be using the audit. Well I will spare you the nitty details of all of that.

So this is an important slide to have/show: since it elaborates a bit on the things that you need:

| Mechanism | Username Attribution | Lifecycle Timing | Can Intercept | Guaranteed Persistence | Latency | HA-Ready | Ease of Config | Managed Clusters
|---|---|---|---|---|---|---|---|---|---|
| Watch Stream | No | After commit | No | No | Near real-time | Yes | Easy | Yes |
| Mutating Webhook | Yes | Before commit | Yes + mutate | No | Blocking | Yes | Moderate | Yes |
| Validating Webhook | Yes | Before commit | Yes | No | Blocking | Yes | Moderate | Yes |
| Audit File | Yes | After commit | No | Yes | Async | No | Complex | No |
| Audit Webhook | Yes | After commit | No | No | Async | With care | Complex | No |

Notes:
- "Managed Clusters" means available on AKS, EKS, GKE without special access


git show --format=fuller

```yaml
commit 423936a8f536ac8e4a74c1d7673264c847f26c3a (HEAD -> present)
Author:     Simon Koudijs <simonkoudijs@gmail.com>
AuthorDate: Tue Sep 15 15:43:01 2026 +0200
Commit:     Simon Koudijs <simonkoudijs@gmail.com>
CommitDate: Tue Sep 15 15:43:01 2026 +0200

    chore: just a normal commit
```

Why is my name on it two times? This is just default behaviour: it's specially made for use cases where the actual comitter is someone else, than the actual author.

And off course an example of this in one of the create commits

```yaml
Author:     Simon7 <simon7@koudijs.dev.test>
AuthorDate: Wed Sep 16 03:51:25 2026 +0000
Commit:     ConfigButler Bot <bot@configbutler.ai>
CommitDate: Wed Sep 16 03:51:25 2026 +0000

    chore(demo1): 1 change from demo:CgZzaW1vbjcSCXJvb20tcGFzcw
    
    - [CREATE] quizsubmissions/demo1-round-2026-09-15-simon7
```


Hopefully you have had some fun: but I also promised to end with a pros and cons list

First of all: I'm trying to show a pattern here, and I'm trying to advocate that the Kubernetes API can do so much more than we think. It shines with AI usage, and it has proven itself to be reliable and backed by people that take long term maintaince imporatnt.

Shines
* People know GitOps and started to like it
* You want very high levels of audit quality
* You want an approval process, you want to re-use tooling that is already known

Avoid if
* People get scared of hearing KRM 
* Don't use it for high volume stuff, altough feel free to try the limits.


The last questionaire will be opened:
Was this talk usefull to you
Do you have feedback?
Do you think you would be willing to use this concept?
Would you like to hear from me, let me know your e-mail adress or linkedin

