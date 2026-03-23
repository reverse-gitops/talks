export type DemoTerminalKeys =
  | 'ctrl+c'
  | 'ctrl+d'
  | 'tab'
  | 'escape'
  | 'up'
  | 'down'
  | 'left'
  | 'right'

export interface DemoTerminalStep {
  id: string
  kind: 'run' | 'keys'
  run?: string
  waitForEnter?: boolean
  keys?: DemoTerminalKeys
}

interface ParsedStepConfig {
  keys?: string
  run?: string
  waitForEnter?: boolean
}

const SUPPORTED_KEYS = new Set<DemoTerminalKeys>([
  'ctrl+c',
  'ctrl+d',
  'tab',
  'escape',
  'up',
  'down',
  'left',
  'right',
])

const scriptCache = new Map<string, Promise<DemoTerminalStep[]>>()

const countIndent = (line: string) => line.match(/^ */)?.[0].length ?? 0

const isIgnorableLine = (line: string) => {
  const trimmed = line.trim()
  return trimmed.length === 0 || trimmed.startsWith('#')
}

const unquoteScalar = (value: string) => {
  if (value.startsWith('"') && value.endsWith('"')) {
    return JSON.parse(value) as string
  }

  if (value.startsWith('\'') && value.endsWith('\'')) {
    return value.slice(1, -1).replace(/''/g, '\'')
  }

  return value
}

const parseBoolean = (value: string, lineNumber: number) => {
  if (value === 'true') return true
  if (value === 'false') return false
  throw new Error(`Invalid boolean at line ${lineNumber}: ${value}`)
}

const parseBlockScalar = (lines: string[], startIndex: number, blockIndent: number) => {
  const content: string[] = []
  let index = startIndex

  while (index < lines.length) {
    const line = lines[index]!
    if (line.trim().length === 0) {
      content.push('')
      index += 1
      continue
    }

    const indent = countIndent(line)
    if (indent < blockIndent)
      break

    content.push(line.slice(blockIndent))
    index += 1
  }

  return {
    nextIndex: index,
    value: content.join('\n').replace(/\n$/, ''),
  }
}

const parseStepConfig = (stepLines: string[], startLineNumber: number): ParsedStepConfig => {
  const config: ParsedStepConfig = {}
  let index = 0

  while (index < stepLines.length) {
    const line = stepLines[index]!
    if (isIgnorableLine(line)) {
      index += 1
      continue
    }

    const propertyMatch = /^([A-Za-z][A-Za-z0-9]*):(?:\s*(.*))?$/.exec(line)
    if (!propertyMatch) {
      throw new Error(`Invalid step property at line ${startLineNumber + index}: ${line}`)
    }

    const [, key, rawValue = ''] = propertyMatch

    if (rawValue === '|' || rawValue === '|-' || rawValue === '|+') {
      const { nextIndex, value } = parseBlockScalar(stepLines, index + 1, 2)
      if (key !== 'run') {
        throw new Error(`Block scalars are only supported for run steps (line ${startLineNumber + index})`)
      }
      config.run = value
      index = nextIndex
      continue
    }

    const value = unquoteScalar(rawValue.trim())
    if (key === 'run') {
      config.run = value
    } else if (key === 'keys') {
      config.keys = value
    } else if (key === 'waitForEnter') {
      config.waitForEnter = parseBoolean(value, startLineNumber + index)
    } else {
      throw new Error(`Unsupported step property "${key}" at line ${startLineNumber + index}`)
    }

    index += 1
  }

  return config
}

export const parseDemoScript = (source: string): DemoTerminalStep[] => {
  const lines = source.replace(/\r\n?/g, '\n').split('\n')
  let index = 0

  while (index < lines.length && isIgnorableLine(lines[index]!))
    index += 1

  if (lines[index]?.trim() !== 'steps:') {
    throw new Error('Demo script must start with a top-level "steps:" key')
  }

  index += 1

  const steps: DemoTerminalStep[] = []
  while (index < lines.length) {
    const line = lines[index]!
    if (isIgnorableLine(line)) {
      index += 1
      continue
    }

    const stepMatch = /^(\s*)-\s*(.*)$/.exec(line)
    if (!stepMatch) {
      throw new Error(`Expected a list item at line ${index + 1}: ${line}`)
    }

    const baseIndent = stepMatch[1]?.length ?? 0
    const stepLines = [stepMatch[2] ?? '']
    index += 1

    while (index < lines.length) {
      const nextLine = lines[index]!
      if (isIgnorableLine(nextLine)) {
        stepLines.push(nextLine.trim().length === 0 ? '' : nextLine.slice(Math.min(nextLine.length, baseIndent + 2)))
        index += 1
        continue
      }

      const nextIndent = countIndent(nextLine)
      if (nextIndent <= baseIndent && nextLine.trimStart().startsWith('- '))
        break

      if (nextIndent < baseIndent + 2) {
        throw new Error(`Step properties must be indented at line ${index + 1}: ${nextLine}`)
      }

      stepLines.push(nextLine.slice(baseIndent + 2))
      index += 1
    }

    const parsedStep = parseStepConfig(stepLines, index - stepLines.length + 1)

    if (!!parsedStep.run === !!parsedStep.keys) {
      throw new Error(`Each step must define exactly one of "run" or "keys" (step ${steps.length + 1})`)
    }

    if (parsedStep.run != null) {
      steps.push({
        id: `step-${steps.length + 1}-run`,
        kind: 'run',
        run: parsedStep.run,
        waitForEnter: parsedStep.waitForEnter !== false,
      })
      continue
    }

    if (!SUPPORTED_KEYS.has(parsedStep.keys as DemoTerminalKeys)) {
      throw new Error(`Unsupported key sequence "${parsedStep.keys}" in step ${steps.length + 1}`)
    }

    steps.push({
      id: `step-${steps.length + 1}-keys`,
      kind: 'keys',
      keys: parsedStep.keys as DemoTerminalKeys,
    })
  }

  return steps
}

export const loadDemoScript = (scriptFile: string): Promise<DemoTerminalStep[]> => {
  let pending = scriptCache.get(scriptFile)
  if (!pending) {
    pending = (async () => {
      const response = await fetch(scriptFile)
      if (!response.ok) {
        throw new Error(`Failed to load demo script "${scriptFile}" (${response.status})`)
      }

      const source = await response.text()
      return parseDemoScript(source)
    })()
    scriptCache.set(scriptFile, pending)
  }

  return pending
}

export const __resetDemoScriptLoaderForTests = () => {
  scriptCache.clear()
}
