import { describe, expect, it } from 'vitest'
import { parseDemoScript } from '../utils/demoScriptLoader'

describe('demoScriptLoader', () => {
  it('parses run and key steps from the flat YAML format', () => {
    const steps = parseDemoScript(`
steps:
  - run: kubectl get nodes

  - run: |
      kubectl get quizsubmissions -A --watch
    waitForEnter: false

  - keys: ctrl+c
`)

    expect(steps).toEqual([
      {
        id: 'step-1-run',
        kind: 'run',
        run: 'kubectl get nodes',
        waitForEnter: true,
      },
      {
        id: 'step-2-run',
        kind: 'run',
        run: 'kubectl get quizsubmissions -A --watch',
        waitForEnter: false,
      },
      {
        id: 'step-3-keys',
        kind: 'keys',
        keys: 'ctrl+c',
      },
    ])
  })

  it('rejects unsupported key sequences', () => {
    expect(() => parseDemoScript(`
steps:
  - keys: ctrl+z
`)).toThrow('Unsupported key sequence')
  })
})
