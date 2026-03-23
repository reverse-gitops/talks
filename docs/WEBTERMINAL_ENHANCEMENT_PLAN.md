# Web Terminal Demo Controller Plan

## Summary

This plan replaces Slidev-driven terminal progression with a dedicated demo controller.

The core decision is simple:

- Slidev owns slide navigation.
- The terminal demo owns its own step progression.
- The clicker `next` and `previous` buttons keep doing normal Slidev navigation.
- The `.` key advances terminal demo steps.
- Terminal demo steps are forward-only in v1.
- By default, a `run` step types first and waits for a second `.` press to send Enter.
- Terminal demo progress is remembered, so going back to a slide does not re-run commands.
- Repeated `.` presses are ignored while a step is still executing.

This is intentionally optimized for live demos, presenter calm, and low hidden state.

## Problems To Solve

The current setup has four real problems:

1. Terminal scripting in slide markdown is tedious.
   Long commands, quoting, escaped newlines, and many `v-click` blocks make authoring ugly.

2. Backward navigation feels wrong.
   Because terminal progression is coupled to Slidev click state, going back means stepping through too many internal reveal states before actually leaving the slide.

3. Terminal demos need more than "type command and press Enter".
   A live demo often needs a keystroke step like `Ctrl+C` to stop `watch`.

4. Re-entry should be safe.
   When returning to a slide, previously executed demo steps should not fire again unless the presenter explicitly resets the demo.

## Design Goals

- Do not drive terminal behavior primarily through `v-click`.
- Do not keep a backward-compatibility layer for `v-click` terminal automation.
- Keep clicker `next` and `previous` dedicated to slides.
- Use `.` as the dedicated "advance demo" trigger.
- Keep the model explicit and deterministic.
- Make two-screen presenter sync part of the design, not an afterthought.
- Keep v1 simple: forward-only demo stepping is enough.

## Recommendation

Use a hybrid model:

- One Slidev slide per meaningful narrative state.
- One custom `DemoTerminal` component inside slides that contain terminal demos.
- One forward-only step controller per `sessionId + scriptFile`.

Do not use one slide per terminal microstate.
That makes authoring noisy and makes the deck harder to edit.

Do not keep using `v-click` for terminal progression.
That is the coupling that causes the current navigation pain.

Do not preserve the old terminal-automation API just to ease migration.
We can update the slides.

## Architecture

The architecture should separate three kinds of state.

### 1. Slide State

Owned by Slidev.

Responsibilities:

- current route / current slide
- normal next / previous navigation
- presenter view and main view staying in sync at the presentation level

Slide state must not know about terminal microsteps.

### 2. Demo Scene State

Owned by a new demo controller, keyed by `sessionId + scriptFile`.

Responsibilities:

- current demo step index
- total number of steps
- whether the controller is `idle`, `executing`, or `completed`
- whether a step has already been executed
- syncing this state between main window and presenter window

This is the state you want visible as `step 3/12`.

### 3. Terminal PTY State

Owned by the backend PTY session that already exists today.

Responsibilities:

- actual shell process
- command output
- long-running processes like `watch`
- shared PTY behavior between presenter and main window

This state should stay live and real.
The demo controller tells the terminal what to do next, but it does not try to replace the PTY.

## Opinionated Model Choice

Use explicit scripted steps applied to a live terminal session.

Do not use terminal snapshots as the primary model.

Why:

- You are running a real PTY, not a fake animation.
- `Ctrl+C` and similar actions need to affect the live process.
- Snapshot-based backward playback is attractive, but it becomes a second terminal system with its own drift and complexity.
- The real fix for backward navigation is separating slide state from demo step state, not reconstructing terminal history.

So the model should be:

- explicit demo steps
- forward execution against a live PTY
- remembered progress
- explicit reset when needed

Snapshots can still be useful later for terminal buffer restoration, but they should not be the main demo-control architecture.

## Script Authoring Model

The presentation should stop embedding terminal logic directly in slide markup.

Instead, define demo steps in an external file such as:

- `the-gitops-paradox/demo-scripts.yaml`

### Proposed YAML Shape

```yaml
steps:
  - run: kubectl get nodes

  - run: kubectl get quizsessions -A

  - run: |
      kubectl get quizsubmissions -A --watch

  - keys: ctrl+c
```

### V1 Step Kinds

Keep the first version small:

- `run`
  Types the command and, by default, waits for a second `.` press before sending Enter.
  This keeps the Enter moment separate for the presenter without requiring a second YAML step.
  Optional flag:
  - `waitForEnter: true` by default
  - `waitForEnter: false` means type and press Enter in one go

