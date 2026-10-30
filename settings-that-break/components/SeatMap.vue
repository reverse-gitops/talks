<!--
  The room as the audience claimed it: one cell per Seat, stage at the top.
    <SeatMap />                    small squares, colour only
    <SeatMap size="medium" />      bigger squares, colour only: for the title slide
    <SeatMap :rows="12" :columns="16" />   another room; the default is in the props
    <SeatMap size="large" />       big cells with emoji and display name: for the reveal
    <SeatMap :preview="120" />     invented seats while the Seat CRD does not exist yet
  Reads every Seat through relative /k8s/... (krm-foyer on demo.koudijs.dev, the kubectl proxy
  forwarder locally). The newest change pulses once, so a colour changed live is easy to point at.
  Hover a seat for its last why; click it for that commit in the trail repo.
  On a failed read the last good map stays up.
-->
<script setup>
import { computed, onUnmounted, ref, watchEffect } from 'vue'
import { useSlideContext } from '@slidev/client'


const props = defineProps({
  size: { type: String, default: 'small' }, // small | medium | large
  // Mission 2, until the real chair count is known. Change it here, so every slide agrees.
  rows: { type: Number, default: 8 },
  columns: { type: Number, default: 12 },
  namespace: { type: String, default: 'voter' },
  every: { type: Number, default: 2000 }, // ms between reads
  preview: { type: Number, default: 0 }, // invented seats to show while there is no Seat CRD
  repo: { type: String, default: 'https://github.com/ConfigButler/k8s-trail' }, // where the seats' commits land
})

const { $renderContext } = useSlideContext()
const seats = ref([])
const problem = ref('')
const previewing = ref(false)
let timer = null

const seatsUrl = computed(() =>
  `/k8s/apis/examples.configbutler.ai/v1alpha1/namespaces/${props.namespace}/seats`)

// The last time anyone wrote the object: the newest managedFields entry.
function changedAt(item) {
  const times = (item.metadata?.managedFields ?? []).map((f) => Date.parse(f.time)).filter(Number.isFinite)
  return times.length ? Math.max(...times) : Date.parse(item.metadata?.creationTimestamp) || 0
}

function toSeat(item) {
  const s = item.spec ?? {}
  const last = item.status?.lastCommit ?? {}
  return {
    row: s.row, column: s.column, color: s.color, emoji: s.emoji, name: s.claimedBy?.displayName ?? s.displayName,
    at: changedAt(item), why: last.message, commit: last.commit,
  }
}

async function read() {
  try {
    const res = await fetch(seatsUrl.value, { headers: { accept: 'application/json' }, credentials: 'same-origin' })
    if (res.status === 404 && props.preview) {
      seats.value = invented(props.preview)
      previewing.value = true
      problem.value = ''
      return
    }
    if (!res.ok) {
      problem.value = res.status === 401 ? 'not logged in' : res.status === 403 ? 'not allowed to list seats' : res.status === 404 ? 'no Seat CRD yet' : `HTTP ${res.status}`
      return
    }
    const list = await res.json()
    seats.value = (list.items ?? []).map(toSeat)
    previewing.value = false
    problem.value = ''
  } catch {
    problem.value = 'cluster not reachable'
  }
}

// Stable fake data: the same seats on every reload, a little denser at the front.
const PALETTE = ['#5AB8FF', '#7EE0A1', '#F2A93B', '#FF8A80', '#C9A6FF', '#4FD1C5', '#F6E05E', '#F687B3', '#90CDF4', '#FBB6CE', '#68D391', '#ED8936']
const EMOJI = ['🦊', '🐙', '🦄', '🐝', '🐢', '🦉', '🐳', '🦖', '🐧', '🦀', '🐸', '🐼', '🚀', '🌵', '🍄', '🌈', '⚡', '🔥', '🍕', '🧇', '☕', '🎸', '🎲', '👾']
const NAMES = ['alice', 'bob', 'carol', 'dave', 'erin', 'frank', 'grace', 'heidi', 'ivan', 'judy', 'mallory', 'niaj', 'olivia', 'peggy', 'rupert', 'sybil', 'trent', 'victor', 'walter', 'yara']
function invented(count) {
  let x = 7
  const next = () => (x = (x * 1103515245 + 12345) % 2147483648) / 2147483648
  const taken = new Map()
  const now = Date.now()
  while (taken.size < Math.min(count, props.columns * props.rows)) {
    const row = 1 + Math.floor(next() ** 1.6 * props.rows)
    const column = 1 + Math.floor(next() * props.columns)
    const key = `${row}-${column}`
    if (taken.has(key)) continue
    taken.set(key, {
      row, column,
      color: PALETTE[Math.floor(next() * PALETTE.length)],
      emoji: EMOJI[Math.floor(next() * EMOJI.length)],
      name: `${NAMES[taken.size % NAMES.length]}${taken.size >= NAMES.length ? taken.size : ''}`,
      at: now - taken.size * 1000,
    })
  }
  return [...taken.values()]
}

