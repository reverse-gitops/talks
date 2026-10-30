https://frontmania.com/timetable-2026/

    Simon Koudijs

Be BFFs with the Kubernetes API

So what if your frontend could talk to a Kubernetes API directly?

Kubernetes is famous for running containers, but its API model is the interesting part: flexible resources, desired state, live updates through watches, validation, and advanced access control. Platform engineers use these ideas every day. Frontenders usually only get the boring REST endpoint at the end. Isn't that a missed opportunity?

I've built a open-source coffee-ordering demo where the whole audience gets admin rights. Grab your phone and configure my demo. Let's see how the live updates are not only cool but also useful in handling conflicts.

This is not a talk about exposing your production infra to the public internet. It is about running a small, dedicated Kubernetes API server as a product backend. Is this weird, brilliant, or dangerous?

Kubernetes may not become your best friend forever. But could it become your Backend for Frontend? Let’s find out.
Mission 2
Wed 11:00 - 11:45

---

Frontmania goals:

 Description
FrontMania Community is for people who are crazy about frontend development a.k.a. frontend maniacs. We as a community believe that frontend development should be fun for everyone!

The Dutch frontend foundation Frontmania unites software developers, application architects, mediadevelopers, IT-managers, students and all its businesspartners who have an interest in frontend technologies.

Our goal is:

1. Upholding the interest of all frontend developers.

2. Spreading knowledge concerning frontend software, infrastructure and related technologies. 

3. Stimulate the application of proper frontend development in professional environments, for example at businesses, (educational) organisations and the government.

4. Improve the contact between professional frontend developers and the companies that use frontend software, nationally and internationally.  

---

I'm excited by giving this talk: the demo already works, and I'm refining a lot of it's core components the last few days. It's all open source so I have something to give/show, and I guess that I should make it practical but also realistic. There is more needed than only an enthousiastic frontend team: backenders and even architects need to be on board as well: where I see this happening? Platform teams that want to build easier ways to provide self-service, companies that are already using Kubernetes and have been wondering, what if we could do this? Well I can tell you from experience: a lot is is NOT there, and this approach is on the edge. I do believe that at it's core there is a lot of great quaity open source work and its using modern and desent standards. So why not?

Let's be honest: when to use it and when not to use it, the last question should be defintily on the agenda.

I'm really wondering how much Kuberntes knowdlegde I can expect from this crowd. I also do believe that I should give them the option to run this thesleves if they wanted to.

And off course: there is also the case/argument where you acutally can stream the YAML documents back into git, so that you can see exactly what happened and who did what. And that we even could accept the changes and bring them to production -> while thinking on this -> this is exactly what I should show as well. There is a lot of iditoic stuff in this plan: let's make sure to call out the idiotic parts one-by-one and let's see where this ends.

Btw. I do have a managed version of this that you also can use to play arround with these concepts. The idea is to make it really simple to do this: making both the deep technical people and the not-so-k8s-tech-savy people happy. And off course frontenders. Feel free to contacat me if you think that this could be an interesting movement.

While thinking of it as well: I really should write down my second manifesto: how application configuration can be better, which points should there be in tht?
* Important config changes are tested (and optionally reviewed) first. Period.
* Every change should be documented with intent, why do you need this? It should be easy to find out why certain things have been exectued
* Secrets are secrets: encrypt them asap, and decrypt them is a serious thing and should only be done by the workloads just befor they need them. 
* Changing is possible for humans, AI and automated systems

While thinking further: this also should be my next follow up talk on testnet: why not trying to see if they are interesetd? I can show way more than I could back then.

---

It's monday and off course Im hugly side-tracked: but in a way, I'm happy with that since this is really giving a lot of new knowledge, which would have been pretty stupid if I hadnt known. I do espect some people in the public to ask difficutl questions on these concepts.

I have been working hard to clear out open source components out of my voter demo: which actualy contined a lot of intersting stuff:
* room-pass (OIDC for eveyone without make it a privay problem)
* krm-stream (sync library for keeping latest versions in all browsers, also sharing a bit so that we dont overwhelm the kube-api serer)
* krm-foyer (a complete binary that wraps the krm-stream libs, and actually allows browser to directly interact with the kube-apiservder. Only with their own server-side-cookie only identity)
* Off course gitops-reverser -> which is automatically inserting the changes into git so that we can show it there.
* And off course we are using a gitops tool to throw the new configuration version into production...

