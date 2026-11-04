<!--
  A number that counts up in real time while you stand on the slide.
    <Counter :from="2" :rate="1" />            starts at click 2, +1 per second
    <Counter :from="4" :until="6" :rate="5" /> stops counting (keeps its value) at click 6
  Outside the live slide (overview, presenter preview, export) it shows a fixed value.
-->
<script setup>
import { onUnmounted, ref, watchEffect } from 'vue'
import { useSlideContext } from '@slidev/client'

const props = defineProps({
  from: { type: Number, required: true },
  until: { type: Number, default: Infinity },
  rate: { type: Number, default: 1 }, // per second
})

const { $clicks, $renderContext } = useSlideContext()
const value = ref(0)
let timer = null

function stop() {
  clearInterval(timer)
  timer = null
}

watchEffect(() => {
  const clicks = $clicks.value
  if (clicks < props.from) {
    stop()
    value.value = 0
  }
  else if ($renderContext.value !== 'slide') {
    stop()
    value.value = Math.round(props.rate * 6)
  }
  else if (clicks >= props.until) {
    stop()
    if (!value.value) value.value = Math.round(props.rate * 6) // opened here directly: never counted
  }
  else if (!timer) {
    timer = setInterval(() => value.value++, 1000 / props.rate)
  }
})

onUnmounted(stop)
</script>

<template>
  <span class="counter">{{ value }}</span>
</template>
