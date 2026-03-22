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



---
layout: image-right
image: /images/stemlokaal-step.jpg
transition: fade

---

# Voting demo

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
    <VoteQRCode :showCountdown="false" />
  </div>

  <div style="min-width: 0; min-height: 0; display: flex; flex-direction: column;">
    <WebTerminal
      backendUrl="http://host.docker.internal:10001"
      sessionId="reverse-gitops-demo-terminal"
      :fontSize="14"
    />
  </div>
</div>

<div
  v-click="[1, 2]"
  class="clickable-code"
  data-terminal-session="reverse-gitops-demo-terminal"
  data-terminal-command="kubectl get nodes"
  style="display: none;"
></div>

<div
  v-click="[3, 4]"
  class="clickable-code"
  data-terminal-session="reverse-gitops-demo-terminal"
  data-terminal-command='kubectl get quizsessions -A'
  style="display: none;"
></div>

<div
  v-click="[5, 6]"
  class="clickable-code"
  data-terminal-session="reverse-gitops-demo-terminal"
  data-terminal-command='kubectl get quizsubmissions -A --watch'
  style="display: none;"
></div>

---
layout: image-right
image: /images/stemlokaal-step.jpg
transition: fade

---

<div style="position: absolute; inset: 6px; display: flex; flex-direction: column;">
  <WebTerminal
    backendUrl="http://host.docker.internal:10001"
    sessionId="reverse-gitops-demo-terminal-2"
    :fontSize="12"
  />

  <div
  v-click="[1, 2]"
  class="clickable-code"
  data-terminal-session="reverse-gitops-demo-terminal-2"
  data-terminal-command="cd ~/demo"
  style="display: none;"
  ></div>

  <div
    v-click="[3, 4]"
    class="clickable-code"
    data-terminal-session="reverse-gitops-demo-terminal-2"
    data-terminal-command='watch --color -n 2 "git log --oneline --graph --decorate --all --color=always | head -30"'
    style="display: none;"
  ></div>
</div>


