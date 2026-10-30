<!--
  Captions plus the step timeline at the bottom of a diagram slide.
  Write one list item per click (item 1 = click 0). The bold start of an item is its
  timeline label; the rest is the caption shown while you stand on that click.

    <Story>

    - **emails flow** Every order sends a confirmation email.
    - **one typo** A power user updates the key.

    </Story>

  If the slide has more clicks than items, the last item stays. An item that repeats
  the label of the item before it keeps the caption area going without a new mark.
-->
<script setup>
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useSlideContext } from '@slidev/client'

const props = defineProps({
  top: { type: Number, default: 772 }, // caption line; the timeline sits 44px below it
})

const { $clicks, $clicksContext } = useSlideContext()
const host = ref()
const items = ref([])

onMounted(() => {
  items.value = [...host.value.querySelectorAll('li')]
})

const active = computed(() => Math.min($clicks.value, items.value.length - 1))
watchEffect(() => items.value.forEach((li, i) => li.classList.toggle('on', i === active.value)))
// Caption number = timeline mark number, so an item that repeats the previous label keeps its number.
watchEffect(() => {
  let n = 0
  items.value.forEach((li, i) => {
    const label = li.querySelector('strong')?.textContent ?? ''
    if (i === 0 || label !== items.value[i - 1].querySelector('strong')?.textContent) n++
    li.dataset.n = String(n).padStart(2, '0')
  })
})

const states = computed(() => Math.max($clicksContext.total, items.value.length - 1) + 1)
const WIDTH = 1472
const marks = computed(() => items.value
  .map((li, i) => ({ i, label: li.querySelector('strong')?.textContent ?? '' }))
  .filter((m, i, all) => i === 0 || m.label !== all[i - 1].label)
  .map((m, n) => ({ ...m, n: n + 1, x: Math.round((m.i / states.value) * WIDTH) })))
const bar = computed(() => Math.min(1, ($clicks.value + 1) / states.value))
</script>

<template>
  <div class="story" :style="{ top: props.top + 'px' }">
    <div ref="host" class="captions"><slot /></div>
    <div class="timeline">
      <template v-for="m in marks" :key="m.i">
        <div class="mark" :class="{ past: active >= m.i }" :style="{ left: m.x + 'px' }">
          {{ String(m.n).padStart(2, '0') }} {{ m.label }}
        </div>
        <div v-if="m.x > 0" class="tick" :style="{ left: m.x - 2 + 'px' }" />
      </template>
      <div class="track" />
      <div class="bar" :style="{ transform: `scaleX(${bar})` }" />
    </div>
  </div>
</template>

<style>
.diagram .story { position: absolute; left: 64px; width: 1472px; height: 108px; }
.diagram .story .captions ul { list-style: none; margin: 0; padding: 0; }
.diagram .story .captions li {
  position: absolute; left: 0; top: 0; width: 1472px; margin: 0;
  font-size: 22px; line-height: 30px; opacity: 0; transition: opacity .35s ease;
}
.diagram .story .captions li.on { opacity: 1; transition-delay: .15s; }
.diagram .story .captions li::before {
  content: attr(data-n) '  '; font-family: var(--mono); color: var(--dim);
}
.diagram .story .captions li strong { display: none; }
.diagram .story .timeline { position: absolute; left: 0; top: 44px; width: 1472px; height: 64px; font-family: var(--mono); font-size: 11px; color: var(--dim); }
.diagram .story .mark { position: absolute; top: 0; white-space: nowrap; transition: color .3s; }
.diagram .story .mark.past { color: var(--muted); }
.diagram .story .tick { position: absolute; top: 22px; width: 2px; height: 12px; background: var(--line-strong); }
.diagram .story .track,
.diagram .story .bar { position: absolute; left: 0; top: 26px; width: 1472px; height: 4px; border-radius: 2px; }
.diagram .story .track { background: #1E2733; }
.diagram .story .bar {
  background: var(--text); opacity: .7; transform-origin: 0 50%;
  transition: transform .6s cubic-bezier(.2, .8, .2, 1);
}
</style>
