<!--
  A connector on the 1600×900 canvas.
    <Arrow points="224,430 319,430" />                 straight arrow
    <Arrow points="224,576 272,576 272,490 319,490" /> elbow, arrowhead on the last point
    <Arrow points="650,510 650,640" :head="false" />  plain line
  Optional: color (any CSS colour), dash ("6 6").
-->
<script setup>
import { computed, useId } from 'vue'

const props = defineProps({
  points: { type: String, required: true },
  head: { type: Boolean, default: true },
  color: { type: String, default: 'var(--arrow)' },
  dash: { type: String, default: undefined },
})

const id = useId()
const d = computed(() => 'M ' + props.points.trim().split(/\s+/).join(' L '))
</script>

<template>
  <svg class="arrow" width="1600" height="900" viewBox="0 0 1600 900" :style="{ color }">
    <defs v-if="head">
      <marker :id="id" orient="auto" markerWidth="5" markerHeight="5" refX="2" refY="2" overflow="visible">
        <path d="M0 0 L4 2 L0 4 Z" fill="currentColor" />
      </marker>
    </defs>
    <path :d="d" :stroke-dasharray="dash" :marker-end="head ? `url(#${id})` : undefined" />
  </svg>
</template>

<style>
.diagram svg.arrow {
  position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none;
  fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
  transition: color .4s, opacity .4s;
}
</style>
