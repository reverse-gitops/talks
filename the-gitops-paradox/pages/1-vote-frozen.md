---
layout: image-right
image: /images/stemlokaal-step.jpg
transition: fade

---

# Voting demo

* A live voting app is always nice
* This one is truly cloud native
* The presentation as well

<!--
Let me make this concrete.<br/>
Instead of debating the model in the abstract,<br/>
let's use it.<br/>
You are going to write to the API yourselves in a moment.
-->

---
layout: image-right
image: /images/stemlokaal-step.jpg
transition: fade

---

<div style="position: absolute; inset: 18px 24px 24px; display: grid; grid-template-columns: 330px minmax(0, 1fr); gap: 24px; align-items: stretch;"><div style="display: flex; flex-direction: column; justify-content: center; padding-top: 3rem;"><h1 style="margin-bottom: 0.9rem;">Someone votes</h1><div style="font-size: 20px; line-height: 1.45; opacity: 0.86;">The API receives a <code>QuizSubmission</code>.<br />The synced repo turns that into a normal file.</div></div><div style="display: flex; flex-direction: column; gap: 0.5rem; min-width: 0;"><pre style="flex: 1; min-height: 0; margin: 3.5rem 0 0; background: #1a1a1a; border-radius: 8px; padding: 1rem; font-family: monospace; font-size: 11px; line-height: 1.45; color: #d4d4d4; overflow: hidden; box-shadow: 0 14px 30px rgba(0,0,0,0.22);"><code><span style="color: #569cd6;">apiVersion:</span> <span style="color: #ce9178;">examples.configbutler.ai/v1alpha1</span>
<span style="color: #569cd6;">kind:</span> <span style="color: #ce9178;">QuizSubmission</span>
<span style="color: #569cd6;">metadata:</span>
  <span style="color: #9cdcfe;">name:</span> <span style="color: #ce9178;">example</span>
  <span style="color: #9cdcfe;">namespace:</span> <span style="color: #ce9178;">vote</span>
<span style="color: #569cd6;">spec:</span>
  <span style="color: #9cdcfe;">answers:</span>
  - <span style="color: #9cdcfe;">questionId:</span> <span style="color: #ce9178;">q1</span>
    <span style="color: #9cdcfe;">singleChoice:</span> <span style="color: #ce9178;">Software engineer</span>
  - <span style="color: #9cdcfe;">questionId:</span> <span style="color: #ce9178;">q2</span>
    <span style="color: #9cdcfe;">singleChoice:</span> <span style="color: #ce9178;">Git</span>
  - <span style="color: #9cdcfe;">questionId:</span> <span style="color: #ce9178;">q3</span>
    <span style="color: #9cdcfe;">singleChoice:</span> <span style="color: #ce9178;">No</span>
  - <span style="color: #9cdcfe;">questionId:</span> <span style="color: #ce9178;">q4</span>
    <span style="color: #9cdcfe;">singleChoice:</span> <span style="color: #ce9178;">Curious</span>
  <span style="color: #9cdcfe;">sessionRef:</span>
    <span style="color: #9cdcfe;">kind:</span> <span style="color: #ce9178;">QuizSession</span>
    <span style="color: #9cdcfe;">name:</span> <span style="color: #ce9178;">demo</span>
  <span style="color: #9cdcfe;">submittedAt:</span> <span style="color: #ce9178;">"2026-02-05T12:34:00Z"</span></code></pre><div style="font-size: 12px; color: #555; text-align: center;">Rendered object from demo-repo/.../quizsubmissions/vote/example.yaml</div></div></div>

<!--
The vote is a regular Kubernetes-style resource.<br/>
But for the point of the talk, do not think "workload" yet.<br/>
Think "intent object".<br/>
That object can be written through an API and still represented as a file.
-->

---
layout: image-right
image: /images/stemlokaal-step.jpg
transition: fade

---

