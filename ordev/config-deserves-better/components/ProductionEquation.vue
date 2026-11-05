<!--
  The big equation: infra + config + code, the thread that keeps coming back in this talk.
    <ProductionEquation />                                                  the words only
    <ProductionEquation compact><template #code>…</template></ProductionEquation>   smaller, with room below
  The slots #code, #config and #infra sit below their part, in the same columns.
  A slide drives its slots from $clicks, so each return of the equation is a small page: see equation-tools.md.
-->
<script setup>
defineProps({
  compact: Boolean, // smaller, to leave room for the slots
})

const parts = ['infra', 'config', 'code']
</script>

<template>
  <div class="equation" :class="{ compact }">
    <template v-for="(part, i) in parts" :key="part">
      <div v-if="i > 0" class="op" :style="{ gridColumn: i * 2, gridRow: 1 }">+</div>
      <div class="part" :style="{ gridColumn: i * 2 + 1, gridRow: 1 }">{{ part }}</div>
      <div v-if="$slots[part]" class="slot" :style="{ gridColumn: i * 2 + 1, gridRow: 2 }">
        <slot :name="part" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.equation {
  --gutter: 96px;
  --word: 112px;
  position: absolute; left: 64px; top: 320px; width: 1472px;
  display: grid; grid-template-columns: 1fr var(--gutter) 1fr var(--gutter) 1fr; grid-template-rows: auto auto;
  justify-items: center; align-items: center;
}
.equation.compact { --gutter: 64px; --word: 60px; top: 164px; }

.part { font-size: var(--word); line-height: 1.2; font-weight: 700; letter-spacing: -.02em; }
.op { font-family: var(--mono); font-size: var(--word); line-height: 1.2; color: var(--accent); }
.slot { align-self: stretch; justify-self: stretch; margin-top: 16px; min-width: 0; }
</style>
