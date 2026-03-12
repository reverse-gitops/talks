export interface CursorWarmupDisposable {
  dispose(): void
}

export interface CursorWarmupEnvironment {
  hasCursorNode(): boolean
  isFocused(): boolean
  getContainerSize(): { width: number; height: number }
  focusTerminal(): void
  blurTerminal(): void
  onRender(callback: () => void): CursorWarmupDisposable
  captureFocusRestore(): () => void
  setSuppressFocusSideEffects(value: boolean): void
  requestAnimationFrame(callback: () => void): void
  setTimeout(callback: () => void, delayMs: number): ReturnType<typeof setTimeout>
  clearTimeout(handle: ReturnType<typeof setTimeout>): void
  debugLog?: (message: string, details?: Record<string, unknown>) => void
}

export interface CursorWarmupRunnerOptions {
  minWidthPx: number
  minHeightPx: number
  timeoutMs?: number
  environment: CursorWarmupEnvironment
}

const DEFAULT_TIMEOUT_MS = 120

export function createCursorWarmupRunner(options: CursorWarmupRunnerOptions) {
  const {
    minWidthPx,
    minHeightPx,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    environment,
  } = options

  let inFlight = false

  return {
    ensureCursorNode(reason: string): boolean {
      if (inFlight || environment.isFocused() || environment.hasCursorNode()) return false

      const { width, height } = environment.getContainerSize()
      if (width < minWidthPx || height < minHeightPx) return false

      const restoreFocus = environment.captureFocusRestore()
      inFlight = true
      environment.setSuppressFocusSideEffects(true)
      environment.debugLog?.('Cursor warmup start', { reason })

      let finished = false
      let focusTimeout: ReturnType<typeof setTimeout> | null = null
      let blurTimeout: ReturnType<typeof setTimeout> | null = null
      let focusedRenderDisposable: CursorWarmupDisposable | null = null
      let blurRenderDisposable: CursorWarmupDisposable | null = null

      const finish = () => {
        if (finished) return
        finished = true
        inFlight = false
        environment.setSuppressFocusSideEffects(false)
        if (focusTimeout) environment.clearTimeout(focusTimeout)
        if (blurTimeout) environment.clearTimeout(blurTimeout)
        focusedRenderDisposable?.dispose()
        blurRenderDisposable?.dispose()
        restoreFocus()
      }

      focusedRenderDisposable = environment.onRender(() => {
        focusedRenderDisposable?.dispose()
        focusedRenderDisposable = null
        environment.requestAnimationFrame(() => {
          environment.blurTerminal()
          blurRenderDisposable = environment.onRender(() => {
            finish()
          })
          blurTimeout = environment.setTimeout(() => {
            finish()
          }, timeoutMs)
        })
      })

      focusTimeout = environment.setTimeout(() => {
        finish()
      }, timeoutMs)

      environment.focusTerminal()
      return true
    },

    isInFlight(): boolean {
      return inFlight
    },
  }
}
