<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useIsSlideActive, useSlideContext } from '@slidev/client'
import WebTerminal from './WebTerminal.vue'
import {
  createDemoStepController,
  type DemoStepController,
  type DemoStepState,
  type DemoTerminalDriver,
} from '../utils/demoStepController'

const props = withDefaults(defineProps<{
  activationKey?: string
  backendUrl?: string
  debug?: boolean
  fontFamily?: string
  fontSize?: number
  releaseKey?: string
  wsUrl?: string
  sessionId: string
  scriptFile: string
  advanceKey?: string
  showStepHint?: boolean
}>(), {
  activationKey: 't',
  advanceKey: '.',
  backendUrl: undefined,
  debug: undefined,
  fontFamily: undefined,
  fontSize: undefined,
  releaseKey: 'F2',
  showStepHint: true,
  wsUrl: undefined,
})

interface WebTerminalExpose extends DemoTerminalDriver {
  blur(): void
  focus(): void
  isReady(): boolean
}

const THUMBNAIL_CONTEXTS = new Set(['previewNext', 'overview'])
const { $renderContext: renderContext } = useSlideContext()
const isSlideActive = useIsSlideActive()
const terminalRef = ref<WebTerminalExpose | null>(null)
const state = ref<DemoStepState>({
  stepIndex: 0,
  totalSteps: 0,
  status: 'idle',
  inFlightStepIndex: null,
  waitingForEnterStepIndex: null,
  lastUpdatedAt: 0,
})

let controller: DemoStepController = createDemoStepController({
  sessionId: props.sessionId,
  scriptFile: props.scriptFile,
  getTerminalDriver: () => terminalRef.value,
})
let unsubscribe: (() => void) | null = controller.subscribe((nextState) => {
  state.value = nextState
})
let keydownAttached = false

const isInteractiveContext = computed(() => !THUMBNAIL_CONTEXTS.has(renderContext.value))
const canHandleDemoKeys = computed(() => isInteractiveContext.value && isSlideActive.value)

const isTypingInEditable = (element: Element | null) => {
  if (!(element instanceof HTMLElement)) return false
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) return true
  return !!element.closest?.('[contenteditable="true"]')
}

const hint = computed(() => {
  if (!props.showStepHint) return ''
  if (state.value.totalSteps === 0) return 'Demo 0/0'
  if (state.value.status === 'completed') {
    return `Demo ${state.value.totalSteps}/${state.value.totalSteps} - done`
  }
  if (state.value.waitingForEnterStepIndex != null) {
    const current = Math.min(state.value.waitingForEnterStepIndex + 1, state.value.totalSteps)
    return `Demo ${current}/${state.value.totalSteps} - press ${props.advanceKey} to run`
  }
  if (state.value.status === 'executing') {
    const current = Math.min((state.value.inFlightStepIndex ?? state.value.stepIndex) + 1, state.value.totalSteps)
    return `Demo ${current}/${state.value.totalSteps} - busy...`
  }
  if (state.value.stepIndex === 0) {
    return `Demo 0/${state.value.totalSteps}`
  }
  const next = Math.min(state.value.stepIndex + 1, state.value.totalSteps)
  return `Demo ${next}/${state.value.totalSteps}`
})

const handleKeydown = (event: KeyboardEvent) => {
  if (!canHandleDemoKeys.value) return
  if (event.key !== props.advanceKey) return
  if (event.repeat) return
  if (isTypingInEditable(document.activeElement)) return
  if (controller.isExecuting()) return
  if (!controller.hasMoreSteps()) return

  event.preventDefault()
  void controller.nextStep()
}

const attachKeyListener = () => {
  if (keydownAttached || !canHandleDemoKeys.value) return
  document.addEventListener('keydown', handleKeydown)
  keydownAttached = true
}

const detachKeyListener = () => {
  if (!keydownAttached) return
  document.removeEventListener('keydown', handleKeydown)
  keydownAttached = false
}

const recreateController = () => {
  unsubscribe?.()
  controller.dispose()
  controller = createDemoStepController({
    sessionId: props.sessionId,
    scriptFile: props.scriptFile,
    getTerminalDriver: () => terminalRef.value,
  })
  unsubscribe = controller.subscribe((nextState) => {
    state.value = nextState
  })
}

watch(() => [props.sessionId, props.scriptFile], () => {
  recreateController()
})

watch(canHandleDemoKeys, (canHandle) => {
  if (canHandle) {
    attachKeyListener()
  } else {
    detachKeyListener()
  }
})

onMounted(() => {
  attachKeyListener()
})

onUnmounted(() => {
  detachKeyListener()
  unsubscribe?.()
  controller.dispose()
})

defineExpose({
  getCurrentStepIndex: () => state.value.stepIndex,
  getTotalSteps: () => state.value.totalSteps,
  hasMoreSteps: () => controller.hasMoreSteps(),
  isExecuting: () => controller.isExecuting(),
  nextStep: () => controller.nextStep(),
  prevStep: () => controller.prevStep(),
  reset: () => controller.reset(),
})
</script>

<template>
  <div class="demo-terminal-wrapper">
    <WebTerminal
      ref="terminalRef"
      :activation-key="activationKey"
      :backend-url="backendUrl"
      :debug="debug"
      :font-family="fontFamily"
      :font-size="fontSize"
      :release-key="releaseKey"
      :ws-url="wsUrl"
      :session-id="sessionId"
    />
    <div
      v-if="showStepHint"
      class="demo-step-hint"
    >
      {{ hint }}
    </div>
  </div>
</template>

<style scoped>
.demo-terminal-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
}

.demo-step-hint {
  position: absolute;
  right: 0.9rem;
  bottom: 0.55rem;
  z-index: 12;
  padding: 0.2rem 0.45rem;
  border-radius: 999px;
  background: rgba(32, 32, 32, 0.72);
  color: rgba(235, 235, 235, 0.72);
  font-size: 0.65rem;
  font-family: monospace;
  letter-spacing: 0.01em;
  pointer-events: none;
}
</style>
