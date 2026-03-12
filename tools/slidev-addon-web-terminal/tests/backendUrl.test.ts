import { describe, it, expect } from 'vitest'
import { getCleanBackendUrl } from '../utils/backendUrl'

const ORIGIN = 'http://localhost:3030'

describe('getCleanBackendUrl', () => {
    describe('same-origin URLs', () => {
        it('returns a same-origin URL unchanged', () => {
            expect(getCleanBackendUrl('http://localhost:3030', ORIGIN)).toBe('http://localhost:3030')
        })

        it('strips a trailing slash', () => {
            expect(getCleanBackendUrl('http://localhost:3030/', ORIGIN)).toBe('http://localhost:3030')
        })

        it('returns a relative URL unchanged', () => {
            expect(getCleanBackendUrl('/api', ORIGIN)).toBe('/api')
        })
    })

    describe('cross-origin HTTP URLs', () => {
        it('rewrites to /proxy/<protocol>/<host>/<port>', () => {
            expect(getCleanBackendUrl('http://127.0.0.1:10001', ORIGIN))
                .toBe('/proxy/http/127.0.0.1/10001')
        })

        it('strips trailing slash before rewriting', () => {
            expect(getCleanBackendUrl('http://127.0.0.1:10001/', ORIGIN))
                .toBe('/proxy/http/127.0.0.1/10001')
        })

        it('uses port 80 when no port is specified for http', () => {
            expect(getCleanBackendUrl('http://remote.example.com', ORIGIN))
                .toBe('/proxy/http/remote.example.com/80')
        })
    })

    describe('cross-origin HTTPS URLs', () => {
        it('rewrites https with explicit port', () => {
            expect(getCleanBackendUrl('https://remote.example.com:8443', ORIGIN))
                .toBe('/proxy/https/remote.example.com/8443')
        })

        it('uses port 443 when no port is specified for https', () => {
            expect(getCleanBackendUrl('https://remote.example.com', ORIGIN))
                .toBe('/proxy/https/remote.example.com/443')
        })
    })

    describe('invalid URLs', () => {
        it('returns the input unchanged when the URL cannot be parsed', () => {
            // A plain string that is not a valid URL and not a valid relative path
            // will fail new URL() — the function should fall back gracefully.
            expect(getCleanBackendUrl('not a url ::::', ORIGIN)).toBe('not a url ::::')
        })
    })
})
