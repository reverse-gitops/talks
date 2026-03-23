<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useSlideContext } from '@slidev/client'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import { AttachAddon } from '@xterm/addon-attach'
import { WebglAddon } from '@xterm/addon-webgl'
import '@xterm/xterm/css/xterm.css'
import {
  createTerminalSessionController,
  type TerminalSessionController,
  type TerminalSessionSource,
} from '../utils/terminalSessionController'
import { createCursorWarmupRunner } from '../utils/cursorWarmup'
import {
  getClickableCodeCommand,
  getClickableCodeAutomationTargets,
  getClickableCodeStepAction,
} from '../utils/clickableCodeAutomation'

const props = withDefaults(defineProps<{
  wsUrl?: string
  backendUrl?: string
  fontSize?: number
  fontFamily?: string
  releaseKey?: string
  /** Enable verbose console logging for terminal/bridge lifecycle diagnostics.
   *  You can also enable this with `?webTerminalDebug=1` or localStorage `webTerminalDebug=1`. */
  debug?: boolean
  /** Stable identifier shared between the presentation and presenter windows.
   *  Both windows must use the same value to share a PTY session.
   *  Defaults to the backendUrl or wsUrl when not set. */
  sessionId?: string
  /** When set, pressing this key (while not typing in an editable element) will focus the terminal.
   *  E.g. activationKey="t". If not set, the terminal will not auto-focus on mount. */
  activationKey?: string
}>(), {
  releaseKey: 'F2',
  activationKey: 't',
})

const terminalContainer = ref<HTMLElement | null>(null)
const isFocused = ref(false)
const isControlledElsewhere = ref(false)

// Skip the real terminal in Slidev thumbnail/overview contexts to avoid interfering
// with the shared PTY (e.g. sending a tiny resize that scrambles the shell output).
// Falls back to false (full render) when running outside Slidev.
const THUMBNAIL_CONTEXTS = new Set(['previewNext', 'overview'])
const { $clicks: slideClicks, $renderContext: renderContext } = useSlideContext()
const isPlaceholder = THUMBNAIL_CONTEXTS.has(renderContext.value)

let terminal: Terminal | null = null
let socket: WebSocket | null = null
let fitAddon: FitAddon | null = null
let attachAddon: AttachAddon | null = null
let rendererAddon: WebglAddon | null = null
let resizeObserver: ResizeObserver | null = null
let sessionController: TerminalSessionController | null = null
let activationKeyHandler: ((e: KeyboardEvent) => void) | null = null
let controlOwnerCleanup: (() => void) | null = null
let suppressFocusSideEffects = false
let cursorEnsured = false
let initRunId = 0
let textareaFocusHandler: (() => void) | null = null
let textareaBlurHandler: (() => void) | null = null
let previousSlideClick = slideClicks.value

type QueuedTerminalAction =
  | { kind: 'pause'; delayMs: number }
  | { kind: 'text'; animated: boolean; text: string }

const pendingTerminalActions: QueuedTerminalAction[] = []
let terminalActionRunner: Promise<void> | null = null
let terminalActionRunId = 0

const isElementVisible = (el: HTMLElement | null): boolean => {
    if (!el?.isConnected) return false
    return el.getClientRects().length > 0
}

const isTypingInEditable = (el: Element | null): boolean => {
    if (!(el instanceof HTMLElement)) return false
    if (!isElementVisible(el)) return false
    if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) return true

    const contentEditable = el.closest?.('[contenteditable="true"]')
    return contentEditable instanceof HTMLElement && isElementVisible(contentEditable)
}
const instanceId = Math.random().toString(36).slice(2, 8)

const isDebugEnabled = () => {
    if (props.debug) return true
    if (typeof window === 'undefined') return false
    const queryEnabled = new URLSearchParams(window.location.search).get('webTerminalDebug') === '1'
    let storageEnabled = false
    try {
        storageEnabled = window.localStorage.getItem('webTerminalDebug') === '1'
    } catch {
        // ignore storage access errors
    }
    return queryEnabled || storageEnabled
}

