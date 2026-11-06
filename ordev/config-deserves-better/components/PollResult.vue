<!--
  The door question as the room answered it: one bar per answer of the Room, read live from the
  Room itself, so a changed question or answer shows up here without touching the deck.
    <PollResult />                 live counts
    <PollResult :preview="60" />   invented answers while there are no Participants to read
    <PollResult :question="false" />  bars only, when the slide or the speaker asks the question
  Reads the Room and its Participants through relative /k8s/... (krm-foyer on demo.koudijs.dev, the
  kubectl proxy forwarder locally) and counts the answer groups in spec.groups.
  On a failed read the last good question and counts stay up. With no answers to show, a message
  says why: the technical reason is its tooltip. A PDF never shows invented answers.
-->
<script setup>
import { computed, onUnmounted, ref, watchEffect } from 'vue'
import { useNav, useSlideContext } from '@slidev/client'

const props = defineProps({
  namespace: { type: String, default: 'voter' },
  room: { type: String, default: 'ordev-1-stamp' }, // whose question to show and whose answers to count
  every: { type: Number, default: 3000 }, // ms between reads
  preview: { type: Number, default: 0 }, // invented answers to show while nobody has joined
  question: { type: Boolean, default: true }, // show the door question above the bars
})

// Only until the Room has been read, and in exports and the overview, which never read it.
const FALLBACK = {
  prompt: 'Where is GitOps going?',
  answers: [
    { label: '🚀 Taking over: soon it\'s just how we deploy', group: 'demo:gitops-taking-over' },
    { label: '📈 Growing steadily', group: 'demo:gitops-growing' },
    { label: '📉 Past its peak: the hype is fading', group: 'demo:gitops-past-peak' },
    { label: '🪦 On its way out: who wants all this YAML?', group: 'demo:gitops-on-its-way-out' },
    { label: '🤔 Oef, what is that again?', group: 'demo:gitops-what-is-that' },
  ],
}

const { $renderContext } = useSlideContext()
const { isPrintMode } = useNav()
const door = ref(FALLBACK)
const groups = ref([]) // one array of groups per Participant
const problem = ref('')
const previewing = ref(false)
const settled = ref(false) // a read has finished: only now may "nobody yet" be said
let timer = null

const api = computed(() => `/k8s/apis/room-pass.koudijs.dev/v1alpha1/namespaces/${props.namespace}`)

// Stable fake data, spread over however many answers the Room has.
function invented(count) {
  const weights = [3, 5, 2, 1, 1]
  const answers = door.value.answers
  const total = answers.reduce((sum, _, i) => sum + (weights[i] ?? 1), 0)
  return answers.flatMap((a, i) => Array.from({ length: Math.round(count * (weights[i] ?? 1) / total) }, () => [a.group]))
}

async function readQuestion() {
  const res = await fetch(`${api.value}/rooms/${props.room}`, { headers: { accept: 'application/json' }, credentials: 'same-origin' })
  if (!res.ok) return // the Participants read below reports what is wrong
  const question = (await res.json()).spec?.question
  if (question?.answers?.length) door.value = question
}

async function read() {
  try {
    await readQuestion()
    const res = await fetch(`${api.value}/participants`, { headers: { accept: 'application/json' }, credentials: 'same-origin' })
    if (!res.ok) {
      problem.value = res.status === 401 ? 'not logged in' : res.status === 403 ? 'not allowed to list participants' : `HTTP ${res.status}`
      return
    }
    const list = await res.json()
    const items = (list.items ?? []).filter((p) => p.spec?.roomRef?.name === props.room)
    previewing.value = !items.length && !!props.preview && !isPrintMode.value
    groups.value = previewing.value ? invented(props.preview) : items.map((p) => p.spec?.groups ?? [])
    problem.value = ''
  } catch {
    problem.value = 'cluster not reachable'
  } finally {
    settled.value = true
  }
}

watchEffect(() => {
  clearInterval(timer)
  timer = null
  if ($renderContext.value !== 'slide' && $renderContext.value !== 'presenter') {
    // Overview, export: a still picture, never a request per thumbnail.
    if (isPrintMode.value) settled.value = true
    else if (props.preview) groups.value = invented(props.preview)
    return
  }
  read()
  timer = setInterval(read, props.every)
})
onUnmounted(() => clearInterval(timer))

const bars = computed(() => {
  const answers = door.value.answers
  const counts = answers.map((a) => groups.value.filter((g) => g.includes(a.group)).length)
  const most = Math.max(1, ...counts)
  return answers.map((a, i) => ({ ...a, count: counts[i], width: `${(counts[i] / most) * 100}%` }))
})
const answered = computed(() => bars.value.reduce((n, b) => n + b.count, 0))
// What to say instead of empty bars. A PDF reader can't do anything about it, so no error there.
const message = computed(() => {
  if (!settled.value || answered.value) return ''
  if (isPrintMode.value) return 'The room answered this live during the talk'
  return problem.value ? 'Can’t reach the answers right now' : 'Nobody has answered yet'
})
</script>

<template>
  <div class="poll">
    <div v-if="question" class="question">{{ door.prompt }}</div>
    <div v-for="b in bars" :key="b.group" class="bar">
      <span class="label">{{ b.label }}</span>
      <span class="track"><i :style="{ width: b.width }" /></span>
      <span class="count">{{ b.count }}</span>
    </div>
    <div class="foot">
      <span v-if="message" class="message" :title="problem">{{ message }}</span>
      <span v-else>{{ answered }} answered</span>
      <span v-if="previewing" class="note">preview data · nobody joined yet</span>
      <span v-else-if="problem && !message" class="note" :title="problem">live view paused</span>
    </div>
  </div>
</template>

<style scoped>
.poll { display: flex; flex-direction: column; gap: 16px; }
.question { font-size: 24px; color: var(--soft); margin-bottom: 8px; }
.bar { display: grid; grid-template-columns: 540px 1fr 56px; align-items: center; gap: 16px; font-size: 22px; }
.track { height: 36px; background: var(--panel); border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
.track i { display: block; height: 100%; background: var(--accent); transition: width .6s ease; }
.count { font-family: var(--mono); text-align: right; color: var(--text); }
.foot { display: flex; justify-content: space-between; gap: 16px; font-family: var(--mono); font-size: 13px; color: var(--muted); }
.foot .note { color: var(--amber); }
.foot .message { font-family: var(--sans, inherit); font-size: 22px; color: var(--soft); }
</style>