- `keys`
  Sends a terminal-safe keystroke sequence.
  Supported in v1:
  - `ctrl+c`
  - `ctrl+d`
  - `tab`
  - `escape`
  - `up`
  - `down`
  - `left`
  - `right`

That already solves your real use case and removes ugly inline command markup.

Most importantly, it preserves presenter pacing:

- one `.` to type the command
- one `.` to press Enter
- one later `.` to send `Ctrl+C`

Example with the optional flag:

```yaml
steps:
  - run: kubectl get nodes
    waitForEnter: true

  - run: kubectl apply -f demo.yaml
    waitForEnter: false

  - keys: ctrl+c
```

For v1, keep the file format intentionally flat:

- one file per terminal demo
- one ordered `steps:` list
- no explicit `sequenceId`
- no `label` field yet

For v1, the identity rule is simple:

- one demo state per `sessionId + scriptFile`

That means:

- reusing the same script file with the same `sessionId` intentionally shares progress
- using a different `sessionId` keeps progress separate even if the script file is the same

This is simple, predictable, and good enough for the first implementation.

## Migration Stance

This plan is intentionally not backward compatible with the old `v-click` terminal automation approach.

That means:

- no support for `v-click`-driven terminal playback in the new system
- no adapter layer that translates old clickable-code blocks into demo steps
- no long-term dual path where both systems stay alive

We will migrate the slides to the new `DemoTerminal` + `demo-scripts.yaml` model instead.

This is the right tradeoff here because:

- the old model is the source of the presenter-navigation problem
- a compatibility layer would add complexity right where we want clarity
- the slide content is under our control, so migration cost is acceptable
- a clean cut keeps the implementation smaller and easier to trust live

## DemoTerminal Component

Create a new wrapper component:

- `tools/slidev-addon-web-terminal/components/DemoTerminal.vue`

This component should wrap the existing `WebTerminal` and add demo-step behavior on top.

### Public API

```ts
interface DemoTerminalStep {
  id: string
  kind: 'run' | 'keys'
  run?: string
  waitForEnter?: boolean
  keys?: 'ctrl+c' | 'ctrl+d' | 'tab' | 'escape' | 'up' | 'down' | 'left' | 'right'
}
```

### Component Props

```ts
interface DemoTerminalProps {
  backendUrl?: string
  wsUrl?: string
  sessionId: string
  scriptFile: string
  advanceKey?: string // default '.'
  showStepHint?: boolean // default true
}
```

### Exposed Methods

Even though v1 is forward-only in practice, expose a clean API:

```ts
nextStep(): Promise<boolean>
prevStep(): Promise<boolean>
reset(): void
hasMoreSteps(): boolean
isExecuting(): boolean
getCurrentStepIndex(): number
getTotalSteps(): number
```

Recommended v1 behavior:

- `nextStep()` is fully implemented.
- `reset()` is fully implemented.
- `hasMoreSteps()` is fully implemented.
- `prevStep()` exists as API but returns `false` in v1.

That keeps the design extensible without overbuilding backward execution now.

## State Controller

Add a dedicated controller module:

- `tools/slidev-addon-web-terminal/utils/demoStepController.ts`

This should own demo progress for one terminal demo instance.

### Responsibilities

- load the script file
- keep current step index in memory
- record which steps have executed
- execute steps exactly once unless reset
- persist state across component unmount/remount
- sync step state across presenter and main window

### Suggested Interface

```ts
interface DemoStepState {
  stepIndex: number
  totalSteps: number
  status: 'idle' | 'executing' | 'completed'
  inFlightStepIndex: number | null
  waitingForEnterStepIndex: number | null
  lastUpdatedAt: number
}

interface DemoStepController {
  getState(): DemoStepState
  nextStep(): Promise<boolean>
  prevStep(): Promise<boolean>
  reset(): void
  hasMoreSteps(): boolean
  isExecuting(): boolean
  subscribe(listener: (state: DemoStepState) => void): () => void
  dispose(): void
}
```

Identity rule for v1:

- controller key: `sessionId + scriptFile`

Do not derive demo identity from slide route or component position.
Keep it explicit and simple.

### Execution Rule

The rule should be strict:

- Step `n` can only execute once.
- Returning to the slide must not re-execute completed steps.
- `reset()` clears the executed-step memory for this demo.
- a `run` step with `waitForEnter: true` is not complete until the Enter moment has happened.
- the type moment and Enter moment must be tracked distinctly inside the same `run` step.