const debugLog = (message: string, details?: unknown) => {
    if (!isDebugEnabled()) return
    const prefix = `[WebTerminal:${instanceId}] ${message}`
    if (details === undefined) {
        console.info(prefix)
    } else {
        console.info(prefix, details)
    }
}

const logEvent = (event: string, details: Record<string, unknown> = {}) => {
    debugLog(event, {
        instanceId,
        renderContext: renderContext.value,
        ...details,
    })
}

// Minimum pixel dimensions for a meaningful terminal fit.
// Containers smaller than this (e.g. Slidev presenter thumbnails) are skipped
// to prevent tiny col/row values from corrupting the shared PTY size.
const MIN_FIT_WIDTH_PX = 200
const MIN_FIT_HEIGHT_PX = 100
const getResolvedFontFamily = () => props.fontFamily ?? "'JetBrainsMono Nerd Font Mono', 'Symbols Nerd Font Mono', monospace"

const safeFit = (reason: string) => {
    if (!fitAddon || !terminalContainer.value) return
    const rect = terminalContainer.value.getBoundingClientRect()
    if (rect.width < MIN_FIT_WIDTH_PX || rect.height < MIN_FIT_HEIGHT_PX) {
        debugLog('Skipping fit: container too small', { width: rect.width, height: rect.height })
        return
    }
    fitAddon.fit()
    if (terminal && !THUMBNAIL_CONTEXTS.has(renderContext.value)) {
        sessionController?.requestResize(terminal.cols, terminal.rows, reason)
    }
}


// xterm.js 6.0 bug: when the terminal is inside a CSS-scaled ancestor (e.g. Slidev's
// slide scaling), xterm measures character sizes in layout pixels (offsetHeight) but
// mouse events arrive in visual viewport pixels (getBoundingClientRect). We intercept
// all mouse events and divide the offset by the CSS scale factor before xterm sees them.
const _correctedEvents = new WeakSet<MouseEvent>()
const fixMouseCoords = (e: MouseEvent) => {
    if (_correctedEvents.has(e) || !terminalContainer.value) return
    const rect = terminalContainer.value.getBoundingClientRect()
    // CSS scale applied by ancestors (e.g. Slidev): BCR is visual, offsetHeight is layout
    const scale = rect.height / terminalContainer.value.offsetHeight
    if (Math.abs(scale - 1) < 0.01) return
    e.stopImmediatePropagation()
    const corrected = new MouseEvent(e.type, {
        bubbles: e.bubbles, cancelable: e.cancelable, composed: e.composed,
        view: e.view, detail: e.detail,
        screenX: e.screenX, screenY: e.screenY,
        clientX: rect.left + (e.clientX - rect.left) / scale,
        clientY: rect.top + (e.clientY - rect.top) / scale,
        ctrlKey: e.ctrlKey, altKey: e.altKey, shiftKey: e.shiftKey, metaKey: e.metaKey,
        button: e.button, buttons: e.buttons, relatedTarget: e.relatedTarget,
    })
    _correctedEvents.add(corrected)
    e.target!.dispatchEvent(corrected)
}
const MOUSE_EVENT_TYPES = ['mousedown', 'mouseup', 'mousemove', 'click', 'contextmenu']
const handleCapturedMouseEvent = (event: Event) => {
    if (event instanceof MouseEvent) fixMouseCoords(event)
}

const hasNativeCursorNode = () => !!terminalContainer.value?.querySelector('.xterm-cursor')

const restoreElementFocus = (element: Element | null) => {
    if (!(element instanceof HTMLElement)) return
    if (element === terminal?.textarea) return
    try {
        element.focus({ preventScroll: true })
    } catch {
        element.focus()
    }
}

