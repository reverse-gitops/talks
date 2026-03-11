<script setup>
defineProps({ drawFilePath: String, frame: String })
</script>

<template>
  <div class="slidev-layout h-full flex flex-col p-10">
    <slot />
    <div class="flex-1 min-h-0">
      <Excalidraw :drawFilePath="drawFilePath" :frame="frame" :matchFrames="true" class="excalidraw-story diagram-shared" />
    </div>
  </div>
</template>

<style>
.excalidraw-story, .excalidraw-story svg {
  width: 100%;
  height: 100%;
}
</style>
