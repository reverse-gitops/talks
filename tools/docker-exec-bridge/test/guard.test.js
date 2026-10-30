import assert from 'node:assert/strict'
import { test } from 'node:test'
import { loadConfig } from '../src/config.js'
import { checkRequest } from '../src/guard.js'

const config = loadConfig({
  TARGET_CONTAINER: 'talks-demo',
  ALLOWED_ORIGINS: 'https://demo.koudijs.dev',
})
const request = (headers) => ({ headers })

test('accepts the deck origin on a loopback host', () => {
  assert.deepEqual(
    checkRequest(request({ host: '127.0.0.1:10001', origin: 'https://demo.koudijs.dev' }), config),
    { ok: true, origin: 'https://demo.koudijs.dev' },
  )
  assert.equal(checkRequest(request({ host: 'localhost:10001', origin: 'https://demo.koudijs.dev' }), config).ok, true)
})

test('rejects another site open in the same browser', () => {
  const result = checkRequest(request({ host: '127.0.0.1:10001', origin: 'https://evil.example' }), config)
  assert.equal(result.ok, false)
  assert.equal(result.status, 403)
})

test('rejects requests without an Origin', () => {
  assert.equal(checkRequest(request({ host: '127.0.0.1:10001' }), config).ok, false)
})

test('rejects DNS rebinding: a rebound hostname still shows up in Host', () => {
  const result = checkRequest(request({ host: 'rebind.evil.example:10001', origin: 'https://demo.koudijs.dev' }), config)
  assert.equal(result.ok, false)
  assert.match(result.reason, /host not allowed/)
})

test('rejects lookalike origins', () => {
  for (const origin of ['http://demo.koudijs.dev', 'https://demo.koudijs.dev.evil.example', 'https://demo.koudijs.dev:8443', 'null']) {
    assert.equal(checkRequest(request({ host: '127.0.0.1:10001', origin }), config).ok, false, origin)
  }
})
