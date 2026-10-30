<!--
  The slide number, small in the bottom-right corner of every slide, so "slide 15" means the same
  to the audience as to the presenter. Hidden on the title slide.
-->
<script setup>
import { useNav } from '@slidev/client'

const { currentPage } = useNav()
</script>

<template>
  <div v-if="currentPage > 1" class="slide-number">{{ currentPage }}</div>
</template>

<style scoped>
.slide-number {
  position: absolute; right: 24px; bottom: 16px; z-index: 20;
  font-family: var(--mono); font-size: 14px; color: var(--muted); pointer-events: none;
}
</style>