const cursorWarmup = createCursorWarmupRunner({
    minWidthPx: MIN_FIT_WIDTH_PX,
    minHeightPx: MIN_FIT_HEIGHT_PX,
    onComplete: () => { cursorEnsured = true },
    environment: {
        hasCursorNode: () => cursorEnsured || hasNativeCursorNode(),
        isFocused: () => isFocused.value,
        getContainerSize: () => terminalContainer.value?.getBoundingClientRect() ?? { width: 0, height: 0 },
        focusTerminal: () => terminal?.focus(),
        blurTerminal: () => terminal?.blur(),
        onRender: callback => terminal?.onRender(callback) ?? { dispose() {} },
        captureFocusRestore: () => {
            const previousActiveElement = document.activeElement
            return () => restoreElementFocus(previousActiveElement)
        },
        setSuppressFocusSideEffects: value => {
            suppressFocusSideEffects = value
        },
        requestAnimationFrame: callback => window.requestAnimationFrame(callback),
        setTimeout: (callback, delayMs) => window.setTimeout(callback, delayMs),
        clearTimeout: handle => window.clearTimeout(handle),
        debugLog: (message, details) => debugLog(message, details),
    },
})

const ensureInactiveCursorNode = (reason: string) => {
    if (!terminal || typeof window === 'undefined') return
    cursorWarmup.ensureCursorNode(reason)
}

const syncCursorVisualState = () => {
    if (!terminal || typeof window === 'undefined') return
    window.requestAnimationFrame(() => {
        if (!terminal) return
        if (isControlledElsewhere.value && !isFocused.value) {
            terminal.blur()
        }
        terminal.refresh(0, Math.max(terminal.rows - 1, 0))
        ensureInactiveCursorNode('syncCursorVisualState')
    })
}

const getAutomationSessionId = () => props.sessionId ?? props.backendUrl ?? props.wsUrl ?? null

const getAutomationScopeRoot = () => {
    const slideRoot = terminalContainer.value?.closest('[data-slidev-no], .slidev-page')
    return slideRoot ?? document
}

const TYPING_DELAY_MIN_MS = 24
const TYPING_DELAY_MAX_MS = 72
const ENTER_DELAY_MIN_MS = 120
const ENTER_DELAY_MAX_MS = 240

const getRandomDelay = (minMs: number, maxMs: number) =>
    Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs

const canWriteToTerminal = () => !!terminal && socket?.readyState === WebSocket.OPEN

const writeTerminalData = (data: string) => {
    if (!data || !canWriteToTerminal()) return
    terminal!.input(data)
}

const sleep = (delayMs: number) => new Promise<void>(resolve => window.setTimeout(resolve, delayMs))

const queueTerminalPause = (delayMs: number) => {
    if (delayMs <= 0) return
    pendingTerminalActions.push({ kind: 'pause', delayMs })
    void flushPendingTerminalInputs()
}

const queueTerminalInput = (data: string, animated = false) => {
    if (!data) return
    pendingTerminalActions.push({ kind: 'text', text: data, animated })
    void flushPendingTerminalInputs()
}

const flushPendingTerminalInputs = async () => {
    if (terminalActionRunner || pendingTerminalActions.length === 0 || !canWriteToTerminal()) return

    const runId = ++terminalActionRunId
    const runner = (async () => {
        while (pendingTerminalActions.length > 0) {
            const action = pendingTerminalActions.shift()
            if (!action) continue

            if (action.kind === 'pause') {
                await sleep(action.delayMs)
                if (terminalActionRunId !== runId) return
                continue
            }

            if (!action.animated || action.text.length <= 1) {
                if (!canWriteToTerminal()) {
                    pendingTerminalActions.unshift(action)
                    return
                }
                writeTerminalData(action.text)
                continue
            }

            for (let index = 0; index < action.text.length; index++) {
                if (!canWriteToTerminal()) {
                    const remainingText = action.text.slice(index)
                    if (remainingText) {
                        pendingTerminalActions.unshift({
                            ...action,
                            text: remainingText,
                        })
                    }
                    return
                }

                writeTerminalData(action.text[index]!)

                if (index < action.text.length - 1) {
                    await sleep(getRandomDelay(TYPING_DELAY_MIN_MS, TYPING_DELAY_MAX_MS))
                    if (terminalActionRunId !== runId) return
                }
            }
        }
    })()

    terminalActionRunner = runner
    await runner.finally(() => {
        if (terminalActionRunner === runner) {
            terminalActionRunner = null
        }
    })

    if (pendingTerminalActions.length > 0 && canWriteToTerminal()) {
        void flushPendingTerminalInputs()
    }
}

