---
layout: image-right
image: /images/stemlokaal-step.jpg
transition: fade

---

# Voting demo

* Last week we voted in the Netherlands
* A voting app is always nice
* This one is truly cloud native
* The presentation as well

<!--
Last week we had elections in the Netherlands

-->


---
layout: image-right
image: /images/stemlokaal-step.jpg
transition: fade

---

# Voting demo

<!-- This file shows an example of what a vote submission looks like, I highlight the spec and the connection to the session object that we can also see in the demo pane -->

<!-- <<< ../demo-repo/adam/rai/8f/examples.configbutler.ai/v1alpha1/quizsessions/vote/demo.yaml yaml {2|3|7|12}{maxHeight:'300px'} -->
<<< ../demo-repo/adam/rai/8f/examples.configbutler.ai/v1alpha1/quizsubmissions/vote/example.yaml yaml {7-15|16-19}{lines:true}{maxHeight:'300px'}

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
