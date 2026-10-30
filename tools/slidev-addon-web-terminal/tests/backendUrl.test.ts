import { describe, it, expect } from 'vitest'
import { getCleanBackendUrl } from '../utils/backendUrl'

describe('getCleanBackendUrl', () => {
    it('returns the URL unchanged, so the browser connects directly', () => {
        expect(getCleanBackendUrl('http://127.0.0.1:10001')).toBe('http://127.0.0.1:10001')
    })

    it('strips a trailing slash', () => {
        expect(getCleanBackendUrl('http://127.0.0.1:10001/')).toBe('http://127.0.0.1:10001')
    })

    it('leaves a relative URL alone', () => {
        expect(getCleanBackendUrl('/api')).toBe('/api')
    })
})
