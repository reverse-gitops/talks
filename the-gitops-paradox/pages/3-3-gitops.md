---
layout: image-right
image: /images/wood-do-not-climb.jpg
transition: fade

---

# 3. GitOps Applies

* Let's deploy a few `PodInfoApp` resources
* Create and merge branch `nl-stuff`
* Intent is in git
* Existing GitOps tools (Flux CD) is doing delivery
* Preview (based on `nl-stuff`) and production (only main)

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
layout: full

---

# gitops-reverser created the branch

<div style="position: absolute; inset: 5.8rem 2rem 2.2rem; display: flex; align-items: center; justify-content: center;">
  <a href="https://reversegitops.dev" target="_blank" rel="noopener noreferrer" style="display: inline-flex; height: 100%; max-width: 100%; align-items: center; justify-content: center; line-height: 0; text-decoration: none; border: 0; outline: 0;">
    <img src="/images/screenshot-reversegitopsdev.png" alt="reversegitops.dev screenshot" style="display: block; width: auto; height: 100%; max-width: 100%; object-fit: contain;" />
  </a>
</div>

<!--
gitops-reverser is instructed to write podinfos into the branch<br/>
The branch is created from main if it doesnt exist<br/>
The commit contains the created intent<br/>
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
      script-file="/demo-scripts/demo2-fiets.yaml"
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
      script-file="/demo-scripts/demo2-merge.yaml"
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