const replayClickableCodeAutomation = (fromExclusive: number, toInclusive: number) => {
    if (!terminal || renderContext.value !== 'slide' || toInclusive <= fromExclusive) return

    const targets = getClickableCodeAutomationTargets(getAutomationScopeRoot(), getAutomationSessionId())
    if (targets.length === 0) return

    for (let step = fromExclusive + 1; step <= toInclusive; step++) {
        for (const target of targets) {
            const action = getClickableCodeStepAction(target, step)
            if (action === 'type') {
                queueTerminalInput(target.command, true)
            } else if (action === 'enter') {
                queueTerminalPause(getRandomDelay(ENTER_DELAY_MIN_MS, ENTER_DELAY_MAX_MS))
                queueTerminalInput('\r')
            }
        }
    }
}

const handleCodeClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  // Only trigger if nested inside or is an element with class 'clickable-code'
  const clickableElement = target.closest('.clickable-code') as HTMLElement | null
  
  if (clickableElement) {
    // Don't execute if it's inside the terminal itself
    if (terminalContainer.value?.contains(clickableElement)) return

    const code = getClickableCodeCommand(clickableElement).trim()
    if (code && terminal) {
      queueTerminalInput(code, true)
      queueTerminalPause(getRandomDelay(ENTER_DELAY_MIN_MS, ENTER_DELAY_MAX_MS))
      queueTerminalInput('\r')
      terminal.focus()
    }
  }
}

