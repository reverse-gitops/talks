const FORCE_MANAGED_RESIZE_REASONS = new Set([
  'initial',
  'socket-open',
  'fonts-ready',
  'resize-observer',
  'window-resize',
  'control-owner-cleared',
])

export const shouldForceManagedResize = (renderContext: string, reason: string) =>
  renderContext === 'slide' && FORCE_MANAGED_RESIZE_REASONS.has(reason)
