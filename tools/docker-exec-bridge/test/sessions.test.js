import assert from 'node:assert/strict'
import { test } from 'node:test'
import { appendToReplayBuffer } from '../src/sessions.js'

test('appends output', () => {
  const buffer = appendToReplayBuffer(Buffer.from('a'), Buffer.from('b'))
  assert.equal(buffer.toString(), 'ab')
})

test('restarts the replay at the last clear-screen', () => {
  const buffer = appendToReplayBuffer(Buffer.from('old output'), Buffer.from('more\x1b[2Jfresh\x1b[3Jnewest'))
  assert.equal(buffer.toString(), '\x1b[3Jnewest')
})

test('keeps only the last 512 KiB', () => {
  const buffer = appendToReplayBuffer(Buffer.alloc(512 * 1024, 'a'), Buffer.from('tail'))
  assert.equal(buffer.length, 512 * 1024)
  assert.equal(buffer.subarray(-4).toString(), 'tail')
})
