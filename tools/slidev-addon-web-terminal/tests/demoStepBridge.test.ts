import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createDemoStepBridge, type DemoStepSyncState } from '../utils/demoStepBridge'

class FakeBroadcastChannel {
  static channels = new Map<string, Set<FakeBroadcastChannel>>()

  name: string
  onmessage: ((event: MessageEvent) => void) | null = null
  private listeners = new Set<(event: MessageEvent) => void>()

  constructor(name: string) {
    this.name = name
    let channelSet = FakeBroadcastChannel.channels.get(name)
    if (!channelSet) {
      channelSet = new Set()
      FakeBroadcastChannel.channels.set(name, channelSet)
    }
    channelSet.add(this)
  }

  postMessage(data: unknown) {
    const peers = FakeBroadcastChannel.channels.get(this.name) ?? new Set()
    for (const peer of peers) {
      if (peer === this) continue
      queueMicrotask(() => {
        const event = { data } as MessageEvent
        peer.onmessage?.(event)
        for (const listener of peer.listeners) {
          listener(event)
        }
      })
    }
  }

  addEventListener(type: string, listener: (event: MessageEvent) => void) {
    if (type === 'message') {
      this.listeners.add(listener)
    }
  }

  removeEventListener(type: string, listener: (event: MessageEvent) => void) {
    if (type === 'message') {
      this.listeners.delete(listener)
    }
  }

  close() {
    FakeBroadcastChannel.channels.get(this.name)?.delete(this)
    this.listeners.clear()
  }
}

const waitingState: DemoStepSyncState = {
  stepIndex: 0,
  totalSteps: 3,
  status: 'idle',
  inFlightStepIndex: null,
  waitingForEnterStepIndex: 0,
  lastUpdatedAt: 12,
}

describe('demoStepBridge', () => {
  beforeEach(() => {
    FakeBroadcastChannel.channels.clear()
    vi.stubGlobal('BroadcastChannel', FakeBroadcastChannel)
  })

  it('replays the latest known state to a new peer on request', async () => {
    const primary = createDemoStepBridge('demo')
    const secondary = createDemoStepBridge('demo')
    const received: DemoStepSyncState[] = []

    secondary.onState((state) => {
      received.push(state)
    })

    primary.announceState(waitingState, 'primary')
    await Promise.resolve()

    secondary.requestState()
    await Promise.resolve()
    await Promise.resolve()

    expect(received).toContainEqual(waitingState)

    primary.close()
    secondary.close()
  })
})
