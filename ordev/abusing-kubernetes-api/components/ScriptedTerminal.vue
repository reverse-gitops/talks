<!--
  A demo terminal that also works on paper.
    <ScriptedTerminal :script-file="scriptFile" session-id="reverser-get-seats" />
  Live, it is the web-terminal addon's DemoTerminal: press . to type the next step, . again to run it.
  In print mode (slidev export, the PDF) there is no shell to talk to, so it shows the script's
  commands instead, the way they would be typed.
-->
<script setup>
import { onMounted, ref } from 'vue'
import { useNav } from '@slidev/client'
import { loadDemoScript } from 'slidev-addon-web-terminal/utils/demoScriptLoader'

const props = defineProps({
  scriptFile: { type: String, required: true },
  sessionId: { type: String, required: true },
  fontSize: { type: Number, default: 18 },
})

const { isPrintMode } = useNav()
const commands = ref([])
onMounted(async () => {
  if (!isPrintMode.value) return
  const steps = await loadDemoScript(props.scriptFile)
  commands.value = steps.filter((s) => s.kind === 'run').map((s) => s.run)
})
</script>

<template>
  <div class="scripted-terminal">
    <div v-if="isPrintMode" class="printed" :style="{ fontSize: `${fontSize}px` }">
      <div v-for="(c, i) in commands" :key="i" class="line"><span class="prompt">$</span> {{ c }}</div>
    </div>
    <DemoTerminal
      v-else
      backendUrl="http://127.0.0.1:10001"
      :sessionId="sessionId"
      :script-file="scriptFile"
      fontFamily="'JetBrains Mono', ui-monospace, monospace"
      :fontSize="fontSize"
    />
  </div>
</template>

<style scoped>
.scripted-terminal { width: 100%; height: 100%; }
.printed { height: 100%; box-sizing: border-box; padding: 20px 24px; background: #000; font-family: 'JetBrains Mono', ui-monospace, monospace; line-height: 1.6; color: #E7ECF2; }
.line { white-space: pre-wrap; word-break: break-all; margin-bottom: 10px; }
.prompt { color: var(--good); }
</style>
