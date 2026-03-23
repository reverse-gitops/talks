---
layout: image-right
image: /images/door-nice.jpg
transition: fade

---

# 3. GitOps Applies

* Simple yaml, no irreversable transformations
* Apply intent straight to the API
* Git catches up in the background
* 'Normal GitOps' applies it

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


