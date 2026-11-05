---
eyebrow: Now that we have files
clicks: 2
transition: fade
---

# Your users never see Git. <span class="green">You still get the log.</span>

<div class="stage">
  <div class="box who" style="top: 280px"><b>Settings screen</b><span class="tag">people</span></div>
  <div class="box who" style="top: 450px"><b>API clients</b><span class="tag">scripts, AI</span></div>
  <Arrow points="284,345 350,410" />
  <Arrow points="284,515 350,450" />

  <div class="box node" style="left: 352px"><b>The API</b><span class="tag">authz, schema and admission: validated intent</span></div>
  <Arrow points="592,430 660,430" />
  <div class="box node" style="left: 662px"><b>gitops-reverser</b><span class="tag">a small nerdy operator</span></div>
  <Arrow points="902,430 970,430" />
  <div class="box node good-edge" style="left: 972px"><b>Files in Git</b><span class="tag">author: whoever saved it</span></div>

  <div class="fade" :class="{ off: $clicks < 2 }">
    <Arrow points="1212,430 1298,430" color="var(--good)" />
    <div class="box node next" style="left: 1300px"><b>Image</b><span class="tag">what comes next</span></div>
    <div class="at line" />
    <div class="at side" style="left: 64px; top: 226px">AUTHORING</div>
    <div class="at side green" style="left: 1272px; top: 226px">DELIVERY</div>
  </div>
</div>

<Story>

- **an API** Everyone keeps a fast API. It checks each change on the way in: who may make it, and whether it's valid.
- **into Git** Each change ends up as a commit with the right author. It's like editing a folder of files through an API.
- **the boundary** Authoring ends here, and delivery starts here. Saved doesn't mean live any more.

</Story>

<Sources slim :items="[{ name: 'GitOps Reverser', href: 'https://github.com/ConfigButler/gitops-reverser' }, { name: 'Reverse GitOps', href: 'https://reversegitops.dev' }]" />

<!--
16:00. You might have felt this one coming: now that we have files, we can commit them. That is how your chairs got into Git. The API also decides who may change what, so authorization happens before anything reaches Git.

[click] Every person who makes a change ends up in Git. I built a special nerd operator for that: gitops-reverser. How it works is tomorrow's talk.

[click] This is the important line: authoring on the left, delivery on the right. The settings screen stays fast. What happens after this line can take its time.
-->

<style>
.who { left: 64px; width: 220px; height: 130px; gap: 4px; }
.who b { font-size: 22px; line-height: 28px; }
.who .tag { font-size: 14px; line-height: 20px; }
.node { top: 350px; width: 240px; height: 160px; gap: 8px; }
.node b { font-size: 24px; line-height: 30px; }
.node .tag { font-size: 14px; line-height: 20px; }
.good-edge { border-color: var(--good); }
.node.next { width: 236px; border-color: #2E6B4E; }
.line { left: 1254px; top: 226px; width: 0; height: 480px; border-left: 2px dashed var(--amber); }
.side { font-family: var(--mono); font-size: 15px; letter-spacing: .14em; color: var(--muted); }
</style>
