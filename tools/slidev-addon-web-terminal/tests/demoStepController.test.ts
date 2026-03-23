import { beforeEach, describe, expect, it, vi } from 'vitest'
import { __resetDemoScriptLoaderForTests } from '../utils/demoScriptLoader'
import {
  __resetDemoStepControllerForTests,
  createDemoStepController,
  type DemoTerminalDriver,
} from '../utils/demoStepController'

const scriptResponse = `
steps:
  - run: kubectl get nodes
  - keys: ctrl+c
`

const createDriver = (overrides: Partial<DemoTerminalDriver> = {}): DemoTerminalDriver => ({
  pressEnter: vi.fn(async () => true),
  sendKeys: vi.fn(async () => true),
  typeText: vi.fn(async () => true),
  ...overrides,
})

describe('demoStepController', () => {
  beforeEach(() => {
    __resetDemoScriptLoaderForTests()
    __resetDemoStepControllerForTests()
    vi.restoreAllMocks()
    vi.stubGlobal('fetch', vi.fn(async () => new Response(scriptResponse, { status: 200 })))
  })

  it('waits for a second advance before pressing Enter on run steps', async () => {
    const driver = createDriver()
    const controller = createDemoStepController({
      sessionId: 'deck',
      scriptFile: '/demo.yaml',
      getTerminalDriver: () => driver,
    })

    expect(await controller.nextStep()).toBe(true)
    expect(driver.typeText).toHaveBeenCalledWith('kubectl get nodes', true)
    expect(controller.getState()).toMatchObject({
      stepIndex: 0,
      waitingForEnterStepIndex: 0,
      status: 'idle',
      totalSteps: 2,
    })
    expect(controller.hasMoreSteps()).toBe(true)

    expect(await controller.nextStep()).toBe(true)
    expect(driver.pressEnter).toHaveBeenCalledTimes(1)
    expect(controller.getState()).toMatchObject({
      stepIndex: 1,
      waitingForEnterStepIndex: null,
      status: 'idle',
      totalSteps: 2,
    })
  })

  it('ignores repeated advances while a step is still executing', async () => {
    let resolveTyping: ((value: boolean) => void) | null = null
    const driver = createDriver({
      typeText: vi.fn(() => new Promise<boolean>((resolve) => {
        resolveTyping = resolve
      })),
    })
    const controller = createDemoStepController({
      sessionId: 'deck',
      scriptFile: '/demo.yaml',
      getTerminalDriver: () => driver,
    })

    const firstAdvance = controller.nextStep()
    await vi.waitFor(() => {
      expect(driver.typeText).toHaveBeenCalledTimes(1)
    })

    expect(controller.isExecuting()).toBe(true)
    expect(await controller.nextStep()).toBe(false)

    resolveTyping?.(true)
    await expect(firstAdvance).resolves.toBe(true)
    expect(controller.getState().waitingForEnterStepIndex).toBe(0)
  })

  it('persists progress across remounts for the same session and script', async () => {
    const driver = createDriver()
    const first = createDemoStepController({
      sessionId: 'deck',
      scriptFile: '/demo.yaml',
      getTerminalDriver: () => driver,
    })

    await first.nextStep()
    await first.nextStep()
    first.dispose()

    const second = createDemoStepController({
      sessionId: 'deck',
      scriptFile: '/demo.yaml',
      getTerminalDriver: () => driver,
    })

    expect(second.getState()).toMatchObject({
      stepIndex: 1,
      totalSteps: 2,
      waitingForEnterStepIndex: null,
    })
  })

  it('executes key steps and reset clears remembered progress', async () => {
    const driver = createDriver()
    const controller = createDemoStepController({
      sessionId: 'deck',
      scriptFile: '/demo.yaml',
      getTerminalDriver: () => driver,
    })

    await controller.nextStep()
    await controller.nextStep()
    await controller.nextStep()

    expect(driver.sendKeys).toHaveBeenCalledWith('ctrl+c')
    expect(controller.getState()).toMatchObject({
      stepIndex: 2,
      status: 'completed',
    })

    controller.reset()

    expect(controller.getState()).toMatchObject({
      stepIndex: 0,
      waitingForEnterStepIndex: null,
      status: 'idle',
      totalSteps: 2,
    })
  })
})