`hasMoreSteps()` semantics for v1:

- return `true` if `waitingForEnterStepIndex != null`
- otherwise return `stepIndex < totalSteps`

This matters because a typed command that is still waiting for Enter is not finished yet.

### In-Flight Lock

This is required for live-demo resilience.

`nextStep()` should be guarded by a promise lock.

Rules:

- if status is `executing`, ignore further `.` presses
- only one step may run at a time
- status changes should be visible in the UI
- if a `run` step is waiting for Enter, the next `.` should send Enter for that same step instead of moving to a new step

Why this matters:

- clicker buttons can bounce
- typing animation takes time
- presenters sometimes press twice under stress

This is the difference between a nice design and a battle-ready demo tool.

This directly solves the "do not run a command a second time when navigating back" problem.

## Two-Screen Sync

This part is important.

You already have advanced shared-session behavior between presenter and main window.
The new demo controller should respect that and mirror the same philosophy:

- one shared PTY session per `sessionId`
- one shared demo-step state per demo instance
- one window executes the step
- both windows display the same current demo step

### Sync Rule

Use a lightweight bridge, similar to the existing PTY bridge, but keep it orthogonal to Slidev internals:

- Slidev syncs route and slide position
- the demo-step bridge syncs demo-step state
- the PTY bridge syncs terminal session ownership and connection state

Use:

- `BroadcastChannel` for cross-window browser sync
- in-memory registry per browser tab for remount persistence
- explicit `state-sync` messages carrying `stepIndex`, `status`, `inFlightStepIndex`, `waitingForEnterStepIndex`, `updatedAt`, and `originId`

### Important Safety Rule

Only the instance that handles the key press should execute the terminal action.
The other window should only mirror the resulting step state.

That prevents duplicate command execution.

In practice:

1. presenter or main window receives `.`
2. that instance claims local control for the step event
3. it executes the next terminal step
4. it broadcasts the updated step state
5. the other window updates its hint UI but does not re-run the step

### Render Context Rule

Do not attach demo-key listeners in Slidev thumbnail or preview contexts.
Only active slide contexts should participate.

This matches the existing terminal behavior and avoids accidental duplicate listeners.

## Key Handling Strategy

### V1 Key Policy

Keep it simple:

- Slide navigation keys remain Slidev's job.
- `.` advances the terminal demo.
- Do not bind the F5-like button in v1.

The F5-like button is interesting, but it is less predictable across browsers and environments.
For now, `.` is the dedicated safe demo key.

### Rules For `.` Handling

Intercept `.` only when all of these are true:

- the active slide contains a `DemoTerminal`
- the terminal demo has remaining steps
- the user is not typing into an input or editable element
- the current render context is a real slide window, not preview/overview

When those conditions are met:

- call `preventDefault()`
- call `nextStep()`

Otherwise:

- do nothing

This keeps the behavior predictable.

### Optional Future Key Policy

Later, if useful:

- `F5-like button` -> alternate action
- `Shift + .` -> fast-forward
- `,` -> `prevStep()` if backward step support is ever implemented

But that is explicitly not required for v1.

## Visual Presenter Hint

Add a small grey hint in the lower-right area of the terminal component.

Recommended content:

- idle: `Demo 3/12`
- busy: `Demo 3/12 - busy...`
- waiting for Enter: `Demo 3/12 - press . to run`
- complete: `Demo 12/12 - done`
- after reset: `Demo 0/12`

This should be subtle but always visible.

This is not cosmetic.
It is part of the recovery story and reduces hidden state.

Recommended v1 hint contents:

- progress count
- current controller status
- optional small done marker when the last step finishes

Do not add labels yet.
They can come later if they still feel useful once the core flow is working.

## Slide Usage Pattern

Slides should become simple again.

### Example Slide

```vue
<DemoTerminal
  backendUrl="http://host.docker.internal:10001"
  sessionId="reverse-gitops-demo-terminal"
  scriptFile="./demo-scripts.yaml"
/>
```

No `v-click` blocks are needed for the terminal steps.

If you want explanatory bullets on the slide, they can still use normal Slidev features.
But the terminal progression itself should not depend on `v-click`.

## Example Implementation Pattern

### `DemoTerminal.vue`

