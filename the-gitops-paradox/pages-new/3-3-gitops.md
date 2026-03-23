---
layout: image-right
image: /images/wood-do-not-climb.jpg
transition: fade

---

<!--
Basically https://reversegitops.dev/ principle 3
The picture shows a lot of logs: there are many different ways to approach this.
-->

# 3. GitOps Applies

* The folder with your 'simple' intent is valuable.
* That folder can be input to any gitops based process that you already have
* I'm going to show an example: but if you can work with YAML manifests then you can do it.

<!--
It's a differnt way to manage your folder in git: but GitOps compatible
Reverse GitOps only wants to extend GitOps 
-->

---
layout: diagram-story-frame
transition: view-transition
drawFilePath: /2-gitops-applies.excalidraw.json
frame: "A"

---

<!-- Let's throw in some manifest in the intent cluster with kubectl apply -f -->

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

---
layout: diagram-story-frame
transition: view-transition
drawFilePath: /2-gitops-applies.excalidraw.json
frame: "B"

---

<!-- Automatically add it to git -->

---
layout: diagram-story-frame
transition: view-transition
drawFilePath: /2-gitops-applies.excalidraw.json
frame: "C"

---

<!-- Make adjustement you like (FreeLens!), just like any ephemeral or preview environment -->

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

---
layout: diagram-story-frame
transition: view-transition
drawFilePath: /2-gitops-applies.excalidraw.json
frame: "D"

---

<!-- Showing the final step and merging the branch into production -->



# 3. GitOps Applies


