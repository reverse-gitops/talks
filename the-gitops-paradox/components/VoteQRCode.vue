<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const BASE_URL = 'https://demo.configbutler.ai'
const CODE_TTL = 30

const props = withDefaults(defineProps<{
  session?: string
  showCountdown?: boolean
}>(), {
  session: 'demo',
  showCountdown: true,
})

const code = ref<string | null>(null)
const countdown = ref(CODE_TTL)
const fetchError = ref(false)

let countdownInterval: ReturnType<typeof setInterval> | null = null

async function fetchCode() {
  try {
    const res = await fetch(`/api/vote-code?session=${encodeURIComponent(props.session)}`)
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    code.value = data.code
    fetchError.value = false
  } catch {
    fetchError.value = true
  }
}

function startCycle() {
  if (countdownInterval) clearInterval(countdownInterval)
  countdown.value = CODE_TTL
  countdownInterval = setInterval(async () => {
    countdown.value--
    if (countdown.value <= 2) {
      clearInterval(countdownInterval!)
      await fetchCode()
      startCycle()
    }
  }, 1000)
}

const sessionPath = computed(() => props.session.replace(/^\/+|\/+$/g, ''))

const voteUrl = computed(() =>
  code.value
    ? `${BASE_URL}/${sessionPath.value}?code=${encodeURIComponent(code.value)}`
    : `${BASE_URL}/${sessionPath.value}`
)

const countdownColor = computed(() => {
  if (countdown.value > 15) return '#4ade80'
  if (countdown.value > 7) return '#facc15'
  return '#f87171'
})

onMounted(async () => {
  await fetchCode()
  startCycle()
})

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
})
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <div v-if="fetchError" class="text-red-400 text-sm">Failed to fetch code</div>
    <QRCode
      :key="voteUrl"
      :data="voteUrl"
      type="svg"
      :width="240"
      :height="240"
      :margin="10"
      :dots-options="{ type: 'extra-rounded', color: 'grey' }"
    />
    <div class="text-sm font-mono text-gray-400 break-all text-center max-w-xs">{{ voteUrl.replace('https://', '') }}</div>
    <div v-if="props.showCountdown" class="flex items-center gap-2 text-sm" :style="{ color: countdownColor }">
      <svg width="12" height="12" viewBox="0 0 12 12">
        <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" stroke-width="1.5"
          stroke-dasharray="31.4"
          :stroke-dashoffset="31.4 * (1 - countdown / CODE_TTL)"
          transform="rotate(-90 6 6)"
        />
      </svg>
      {{ countdown }}s
    </div>
  </div>
</template>