```vue
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import WebTerminal from './WebTerminal.vue'
import { createDemoStepController } from '../utils/demoStepController'

const props = withDefaults(defineProps<{
  backendUrl?: string
  wsUrl?: string
  sessionId: string
  scriptFile: string
  advanceKey?: string
  showStepHint?: boolean
}>(), {
  advanceKey: '.',
  showStepHint: true,
})

const state = ref({
  stepIndex: 0,
  totalSteps: 0,
  status: 'idle',
  inFlightStepIndex: null,
  waitingForEnterStepIndex: null,
})

const controller = createDemoStepController({
  sessionId: props.sessionId,
  scriptFile: props.scriptFile,
})

const hint = computed(() => {
  if (!props.showStepHint) return ''
  if (state.value.totalSteps === 0) return 'Demo 0/0'
  if (state.value.status === 'completed') return `Demo ${state.value.totalSteps}/${state.value.totalSteps} - done`
  if (state.value.waitingForEnterStepIndex != null) {
    const current = Math.min(state.value.waitingForEnterStepIndex + 1, state.value.totalSteps)
    return `Demo ${current}/${state.value.totalSteps} - press . to run`
  }
  if (state.value.status === 'executing') {
    const current = Math.min((state.value.inFlightStepIndex ?? state.value.stepIndex) + 1, state.value.totalSteps)
    return `Demo ${current}/${state.value.totalSteps} - busy...`
  }
  const next = Math.min(state.value.stepIndex + 1, state.value.totalSteps)
  return `Demo ${next}/${state.value.totalSteps}`
})

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key !== props.advanceKey) return
  if (event.repeat) return
  if (isTypingInEditable(document.activeElement)) return
  if (controller.isExecuting()) return
  if (!controller.hasMoreSteps()) return

  event.preventDefault()
  void controller.nextStep()
}

let unsubscribe: (() => void) | null = null

onMounted(() => {
  unsubscribe = controller.subscribe((nextState) => {
    state.value = nextState
  })
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  unsubscribe?.()
  document.removeEventListener('keydown', handleKeydown)
  controller.dispose()
})

defineExpose({
  nextStep: () => controller.nextStep(),
  prevStep: () => controller.prevStep(),
  reset: () => controller.reset(),
  hasMoreSteps: () => controller.hasMoreSteps(),
})
</script>

<template>
  <div class="demo-terminal-wrapper">
    <WebTerminal
      :backend-url="backendUrl"
      :ws-url="wsUrl"
      :session-id="sessionId"
    />
    <div v-if="showStepHint" class="demo-step-hint">
      {{ hint }}
    </div>
  </div>
</template>
```

`isTypingInEditable()` should stay a small UI helper near the component or in a shared DOM utility.
It does not need to be part of the demo-step controller API.

### `demoStepController.ts`

```ts
export async function executeDemoStep(step: DemoTerminalStep, terminal: TerminalDriver) {
  if (step.kind === 'run' && step.run) {
    await terminal.type(step.run)
    return
  }

  if (step.kind === 'keys' && step.keys) {
    await terminal.sendKeys(step.keys)
  }
}
```

```ts
let inFlight: Promise<boolean> | null = null

async function nextStep(): Promise<boolean> {
  if (state.status === 'executing') return false
  if (!hasMoreSteps()) return false

  if (state.waitingForEnterStepIndex != null) {
    state.status = 'executing'
    state.inFlightStepIndex = state.waitingForEnterStepIndex
    notify()

    inFlight = (async () => {
      try {
        await terminal.enter()
        state.stepIndex += 1
        state.waitingForEnterStepIndex = null
        state.status = state.stepIndex >= state.totalSteps ? 'completed' : 'idle'
        state.inFlightStepIndex = null
        notify()
        return true
      } finally {
        inFlight = null
      }
    })()

    return inFlight
  }

  const stepToRun = state.stepIndex
  state.status = 'executing'
  state.inFlightStepIndex = stepToRun
  notify()

  inFlight = (async () => {
    try {
      await executeDemoStep(steps[stepToRun]!, terminal)
      const step = steps[stepToRun]!
      if (step.kind === 'run' && step.waitForEnter !== false) {
        state.waitingForEnterStepIndex = stepToRun
        state.status = 'idle'
      } else {
        state.stepIndex += 1
        state.status = state.stepIndex >= state.totalSteps ? 'completed' : 'idle'
      }
      state.inFlightStepIndex = null
      notify()
      return true
    } catch (error) {
      state.status = 'idle'
      state.inFlightStepIndex = null
      notify()
      throw error
    } finally {
      inFlight = null
    }
  })()

  return inFlight
}
```

### Key Listener Cleanup Rule

Always attach listeners in `onMounted()` and remove them in `onUnmounted()`.

Never leave global listeners attached after slide unmount.

