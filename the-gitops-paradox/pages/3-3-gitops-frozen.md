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

<div style="position: absolute; inset: 18px 24px 24px; display: flex; flex-direction: column; gap: 0.5rem;">
  <div style="flex: 1; min-height: 0; margin-top: 3.5rem; background: #1a1a1a; border-radius: 6px; padding: 1rem; font-family: monospace; font-size: 12px; color: #d4d4d4; overflow: auto;">
    <div style="margin-bottom: 0.75rem;">
      <span style="color: #4ec9b0;">$</span> <span style="color: #9cdcfe;">kubectl apply -f intent.yaml</span>
    </div>
    <div style="color: #b5cea8;">podinfoapps.kro.run/fiets created</div>
    <div style="color: #b5cea8;">podinfoapps.kro.run/gevel created</div>
    <div style="color: #b5cea8; margin-bottom: 1.25rem;">podinfoapps.kro.run/paal created</div>
    <div style="margin-bottom: 0.75rem;">
      <span style="color: #4ec9b0;">$</span> <span style="color: #9cdcfe;">watch -n2 "git log --oneline --graph --decorate --all --color"</span>
    </div>
    <div style="color: #ce9178;">* <span style="color: #b5cea8;">07a6eed</span> <span style="color: #4ec9b0;">(origin/nl-stuff)</span> [CREATE] kro.run/v1alpha1/podinfoapps/paal</div>
    <div style="color: #ce9178;">* <span style="color: #b5cea8;">12f268e</span> [CREATE] kro.run/v1alpha1/podinfoapps/gevel</div>
    <div style="color: #ce9178;">* <span style="color: #b5cea8;">2aeac44</span> [CREATE] kro.run/v1alpha1/podinfoapps/fiets</div>
    <div style="color: #ce9178;">* <span style="color: #b5cea8;">29e747e</span> <span style="color: #4ec9b0;">(HEAD -&gt; main, origin/main)</span> [UPDATE] v1/namespaces/vote</div>
  </div>
  <div style="font-size: 12px; color: #888; text-align: center; padding-top: 2px;">
    &#9432; Rendered output &mdash; on stage this was a live terminal
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

<div style="position: absolute; inset: 18px 24px 24px; display: flex; flex-direction: column; gap: 0.5rem;">
  <div style="flex: 1; min-height: 0; margin-top: 3.5rem; background: #1a1a1a; border-radius: 6px; padding: 1rem; font-family: monospace; font-size: 12px; color: #d4d4d4; overflow: auto;">
    <div style="margin-bottom: 0.75rem;">
      <span style="color: #4ec9b0;">$</span> <span style="color: #9cdcfe;">merge-nl-stuff.sh</span>
    </div>
    <div style="color: #888;">0/5 Ensuring Gitea port-forward</div>
    <div style="color: #888;">1/5 Fetching origin</div>
    <div style="color: #888;">2/5 Checking out nl-stuff</div>
    <div style="color: #888;">3/5 Checking out main</div>
    <div style="color: #888;">4/5 Merging nl-stuff into main</div>
    <div style="color: #888; margin-bottom: 1.25rem;">Done: nl-stuff merged into main and deleted locally and on origin</div>
    <div style="margin-bottom: 0.75rem;">
      <span style="color: #4ec9b0;">$</span> <span style="color: #9cdcfe;">watch -n2 "kubectl get podinfoapps -A"</span>
    </div>
    <div style="color: #d4d4d4; margin-bottom: 0.25rem;">NAMESPACE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NAME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;READY&nbsp;&nbsp;AGE</div>
    <div style="color: #b5cea8;">podinfos-intent&nbsp;&nbsp;fiets&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;True&nbsp;&nbsp;&nbsp;42s</div>
    <div style="color: #b5cea8;">podinfos-intent&nbsp;&nbsp;gevel&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;True&nbsp;&nbsp;&nbsp;39s</div>
    <div style="color: #b5cea8;">podinfos-intent&nbsp;&nbsp;paal&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;True&nbsp;&nbsp;&nbsp;36s</div>
  </div>
  <div style="font-size: 12px; color: #888; text-align: center; padding-top: 2px;">
    &#9432; Rendered output &mdash; on stage this was a live terminal
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
