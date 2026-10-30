<!--
  The rotating Room Pass join code, as a QR code the room can scan.
    <RoomQRCode />                                  the mission2 Room, 320px
    <RoomQRCode room="demo" :size="240" />
  Reads the Room through relative /k8s/... with whatever login the page has: krm-foyer on
  demo.koudijs.dev, or the kubectl proxy forwarder in vite.config.ts locally. Only an operator
  may read a Room, so anyone else sees "no code".
  The code rotates every 30s and stays valid for 120s, so a poll every few seconds is plenty.
  On a failed read the last good code stays up: a stale QR still works for two minutes, a blank
  one never does.
-->
<script setup>
import { computed, onUnmounted, ref, watchEffect } from 'vue'
import { useSlideContext } from '@slidev/client'
import { renderSVG } from 'uqr'

const props = defineProps({
  room: { type: String, default: 'mission2' },
  namespace: { type: String, default: 'voter' },
  base: { type: String, default: 'https://demo.koudijs.dev' },
  size: { type: Number, default: 320 },
  every: { type: Number, default: 3000 }, // ms between reads
})

const { $renderContext } = useSlideContext()
const code = ref('')
const problem = ref('')
let timer = null

const roomUrl = computed(() =>
  `/k8s/apis/room-pass.koudijs.dev/v1alpha1/namespaces/${props.namespace}/rooms/${props.room}`)

async function read() {
  try {
    const res = await fetch(roomUrl.value, { headers: { accept: 'application/json' }, credentials: 'same-origin' })
    if (!res.ok) {
      problem.value = res.status === 401 ? 'not logged in'
        : res.status === 403 ? 'not allowed to read the Room'
        : res.status === 404 ? `no Room ${props.room} in ${props.namespace}`
        : `HTTP ${res.status}`
      return
    }
    const room = await res.json()
    code.value = room?.status?.joinCode?.code ?? ''
    problem.value = code.value ? '' : 'the Room publishes no code'
  } catch (e) {
    problem.value = 'cluster not reachable'
  }
}

// Only the slide on screen and the presenter view read; overview thumbnails stay quiet.
watchEffect(() => {
  clearInterval(timer)
  timer = null
  if ($renderContext.value !== 'slide' && $renderContext.value !== 'presenter') return
  read()
  timer = setInterval(read, props.every)
})
onUnmounted(() => clearInterval(timer))

const joinUrl = computed(() => code.value ? `${props.base}/join-room?code=${encodeURIComponent(code.value)}` : '')
const svg = computed(() => joinUrl.value
  ? renderSVG(joinUrl.value, { ecc: 'L', border: 2, whiteColor: '#FFFFFF', blackColor: '#0B0F14' })
  : '')
// Speakable groups, as on the Room Pass screen: BCDFGH -> BCD-FGH
const spoken = computed(() => code.value.replace(/(.{3})(?=.)/g, '$1-'))
const host = computed(() => props.base.replace(/^https?:\/\//, ''))
</script>

<template>
  <div class="room-qr" :style="{ width: `${size}px` }">
    <!-- eslint-disable-next-line vue/no-v-html -- uqr renders its own SVG -->
    <div v-if="svg" class="code" :style="{ width: `${size}px`, height: `${size}px` }" v-html="svg" />
    <div v-else class="code empty" :style="{ width: `${size}px`, height: `${size}px` }">
      <span>{{ problem || 'reading the Room…' }}</span>
    </div>
    <div class="spoken">{{ spoken || '···-···' }}</div>
    <div class="host">{{ host }}/join</div>
    <div v-if="svg && problem" class="stale">{{ problem }} · showing the last code</div>
  </div>
</template>

<style scoped>
.room-qr { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.code { border-radius: 14px; overflow: hidden; background: #fff; }
.code :deep(svg) { display: block; width: 100%; height: 100%; }
.code.empty {
  display: flex; align-items: center; justify-content: center; padding: 24px; box-sizing: border-box;
  background: var(--panel); border: 1px dashed var(--line-strong);
  font-family: var(--mono); font-size: 14px; color: var(--muted); text-align: center;
}
.spoken { font-family: var(--mono); font-size: 34px; letter-spacing: .12em; color: var(--text); }
.host { font-family: var(--mono); font-size: 14px; color: var(--soft); }
.stale { font-family: var(--mono); font-size: 12px; color: var(--amber); }
</style>
