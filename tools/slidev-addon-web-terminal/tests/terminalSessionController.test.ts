import { beforeEach, describe, expect, it, vi } from 'vitest'
import { __resetSessionBridgeRegistryForTests } from '../utils/sessionBridgeRegistry'
import {
  __resetTerminalSessionControllerForTests,
  createTerminalSessionController,
} from '../utils/terminalSessionController'

const backendUrl = 'http://backend.test:10001'

const createdTerminalUrl = (pid: string) => `ws://backend.test:10001/terminals/${pid}`

describe('terminalSessionController', () => {
  beforeEach(() => {
    __resetSessionBridgeRegistryForTests()
    __resetTerminalSessionControllerForTests()
    vi.restoreAllMocks()
    ;(globalThis as { window?: unknown }).window = {
      location: {
        href: `${backendUrl}/presentation`,
        origin: backendUrl,
        host: 'backend.test:10001',
        protocol: 'http:',
      },
    }
  })

  it('creates one PTY for six concurrent same-tab controllers', async () => {
    const fetchMock = vi.fn(async (input: string | URL, init?: RequestInit) => {
      const url = String(input)
      if (url === `${backendUrl}/api/terminals` && init?.method === 'POST') {
        return new Response('pty-1', { status: 200 })
      }
      throw new Error(`Unexpected fetch: ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const controllers = Array.from({ length: 6 }, () =>
      createTerminalSessionController({
        backendUrl,
        sessionId: 'deck',
        sharedUrlTimeoutMs: 1,
      }),
    )

    const resolved = await Promise.all(controllers.map(controller => controller.resolveConnection()))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(resolved).toEqual(Array.from({ length: 6 }, () => ({
      url: createdTerminalUrl('pty-1'),
      pid: 'pty-1',
      source: 'created',
    })))

    controllers.forEach(controller => controller.dispose())
  })

  it('reuses the cached URL on remount without creating a new PTY', async () => {
    const fetchMock = vi.fn(async (input: string | URL, init?: RequestInit) => {
      const url = String(input)
      if (url === `${backendUrl}/api/terminals` && init?.method === 'POST') {
        return new Response('pty-7', { status: 200 })
      }
      throw new Error(`Unexpected fetch: ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const first = createTerminalSessionController({
      backendUrl,
      sessionId: 'deck',
      sharedUrlTimeoutMs: 1,
    })
    const initial = await first.resolveConnection()
    first.dispose()

    const second = createTerminalSessionController({
      backendUrl,
      sessionId: 'deck',
      sharedUrlTimeoutMs: 1,
    })
    const remounted = await second.resolveConnection()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(initial).toEqual({
      url: createdTerminalUrl('pty-7'),
      pid: 'pty-7',
      source: 'created',
    })
    expect(remounted).toEqual({
      url: createdTerminalUrl('pty-7'),
      pid: 'pty-7',
      source: 'cached',
    })

    second.dispose()
  })

  it('serializes stale-session recovery across concurrent controllers', async () => {
    let nextPid = 'pty-1'
    const fetchMock = vi.fn(async (input: string | URL, init?: RequestInit) => {
      const url = String(input)
      if (url === `${backendUrl}/api/terminals` && init?.method === 'POST') {
        const pid = nextPid
        nextPid = 'pty-2'
        return new Response(pid, { status: 200 })
      }
      throw new Error(`Unexpected fetch: ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const primer = createTerminalSessionController({
      backendUrl,
      sessionId: 'deck',
      sharedUrlTimeoutMs: 1,
    })
    const initial = await primer.resolveConnection()
    primer.dispose()

    const controllers = Array.from({ length: 6 }, () =>
      createTerminalSessionController({
        backendUrl,
        sessionId: 'deck',
        sharedUrlTimeoutMs: 1,
      }),
    )

    const cached = await Promise.all(controllers.map(controller => controller.resolveConnection()))
    const staleClose = { code: 4404, reason: 'terminal-not-found' } as CloseEvent
    const recovered = await Promise.all(
      controllers.map(controller => controller.handleSocketClose(staleClose, initial!.url)),
    )

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(cached.every(connection => connection?.source === 'cached')).toBe(true)
    expect(recovered).toEqual(Array.from({ length: 6 }, () => ({
      retryUrl: createdTerminalUrl('pty-2'),
    })))

    controllers.forEach(controller => controller.dispose())
  })

  it('posts resize updates only while focused unless forced', async () => {
    const fetchMock = vi.fn(async (input: string | URL, init?: RequestInit) => {
      const url = String(input)
      if (url === `${backendUrl}/api/terminals` && init?.method === 'POST') {
        return new Response('pty-9', { status: 200 })
      }
      if (url.includes('/api/terminals/pty-9/size') && init?.method === 'POST') {
        return new Response(null, { status: 204 })
      }
      throw new Error(`Unexpected fetch: ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const controller = createTerminalSessionController({
      backendUrl,
      sessionId: 'deck',
      sharedUrlTimeoutMs: 1,
    })
    await controller.resolveConnection()

    controller.requestResize(80, 24, 'unfocused')
    controller.setFocused(true)
    controller.requestResize(80, 24, 'focused')
    controller.setFocused(false)
    controller.requestResize(100, 30, 'forced', true)

    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(fetchMock.mock.calls[1]?.[0]).toContain('/api/terminals/pty-9/size?cols=80&rows=24')
    expect(fetchMock.mock.calls[2]?.[0]).toContain('/api/terminals/pty-9/size?cols=100&rows=30')

    controller.dispose()
  })

  it('creates a PTY with the fitted terminal size when available', async () => {
    const fetchMock = vi.fn(async (input: string | URL, init?: RequestInit) => {
      const url = String(input)
      if (url === `${backendUrl}/api/terminals?cols=120&rows=40` && init?.method === 'POST') {
        return new Response('pty-12', { status: 200 })
      }
      throw new Error(`Unexpected fetch: ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const controller = createTerminalSessionController({
      backendUrl,
      sessionId: 'deck',
      sharedUrlTimeoutMs: 1,
      getInitialSize: () => ({ cols: 120, rows: 40 }),
    })

    const resolved = await controller.resolveConnection()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(resolved).toEqual({
      url: createdTerminalUrl('pty-12'),
      pid: 'pty-12',
      source: 'created',
    })

    controller.dispose()
  })
})
