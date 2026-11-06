<!--
  The talk as one list: on the TLDR slides, and on each part's first slide with one row lit.
    <Contents>handwritten line at the bottom</Contents>   all four rows
    <Contents :at="2">handwritten line</Contents>         part 2 lit, the others dimmed
-->
<script setup>
defineProps({
  at: { type: Number, default: undefined },
})

const PARTS = [
  { title: "It's just an API", line: 'kube-apiserver and etcd, nothing else. One shape for API and file, and types you define.' },
  { title: 'Identity is kept', line: 'Your own login, for people and workloads, all the way to the commit.' },
  { title: 'The API forgets, Git remembers', line: 'GitOps for configuration: every change a commit, with who and why.' },
  { title: "It doesn't always fit", line: 'The downsides, and practical criteria for when to use it.' },
]
</script>

<template>
  <div class="stage">
    <div class="parts">
      <div v-for="(part, i) in PARTS" :key="part.title" class="part" :class="{ dim: at && at !== i + 1, lit: at === i + 1 }">
        <span class="nr">{{ i + 1 }}</span>
        <div>
          <b>{{ part.title }}</b>
          <p>{{ part.line }}</p>
        </div>
      </div>
    </div>
    <div class="line"><slot /></div>
  </div>
</template>

<style scoped>
.parts { position: absolute; left: 64px; top: 180px; width: 1472px; display: flex; flex-direction: column; gap: 18px; }
.part { display: flex; align-items: center; gap: 32px; height: 118px; padding: 0 36px; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 14px; transition: opacity .5s ease; }
.part.dim { opacity: .25; }
.part.lit { border-color: var(--good); }
.nr { flex: none; width: 56px; text-align: center; font-family: var(--mono); font-size: 52px; font-weight: 600; color: var(--good); }
.part b { font-size: 36px; line-height: 44px; font-weight: 700; color: var(--text); }
.part p { margin: 2px 0 0; font-size: 25px; line-height: 34px; color: var(--soft); opacity: 1; }
.line { position: absolute; left: 64px; top: 730px; width: 1472px; text-align: center; font-family: 'Caveat', cursive; font-size: 58px; line-height: 1.1; font-weight: 600; color: var(--amber); }
</style>