const initTerminal = async () => {
    if (!terminalContainer.value) return
    const runId = ++initRunId
    logEvent('component.init.start', {
        renderContext: renderContext.value,
        wsUrl: props.wsUrl,
        backendUrl: props.backendUrl,
        sessionId: props.sessionId,
        releaseKey: props.releaseKey,
    })

    // Initialize Terminal
    terminal = new Terminal({
        cursorBlink: true,
        cursorStyle: 'block',
        cursorInactiveStyle: 'outline', // hollow block when not focused
        macOptionIsMeta: true,
        scrollback: 10000,
        tabStopWidth: 10,
        allowProposedApi: true,
        fontSize: props.fontSize ?? 15,
        fontFamily: getResolvedFontFamily(),
    })

    // Initialize Addons
    fitAddon = new FitAddon()
    terminal.loadAddon(fitAddon)
    terminal.loadAddon(new WebLinksAddon())

    terminal.open(terminalContainer.value)

    // Renderer cascade: WebGL → DOM (xterm v6 removed the canvas renderer).
    // WebGL fixes Nerd Font glyph clipping (xterm.js issue #3807) and is fastest on real GPU.
    // We detect software rendering (SwiftShader/Mesa) and skip it — software WebGL is slower
    // than xterm's built-in DOM renderer.
    const isSoftwareWebGL = (): boolean => {
        try {
            const probe = document.createElement('canvas')
            const gl = probe.getContext('webgl2') ?? probe.getContext('webgl')
            const ext = gl?.getExtension('WEBGL_debug_renderer_info')
            const renderer = ext ? gl!.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string : ''
            return /swiftshader|software|llvmpipe|mesa offscreen/i.test(renderer)
        } catch { return false }
    }

    if (!isSoftwareWebGL()) {
        try {
            const webgl = new WebglAddon()
            webgl.onContextLoss(() => {
                debugLog('WebGL context lost, falling back to DOM renderer')
                webgl.dispose()
                rendererAddon = null
            })
            terminal.loadAddon(webgl)
            rendererAddon = webgl
            debugLog('Using WebGL renderer')
        } catch {
            debugLog('WebGL unavailable, using DOM renderer')
        }
    } else {
        debugLog('Software WebGL detected, using DOM renderer')
    }

    safeFit('initial')
    syncCursorVisualState()

    // Load Nerd Font then invalidate xterm's glyph atlas so the canvas/WebGL renderer
    // redraws with the correct glyphs instead of the fallback font's cached bitmaps.
    document.fonts.ready.then(() => {
        if (runId !== initRunId || !terminal) return
        terminal.clearTextureAtlas?.()
        safeFit('fonts-ready')
    })

    // Track focus state for our border/hint overlay via the underlying textarea DOM element
    // (xterm handles the cursor appearance natively via cursorInactiveStyle)
    const ta = terminal.textarea
    if (ta) {
        textareaFocusHandler = () => {
            if (suppressFocusSideEffects) return
            isFocused.value = true
            isControlledElsewhere.value = false
            sessionController?.setFocused(true)
            sessionController?.setControlOwner(instanceId)
            debugLog('Terminal textarea focus')
            if (terminal && !THUMBNAIL_CONTEXTS.has(renderContext.value)) {
                sessionController?.requestResize(terminal.cols, terminal.rows, 'terminal-focus', true)
            }
            syncCursorVisualState()
        }
        textareaBlurHandler = () => {
            if (suppressFocusSideEffects) return
            isFocused.value = false
            sessionController?.setFocused(false)
            sessionController?.setControlOwner(null)
            debugLog('Terminal textarea blur')
            syncCursorVisualState()
        }
        ta.addEventListener('focus', textareaFocusHandler)
        ta.addEventListener('blur', textareaBlurHandler)
    }

    // Set up global key handler: activation key focuses the terminal, and
    // release key can reclaim focus when another tab currently owns the session.
    if (props.activationKey || props.releaseKey) {
        const key = props.activationKey?.toLowerCase()
        const releaseKey = props.releaseKey.toLowerCase()
        activationKeyHandler = (e: KeyboardEvent) => {
            if (e.repeat) return
            if (isTypingInEditable(document.activeElement)) return
            const pressedKey = e.key.toLowerCase()
            if (key && pressedKey === key) {
                e.preventDefault()
                terminal?.focus()
                return
            }
            if (!isFocused.value && isControlledElsewhere.value && pressedKey === releaseKey) {
                e.preventDefault()
                terminal?.focus()
            }
        }
        document.addEventListener('keydown', activationKeyHandler)
    }

    // Intercept the release key so the presenter can return keyboard control to Slidev
    terminal.attachCustomKeyEventHandler((e: KeyboardEvent) => {
        if (e.type === 'keydown' && e.key === props.releaseKey) {
            terminal?.blur()
            return false
        }
        return true
    })

    // Fix xterm.js 6.0 HiDPI mouse coordinate bug
    MOUSE_EVENT_TYPES.forEach(t => terminalContainer.value!.addEventListener(t, handleCapturedMouseEvent, { capture: true }))

    // Handle resizing — both window resize and container resize (e.g. slide layout changes)
    window.addEventListener('resize', handleResize)
    resizeObserver = new ResizeObserver(() => { safeFit('resize-observer') })
    resizeObserver.observe(terminalContainer.value)

    // Add global click listener for 'click to execute' feature
    document.addEventListener('click', handleCodeClick)

    let connectionUrl: string | null = props.wsUrl ?? null
    let connectionSource: TerminalSessionSource | 'direct' = props.wsUrl ? 'direct' : 'created'

    if (props.wsUrl && props.backendUrl) {
        console.warn('WebTerminal received both wsUrl and backendUrl; wsUrl takes precedence and managed session sharing is disabled.')
        logEvent('session.mode.warning', {
            wsUrl: props.wsUrl,
            backendUrl: props.backendUrl,
        })
    }

    if (!connectionUrl && props.backendUrl) {
        sessionController = createTerminalSessionController({
            backendUrl: props.backendUrl,
            sessionId: props.sessionId ?? props.backendUrl,
            debug: isDebugEnabled(),
            getInitialSize: () => terminal ? { cols: terminal.cols, rows: terminal.rows } : null,
            logger: (event, details) => logEvent(event, details),
        })
        controlOwnerCleanup?.()
        controlOwnerCleanup = sessionController.onControlOwnerChange((ownerId) => {
            isControlledElsewhere.value = !!ownerId && ownerId !== instanceId
            syncCursorVisualState()
        })
        isControlledElsewhere.value = (() => {
            const ownerId = sessionController?.getControlOwner()
            return !!ownerId && ownerId !== instanceId
        })()
        syncCursorVisualState()

        const resolved = await sessionController.resolveConnection()
        if (runId !== initRunId) return
        if (resolved) {
            connectionUrl = resolved.url
            connectionSource = resolved.source
        } else {
            terminal.write('\r\nFailed to create terminal session.\r\n')
        }
    }

    // Connect to WebSocket
    if (connectionUrl) {
       connectWebSocket(connectionUrl, connectionSource)
    } else {
       terminal.write('\r\nNo WebSocket URL or Backend URL provided.\r\n')
    }
}

