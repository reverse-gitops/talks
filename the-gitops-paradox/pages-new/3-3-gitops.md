---
layout: image-right
image: /images/wood-do-not-climb.jpg
transition: fade

---

# 3. GitOps Applies

* Git still gives you review, history, rollback, and promotion
* The intent folder stays valuable and portable
* Existing GitOps tooling can keep doing the delivery
* The write path changes, not the deployment model

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

<!--
Let me show that this still behaves like GitOps.<br/>
I will write a few intent resources into the API.<br/>
Everything after that should look familiar.
-->

---
layout: image-right
image: /images/door-nice.jpg
transition: fade

---

<div style="position: absolute; inset: 18px 24px 24px; display: flex; flex-direction: column;">
  <div style="flex: 1; min-height: 0; margin-top: 3.5rem;">
    <DemoTerminal
      backendUrl="http://host.docker.internal:10001"
      sessionId="demo2-0"
      script-file="/demo-scripts/demo2-0.yaml"
      :fontSize="12"
    />
  </div>
</div>

<!--
This is the write step.<br/>
I am not editing files directly here.<br/>
I am writing intent to the API.
-->

---
layout: diagram-story-frame
transition: view-transition
drawFilePath: /2-gitops-applies.excalidraw.json
frame: "B"

---

<!--
Now the bridge kicks in.<br/>
Those API writes are turned into commits automatically.<br/>
So Git is still getting the full story.
-->

---
layout: diagram-story-frame
transition: view-transition
drawFilePath: /2-gitops-applies.excalidraw.json
frame: "C"

---

<!--
And because the intent is reversible,<br/>
I can also adjust it through the API side.<br/>
That is the whole point:<br/>
easy writes first, Git-compatible flow second.
-->

---
layout: image-right
image: /images/door-nice.jpg
transition: fade

---

<div style="position: absolute; inset: 18px 24px 24px; display: flex; flex-direction: column;">
  <div style="flex: 1; min-height: 0; margin-top: 3.5rem;">
    <DemoTerminal
      backendUrl="http://host.docker.internal:10001"
      sessionId="demo2-1"
      script-file="/demo-scripts/demo2-1.yaml"
      :fontSize="12"
    />
  </div>
</div>

<!--
This is the second write step.<br/>
Same model, same API,<br/>
just another change to intent.
-->

---
layout: diagram-story-frame
transition: view-transition
drawFilePath: /2-gitops-applies.excalidraw.json
frame: "D"

---

<!--
And the last step is completely normal again.<br/>
Review it, merge it, promote it.<br/>
GitOps still applies.
-->
