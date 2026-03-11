<script setup lang="ts">
type DotsOptions = {
  type?: string
  color?: string
}

const props = withDefaults(defineProps<{
  link: string
  width?: number
  height?: number
  margin?: number
  dotsOptions?: DotsOptions
}>(), {
  width: 260,
  height: 260,
  margin: 10,
  dotsOptions: () => ({ type: 'extra-rounded', color: 'grey' }),
})
</script>

<template>
  <div class="flex flex-col items-center">
    <QRCode
      :data="props.link"
      type="svg"
      :margin="props.margin"
      :width="props.width"
      :height="props.height"
      :dots-options="props.dotsOptions"
    />

    <a
      :href="props.link"
      target="_blank"
      rel="noopener noreferrer"
      class="mt-4 text-2xl opacity-80 break-all"
    >
      {{ props.link }}
    </a>
  </div>
</template>
