<!--
  The order of the talk, as a chain: on the TLDR slide, and between sections to show where we are.
  `at` picks the step that is highlighted: settings, git, image, test or production.
-->
<script setup lang="ts">
defineProps<{ at: 'settings' | 'git' | 'image' | 'test' | 'production' }>()
</script>

<template>
  <div class="chain">
    <b :class="{ hero: at === 'settings' }">Settings screen</b><i>→</i>
    <b :class="{ hero: at === 'git' }">Files in Git</b><i>→</i>
    <b :class="{ hero: at === 'image' }">Image</b><i>→</i>
    <b :class="{ hero: at === 'test' }">Test</b><i>→</i>
    <b :class="{ hero: at === 'production' }">Production</b>
  </div>
</template>

<style scoped>
.chain { display: flex; align-items: center; gap: 18px; width: 100%; font-size: 32px; }
.chain b { flex: 1; padding: 24px 12px; text-align: center; white-space: nowrap; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 12px; font-weight: 500; }
.chain b.hero { color: var(--bg); background: var(--good); border-color: var(--good); font-weight: 700; }
.chain i { font-style: normal; color: var(--arrow); }
</style>
