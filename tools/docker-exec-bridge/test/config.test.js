import assert from 'node:assert/strict'
import { test } from 'node:test'
import { loadConfig } from '../src/config.js'

test('requires a target container', () => {
  assert.throws(() => loadConfig({}), /TARGET_CONTAINER is required/)
})

test('defaults bind to loopback and allow the local dev server', () => {
  const config = loadConfig({ TARGET_CONTAINER: 'talks-demo' })
  assert.equal(config.listenHost, '127.0.0.1')
  assert.equal(config.port, 10001)
  assert.deepEqual([...config.allowedOrigins], ['http://localhost:3030'])
  assert.deepEqual([...config.allowedHosts], ['127.0.0.1:10001', 'localhost:10001'])
  assert.deepEqual(config.execCmd, ['bash', '-l'])
})

test('allowed hosts follow PUBLIC_PORT when Docker publishes on another port', () => {
  const config = loadConfig({ TARGET_CONTAINER: 'talks-demo', PORT: '10001', PUBLIC_PORT: '12000' })
  assert.deepEqual([...config.allowedHosts], ['127.0.0.1:12000', 'localhost:12000'])
})

test('origins are normalised and must not carry a path', () => {
  const config = loadConfig({
    TARGET_CONTAINER: 'talks-demo',
    ALLOWED_ORIGINS: 'https://demo.koudijs.dev/, http://localhost:3030',
  })
  assert.deepEqual([...config.allowedOrigins], ['https://demo.koudijs.dev', 'http://localhost:3030'])

  assert.throws(
    () => loadConfig({ TARGET_CONTAINER: 'talks-demo', ALLOWED_ORIGINS: 'https://demo.koudijs.dev/cnd-utrecht' }),
    /without a path/,
  )
})

test('config cannot be changed after startup', () => {
  const config = loadConfig({ TARGET_CONTAINER: 'talks-demo' })
  assert.throws(() => { config.targetContainer = 'other' }, TypeError)
})
