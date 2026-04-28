<script setup>
defineProps({ image: String })
</script>

<template>
  <div class="slidev-layout h-full flex flex-col p-10">
    <slot />
    <div class="flex-1 flex items-center justify-center min-h-0">
      <img :src="image" class="max-w-full max-h-full object-contain diagram-shared" />
    </div>
  </div>
</template>

<style>
.diagram-shared {
  view-transition-name: main-diagram;
}

::view-transition-old(main-diagram),
::view-transition-new(main-diagram) {
  animation-duration: 2000ms;
  animation-timing-function: cubic-bezier(0.2, 0, 0, 1);
}
</style>
