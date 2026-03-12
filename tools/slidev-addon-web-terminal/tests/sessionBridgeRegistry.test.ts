import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  __resetSessionBridgeRegistryForTests,
  acquireBridge,
  ensureSessionUrl,
  getCachedUrl,
  invalidateCachedUrl,
  recoverSessionUrl,
} from '../utils/sessionBridgeRegistry'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

describe('sessionBridgeRegistry', () => {
  beforeEach(() => {
    __resetSessionBridgeRegistryForTests()
  })

  it('concurrent ensureSessionUrl callers create exactly one PTY', async () => {
    acquireBridge('shared-session')
    const creator = vi.fn(async () => {
      await delay(5)
      return 'ws://localhost:10001/terminals/alpha'
    })

    const urls = await Promise.all([
      ensureSessionUrl('shared-session', creator),
      ensureSessionUrl('shared-session', creator),
      ensureSessionUrl('shared-session', creator),
    ])

    expect(creator).toHaveBeenCalledTimes(1)
    expect(urls).toEqual([
      'ws://localhost:10001/terminals/alpha',
      'ws://localhost:10001/terminals/alpha',
      'ws://localhost:10001/terminals/alpha',
    ])
    expect(getCachedUrl('shared-session')).toBe('ws://localhost:10001/terminals/alpha')
  })

  it('invalidateCachedUrl only clears the expected stale URL', () => {
    const bridge = acquireBridge('stale-cache')
    bridge.announce('ws://localhost:10001/terminals/original')

    invalidateCachedUrl('stale-cache', 'ws://localhost:10001/terminals/other')
    expect(getCachedUrl('stale-cache')).toBe('ws://localhost:10001/terminals/original')

    invalidateCachedUrl('stale-cache', 'ws://localhost:10001/terminals/original')
    expect(getCachedUrl('stale-cache')).toBeNull()
  })

  it('concurrent stale recoveries share one recovery promise and one announce', async () => {
    const bridge = acquireBridge('recover-session')
    bridge.announce('ws://localhost:10001/terminals/stale')

    const announceSpy = vi.spyOn(bridge, 'announce')
    announceSpy.mockClear()

    const creator = vi.fn(async () => {
      await delay(5)
      return 'ws://localhost:10001/terminals/fresh'
    })

    const results = await Promise.all([
      recoverSessionUrl('recover-session', 'ws://localhost:10001/terminals/stale', creator),
      recoverSessionUrl('recover-session', 'ws://localhost:10001/terminals/stale', creator),
      recoverSessionUrl('recover-session', 'ws://localhost:10001/terminals/stale', creator),
    ])

    expect(creator).toHaveBeenCalledTimes(1)
    expect(announceSpy).toHaveBeenCalledTimes(1)
    expect(results.map(result => result.url)).toEqual([
      'ws://localhost:10001/terminals/fresh',
      'ws://localhost:10001/terminals/fresh',
      'ws://localhost:10001/terminals/fresh',
    ])
    expect(results.map(result => result.source)).toContain('recovered')
    expect(results.map(result => result.source)).toContain('reused_pending')
    expect(getCachedUrl('recover-session')).toBe('ws://localhost:10001/terminals/fresh')
  })

  it('failed recovery clears pending state and allows a later retry', async () => {
    const bridge = acquireBridge('retry-session')
    bridge.announce('ws://localhost:10001/terminals/stale')

    const failingCreator = vi.fn(async () => {
      await delay(5)
      return null
    })

    const failed = await Promise.all([
      recoverSessionUrl('retry-session', 'ws://localhost:10001/terminals/stale', failingCreator),
      recoverSessionUrl('retry-session', 'ws://localhost:10001/terminals/stale', failingCreator),
    ])

    expect(failingCreator).toHaveBeenCalledTimes(1)
    expect(failed.every(result => result.url === null)).toBe(true)
    expect(getCachedUrl('retry-session')).toBeNull()

    const succeedingCreator = vi.fn(async () => 'ws://localhost:10001/terminals/retried')
    const recovered = await recoverSessionUrl(
      'retry-session',
      'ws://localhost:10001/terminals/stale',
      succeedingCreator,
    )

    expect(succeedingCreator).toHaveBeenCalledTimes(1)
    expect(recovered).toEqual({
      url: 'ws://localhost:10001/terminals/retried',
      source: 'recovered',
    })
    expect(getCachedUrl('retry-session')).toBe('ws://localhost:10001/terminals/retried')
  })
})
