<!--
  The whole talk as one picture: on the TLDR slides, and on every chapter slide with one block lit.
    <Tldr :step="$clicks">line at the bottom</Tldr>   builds up over 3 clicks; without step it is complete
    <Tldr at="auth">the one sentence</Tldr>           a chapter: screen, auth, api, reverser, git, back or krm
-->
<script setup>
const props = defineProps({
  step: { type: Number, default: 3 },
  at: { type: String, default: undefined },
})

// The way back and KRM are about the connection, so they also light what they connect.
const LIT_WITH = { back: ['api', 'git'], krm: ['api', 'git'] }
const lit = (block) => !props.at || props.at === block || LIT_WITH[props.at]?.includes(block)
const shown = (block) => !props.at || props.at === block
</script>

<template>
  <div class="stage">
    <div class="zone dashed cluster" :class="{ dim: !lit('api') }" />
    <div v-if="shown('api')" class="at cluster-name"><b>DATA-ONLY CLUSTER</b><span>no workloads run here</span><em>API for your GitOps folder</em></div>

    <div class="box step hero" :class="{ dim: !lit('screen') }" style="left: 64px"><b>Settings screen</b><span class="tag">people, scripts, AI</span></div>
    <Arrow points="314,395 367,395" :class="{ dim: at }" />
    <div v-if="shown('auth')" class="at repos auth">
      <a href="https://github.com/ConfigButler/krm-foyer" target="_blank">ConfigButler/krm-foyer</a>
      <a href="https://github.com/sunib/room-pass" target="_blank">sunib/room-pass</a>
    </div>
    <div class="box step" :class="{ dim: !lit('auth') }" style="left: 369px"><b>Auth for users</b><span class="tag">a login, then your own token: no shared account</span></div>
    <Arrow points="619,395 672,395" :class="{ dim: at }" />
    <div class="box step api" :class="{ dim: !lit('api') }" style="left: 674px"><b>Public<br>kube-apiserver</b><span class="tag">schema, RBAC, admission</span></div>

    <div class="fade" :class="{ off: step < 1 }">
      <Arrow points="924,395 977,395" color="var(--good)" :class="{ dim: at }" />
      <div v-if="shown('reverser')" class="at repos reverser">
        <a href="https://github.com/ConfigButler/gitops-reverser" target="_blank">ConfigButler/gitops-reverser</a>
      </div>
      <div class="box step" :class="{ dim: !lit('reverser') }" style="left: 979px"><b>gitops-reverser</b><span class="tag">open source: each API change becomes a commit</span></div>
      <Arrow points="1229,395 1282,395" color="var(--good)" :class="{ dim: at }" />
      <div class="box step hero" :class="{ dim: !lit('git') }" style="left: 1284px"><b>Files in Git</b><span class="tag">author: whoever saved it<br>delivery starts here</span></div>
    </div>

    <div class="fade" :class="{ off: step < 2 }">
      <Arrow points="1409,462 1409,540 799,540 799,486" color="var(--amber)" :class="{ dim: !lit('back') }" />
      <div class="at back" :class="{ dim: !lit('back') }">
        <span>Normal GitOps</span>
        <img src="/images/logos/flux-cd.svg" alt="Flux">
        <img src="/images/logos/argocd.svg" alt="Argo CD">
      </div>
    </div>

    <p v-if="at" class="at say"><slot /></p>
    <div v-else class="fade" :class="{ off: step < 3 }">
      <div class="at krm"><b>KRM</b> makes it possible: one shape, in the API and in the files</div>
      <div class="at magic"><slot /></div>
    </div>
  </div>
</template>

<style scoped>
.dim { opacity: .2; }
.step { top: 330px; width: 250px; height: 130px; gap: 8px; }
.step b { font-size: 24px; line-height: 30px; }
.step .tag { font-size: 14px; line-height: 20px; }
.step.api { border-color: var(--accent); }
.cluster { left: 654px; top: 230px; width: 290px; height: 252px; }
.cluster-name { left: 654px; top: 236px; width: 290px; display: flex; flex-direction: column; gap: 2px; align-items: center; font-family: var(--mono); }
.cluster-name b { font-size: 13px; line-height: 20px; font-weight: 600; letter-spacing: .06em; color: var(--text); white-space: nowrap; }
.cluster-name span { font-size: 15px; line-height: 22px; color: var(--good); }
.cluster-name em { margin-top: 6px; font-style: normal; font-size: 17px; line-height: 24px; font-weight: 600; color: var(--accent); white-space: nowrap; }
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
.slidev-layout .say { left: 64px; top: 650px; width: 1472px; margin: 0; text-align: center; font-size: 38px; line-height: 1.3; color: var(--text); opacity: 1; }
</style>
