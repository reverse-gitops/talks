import { describe, it, expect } from 'vitest'
import {
  getClickableCodeAutomationTargets,
  getClickableCodeStepAction,
  matchesTerminalSession,
} from '../utils/clickableCodeAutomation'

const createRoot = (elements: HTMLElement[]) => ({
  querySelectorAll: () => elements,
}) as ParentNode

const createClickableCode = ({
  command = 'kubectl get pods -A',
  displayText,
  order,
  sessionId,
  start,
  end,
}: {
  command?: string
  displayText?: string
  end?: number
  order?: number
  sessionId?: string
  start?: number
}) => {
  const attributes = new Map<string, string>()
  const dataset: Record<string, string> = {}

  if (sessionId) {
    attributes.set('data-terminal-session', sessionId)
    dataset.terminalSession = sessionId
  }
  if (start != null)
    dataset.slidevClicksStart = String(start)
  if (end != null)
    dataset.slidevClicksEnd = String(end)
  if (order != null)
    dataset.terminalOrder = String(order)
  if (displayText != null) {
    attributes.set('data-terminal-command', command)
    dataset.terminalCommand = command
  }

  return {
    className: 'clickable-code',
    dataset,
    innerText: displayText ?? command,
    getAttribute: (name: string) => attributes.get(name) ?? null,
  } as HTMLElement
}

describe('clickableCodeAutomation', () => {
  it('collects clickable-code targets with Slidev click metadata', () => {
    const root = createRoot([
      createClickableCode({ command: 'echo hello', start: 1, end: 2 }),
      createClickableCode({ command: 'ignored', sessionId: 'other-terminal', start: 3, end: 4 }),
    ])

    const targets = getClickableCodeAutomationTargets(root, 'demo-terminal')

    expect(targets).toHaveLength(1)
    expect(targets[0]).toMatchObject({
      command: 'echo hello',
      startStep: 1,
      enterStep: 2,
    })
  })

  it('treats plain v-click metadata as type-only automation', () => {
    const root = createRoot([createClickableCode({ start: 5 })])

    const targets = getClickableCodeAutomationTargets(root, null)

    expect(targets).toHaveLength(1)
    expect(targets[0]?.enterStep).toBeNull()
    expect(getClickableCodeStepAction(targets[0]!, 5)).toBe('type')
    expect(getClickableCodeStepAction(targets[0]!, 6)).toBeNull()
  })

  it('uses the range end as the enter step for two-step command playback', () => {
    const root = createRoot([createClickableCode({ start: 2, end: 3 })])

    const [target] = getClickableCodeAutomationTargets(root, null)

    expect(getClickableCodeStepAction(target, 2)).toBe('type')
    expect(getClickableCodeStepAction(target, 3)).toBe('enter')
    expect(getClickableCodeStepAction(target, 4)).toBeNull()
  })

  it('allows targets without a terminal session when only one terminal is present', () => {
    const element = createClickableCode({ start: 1, end: 2 })

    expect(matchesTerminalSession(element, 'demo-terminal')).toBe(true)
    expect(matchesTerminalSession(element, null)).toBe(true)
  })

  it('supports hidden commands via data-terminal-command and sorts by explicit order', () => {
    const root = createRoot([
      createClickableCode({ command: 'echo second', displayText: '', order: 2, start: 1 }),
      createClickableCode({ command: 'echo first', displayText: '', order: 1, start: 1 }),
    ])

    const targets = getClickableCodeAutomationTargets(root, null)

    expect(targets.map(target => target.command)).toEqual(['echo first', 'echo second'])
    expect(targets.map(target => target.order)).toEqual([1, 2])
  })
})
