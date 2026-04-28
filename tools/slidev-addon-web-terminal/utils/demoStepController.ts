import { createDemoStepBridge, type DemoStepSyncState } from './demoStepBridge'
import { loadDemoScript, type DemoTerminalKeys, type DemoTerminalStep } from './demoScriptLoader'

export type DemoStepState = DemoStepSyncState

export interface DemoStepController {
  getState(): DemoStepState
  nextStep(): Promise<boolean>
  prevStep(): Promise<boolean>
  reset(): void
  hasMoreSteps(): boolean
  isExecuting(): boolean
  subscribe(listener: (state: DemoStepState) => void): () => void
  dispose(): void
}

export interface DemoTerminalDriver {
  pressEnter(): Promise<boolean>
  sendKeys(keys: DemoTerminalKeys): Promise<boolean>
  typeText(text: string, animated?: boolean): Promise<boolean>
}

interface DemoStepControllerOptions {
  sessionId: string
  scriptFile: string
  getTerminalDriver?: () => DemoTerminalDriver | null
}

interface ControllerEntry {
  bridgeCleanup: (() => void) | null
  bridge: ReturnType<typeof createDemoStepBridge>
  refCount: number
  state: DemoStepState
  steps: DemoTerminalStep[] | null
  pendingSteps: Promise<DemoTerminalStep[]> | null
  subscribers: Set<(state: DemoStepState) => void>
  inFlight: Promise<boolean> | null
}

const controllerEntries = new Map<string, ControllerEntry>()

const createInitialState = (): DemoStepState => ({
  stepIndex: 0,
  totalSteps: 0,
  status: 'idle',
  inFlightStepIndex: null,
  waitingForEnterStepIndex: null,
  lastUpdatedAt: 0,
})

const nextTimestamp = (previousTimestamp: number) => Math.max(Date.now(), previousTimestamp + 1)

const cloneState = (state: DemoStepState): DemoStepState => ({ ...state })

const normalizeState = (state: DemoStepState): DemoStepState => {
  const totalSteps = Math.max(0, Math.floor(state.totalSteps))
  const waitingForEnterStepIndex =
    state.waitingForEnterStepIndex != null && state.waitingForEnterStepIndex >= 0 && state.waitingForEnterStepIndex < totalSteps
      ? Math.floor(state.waitingForEnterStepIndex)
      : null

  const maxStepIndex = waitingForEnterStepIndex != null ? waitingForEnterStepIndex : totalSteps
  const stepIndex = Math.min(Math.max(0, Math.floor(state.stepIndex)), maxStepIndex)
  const inFlightStepIndex =
    state.inFlightStepIndex != null && state.inFlightStepIndex >= 0 && state.inFlightStepIndex < totalSteps
      ? Math.floor(state.inFlightStepIndex)
      : null

  let status = state.status
  if (status !== 'executing' && waitingForEnterStepIndex == null && totalSteps > 0 && stepIndex >= totalSteps) {
    status = 'completed'
  } else if (status !== 'executing' && status !== 'completed') {
    status = 'idle'
  }

  return {
    stepIndex,
    totalSteps,
    status,
    inFlightStepIndex,
    waitingForEnterStepIndex,
    lastUpdatedAt: Math.max(0, Math.floor(state.lastUpdatedAt)),
  }
}

const notifySubscribers = (entry: ControllerEntry) => {
  const snapshot = cloneState(entry.state)
  for (const subscriber of entry.subscribers) {
    subscriber(snapshot)
  }
}

const applyState = (
  entry: ControllerEntry,
  nextState: DemoStepState,
  options: { broadcast?: boolean; originId?: string } = {},
) => {
  const normalizedState = normalizeState(nextState)
  const didChange = JSON.stringify(entry.state) !== JSON.stringify(normalizedState)
  entry.state = normalizedState
  if (!didChange) return

  notifySubscribers(entry)
  if (options.broadcast !== false) {
    entry.bridge.announceState(entry.state, options.originId ?? 'local')
  }
}

const updateState = (
  entry: ControllerEntry,
  recipe: (state: DemoStepState) => DemoStepState,
  options: { broadcast?: boolean; originId?: string } = {},
) => {
  const nextState = recipe({
    ...entry.state,
    lastUpdatedAt: nextTimestamp(entry.state.lastUpdatedAt),
  })
  applyState(entry, nextState, options)
}

const hasMoreSteps = (state: DemoStepState) =>
  state.waitingForEnterStepIndex != null || state.stepIndex < state.totalSteps

const controllerKeyFor = (sessionId: string, scriptFile: string) => `${sessionId}::${scriptFile}`

const loadStepsIntoEntry = async (entry: ControllerEntry, scriptFile: string) => {
  if (!entry.pendingSteps) {
    entry.pendingSteps = loadDemoScript(scriptFile)
      .then((steps) => {
        entry.steps = steps
        const isComplete = entry.state.waitingForEnterStepIndex == null && entry.state.stepIndex >= steps.length && steps.length > 0
        applyState(entry, {
          ...entry.state,
          totalSteps: steps.length,
          status: isComplete ? 'completed' : entry.state.status,
          lastUpdatedAt: nextTimestamp(entry.state.lastUpdatedAt),
        })
        return steps
      })
      .finally(() => {
        entry.pendingSteps = null
      })
  }

  return entry.pendingSteps
}

