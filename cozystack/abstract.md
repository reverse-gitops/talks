Title :What If Every Cozystack Change Became a Commit?

Topic: 4. Automation & GitOps

Please elaborate on topic: I’m currently building https://github.com/ConfigButler/gitops-reverser as an example implementation of the Reverse GitOps pattern. Cozystack feels like an unusually good match for this topic: its platform-oriented use of the Kubernetes API creates a natural foundation for exploring how infrastructure intent can be captured back into Git automatically, without changing the operator workflow.

# Abstract

Cozystack exposes platform services as Kubernetes API resources, e.g. Postgres, Redis, Bucket, Kubernetes. Users interact in the usual ways: kubectl, a GUI (Cozystack dashboard), or even feeding their AI agents through an MCP. But who is making all these changes? And why did they do it? Git seems far away.

But it doesn't have to be.

What if every platform change automatically appeared as clean YAML in Git? Fully automated. Just a silent layer that turns API activity into a durable, readable history of infrastructure intent.

The immediate win is auditability: instead of digging through logs or dashboards, teams get versioned history they can inspect, diff, and share.

Think of it as reverse GitOps: instead of Git driving the platform, the platform continuously writes its intent back to Git.

In this talk, I'll explain why Cozystack is a natural fit for this model, show it live, and explore what platforms gain when Git stops being the interface — and starts being the memory.


Titles:

“Git Seems Far Away” is charming and matches the opening, but a reviewer may not immediately know what the talk is about. Originality high, clarity moderate.

Top contenders:

- Reverse GitOps: Auditability Without Pull Requests — fits the colon pattern of last year’s talks, practical payoff, pushes the term
- Reverse GitOps: When the Platform Writes Back to Git — if concept-branding matters most
- When Git Stops Being the Interface — keeps the poetry, clearer than “Git Seems Far Away”
- What If Every Cozystack Change Became a Commit? — strong curiosity hook

Recommendation: “Reverse GitOps: Auditability Without Pull Requests” for acceptance; keep “Git Seems Far Away” if you want the evocative angle.