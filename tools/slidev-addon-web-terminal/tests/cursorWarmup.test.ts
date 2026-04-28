import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createCursorWarmupRunner } from '../utils/cursorWarmup'

describe('cursorWarmup', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('warms up an unfocused visible terminal until blur render completes', () => {
    let suppressFocusSideEffects = false
    let cursorNodeExists = false
    const focused = false
    let focusCalls = 0
    let blurCalls = 0
    let restoreCalls = 0
    let focusedRenderCallback: (() => void) | null = null
    let blurRenderCallback: (() => void) | null = null

    const runner = createCursorWarmupRunner({
      minWidthPx: 200,
      minHeightPx: 100,
      environment: {
        hasCursorNode: () => cursorNodeExists,
        isFocused: () => focused,
        getContainerSize: () => ({ width: 640, height: 320 }),
        focusTerminal: () => {
          focusCalls++
        },
        blurTerminal: () => {
          blurCalls++
          cursorNodeExists = true
        },
        onRender: (callback) => {
          if (!focusedRenderCallback) {
            focusedRenderCallback = callback
          } else {
            blurRenderCallback = callback
          }
          return { dispose() {} }
        },
        captureFocusRestore: () => () => {
          restoreCalls++
        },
        setSuppressFocusSideEffects: (value) => {
          suppressFocusSideEffects = value
        },
        requestAnimationFrame: (callback) => callback(),
        setTimeout: (callback, delayMs) => setTimeout(callback, delayMs),
        clearTimeout: (handle) => clearTimeout(handle),
      },
    })

    expect(runner.ensureCursorNode('test')).toBe(true)
    expect(runner.isInFlight()).toBe(true)
    expect(suppressFocusSideEffects).toBe(true)
    expect(focusCalls).toBe(1)

    focusedRenderCallback?.()
    expect(blurCalls).toBe(1)

    blurRenderCallback?.()
    expect(runner.isInFlight()).toBe(false)
    expect(suppressFocusSideEffects).toBe(false)
    expect(restoreCalls).toBe(1)
  })

  it('does nothing when the terminal is too small or already has a cursor', () => {
    const focusTerminal = vi.fn()

    const runner = createCursorWarmupRunner({
      minWidthPx: 200,
      minHeightPx: 100,
      environment: {
        hasCursorNode: () => false,
        isFocused: () => false,
        getContainerSize: () => ({ width: 0, height: 0 }),
        focusTerminal,
        blurTerminal: vi.fn(),
        onRender: () => ({ dispose() {} }),
        captureFocusRestore: () => () => {},
        setSuppressFocusSideEffects: vi.fn(),
        requestAnimationFrame: (callback) => callback(),
        setTimeout: (callback, delayMs) => setTimeout(callback, delayMs),
        clearTimeout: (handle) => clearTimeout(handle),
      },
    })

    expect(runner.ensureCursorNode('too-small')).toBe(false)
    expect(runner.isInFlight()).toBe(false)
    expect(focusTerminal).not.toHaveBeenCalled()
  })
})