This matters because Slidev remounts components frequently during navigation and presenter mode.

## Recovery And Resilience

This design should be explicitly recovery-friendly.

### Recovery Rules

- Missing a `.` press should not corrupt slide navigation.
- Going back to a slide should not replay old steps.
- The presenter should always see where they are in the sequence.
- Reset should be one obvious action.

### ADHD-Friendly Rules

- one button for slide movement
- one button for demo movement
- always-visible progress indicator
- no hidden microstates inside Slidev navigation
- no surprise replays when revisiting a slide

That is the calmest mental model:

- `next/previous` move slides
- `.` advances terminal demo

Everything else is secondary.

## What We Are Not Doing

To keep implementation clean, v1 should not include:

- terminal demo progression via `v-click`
- any backward-compatibility layer for old clickable-code / `v-click` terminal flows
- backward execution of demo steps
- general browser keyboard-event replay
- complicated autoplay logic
- one slide per terminal microstep

## Concrete Implementation Plan

### Phase 1: Foundations

1. Create `demo-scripts.yaml` support.
2. Add a script loader that reads steps from the script file.
3. Add `DemoTerminal.vue` as a wrapper around `WebTerminal.vue`.
4. Add `demoStepController.ts` with forward-only remembered progress and an in-flight execution lock.
5. Add `.` key handling.
6. Add the lower-right step hint, including `busy...`, `press . to run`, and `done` states.
7. Migrate existing demo slides away from terminal `v-click` blocks.

### Phase 2: Shared State And Safety

1. Add a cross-window demo-step bridge keyed by `sessionId + scriptFile`.
2. Mirror step state between presenter and main window.
3. Ensure only the origin instance executes terminal steps.
4. Persist state across component remounts on slide navigation.
5. Add tests around duplicate suppression, waiting-for-Enter state, and cross-window sync.

## For Later

- add reset UI
- add `runToEnd()`
- add alternate clicker-key actions such as F5-like mapping
- revisit whether backward step support is worth adding

## Suggested File Changes

### New

- `tools/slidev-addon-web-terminal/components/DemoTerminal.vue`
- `tools/slidev-addon-web-terminal/utils/demoStepController.ts`
- `tools/slidev-addon-web-terminal/utils/demoScriptLoader.ts`
- `tools/slidev-addon-web-terminal/utils/demoStepBridge.ts`
- `the-gitops-paradox/demo-scripts.yaml`

### Modify

- `tools/slidev-addon-web-terminal/components/WebTerminal.vue`
  Add a minimal terminal driver interface that `DemoTerminal` can call for typing, Enter, and key sequences.

- `tools/slidev-addon-web-terminal/utils/clickableCodeAutomation.ts`
  Remove old `v-click` terminal automation support rather than carrying it forward.

- `tools/slidev-addon-web-terminal/utils/terminalSessionController.ts`
  Reuse the existing session-sharing model and ensure the new demo-step controller works with the same `sessionId` assumptions.

- `tools/slidev-addon-web-terminal/README.md`
  Document the new `DemoTerminal` workflow as the replacement for `v-click` terminal progression.

## Testing Plan

At minimum, cover:

- `.` advances exactly one step
- repeated `.` presses during typing are ignored
- a `run` step waits for a second `.` by default before sending Enter
- `hasMoreSteps()` stays true while waiting for Enter
- revisiting a slide does not re-run completed steps
- `Ctrl+C` step sends the correct control sequence
- sync includes waiting-for-Enter state across presenter and main window
- presenter and main window show the same step index
- only one window executes the step
- reset clears remembered progress

## Success Criteria

This work is successful when all of these are true:

- authoring a demo sequence no longer requires many `v-click` blocks
- old terminal `v-click` automation support has been removed
- multiline commands live in a readable external script file
- slide `next` and `previous` behave like normal slides again
- `.` advances terminal steps independently of Slidev click state
- `run` is simple to author, and Enter remains a separate presenter moment by default
- `Ctrl+C` can be declared as a normal demo step
- returning to a slide does not re-run completed terminal actions
- demo progress is keyed simply by `sessionId + scriptFile`
- presenter and main window stay aligned on demo progress
- the presenter can always see where they are in the sequence

## Final Recommendation

Build `DemoTerminal` as a dedicated scripted live-demo component.

Keep Slidev focused on slides.
Keep the PTY focused on being a real terminal.
Put demo progression in the middle as its own explicit controller.

That gives you the cleanest authoring model, the safest live-demo behavior, and the lowest-stress clicker workflow.
