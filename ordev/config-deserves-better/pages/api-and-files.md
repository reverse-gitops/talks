---
clicks: 3
transition: fade
---

# An API and files. <span class="green">At the same time.</span>

<div class="stage">
  <div class="at label">Tomorrow's TLDR;</div>

  <div class="zone dashed cluster" />
  <div class="at cluster-name"><b>TEMPORARY, DATA-ONLY CLUSTER</b><span>only needed for editing</span><em>API for your GitOps folder</em></div>
  <div class="at cluster-tools">
    <span><img src="/images/logos/kcp.svg" alt="">kcp</span>
    <span><img src="/images/logos/kamaji.svg" alt="">Kamaji</span>
  </div>

  <div class="box step hero" style="left: 64px"><b>Settings screen</b><span class="tag">people, scripts, AI</span></div>
  <Arrow points="314,395 367,395" />
  <div class="at repos auth">
    <a href="https://github.com/ConfigButler/krm-foyer" target="_blank">ConfigButler/krm-foyer</a>
    <a href="https://github.com/sunib/room-pass" target="_blank">sunib/room-pass</a>
  </div>
  <div class="box step" style="left: 369px"><b>Auth for users</b><span class="tag">a login, then your own token: no shared account</span></div>
  <Arrow points="619,395 672,395" />
  <div class="box step api" style="left: 674px"><b>Public<br>kube-apiserver</b><span class="tag">schema, RBAC, admission</span></div>

  <div class="fade" :class="{ off: $clicks < 1 }">
    <Arrow points="924,395 977,395" color="var(--good)" />
    <div class="at repos reverser">
      <a href="https://github.com/ConfigButler/gitops-reverser" target="_blank">ConfigButler/gitops-reverser</a>
    </div>
    <div class="box step" style="left: 979px"><b>gitops-reverser</b><span class="tag">open source: each API change becomes a commit</span></div>
    <Arrow points="1229,395 1282,395" color="var(--good)" />
    <div class="box step hero" style="left: 1284px"><b>Files in Git</b><span class="tag">author: whoever saved it<br>delivery starts here</span></div>
  </div>

  <div class="fade" :class="{ off: $clicks < 2 }">
    <Arrow points="1409,462 1409,540 799,540 799,486" color="var(--amber)" />
    <div class="at back">
      <span>Normal GitOps</span>
      <img src="/images/logos/flux-cd.svg" alt="Flux">
      <img src="/images/logos/argocd.svg" alt="Argo CD">
    </div>
  </div>

  <div class="fade" :class="{ off: $clicks < 3 }">
    <div class="at krm"><b>KRM</b> makes it possible: one shape, in the API and in the files</div>
    <div class="at magic">Today I won't go deeper. Let's use it, and be happy with the magic.</div>
  </div>
</div>

<Story>

- **the way in** Your users log in and talk to a public kube-apiserver, with their own token. It checks every change on the way in.
- **into Git** gitops-reverser turns each change into a commit with the right author. Authoring ends here, and delivery starts here.
- **the way back** Files move back from Git into the temporary cluster. It holds only data, and you only need it for editing. Git keeps the history.
- **the magic** One shape, KRM, makes this possible. Today we just use it.

</Story>

<!--
14:30. This is a big jump, so say that out loud. "Is this a database or a folder of files? Normally it's one or the other." This slide is the TLDR of tomorrow's talk.

The way in, which is how you changed your chair. You logged in, and your token goes to the API server: no shared account, and that's also what makes the commit author honest. It's a public kube-apiserver, yes. It decides who may change what, and it checks what you send. Look at the dashed line: this is a temporary cluster that holds only data, and you only need it for editing. Your workloads don't run here. Think of kcp or Kamaji, if you know those.

[click] gitops-reverser, my open source operator, turns each change into a commit with your name. This is the important line: authoring on the left, delivery from Git onwards. Saved doesn't mean live any more.

[click] And there's a step back, and that's just normal GitOps: Flux or Argo CD moves the files from Git into the temporary cluster. So that cluster is not the truth: Git is. Be honest here: my demo runs in namespaces on my own cluster, and a temporary data-only cluster per team or per change is where this is going.

[click] All of this works because of one shape, KRM, in the API and in the files. Today I won't go deeper: let's use it, and be happy with the magic.
-->

<style>
.label { left: 64px; top: 26px; font-family: var(--mono); font-size: 34px; font-weight: 600; line-height: 1.5; color: var(--accent); }
.step { top: 330px; width: 250px; height: 130px; gap: 8px; }
.step b { font-size: 24px; line-height: 30px; }
.step .tag { font-size: 14px; line-height: 20px; }
.step.api { border-color: var(--accent); }
.cluster { left: 654px; top: 230px; width: 290px; height: 252px; }
.cluster-name { left: 654px; top: 236px; width: 290px; display: flex; flex-direction: column; gap: 2px; align-items: center; font-family: var(--mono); }
.cluster-name b { font-size: 13px; line-height: 20px; font-weight: 600; letter-spacing: .06em; color: var(--text); white-space: nowrap; }
.cluster-name span { font-size: 15px; line-height: 22px; color: var(--good); }
.cluster-name em { margin-top: 6px; font-style: normal; font-size: 17px; line-height: 24px; font-weight: 600; color: var(--accent); white-space: nowrap; }
.cluster-tools { left: 654px; top: 178px; width: 290px; display: flex; justify-content: center; gap: 22px; font-family: var(--mono); font-size: 16px; line-height: 20px; color: var(--soft); }
.cluster-tools span { display: flex; align-items: center; gap: 8px; }
.cluster-tools img { height: 44px; width: 44px; padding: 4px; object-fit: contain; background: #fff; border-radius: 8px; }
.repos { width: 290px; display: flex; flex-direction: column; align-items: center; gap: 2px; }
.repos.auth { left: 349px; top: 272px; }
.repos.reverser { left: 959px; top: 296px; }
.slidev-layout .repos a { font-family: var(--mono); font-size: 15px; line-height: 24px; color: var(--accent); border: none; white-space: nowrap; }
.step.hero { background: var(--good); border-color: var(--good); }
.step.hero b, .step.hero .tag { color: var(--bg); }
.back { left: 799px; top: 552px; width: 610px; display: flex; justify-content: center; align-items: center; gap: 16px; font-family: var(--mono); font-size: 24px; line-height: 44px; color: var(--amber); }
.back img { height: 44px; width: auto; }
.krm { left: 64px; top: 612px; width: 1472px; text-align: center; font-size: 30px; line-height: 40px; color: var(--soft); }
.krm b { color: var(--text); }
.magic { left: 64px; top: 668px; width: 1472px; text-align: center; font-family: 'Caveat', cursive; font-size: 50px; line-height: 1.1; font-weight: 600; color: var(--amber); }
</style>
