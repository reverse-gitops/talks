---
layout: image-right
image: /images/door-nice.jpg

transition: fade

---

# 3. GitOps Applies

* Simple yaml, no irreversable transformations
* Apply intent straight to the API
* Git catches up in the background

---
layout: image-right
image: /images/door-nice.jpg

transition: fade

---

# 3. GitOps Applies

<div style="position: absolute; inset: 18px 24px 24px; display: flex; flex-direction: column;">
  <div style="flex: 1; min-height: 0; margin-top: 3.5rem;">
    <WebTerminal
      backendUrl="http://host.docker.internal:10001"
      sessionId="gitops-applies-demo-terminal"
      :fontSize="12"
    />
  </div>
</div>

<div
  v-click="[1, 2]"
  class="clickable-code"
  data-terminal-session="gitops-applies-demo-terminal"
  data-terminal-command="kubectl proxy --port=8001 >/tmp/gitops-applies-kubectl-proxy.log 2>&amp;1 &amp;"
  style="display: none;"
></div>

<div
  v-click="[3, 4]"
  class="clickable-code"
  data-terminal-session="gitops-applies-demo-terminal"
  data-terminal-command='http POST http://127.0.0.1:8001/apis/kro.run/v1alpha1/namespaces/podinfos-intent/podinfoapps apiVersion=kro.run/v1alpha1 kind=PodInfoApp metadata:="{\"name\":\"fiets7\",\"namespace\":\"podinfos-intent\"}" spec:="{\"replicas\":1,\"message\":\"The Dutch word for bicycle is \\\"fiets\\\". We have a lot of them.\",\"color\":\"#115711\"}"'
  style="display: none;"
></div>