const executeStep = async (
  step: DemoTerminalStep,
  terminalDriver: DemoTerminalDriver,
) => {
  if (step.kind === 'run' && step.run != null) {
    return terminalDriver.typeText(step.run, true)
  }

  if (step.kind === 'keys' && step.keys) {
    return terminalDriver.sendKeys(step.keys)
  }

  return false
}

const getOrCreateEntry = (controllerKey: string): ControllerEntry => {
  let entry = controllerEntries.get(controllerKey)
  if (entry) {
    entry.refCount += 1
    return entry
  }

  const bridge = createDemoStepBridge(controllerKey)
  entry = {
    bridge,
    bridgeCleanup: null,
    refCount: 1,
    state: createInitialState(),
    steps: null,
    pendingSteps: null,
    subscribers: new Set(),
    inFlight: null,
  }

  entry.bridgeCleanup = bridge.onState((incomingState) => {
    if (incomingState.lastUpdatedAt <= entry!.state.lastUpdatedAt)
      return

    applyState(entry!, incomingState, { broadcast: false })
  })
  bridge.requestState()

  controllerEntries.set(controllerKey, entry)
  return entry
}

export const createDemoStepController = (
  options: DemoStepControllerOptions,
): DemoStepController => {
  const controllerKey = controllerKeyFor(options.sessionId, options.scriptFile)
  const entry = getOrCreateEntry(controllerKey)
  const originId = Math.random().toString(36).slice(2, 8)

  void loadStepsIntoEntry(entry, options.scriptFile).catch((error) => {
    console.error(`Failed to load demo script ${options.scriptFile}`, error)
  })

  return {
    getState() {
      return cloneState(entry.state)
    },

    async nextStep() {
      if (entry.state.status === 'executing')
        return false

      if (entry.inFlight)
        return false

      updateState(entry, state => ({
        ...state,
        status: 'executing',
        inFlightStepIndex: state.waitingForEnterStepIndex ?? state.stepIndex,
      }), { originId })

      const action = (async () => {
        const steps = entry.steps ?? await loadStepsIntoEntry(entry, options.scriptFile)
        if (!steps.length || !hasMoreSteps(entry.state)) {
          updateState(entry, state => ({
            ...state,
            status: state.stepIndex >= state.totalSteps && state.totalSteps > 0 ? 'completed' : 'idle',
            inFlightStepIndex: null,
          }), { originId })
          return false
        }

        const terminalDriver = options.getTerminalDriver?.() ?? null
        if (!terminalDriver) {
          updateState(entry, state => ({
            ...state,
            status: 'idle',
            inFlightStepIndex: null,
          }), { originId })
          return false
        }

        if (entry.state.waitingForEnterStepIndex != null) {
          const waitingStepIndex = entry.state.waitingForEnterStepIndex
          updateState(entry, state => ({
            ...state,
            status: 'executing',
            inFlightStepIndex: waitingStepIndex,
          }), { originId })

          const entered = await terminalDriver.pressEnter()
          if (!entered) {
            updateState(entry, state => ({
              ...state,
              status: 'idle',
              inFlightStepIndex: null,
            }), { originId })
            return false
          }

          updateState(entry, state => {
            const nextStepIndex = waitingStepIndex + 1
            return {
              ...state,
              stepIndex: nextStepIndex,
              waitingForEnterStepIndex: null,
              inFlightStepIndex: null,
              status: nextStepIndex >= state.totalSteps ? 'completed' : 'idle',
            }
          }, { originId })
          return true
        }

        const stepToRun = entry.state.stepIndex
        const step = steps[stepToRun]
        if (!step)
          return false

        updateState(entry, state => ({
          ...state,
          status: 'executing',
          inFlightStepIndex: stepToRun,
        }), { originId })

        const executed = await executeStep(step, terminalDriver)
        if (!executed) {
          updateState(entry, state => ({
            ...state,
            status: 'idle',
            inFlightStepIndex: null,
          }), { originId })
          return false
        }

        if (step.kind === 'run' && step.waitForEnter !== false) {
          updateState(entry, state => ({
            ...state,
            status: 'idle',
            inFlightStepIndex: null,
            waitingForEnterStepIndex: stepToRun,
          }), { originId })
          return true
        }

        updateState(entry, state => {
          const nextStepIndex = stepToRun + 1
          return {
            ...state,
            stepIndex: nextStepIndex,
            inFlightStepIndex: null,
            status: nextStepIndex >= state.totalSteps ? 'completed' : 'idle',
          }
        }, { originId })
        return true
      })().finally(() => {
        if (entry.inFlight === action) {
          entry.inFlight = null
        }
      })

      entry.inFlight = action
      return action
    },

    async prevStep() {
      return false
    },

    reset() {
      if (entry.state.status === 'executing')
        return

      updateState(entry, () => ({
        ...createInitialState(),
        totalSteps: entry.steps?.length ?? entry.state.totalSteps,
        lastUpdatedAt: nextTimestamp(entry.state.lastUpdatedAt),
      }), { originId })
    },

    hasMoreSteps() {
      return hasMoreSteps(entry.state)
    },

    isExecuting() {
      return entry.state.status === 'executing'
    },

    subscribe(listener) {
      entry.subscribers.add(listener)
      listener(cloneState(entry.state))
      return () => {
        entry.subscribers.delete(listener)
      }
    },

    dispose() {
      entry.refCount = Math.max(0, entry.refCount - 1)
    },
  }
}

export const __resetDemoStepControllerForTests = () => {
  for (const entry of controllerEntries.values()) {
    entry.bridgeCleanup?.()
    entry.bridge.close()
  }
  controllerEntries.clear()
}
