The goal is to slow down configuration changes: especially the ones that end-users are doing by using a GUI or by unleasing an random AI to our systems. 

Start: what is configurtion, anyhting users adjust. The failing API key example, but also a refernce back to yesterdays presentation of Christine Pinto: "we don't need to test that". Can we build more safe guards arround configuration? Show the change of cloudflare DNS. Off course I could have made a better runbook, scripts to put in the right values. But why isnt there a button to revert the last 10 minutes worth of actions? If I really get panicing arround.

We are going to package configuration. Let's put these also in an artifact registry, just like most of you are putting their code in it. What does that take and why would it be usefull? Is it worth it?

Let's take a look at source code: how do we deploy that? We have a nice picture were we exerniazle the configataion. I would like a picture of that, but first a picture that shows the normal regular process that people recognize. Show how the artifaccts get created by Git and CI, and perhaps do a word on promoting resources. Also a word on igredients: I do not know your exact system, and as as good consulttnt once said: it all depends. 

Then we switch to let's apply this. If we want to get back to source code then we would prefebly model our applications configuration as much as possible into text files. Oef thats two steps back isnt it?

Only store the desired state, and make sure that you model complexer configuation in multiple resources that can reference each other. Make sure to keep a special place for your secret values. We dont want them to be in sight. And then there is the hard case where we also still need an API. We do want our users to see a nice settins screen, or there AIs to have the option to use an API (it gives fast answers). I would say that you model anything you like in KRM.

You might have felt this one comming: now that we have files, we can also commit things into Git. Every person that makes a chagne ends up in Git. I have made a special nerd operator that is called gitops-reverser. How that works is part of tomorrows talk. Effectivly it allows you edit a folder with files through an API. Your end-users  dont need to see Git, but you get a nice audit log.

Now that we have them in Git: we can do the same, we can push them in container images, and now we can actually sideload them into a deployment: really replacing the old pods with new pods. The decrypion of secrets only happens at a very late stage and only with the workloads identity: we can't get access to them.

Some of you might recognize this as Kubernetes: it is, but for this talk its not that important. I only use it for its great API and for the opiton to reverse-gitops it back into Git. If you care to know the details on that: then I invite you tomrrow to my talk on (Ab)using the Kuberentes API for settings managmenet. Where I'm openly asking the questio: is this contrarian? And is there a change that it is right? (which really circles back to the keynote of wendsday that was given by Neo4J).