const connectWebSocket = (url: string, source: TerminalSessionSource | 'direct') => {
    attachAddon?.dispose()
    attachAddon = null

    const webSocket = new WebSocket(url)
    socket = webSocket
    logEvent('socket.connecting', { url, source })

    webSocket.onopen = () => {
        if (socket !== webSocket) return
        logEvent('socket.open', { url, source })
        if (terminal) {
            attachAddon = new AttachAddon(webSocket)
            terminal.loadAddon(attachAddon)
            flushPendingTerminalInputs()
            safeFit('socket-open')
            syncCursorVisualState()
        }
    }

    webSocket.onclose = async (event) => {
        const isActiveSocket = socket === webSocket
        if (isActiveSocket) socket = null
        logEvent('socket.close', {
            url,
            source,
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean,
        })

        if (sessionController && isActiveSocket) {
            const recovery = await sessionController.handleSocketClose(event, url)
            if (recovery) {
                connectWebSocket(recovery.retryUrl, 'recovered')
                return
            }
        }

        if (terminal && isActiveSocket) {
            terminal.write('\r\nConnection closed.\r\n')
        }
    }
    
    webSocket.onerror = (err) => {
        if (socket !== webSocket) return
        console.error("WebSocket error:", err)
        logEvent('socket.error', { url, source })
        if (terminal) {
            terminal.write('\r\nWebSocket error.\r\n')
        }
    }
}

const focusTerminal = () => terminal?.focus()


const handleResize = () => {
    safeFit('window-resize')
}

const dispose = () => {
    initRunId++
    cursorEnsured = false
    logEvent('component.dispose.start')
    isFocused.value = false
    isControlledElsewhere.value = false
    sessionController?.setFocused(false)
    if (sessionController?.getControlOwner() === instanceId) {
        sessionController.setControlOwner(null)
    }
    MOUSE_EVENT_TYPES.forEach(t => terminalContainer.value?.removeEventListener(t, handleCapturedMouseEvent, { capture: true }))
    window.removeEventListener('resize', handleResize)
    resizeObserver?.disconnect()
    resizeObserver = null
    document.removeEventListener('click', handleCodeClick)
    if (activationKeyHandler) {
        document.removeEventListener('keydown', activationKeyHandler)
        activationKeyHandler = null
        debugLog('Activation key handler removed')
    }
    controlOwnerCleanup?.()
    controlOwnerCleanup = null
    if (socket) {
        debugLog('Closing WebSocket', { readyState: socket.readyState })
        socket.close()
        socket = null
    }
    attachAddon?.dispose()
    attachAddon = null
    rendererAddon?.dispose()
    rendererAddon = null
    const ta = terminal?.textarea
    if (ta && textareaFocusHandler) ta.removeEventListener('focus', textareaFocusHandler)
    if (ta && textareaBlurHandler) ta.removeEventListener('blur', textareaBlurHandler)
    textareaFocusHandler = null
    textareaBlurHandler = null
    if (sessionController) {
        sessionController.dispose()
        sessionController = null
    }
    if (terminal) {
        debugLog('Disposing xterm instance')
        terminal.dispose()
        terminal = null
    }
    terminalActionRunId++
    terminalActionRunner = null
    pendingTerminalActions.length = 0
    previousSlideClick = slideClicks.value
    logEvent('component.dispose.complete')
}

defineExpose({ focus: focusTerminal, blur: () => terminal?.blur() })

onMounted(() => {
    debugLog('Component mounted', { renderContext: renderContext.value })
    if (isPlaceholder) {
        debugLog('Thumbnail/overview context; skipping terminal init', { renderContext: renderContext.value })
        return
    }
    initTerminal()
})

onUnmounted(() => {
    debugLog('Component unmounted', { renderContext: renderContext.value })
    dispose()
})