The topic I'm side tracked with is CRDT: Conflict-free Replicated Data Type -> which is really what I've been building in a little bit different way. It's really interesting to recognize this and to see the similirties. Especialy the guaranteed conflict free nature is really nice. The whole crowd could give a +1 and it would just work. Despite that things come together all at once without knowing about eachoteher!

It also raised a lot of questions: when does it fits best? How do you handle incomming changes? Is that a brandnewdocument? And how can it be that there is no conflict? It's very good to be aware: and it might be a very nice demo as well to show that 50 people made changes -> and still resultin one commit with a lot of co-authors. But the value of that would be limited since you don't know why they did it...

---

The other big questions that still should find its place into the presenation:

* When and why is this actually a good fit? And worth it?
    * First all it doeesnt need to replace every API. You can start simple and small
    * Kubernetes is build on etcd, very flexible but also not optimised for things that a relationial database can offer (indexes, joins, offical relations)
    * You have backend teams that like Kuberntes: they don't need to work in golang, but they do need to be willin g to think in desired state. Not everythign fits into that.
    * This is why the example is about configuration data: typically its not beeing changed to often, it's highly imporant and it does make sense to put this into Kubernetes: why? Since it's easy to work on it together, but it's also very easy for AI to work on it.
    * You really need to put it into small blocks: that fit togehter
    * IT's really nice to deploy configuration: yes it's slower: but it's also allowing you to do a review
    * To make the picture complete: if you push your configuration into Git including, intent and names then you have a very nice audit log: and with PRs even the ultimate way to review high risk configuration changes.
    * You may want to push configuraion into files: deploying itself can just be done with container images. Your DevOps team can probably tell you more on that one (just like the application code).
        * Can we build a new artifact out of the commits that peple made? By perhaps merging that branch?
        * We can also more quicjly in the background push file versions off course. That would be a very interesting small operator as well. I guess that annotating that one is just as important: so let's 
    * You can't use OIDC for whatver reason (not sure what that would be).
    * Kubernetes has a limited amount of history:
        * But it does have options to write audit logs to files or to push them to an endpoint
        * I've written a special operator to write back the docs into Git
        * One of better design proprties is that any Kuberentes resource also can be shown as yaml file. All relevant info is in there.
            * That's also why I could do the next trick
        * All your names and edits are streamed into Git: anyone that's wondering what just hapened can just check out what you guys did. Normally your real username would be in there
        * Is this usefull? Well it's a dev friendly way to find out whats wrong
        * It's also AI friendly. Perhaps nice to show what AI can do with this data, without much explaining or even skills needed.


Plesae dont use this for high frequency data. And do note: you can handle multiple APIs on one 

If you want to pursue this: feel free to contact me, this is a pretty early idea. Until know I have been working with DevOps people, GitOps people, Kubernetes experts etc. I now want to extend to application devleopers. And yes bringing good frontends is something that I really love so that's why you have been first.

Screenshot on server sent events -> goold old server sent events, well suported and now also by kube-api server
https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events

---

npx @marp-team/marp-cli@latest krm-bff.md -o krm-bff.html --allow-local-files
# open krm-bff.html in a browser, press  p  for presenter view (speaker notes)

npx @mermaid-js/mermaid-cli -i watch-conflict.mmd -o watch-conflict.svg -b transparent -c mermaid-config.json
npx @mermaid-js/mermaid-cli -i actors.mmd -o actors.svg -b transparent -c mermaid-config.json

---

Don't do this at home. Today I have been working hard on all open source components invovled:

We should try to convey how they all work togheter, without making it a show my opensource work story:

https://github.com/sunib/room-pass
https://github.com/ConfigButler/krm-foyer
https://github.com/ConfigButler/krm-stream
https://github.com/ConfigButler/gitops-reverser/

Some intro on Kubernetes: 10th aniversay last year. It kind of grown massive. How many people do you think attend to the yearly held CNCF KubeCon conference? 13k last year.

CNCF offers a big poster with operators: and most of it comes down to the single same thing. It's a nice set of API resources that allows you to define desired state: whatever you want. But most is infra related. Does that make it a bummer? Doesnt need to be. The API is among the best I have seen. So many REST discussions later I stil can't believe that it was there all the time.

Also honest: it's 10 years old and the Kubernetes release process is veeeery carefull. So they still run the older OpenAPI spec version for example. 

But in essnce: they just have delivered a very mature platform: where you can build on. So you came here to learn a bit on using it as as a BFF. What should it do?

Well we do need a proxy, and we need a way to login. Normally you use it through a scarry difficult looking kubectl command line tool. Today we won't. I will show you FreeLens, and I will show you a custom made frontend that works with Kubernetes.

---
