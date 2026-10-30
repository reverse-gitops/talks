<!--
  The door question as the room answered it: one bar per answer of the mission2 Room.
    <PollResult />                 live counts
    <PollResult :preview="60" />   invented answers while there are no Participants to read
    <PollResult :question="false" />  bars only, when the slide or the speaker asks the question
  Reads every Participant through relative /k8s/... (krm-foyer on demo.koudijs.dev, the kubectl
  proxy forwarder locally) and counts the answer groups in spec.groups.
  On a failed read the last good counts stay up.
-->
<script setup>
import { computed, onUnmounted, ref, watchEffect } from 'vue'
import { useSlideContext } from '@slidev/client'

const props = defineProps({
  namespace: { type: String, default: 'voter' },
  every: { type: Number, default: 3000 }, // ms between reads
  preview: { type: Number, default: 0 }, // invented answers to show while nobody has joined
  question: { type: Boolean, default: true }, // show the door question above the bars
})

// The answers of the mission2 Room's door question, in the order of room.yaml.
const ANSWERS = [
  { label: 'Never used it', group: 'demo:gitops-never' },
  { label: 'I know the idea', group: 'demo:gitops-idea' },
  { label: 'I use it', group: 'demo:gitops-use' },
  { label: 'I run it', group: 'demo:gitops-run' },
]

const { $renderContext } = useSlideContext()
const groups = ref([]) // one array of groups per Participant
const problem = ref('')
const previewing = ref(false)
let timer = null

const participantsUrl = computed(() =>
  `/k8s/apis/room-pass.koudijs.dev/v1alpha1/namespaces/${props.namespace}/participants`)

// Stable fake data: a cloud native crowd, so mostly "use it".
function invented(count) {
  const weights = [1, 3, 5, 2]
  const total = weights.reduce((a, b) => a + b, 0)
  return ANSWERS.flatMap((a, i) => Array.from({ length: Math.round(count * weights[i] / total) }, () => [a.group]))
}

async function read() {
  try {
    const res = await fetch(participantsUrl.value, { headers: { accept: 'application/json' }, credentials: 'same-origin' })
    if (!res.ok) {
      problem.value = res.status === 401 ? 'not logged in' : res.status === 403 ? 'not allowed to list participants' : `HTTP ${res.status}`
      return
    }
    const list = await res.json()
    const items = list.items ?? []
    previewing.value = !items.length && !!props.preview
    groups.value = previewing.value ? invented(props.preview) : items.map((p) => p.spec?.groups ?? [])
    problem.value = ''
  } catch {
    problem.value = 'cluster not reachable'
  }
}

watchEffect(() => {
  clearInterval(timer)
  timer = null
  if ($renderContext.value !== 'slide' && $renderContext.value !== 'presenter') {
    // Overview, export: a still picture, never a request per thumbnail.
    if (props.preview) groups.value = invented(props.preview)
    return
  }
  read()
  timer = setInterval(read, props.every)
})
onUnmounted(() => clearInterval(timer))

const bars = computed(() => {
  const counts = ANSWERS.map((a) => groups.value.filter((g) => g.includes(a.group)).length)
  const most = Math.max(1, ...counts)
  return ANSWERS.map((a, i) => ({ ...a, count: counts[i], width: `${(counts[i] / most) * 100}%` }))
})
const answered = computed(() => bars.value.reduce((n, b) => n + b.count, 0))
</script>

<template>
  <div class="poll">
    <div v-if="question" class="question">How familiar are you with GitOps?</div>
    <div v-for="b in bars" :key="b.group" class="bar">
      <span class="label">{{ b.label }}</span>
      <span class="track"><i :style="{ width: b.width }" /></span>
      <span class="count">{{ b.count }}</span>
    </div>
    <div class="foot">
      <span>{{ answered }} answered</span>
      <span v-if="previewing" class="note">preview data · nobody joined yet</span>
      <span v-else-if="problem" class="note">{{ problem }}</span>
    </div>
  </div>
</template>

<style scoped>
.poll { display: flex; flex-direction: column; gap: 16px; }
.question { font-size: 24px; color: var(--soft); margin-bottom: 8px; }
.bar { display: grid; grid-template-columns: 200px 1fr 56px; align-items: center; gap: 16px; font-size: 22px; }
.track { height: 36px; background: var(--panel); border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
.track i { display: block; height: 100%; background: var(--accent); transition: width .6s ease; }
.count { font-family: var(--mono); text-align: right; color: var(--text); }
.foot { display: flex; justify-content: space-between; gap: 16px; font-family: var(--mono); font-size: 13px; color: var(--muted); }
.foot .note { color: var(--amber); }
</style>
