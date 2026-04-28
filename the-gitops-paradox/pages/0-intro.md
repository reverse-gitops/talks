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
My son built this plane himself.<br/>
It is still a prototype, but it flies.<br/>
That is a bit how this talk feels as well:<br/>
rough in places, but real.
-->

--- #7
layout: fact

---
# Will mine fly as well?

<!--
This is the first time I am sharing this vision this publicly.<br/>
So I am not presenting a finished doctrine.<br/>
I am showing you something that works,<br/>
and I am asking you whether the idea deserves to fly.
-->

--- #7
layout: fact

---
# I <mdi-heart /> Files

<!--
I love files because they stay open.<br/>
They are easy to inspect, easy to diff, and easy to automate.<br/>
Humans like that.<br/>
And honestly, AI likes that too.
-->

--- #7
layout: fact

---
# I <mdi-heart /> Git

<!--
I love Git because it gives us history, collaboration, and rollback.<br/>
It gives us a process around change.<br/>
That part is not the problem.
-->

--- #7
layout: fact

---
# I <mdi-heart /> GitOps

<!--
And I genuinely love GitOps.<br/>
Reproducibility, promotion, auditability, reconciliation:<br/>
those are real strengths.<br/>
I want to keep them.
-->

--- #7
layout: fact

---

# Pfff now I need to create a PR with the right YAML ☹️

<!-- 
But then reality hits.<br/>
For many people, this is simply not a good write interface.<br/>
Not because they are incapable,<br/>
but because expressing intent through Git and hand-crafted YAML is too much friction.
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
So my question is not whether GitOps is valuable.<br/>
My question is: should Git be the primary input path for every change?<br/>
Humans want a usable interface.<br/>
AI wants a typed interface.<br/>
And most platform teams end up building an API anyway.
-->

---
layout: diagram-story-frame
transition: view-transition
drawFilePath: /1-gitops-reverser.excalidraw.json
frame: "A"
---

<!--
This is the core idea.<br/>
Let humans, tools, and AI talk to a typed Kubernetes API.<br/>
Capture that intent there.<br/>
Then let Git record, review, promote, and distribute the result.
-->

---
layout: full

---

<div class="w-full h-full flex items-center justify-center p-4">
  <a href="https://github.com/ConfigButler/gitops-reverser" target="_blank" rel="noopener noreferrer">
    <img src="/images/screenshot-gitops-reverser.png" alt="gitops-reverser screenshot" class="max-w-full max-h-full object-contain"></img>
  </a>
</div>

<!-- 
This is not just a thought experiment.<br/>
I built a working implementation of it in the open.<br/>
Runtime behavior is deterministic. The operator does not use AI or heuristics at runtime.<br/>
Today I want to show you what that operating model feels like.
-->
