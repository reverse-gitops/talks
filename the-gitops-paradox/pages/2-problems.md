---

---

# A beatiful concept: you define intent (or spec) in files in a git repo. By doing so you have a perfect audit log (git blame). You can revert changes.

Let's celebrate GitOps: it's been years now and FluxCD and ArgoCD even have their own conference.

But one things reamins a problem: it's not always easy for humans to grasp what is really going on. There is so many tools that can be applied. It's easier to make a mess than to stand ground and keep things simple. 

Sorry for beeing blunt: technology is not always solving problems.

---

# Problems

In my perception it's not always easy to get it right: writing YAML can be painfull. Getting the CRD right can be painfull. Tools are not always helping to much.
* inside vscode there is no default schema support, only when you connect it your cluster. Do you always have access to a cluster?
* Helm charts and Kustomize prevent repetition but they also layer complexity.
* AI doesnt always use the latest versions, how could it know: there is so many old examples on the internet.
* The process of git is nice: but lot's of people (at least outside of this conference) don't like/get git.
* And this is all a great shame!
* Because Kubernetes YAML is so nice, it's self-explaining and it lends itself to model things. Like platforms...

* Off course there is problems:
    * What do you do with different environments? You just create multiple instances. And you script/template/explode whatever you need with other tech. Reverse-gitops doesnt need to solve everything.

