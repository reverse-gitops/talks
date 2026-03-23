---
layout: image-right
image: /images/schietterein.jpg

---

# The paradox

* We shield people from the Kubernetes API.
* We force them to use Git as the write path.
* Then we build custom APIs and portals anyway.
* So why not use Kubernetes itself as the typed API for intent?
* Keep GitOps. Change the front door.

<!--
This is the paradox I am trying to name.<br/>
We do not trust people with the Kubernetes API,<br/>
but we still need a good API for self-service.<br/>
So platform teams keep rebuilding one next to Kubernetes.<br/>
My claim is: often, Kubernetes already is the API we need.
-->

---
layout: full

---

# reversegitops.dev

<div class="w-full h-full flex items-center justify-center p-4">
  <a href="https://reversegitops.dev" target="_blank" rel="noopener noreferrer" class="w-full h-full flex items-center justify-center">
    <img src="/images/screenshot-reversegitopsdev.png" alt="gitops-reverser screenshot" class="block w-auto h-full max-w-full max-h-full object-contain"></img>
  </a>
</div>

<!--
I wanted to make this bigger than one implementation.<br/>
That is why I wrote it down as a small manifesto.<br/>
Not to replace GitOps,<br/>
but to argue that GitOps needs a better write interface.
-->

---
layout: diagram-story-frame
transition: view-transition
drawFilePath: /1-gitops-reverser.excalidraw.json
frame: "B"

---

<!-- 
What we just saw was not a toy voting app.<br/>
It was an example of a different operating model.<br/>
Reverse GitOps is an extra layer in front of GitOps:<br/>
an easier write path for resources that still end up in Git.
-->
