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

# Voting demo

<!-- <<< ../demo-repo-local/adam/rai/8f/examples.configbutler.ai/v1alpha1/quizsessions/vote/demo.yaml yaml {2|3|7|12}{maxHeight:'300px'} -->
<<< ../demo-repo-local/adam/rai/8f/examples.configbutler.ai/v1alpha1/quizsubmissions/vote/example.yaml yaml {7-15|16-19}{lines:true}{maxHeight:'300px'}

<!--
This is what a vote looks like as a typed resource.<br/>
There is a clear spec.<br/>
And it connects back to the session object that defines the question.
-->

---
layout: image-right
image: /images/stemlokaal-step.jpg
transition: fade

---

# Voting demo

<div
  style="position: absolute; inset: 18px 24px 24px; display: grid; grid-template-columns: minmax(240px, 300px) minmax(0, 1fr); gap: 24px; align-items: stretch;"
>
  <div style="display: flex; align-items: center; justify-content: center;">
    <VoteQRCode session="demo" :showCountdown="false" />
  </div>

  <div style="min-width: 0; min-height: 0; display: flex; flex-direction: column;">
    <DemoTerminal
      backendUrl="http://host.docker.internal:10001"
      sessionId="reverse-gitops-demo-terminal"
      script-file="/demo-scripts/voting-demo-terminal.yaml"
      :fontSize="14"
    />
  </div>
</div>

<!--
The QR code gives you a tiny client on top of the Kubernetes API.<br/>
The terminal shows the writes coming in live.<br/>
So this is not a mockup:<br/>
you are interacting with the API right now.
-->

---
layout: image-right
image: /images/stemlokaal-step.jpg
transition: fade

---

<div style="position: absolute; inset: 6px; display: flex; flex-direction: column;">
  <DemoTerminal
    backendUrl="http://host.docker.internal:10001"
    sessionId="reverse-gitops-demo-terminal-2"
    script-file="/demo-scripts/voting-demo-terminal-2.yaml"
    :fontSize="12"
  />
</div>

<!--
And now the second half of the story:<br/>
if this is GitOps, where is Git?<br/>
In the background, those API writes are being turned into commits.<br/>
That is the bridge into the rest of the talk.
-->
