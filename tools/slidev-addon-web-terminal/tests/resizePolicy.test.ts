import { describe, expect, it } from 'vitest'
import { shouldForceManagedResize } from '../utils/resizePolicy'

describe('resizePolicy', () => {
  it('forces managed resize updates for the main slide view lifecycle', () => {
    expect(shouldForceManagedResize('slide', 'socket-open')).toBe(true)
    expect(shouldForceManagedResize('slide', 'fonts-ready')).toBe(true)
    expect(shouldForceManagedResize('slide', 'resize-observer')).toBe(true)
    expect(shouldForceManagedResize('slide', 'window-resize')).toBe(true)
    expect(shouldForceManagedResize('slide', 'control-owner-cleared')).toBe(true)
  })

  it('does not force managed resize updates for presenter or thumbnail contexts', () => {
    expect(shouldForceManagedResize('presenter', 'socket-open')).toBe(false)
    expect(shouldForceManagedResize('overview', 'socket-open')).toBe(false)
    expect(shouldForceManagedResize('previewNext', 'socket-open')).toBe(false)
  })
})
