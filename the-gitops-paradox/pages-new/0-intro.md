---
layout: full
---

<!-- This is 18 second video without sound: it shows me, my son (from the back) and a big RC plane that slowly takes off and lands nicely. -->

<RenderWhen context="slide">
  <SlidevVideo class="w-full h-full object-cover" autoplay controls>
    <source src="/images/rc-short.mp4" type="video/mp4" />
  </SlidevVideo>
</RenderWhen>

<RenderWhen context="presenter">
  <h2>Short movie</h2>
  <p>The live presentation shows a video of self-build rc plane taking off and landing</p>
</RenderWhen>

<!--
My son spend serious time on building his own rc plane, and as you can see it worked. It even landed well.
Showing a prototype that is still rough feels awkward, but also liberating.
-->

--- #7
layout: fact

---
# Will mine fly as well?

<!--
For me this is a big moment
It's the first time that I tell publicly about my vision
Don't expect a flashed out story, it's rough and has edges
I would love to receive your feedback
-->

--- #7
layout: fact

---
# I <mdi-heart /> Files

--- #7
layout: fact

---
# I <mdi-heart /> Git

--- #7
layout: fact

---
# I <mdi-heart /> GitOps

--- #7
layout: fact

---

# Pfff now I need to create a PR with the right YAML ☹️

<!-- 
The pivot, it's not easy for everyone! 
I remember my technical tech savy front end collegau saying this. 
The sigh was very real, and he was certainly not 'unable'.
It wasnt easy enough for him
-->
--- #6

# Why?

|  | GitOps | Reverse GitOps
| --- | --- | --- |
| Reproducable | <mdi-check /> | <mdi-check /> |
| Process | <mdi-check /> | <mdi-check /> |
| Full history | <mdi-check /> | <mdi-check /> |
| Rollbacks | <mdi-check /> | <mdi-check /> |
| API First 😊 | | <mdi-check /> |
| Fast type checking | | <mdi-check /> |

<!-- 
Git deservers a central place in our configuration 
-->

---
layout: diagram-story-frame
transition: view-transition
drawFilePath: /1-gitops-reverser.excalidraw.json
frame: "A"
---

<!-- This is the important picture: 
From left to right:
1. it shows actors (end-users, engineers and AI, that can use kubectl, GUI and MCP, which in under the hood all translates into API calls)
2. It shows a intent Kubernetes cluster (control-plane only)
3. It shows the gitops-reverser, an operator that syncs Kuberentes API activity live into GitOps compatible YAML
4. And then the Git repo
5. And then the normal clusters, which are synced in a all possible normal GitOps ways.

<!--
Personally I like it to jump into examples
So here is a concrete implementation of the "Reverse GitOps" addition
Hold on: you all have the change do some API calls in a moment
-->

---
layout: full

---

<!-- This shows the gitops-reverser implemenation in GitHub-->
<div class="w-full h-full flex items-center justify-center p-4">
  <a href="https://github.com/ConfigButler/gitops-reverser" target="_blank" rel="noopener noreferrer">
    <img src="/images/screenshot-gitops-reverser.png" alt="gitops-reverser screenshot" class="max-w-full max-h-full object-contain"></img>
  </a>
</div>

<!-- 
It's created in the open
Runtime behavior is deterministic. The operator does not use AI or heuristics at runtime.
Fully open source
I've quit my full time job to work on this last summer. I am trying to build a company on top of it: 
  * help implementing it,
  * getthing the authentication layer right, coupling it to OIDC
  * offering it as a SaaS solution
  -->