// Below the fake data: the effect runs during setup, and in the overview it needs PALETTE at once.
watchEffect(() => {
  clearInterval(timer)
  timer = null
  if ($renderContext.value !== 'slide' && $renderContext.value !== 'presenter') {
    // Overview, export: a still picture, never a request per thumbnail.
    if (props.preview) seats.value = invented(props.preview)
    return
  }
  read()
  timer = setInterval(read, props.every)
})
onUnmounted(() => clearInterval(timer))

const byCell = computed(() => new Map(seats.value.map((s) => [`${s.row}-${s.column}`, s])))
const newest = computed(() => seats.value.reduce((a, s) => (!a || s.at > a.at ? s : a), null))
const cells = computed(() => {
  const out = []
  for (let row = 1; row <= props.rows; row++) {
    for (let column = 1; column <= props.columns; column++) {
      const seat = byCell.value.get(`${row}-${column}`)
      const isNewest = !!seat && seat === newest.value && !previewing.value
      // The newest cell is keyed by its change too: a new element plays the pulse again, once.
      out.push({ key: `${row}-${column}`, id: isNewest ? `${row}-${column}@${seat.at}` : `${row}-${column}`, seat, isNewest })
    }
  }
  return out
})

// Cells as big as fit the box each size gets on the 1600×900 canvas, whatever the room's shape.
const BOX = { small: { width: 640, height: 330, max: 40, gap: 5 }, medium: { width: 1000, height: 380, max: 56, gap: 6 }, large: { width: 1472, height: 690, max: 120, gap: 8 } }
const geometry = computed(() => {
  const box = BOX[props.size] ?? BOX.small
  const pitch = Math.min(box.width / props.columns, box.height / props.rows, box.max + box.gap)
  return { '--cell': `${Math.floor(pitch - box.gap)}px`, '--gap': `${box.gap}px`, '--columns': props.columns }
})
function hover(c) {
  if (!c.seat) return null
  const [row, column] = c.key.split('-')
  return `${c.seat.name} · row ${row}, seat ${column}${c.seat.why ? `\n“${c.seat.why}”` : ''}`
}

const seatCount = computed(() => props.rows * props.columns)
// Seats outside the drawn room (a smaller room than the CRD allows) are counted, not lost.
const outside = computed(() => seats.value.filter((s) => s.row > props.rows || s.column > props.columns).length)
</script>

<template>
  <div class="seat-map" :class="size" :style="geometry">
    <div class="stage">stage</div>
    <div class="grid">
      <component
        :is="c.seat?.commit ? 'a' : 'div'" v-for="c in cells" :key="c.id"
        class="cell" :class="{ taken: c.seat, newest: c.isNewest }"
        :style="c.seat ? { '--seat': c.seat.color } : null"
        :title="hover(c)"
        :href="c.seat?.commit ? `${repo}/commit/${c.seat.commit}` : null"
        :target="c.seat?.commit ? '_blank' : null" :rel="c.seat?.commit ? 'noopener' : null"
      >
        <template v-if="c.seat && size === 'large'">
          <span class="emoji">{{ c.seat.emoji }}</span>
          <span class="name">{{ c.seat.name }}</span>
        </template>
      </component>
    </div>
    <div class="foot">
      <span>{{ seats.length - outside }} / {{ seatCount }} seats claimed<template v-if="outside"> · {{ outside }} outside the map</template></span>
      <span v-if="previewing" class="note">preview data · no Seat CRD yet</span>
      <span v-else-if="problem" class="note">{{ problem }}</span>
    </div>
  </div>
</template>

<style scoped>
.seat-map { display: inline-flex; flex-direction: column; gap: 8px; }

.stage {
  height: 6px; border-radius: 3px; background: var(--line-strong);
  font-size: 0; /* the word is for screen readers; the bar says it */
}
.large .stage { height: 22px; font-size: 11px; line-height: 22px; text-align: center; font-family: var(--mono); letter-spacing: .3em; text-transform: uppercase; color: var(--muted); background: var(--panel); border: 1px solid var(--line); }

.grid { display: grid; grid-template-columns: repeat(var(--columns), var(--cell)); grid-auto-rows: var(--cell); gap: var(--gap); }

.cell {
  border-radius: 4px; border: 1px solid var(--line);
  transition: background-color .5s, border-color .5s, transform .3s;
}
.large .cell { border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; }
a.cell { cursor: pointer; text-decoration: none; }
.cell.taken { background: var(--seat); border-color: var(--seat); }
.large .cell.taken { background: color-mix(in srgb, var(--seat) 28%, var(--panel)); }

.emoji { font-size: calc(var(--cell) * .42); line-height: 1.2; }
.name {
  max-width: 100%; padding: 0 4px; box-sizing: border-box;
  font-family: var(--mono); font-size: calc(var(--cell) * .16); line-height: 1.3; color: var(--text);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.cell.newest { animation: newest 1.1s ease-out; z-index: 1; }
@keyframes newest {
  0% { box-shadow: 0 0 0 0 var(--seat); transform: scale(1.15); }
  70% { box-shadow: 0 0 0 10px transparent; transform: scale(1); }
  100% { box-shadow: 0 0 0 0 transparent; transform: scale(1); }
}

.foot { display: flex; justify-content: space-between; gap: 16px; font-family: var(--mono); font-size: 13px; color: var(--muted); }
.foot .note { color: var(--amber); }
</style>
