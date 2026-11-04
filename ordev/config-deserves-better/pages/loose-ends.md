---
layout: default
transition: fade
---

###### None of these parts are easy

# What I haven't solved

<ol class="ends">
  <li v-click><b>1</b><div><strong>Different values per environment</strong><span>One image per overlay, and you no longer promote the same thing. Values from outside, and the model isn't complete</span></div></li>
  <li v-click><b>2</b><div><strong>Testing it as a whole</strong><span>One file can be checked. Does it work with this code and this infra? That takes a real environment</span></div></li>
  <li v-click><b>3</b><div><strong>Code and config moving apart</strong><span>Two streams, two versions. Which combinations are valid?</span></div></li>
  <li v-click><b>4</b><div><strong>Going back while the API disagrees</strong><span>Roll back the image, and the settings screen still holds the new value. Which one is the truth?</span></div></li>
  <li v-click><b>5</b><div><strong>Secrets over time</strong><span>Rolling back to a key you already revoked doesn't help</span></div></li>
</ol>

<p v-click class="punch">Hard questions. But with a settings table you often can't even ask them: there is no version to point at.</p>

<!--
33:00. Say this plainly. Nothing here is easy.

[click] Different values per environment. Promoting the same digest and having different values pull against each other. All environments in one image, with the pod picking a folder, means test can see production's values. No option is clean.

[click] Testing the thing as a whole. Checking a file is easy. Testing this configuration with this code and this infra needs a real environment and a candidate digest.

[click] Two streams means two versions, so which combinations are valid?

[click] Going back while the API disagrees. The next save may bring the new value straight back.

[click] Secrets over time. And their names stay readable.

[click] We have to find a way to improve things, and I think this is an important ingredient.

If there's time: a settings change means a rollout, which takes minutes and restarts pods. A panic rollback needs a practised path. The pull request step between "recorded" and "approved" isn't built yet. And the image isn't signed yet: the commits are, and cosign is the standard next step.
-->

<style>
.slidev-layout ol.ends { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px; }
.ends > li { display: flex; align-items: flex-start; gap: 22px; margin: 0; padding: 0; }
.ends b { flex: none; width: 48px; height: 48px; margin-top: 2px; border-radius: 24px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: var(--bg); background: var(--amber); }
.ends div { display: flex; flex-direction: column; gap: 0; }
.ends strong { font-size: 30px; line-height: 1.2; }
.ends span { font-size: 22px; line-height: 1.3; color: var(--soft); }
.punch { margin-top: 26px; font-size: 30px; line-height: 1.3; font-weight: 600; color: var(--text); }
</style>
