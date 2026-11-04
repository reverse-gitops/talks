Everything that can change behaviour for more than one flow

code + config + infra = production
code * config * infra = production

Better to multiply, if your configuration deserves a 0. If any of them is 0 then the output is also worth 0. So we have prety good practices on both code and infra (k8s, GitOps anyone). But what do we do with this middle ground?

config = feature flags, business rules, configurable API keys, things that you can just change quikcly.
infra = everything that can't be broken by customers, the connection from your workload into th database for example (that wouldnt be configurable as intent in most cases).

Examples:
* Workloads that assist your business in some way
* SaaS providers

They all provide configuration

There is also the topic of legal: Can we still sell in 2026 that someodd must have changed a hidden settings screen and that we don't even know more than that "admin" did he last update at 11:23? That can't be right can it? How could you roll back from that in case of emergecny?

This is not to bash databases, this is also not bash apps that get all of this right. There is a lot of ways to get this right, and I'm also proposing one.

Let's take a look at a tyupcial example, you have transaction data comming in to a database. That's perfect, you can optimise for common flows. Create the right indexes etc. But often there is also the settings that people may change. At most a few times a week, but hey let's just put them there as well. But how is that checked and deployed have all things build that we normally use for code?

---

So how we do this for code, the quick picture shows it. We build with CI and CD. And we have great tools to do this. The industry moved to containers