<div style="position: absolute; inset: 18px 24px 24px; display: flex; flex-direction: column; gap: 0.5rem;"><pre style="flex: 1; min-height: 0; margin: 3.5rem 0 0; background: #1a1a1a; border-radius: 8px; padding: 1rem; font-family: monospace; font-size: 12px; line-height: 1.45; color: #d4d4d4; overflow: hidden; box-shadow: 0 14px 30px rgba(0,0,0,0.22);"><code><span style="color: #4ec9b0;">$</span> <span style="color: #9cdcfe;">kubectl get quizsessions -n vote</span>
NAME   STATE  TITLE
<span style="color: #b5cea8;">demo   live   KubeCon 2026 Demo</span>
<span style="color: #4ec9b0;">$</span> <span style="color: #9cdcfe;">kubectl get quizsubmissions -n vote --watch</span>
NAME        SESSION  AGE
<span style="color: #b5cea8;">example     demo     2m</span>
<span style="color: #4ec9b0;">$</span> <span style="color: #9cdcfe;">git log --oneline --decorate --all -5</span>
<span style="color: #ce9178;">* <span style="color: #b5cea8;">65b3c71</span> [CREATE] examples.configbutler.ai/v1alpha1/quizsubmissions/example</span>
<span style="color: #ce9178;">* <span style="color: #b5cea8;">e518c65</span> [CREATE] examples.configbutler.ai/v1alpha1/quizsessions/feedback</span>
<span style="color: #ce9178;">* <span style="color: #b5cea8;">fb999fd</span> [CREATE] examples.configbutler.ai/v1alpha1/quizsessions/demo</span></code></pre><div style="font-size: 12px; color: #555; text-align: center; padding-top: 2px;">Rendered output - on stage this was a live terminal</div></div>

<!--
And now the second half of the story:<br/>
if this is GitOps, where is Git?<br/>
In the background, those API writes are being turned into commits.<br/>
The interesting thing is not a workload rollout yet.<br/>
It is that intent is now both API-writable and Git-readable.
-->

---
layout: image-right
image: /images/stemlokaal-step.jpg
transition: fade

---

<div style="position: absolute; inset: 18px 24px 24px; display: grid; grid-template-columns: 46% 340px; gap: 24px; align-items: stretch;"><div style="min-width: 0; padding-top: 3.5rem;"><h1 style="margin-bottom: 1rem;">Demo takeaway</h1><div style="font-size: 22px; line-height: 1.45; opacity: 0.9; margin-bottom: 1.25rem;">Not workloads. Just editable intent objects in Git.</div><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 17px;"><div style="background: rgba(255,255,255,0.78); color: #1f2937; border-radius: 12px; padding: 0.9rem;"><strong>Plain object</strong><br /><span style="opacity: 0.72;">QuizSession</span></div><div style="background: rgba(255,255,255,0.78); color: #1f2937; border-radius: 12px; padding: 0.9rem;"><strong>Plain object</strong><br /><span style="opacity: 0.72;">QuizSubmission</span></div><div style="background: rgba(255,255,255,0.78); color: #1f2937; border-radius: 12px; padding: 0.9rem;"><strong>Editable</strong><br /><span style="opacity: 0.72;">with YAML</span></div><div style="background: rgba(255,255,255,0.78); color: #1f2937; border-radius: 12px; padding: 0.9rem;"><strong>Trackable</strong><br /><span style="opacity: 0.72;">as files in Git</span></div></div></div><div style="display: flex; flex-direction: column; gap: 0.5rem; justify-content: center; min-width: 0;"><pre style="background: #1a1a1a; border-radius: 8px; padding: 1rem; font-family: monospace; font-size: 11px; line-height: 1.45; color: #d4d4d4; box-shadow: 0 14px 30px rgba(0,0,0,0.22);"><code><span style="color: #888;">demo-repo/</span>
adam/rai/8f/
  examples.configbutler.ai/
    v1alpha1/
      quizsessions/vote/
        <span style="color: #b5cea8;">demo.yaml</span>
        <span style="color: #b5cea8;">feedback.yaml</span>
      quizsubmissions/vote/
        <span style="color: #b5cea8;">example.yaml</span></code></pre><div style="font-size: 12px; color: #555; text-align: center;">PDF snapshot - on stage this was audience interaction through the API</div></div></div>

<!--
This is the important simplification.<br/>
For this demo, intent is not even about workloads yet.<br/>
It is not about deployments, services, or the real clusters.<br/>
It is just a set of typed objects that can be edited and stored as files.
-->
