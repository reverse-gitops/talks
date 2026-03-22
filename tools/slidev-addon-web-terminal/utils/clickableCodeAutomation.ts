export type TerminalStepAction = 'type' | 'enter'

export interface ClickableCodeAutomationTarget {
  command: string
  element: HTMLElement
  enterStep: number | null
  order: number
  startStep: number
}

type SortableClickableCodeAutomationTarget = ClickableCodeAutomationTarget & {
  sourceIndex: number
}

const CLICKABLE_CODE_SELECTOR = '.clickable-code'

const parseDatasetNumber = (value: string | undefined): number | null => {
  if (!value) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export const getClickableCodeCommand = (element: HTMLElement) =>
  element.dataset.terminalCommand
  ?? element.getAttribute('data-terminal-command')
  ?? element.innerText.trim()

const getTargetSessionId = (element: HTMLElement): string | null =>
  element.dataset.terminalSession
  ?? element.dataset.sessionId
  ?? element.getAttribute('data-terminal-session')
  ?? element.getAttribute('data-session-id')

export const matchesTerminalSession = (element: HTMLElement, sessionId: string | null) => {
  const targetSessionId = getTargetSessionId(element)
  return !targetSessionId || !sessionId || targetSessionId === sessionId
}

export const getClickableCodeAutomationTargets = (
  root: ParentNode,
  sessionId: string | null,
): ClickableCodeAutomationTarget[] =>
  Array.from(root.querySelectorAll<HTMLElement>(CLICKABLE_CODE_SELECTOR))
    .filter(element => matchesTerminalSession(element, sessionId))
    .map((element, sourceIndex) => {
      const command = getClickableCodeCommand(element).trim()
      const startStep = parseDatasetNumber(element.dataset.slidevClicksStart)
      const endStep = parseDatasetNumber(element.dataset.slidevClicksEnd)
      const order = parseDatasetNumber(element.dataset.terminalOrder) ?? 0

      if (!command || startStep == null) return null

      return {
        command,
        element,
        startStep,
        order,
        enterStep: endStep != null && endStep > startStep ? endStep : null,
        sourceIndex,
      } satisfies SortableClickableCodeAutomationTarget
    })
    .filter((target): target is SortableClickableCodeAutomationTarget => !!target)
    .sort((a, b) =>
      a.startStep - b.startStep
      || a.order - b.order
      || a.sourceIndex - b.sourceIndex,
    )

export const getClickableCodeStepAction = (
  target: ClickableCodeAutomationTarget,
  step: number,
): TerminalStepAction | null => {
  if (step === target.startStep) return 'type'
  if (target.enterStep != null && step === target.enterStep) return 'enter'
  return null
}
