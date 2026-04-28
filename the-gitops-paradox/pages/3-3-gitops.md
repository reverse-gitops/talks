---
layout: image-right
image: /images/wood-do-not-climb.jpg
transition: fade

---

# 3. GitOps Applies

* The write path changes, not the deployment model
* Git still gives you review, history, rollback, and promotion
* Flux still does the delivery
* Branches become preview, `main` becomes production

<!--
This is principle three.<br/>
Reverse GitOps is not trying to remove GitOps.<br/>
It changes how intent gets written,<br/>
but Git can still stay the place for review, promotion, and distribution.
-->

---
layout: diagram-story-frame
transition: view-transition
drawFilePath: /2-gitops-applies.excalidraw.json
frame: "A"

---

# A. User writes intent as YAML

Humans, GUIs, and AI can all use the same typed API.

<!--
The only unusual part is the first write.<br/>
After that, the flow should feel familiar.
-->

---
layout: diagram-story-frame
transition: view-transition
drawFilePath: /2-gitops-applies.excalidraw.json
frame: "B"

---

# B. gitops-reverser commits, Flux deploys preview

The branch exists for review, but the preview is already live.

<!--
The bridge kicks in immediately.<br/>
The API write becomes a Git commit,<br/>
and Flux deploys the branch into preview.
-->

---
layout: diagram-story-frame
transition: view-transition
drawFilePath: /2-gitops-applies.excalidraw.json
frame: "C"

---

# C. Another change, another preview deploy

Each new YAML change becomes another commit and another preview update.

<!--
This is where the model becomes pleasant to use.<br/>
I can keep editing intent through the API side,<br/>
while Git keeps the history and Flux keeps reconciling preview.
-->

---
layout: diagram-story-frame
transition: view-transition
drawFilePath: /2-gitops-applies.excalidraw.json
frame: "D"

---

# D. Merge to `main`, Flux promotes to production

Promotion is still normal GitOps: review it, merge it, let Flux reconcile `main`.

<!--
The last step is completely normal again.<br/>
Review it, merge it, promote it.<br/>
GitOps still applies.
-->
