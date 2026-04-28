export interface DemoStepSyncState {
  stepIndex: number
  totalSteps: number
  status: 'idle' | 'executing' | 'completed'
  inFlightStepIndex: number | null
  waitingForEnterStepIndex: number | null
  lastUpdatedAt: number
}

type DemoStepBridgeMessage =
  | { type: 'state-request' }
  | { type: 'state-sync'; originId: string; state: DemoStepSyncState }

export interface DemoStepBridge {
  announceState(state: DemoStepSyncState, originId: string): void
  requestState(): void
  onState(listener: (state: DemoStepSyncState, originId: string) => void): () => void
  close(): void
}

interface DemoStepBridgeOptions {
  debug?: boolean
  logger?: (message: string, details?: unknown) => void
}

export const createDemoStepBridge = (
  controllerKey: string,
  options: DemoStepBridgeOptions = {},
): DemoStepBridge => {
  const log = (message: string, details?: unknown) => {
    if (!options.debug) return
    if (options.logger) {
      options.logger(message, details)
      return
    }
    if (details === undefined) {
      console.info(`[DemoStepBridge:${controllerKey}] ${message}`)
    } else {
      console.info(`[DemoStepBridge:${controllerKey}] ${message}`, details)
    }
  }

  if (typeof BroadcastChannel === 'undefined') {
    return {
      announceState() {},
      requestState() {},
      onState: () => () => {},
      close() {},
    }
  }

  const channelName = `demo-terminal:${controllerKey}`
  const channel = new BroadcastChannel(channelName)
  const listeners = new Set<(state: DemoStepSyncState, originId: string) => void>()
  let lastKnownState: DemoStepSyncState | null = null

  const notifyListeners = (state: DemoStepSyncState, originId: string) => {
    for (const listener of listeners) {
      listener(state, originId)
    }
  }

  channel.onmessage = (event: MessageEvent<DemoStepBridgeMessage>) => {
    const message = event.data
    if (message.type === 'state-request') {
      if (!lastKnownState) return
      log('state.request')
      channel.postMessage({
        type: 'state-sync',
        originId: 'bridge-cache',
        state: lastKnownState,
      } satisfies DemoStepBridgeMessage)
      return
    }

    lastKnownState = message.state
    log('state.sync', { originId: message.originId, state: message.state })
    notifyListeners(message.state, message.originId)
  }

  return {
    announceState(state, originId) {
      lastKnownState = state
      log('state.announce', { originId, state })
      channel.postMessage({
        type: 'state-sync',
        originId,
        state,
      } satisfies DemoStepBridgeMessage)
    },

    requestState() {
      log('state.request.send')
      channel.postMessage({ type: 'state-request' } satisfies DemoStepBridgeMessage)
    },

    onState(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },

    close() {
      listeners.clear()
      channel.close()
    },
  }
}