watch(() => [props.wsUrl, props.backendUrl, props.sessionId], () => {
    logEvent('component.props.changed', { wsUrl: props.wsUrl, backendUrl: props.backendUrl, sessionId: props.sessionId })
    dispose()
    initTerminal()
})

watch(slideClicks, (currentClick) => {
    replayClickableCodeAutomation(previousSlideClick, currentClick)
    previousSlideClick = currentClick
})

</script>

<template>
  <div
    v-if="isPlaceholder"
    class="web-terminal-placeholder"
  >
    terminal
  </div>
  <div
    v-else
    class="web-terminal-wrapper"
    :class="{ 'is-focused': isFocused, 'is-controlled-elsewhere': isControlledElsewhere && !isFocused }"
    @click="focusTerminal"
  >
    <div
      ref="terminalContainer"
      class="web-terminal-container"
    />
    <div
      v-if="!isFocused && !isControlledElsewhere"
      class="focus-hint"
    >
      Click to interact
    </div>
    <div
      v-else-if="!isFocused && isControlledElsewhere"
      class="focus-hint takeover"
    >
      Press {{ releaseKey }} to take over
    </div>
    <div
      v-else
      class="focus-hint release"
    >
      {{ releaseKey }} to release
    </div>
  </div>
</template>

<style>
/* Nerd Font — loaded here (non-scoped) because @font-face breaks inside <style scoped>.
   JetBrainsMono NF covers powerline + devicons glyphs used by Starship and k9s.
   font-display:block prevents the browser measuring character widths with a fallback font
   before the real font arrives, which would corrupt xterm's col/row calculations. */
@font-face {
  font-family: 'JetBrainsMono Nerd Font Mono';
  src: url('https://cdn.jsdelivr.net/gh/ryanoasis/nerd-fonts@v3.4.0/patched-fonts/JetBrainsMono/Ligatures/Regular/JetBrainsMonoNerdFontMono-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: 'JetBrainsMono Nerd Font Mono';
  src: url('https://cdn.jsdelivr.net/gh/ryanoasis/nerd-fonts@v3.4.0/patched-fonts/JetBrainsMono/Ligatures/Bold/JetBrainsMonoNerdFontMono-Bold.ttf') format('truetype');
  font-weight: bold;
  font-style: normal;
  font-display: block;
}

/* Global styles for clickable code blocks */
.clickable-code, .clickable-code * {
  cursor: pointer;
}
.clickable-code {
  transition: opacity 0.2s;
}
.clickable-code:hover {
  opacity: 0.8;
}
.clickable-code:hover code {
  outline: 1px dashed #555;
  outline-offset: 2px;
}
</style>

<style scoped>
.web-terminal-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  padding: 1rem;
  background-color: #000;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.15);
  transition: box-shadow 0.2s;
}

.web-terminal-wrapper.is-focused {
  box-shadow: 0 0 0 2px #4ade80;
}

.web-terminal-wrapper.is-controlled-elsewhere {
  box-shadow: 0 0 0 2px #60a5fa;
}

@keyframes remote-cursor-blink {
  0%, 49% {
    opacity: 1;
  }
  50%, 100% {
    opacity: 0;
  }
}

.web-terminal-wrapper.is-controlled-elsewhere :deep(.xterm-rows .xterm-cursor.xterm-cursor-outline) {
  animation: remote-cursor-blink 1s step-end infinite;
  outline-color: #60a5fa !important;
}

.web-terminal-container {
  width: 100%;
  height: 100%;
  flex: 1;
  min-width: 0;
  min-height: 0;
}

.focus-hint {
  position: absolute;
  bottom: 6px;
  right: 10px;
  font-size: 0.65rem;
  font-family: monospace;
  color: rgba(255, 255, 255, 0.3);
  pointer-events: none;
  user-select: none;
  transition: color 0.2s;
}

.focus-hint.release {
  color: #4ade80aa;
}

.focus-hint.takeover {
  color: #60a5faaa;
}

.web-terminal-placeholder {
  width: 100%;
  height: 100%;
  background-color: #000;
  border-radius: 4px;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: monospace;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.3);
  user-select: none;
}
</style>
