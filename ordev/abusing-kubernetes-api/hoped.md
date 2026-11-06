I would love to validate if I'm on the right track

What made it so succesfull? They have had very good and strong designers, and they have designed for change. They are open for 

I have this dream: I would like a world were cloud providers dont spend their time on building APIs, I would like a world were I do not feel guilty about clicking arround to make my changes. To be a more visaul guy. I also would like a world were I'm the one who decides where my configuration data is stored. Where I get to decided how it's encryted. Where I decide how can read it. If I revoke rights then my cloudprovider cant read it anymore. Git offers a perfect trail. Files can offer a representation. So let's explore. How an kubeapi-server could fit into this! 

What is a control-plane?

Who of you is using GitOps
What is a GitOps repo, and how is it usefull? It's a very powerfull piece in your machinery. It's the source of truth, all clusters obey. They will do anything they can to make it the source of truth. Source of configuration. Desired state. Whatever rocks your boat.


I would love to be the next neo4j: only let's agree to do it in 10 years.

Contrarian? But right?

Can I proof my claim? Can I really prevent that I'm not vibecodoing my way out of this? But how?

Webhooks can't be trusted: you can never rely on this.

I would love to make this in a managed service, but how would I do that? What is this kcp, and how could I show quickly how that is working out?

Why do I really need CRDs to be different? What would be my goal with that?

What would somebody like that comes to my talk? He might be open to a different perspective. Is there something in this idea?

Let's sit back for a moment: we are building GitOps tools pipelines and what not to have reliabiliy. To predicabilty create something, some part is true. I would also throw infra-as-code under this. It's cool stuff, but why do we need it? We want roll back, we want to have control! Can we give control to this type of customer in a different way?

On the other side we build an API: we need to reinvent the weel. Apperently there is cusomters that really want to stay in control, that we are not serving in the rigt way. It's feeling like them vs us. But should it?

What if we could build an API that fulfills both goals? Make your customers happy, make you happy, and also fullfils the increasing need for configuarion.



---

We need to get the word out: this talk is on using kube-apiserver with etcd. It's really about the API part. And you have to know a bit more on the Kubernetes architecture before I can show you how its different.

Yedsterday I tried to let you believe that we should only have tempeorary clusters: but for todays talk we are going to run a continues one. We are not going to edit folders to creaet packages. We are going to build our product API around it. How could that go wrong?

How central do you place GitOps in all of this?