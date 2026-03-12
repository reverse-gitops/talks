import { describe, it, expect } from 'vitest'
import { createSessionBridge } from '../utils/sessionBridge'

describe('createSessionBridge', () => {
    it('returns an object with requestUrl, announce and close methods', () => {
        const bridge = createSessionBridge('test-shape')
        expect(typeof bridge.requestUrl).toBe('function')
        expect(typeof bridge.requestConnectionUrl).toBe('function')
        expect(typeof bridge.announce).toBe('function')
        expect(typeof bridge.setControlOwner).toBe('function')
        expect(typeof bridge.getControlOwner).toBe('function')
        expect(typeof bridge.onControlOwnerChange).toBe('function')
        expect(typeof bridge.close).toBe('function')
        bridge.close()
    })

    it('requestUrl resolves null when no other instance replies within timeout', async () => {
        const bridge = createSessionBridge('test-timeout')
        const result = await bridge.requestUrl(50)
        expect(result).toBeNull()
        bridge.close()
    })

    it('requestUrl resolves with the URL announced by a second instance', async () => {
        const leader = createSessionBridge('test-share')
        const follower = createSessionBridge('test-share')

        // Follower sends request, leader sees it and re-announces
        leader.announce('ws://localhost:10001/terminals/42')
        const result = await follower.requestUrl(200)

        expect(result).toBe('ws://localhost:10001/terminals/42')
        leader.close()
        follower.close()
    })

    it('requestUrl picks up an announcement that arrived before it was called', async () => {
        const leader = createSessionBridge('test-pre-announce')
        const follower = createSessionBridge('test-pre-announce')

        // Leader announces; follower's onmessage caches it in storedUrl
        leader.announce('ws://localhost:10001/terminals/99')

        // Wait a tick for the message to propagate, then request
        await new Promise(r => setTimeout(r, 20))
        const result = await follower.requestUrl(200)

        expect(result).toBe('ws://localhost:10001/terminals/99')
        leader.close()
        follower.close()
    })

    it('legacy requestConnectionUrl alias resolves the shared URL', async () => {
        const leader = createSessionBridge('test-legacy-alias')
        const follower = createSessionBridge('test-legacy-alias')

        leader.announce('ws://localhost:10001/terminals/777')
        const result = await follower.requestConnectionUrl?.(200)

        expect(result).toBe('ws://localhost:10001/terminals/777')
        leader.close()
        follower.close()
    })

    it('broadcasts control owner changes across bridge instances', async () => {
        const leader = createSessionBridge('test-control-owner')
        const follower = createSessionBridge('test-control-owner')

        const seenOwners: Array<string | null> = []
        const stop = follower.onControlOwnerChange(ownerId => {
            seenOwners.push(ownerId)
        })

        leader.setControlOwner('leader-tab')
        await new Promise(r => setTimeout(r, 20))
        leader.setControlOwner(null)
        await new Promise(r => setTimeout(r, 20))

        expect(follower.getControlOwner()).toBeNull()
        expect(seenOwners).toEqual(['leader-tab', null])

        stop()
        leader.close()
        follower.close()
    })
})
