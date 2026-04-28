import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { buildMatchMap, elementsMatch } from './matchFrames'

const TWO_CIRCLES = JSON.parse(
  readFileSync(join(import.meta.dirname, '../public/two-circles.excalidraw.json'), 'utf8'),
)

// ─── helpers ────────────────────────────────────────────────────────────────

function frame(id: string, x = 0, y = 0) {
  return { id, type: 'frame', name: id, x, y, width: 800, height: 600 }
}

function ellipse(id: string, frameId: string, x: number, y: number, w = 100, h = 100) {
  return { id, type: 'ellipse', frameId, x, y, width: w, height: h }
}

function rect(id: string, frameId: string, x: number, y: number, w = 100, h = 100) {
  return { id, type: 'rectangle', frameId, x, y, width: w, height: h }
}

function textEl(id: string, frameId: string, x: number, y: number, text: string) {
  return { id, type: 'text', frameId, x, y, width: 80, height: 20, text }
}

// ─── two-circles.excalidraw.json ────────────────────────────────────────────
// Frame A has two ellipses. Frame B has the same two ellipses, but Circle 2
// is moved to a clearly different position.
//
// Relative positions (bounding-box origin):
//   Circle1A  relX=0,    relY=0      →  Circle1B  relX=0,    relY=0      ← should MATCH
//   Circle2A  relX=66.5, relY=55.2   →  Circle2B  relX=120.5, relY=30.6  ← should NOT match (Δ>20px)

describe('two-circles.excalidraw.json', () => {
  const CIRCLE1_A = 'TS1d0tpnTl_bQiE6-rElo'
  const CIRCLE2_A = 'pMIXALISmLL6QFteIZGiv'
  const CIRCLE1_B = 'n3qhyfiC0WBpP6_NmtijQ'
  const CIRCLE2_B = '2dfxjxBQJ_FkMvi4y_imz'

  it('matches Circle 1 across frames (same relative position)', () => {
    const map = buildMatchMap(TWO_CIRCLES)
    // Circle1B should share the canonical id of Circle1A
    expect(map.get(CIRCLE1_A)).toBe(CIRCLE1_A)
    expect(map.get(CIRCLE1_B)).toBe(CIRCLE1_A)
  })

  it('does NOT match Circle 2 across frames (moved > 20px in relative coords)', () => {
    const map = buildMatchMap(TWO_CIRCLES)
    // Circle2 moved too far — heuristic should not link them
    const circle2ACanonical = map.get(CIRCLE2_A)
    const circle2BCanonical = map.get(CIRCLE2_B)
    // They must not share the same canonical id as each other
    expect(circle2ACanonical).not.toBe(CIRCLE2_B)
    expect(circle2BCanonical).not.toBe(CIRCLE2_A)
    if (circle2ACanonical !== undefined && circle2BCanonical !== undefined) {
      expect(circle2ACanonical).not.toBe(circle2BCanonical)
    }
  })

  it('does not add unmatched circles to the map', () => {
    const map = buildMatchMap(TWO_CIRCLES)
    // Circle2 elements should not appear in the match map at all
    // (no partner found in the other frame)
    expect(map.has(CIRCLE2_A)).toBe(false)
    expect(map.has(CIRCLE2_B)).toBe(false)
  })

  it('ignores elements that are outside any frame (frameId: null)', () => {
    const FRAMELESS = 'KUmEY-6xMSP6nP5z53nbQ'
    const map = buildMatchMap(TWO_CIRCLES)
    expect(map.has(FRAMELESS)).toBe(false)
  })
})

// ─── elementsMatch ──────────────────────────────────────────────────────────

describe('elementsMatch', () => {
  it('matches identical relative positions', () => {
    const a = { element: ellipse('a', 'f1', 0, 0), relX: 0, relY: 0 }
    const b = { element: ellipse('b', 'f2', 0, 0), relX: 0, relY: 0 }
    expect(elementsMatch(a, b)).toBe(true)
  })

  it('matches when positions differ by less than 20px', () => {
    const a = { element: ellipse('a', 'f1', 0, 0), relX: 0, relY: 0 }
    const b = { element: ellipse('b', 'f2', 0, 0), relX: 19, relY: 19 }
    expect(elementsMatch(a, b)).toBe(true)
  })

  it('rejects when position differs by 20px or more', () => {
    const a = { element: ellipse('a', 'f1', 0, 0), relX: 0, relY: 0 }
    const b = { element: ellipse('b', 'f2', 0, 0), relX: 20, relY: 0 }
    expect(elementsMatch(a, b)).toBe(false)
  })

  it('rejects different types', () => {
    const a = { element: ellipse('a', 'f1', 0, 0), relX: 0, relY: 0 }
    const b = { element: rect('b', 'f2', 0, 0), relX: 0, relY: 0 }
    expect(elementsMatch(a, b)).toBe(false)
  })

  it('rejects when size differs by 10px or more', () => {
    const a = { element: ellipse('a', 'f1', 0, 0, 100, 100), relX: 0, relY: 0 }
    const b = { element: ellipse('b', 'f2', 0, 0, 110, 100), relX: 0, relY: 0 }
    expect(elementsMatch(a, b)).toBe(false)
  })

  it('matches when size differs by less than 10px', () => {
    const a = { element: ellipse('a', 'f1', 0, 0, 100, 100), relX: 0, relY: 0 }
    const b = { element: ellipse('b', 'f2', 0, 0, 109, 100), relX: 0, relY: 0 }
    expect(elementsMatch(a, b)).toBe(true)
  })

  it('matches text elements with identical text', () => {
    const a = { element: textEl('a', 'f1', 0, 0, 'Hello'), relX: 0, relY: 0 }
    const b = { element: textEl('b', 'f2', 0, 0, 'Hello'), relX: 0, relY: 0 }
    expect(elementsMatch(a, b)).toBe(true)
  })

  it('rejects text elements with different text', () => {
    const a = { element: textEl('a', 'f1', 0, 0, 'Hello'), relX: 0, relY: 0 }
    const b = { element: textEl('b', 'f2', 0, 0, 'World'), relX: 0, relY: 0 }
    expect(elementsMatch(a, b)).toBe(false)
  })
})

// ─── buildMatchMap ──────────────────────────────────────────────────────────

describe('buildMatchMap', () => {
  it('returns empty map when no frames', () => {
    const map = buildMatchMap({ elements: [] })
    expect(map.size).toBe(0)
  })

  it('matches a single ellipse present in both frames at the same relative position', () => {
    // Frame A at (0,0), frame B at (1000,0) — elements at same relative pos
    const fA = frame('fA', 0, 0)
    const fB = frame('fB', 1000, 0)
    const eA = ellipse('eA', 'fA', 100, 100)
    const eB = ellipse('eB', 'fB', 1100, 100) // same relX=100, relY=100

    const map = buildMatchMap({ elements: [fA, fB, eA, eB] })

    expect(map.get('eA')).toBe('eA') // canonical
    expect(map.get('eB')).toBe('eA') // matched to canonical
  })

  it('uses bounding-box origin, not frame origin', () => {
    // Frame A at (0,0), its only element at (50,80) → relX=0, relY=0 (it IS the bounding box origin)
    // Frame B at (500,0), its only element at (510,30) → relX=0, relY=0
    // They should match even though they differ from the frame x,y
    const fA = frame('fA', 0, 0)
    const fB = frame('fB', 500, 0)
    const eA = ellipse('eA', 'fA', 50, 80)
    const eB = ellipse('eB', 'fB', 510, 30)

    const map = buildMatchMap({ elements: [fA, fB, eA, eB] })

    expect(map.get('eA')).toBe('eA')
    expect(map.get('eB')).toBe('eA')
  })

  it('does NOT match elements at different relative positions within their frames', () => {
    // Frame A has two elements: anchor at (0,0) and eA at (300,0) → eA.relX = 300
    // Frame B has two elements: anchor at (0,0) and eB at (0,300) → eB.relX = 0, relY = 300
    // eA and eB should not match (relX 300 vs 0)
    const fA = frame('fA', 0, 0)
    const fB = frame('fB', 1000, 0)
    const anchorA = ellipse('anchorA', 'fA', 0, 0, 10, 10)
    const anchorB = ellipse('anchorB', 'fB', 1000, 0, 10, 10)
    const eA = ellipse('eA', 'fA', 300, 0) // relX=300, relY=0
    const eB = ellipse('eB', 'fB', 1000, 300) // relX=0, relY=300

    const map = buildMatchMap({ elements: [fA, fB, anchorA, anchorB, eA, eB] })

    // eA and eB must not be matched to each other
    expect(map.get('eA')).not.toBe('eA') // eA is not canonical for eB
    expect(map.get('eB')).not.toBe('eA')
    // anchors match each other (same type, size, relX=0 relY=0)
    expect(map.get('anchorB')).toBe('anchorA')
  })

  it('matches multiple elements across frames', () => {
    const fA = frame('fA', 0, 0)
    const fB = frame('fB', 1000, 0)
    // Two ellipses that exist in both frames at the same relative positions
    const eA1 = ellipse('eA1', 'fA', 100, 100)
    const eA2 = ellipse('eA2', 'fA', 300, 200)
    const eB1 = ellipse('eB1', 'fB', 1100, 100)
    const eB2 = ellipse('eB2', 'fB', 1300, 200)

    const map = buildMatchMap({ elements: [fA, fB, eA1, eA2, eB1, eB2] })

    expect(map.get('eB1')).toBe('eA1')
    expect(map.get('eB2')).toBe('eA2')
  })

  it('respects matchHints over heuristic', () => {
    const fA = frame('fA', 0, 0)
    const fB = frame('fB', 1000, 0)
    // Positions are completely different — heuristic would not match them
    const eA = ellipse('eA', 'fA', 0, 0)
    const eB = ellipse('eB', 'fB', 1500, 500)

    const map = buildMatchMap({ elements: [fA, fB, eA, eB] }, { eA: 'eB' })

    expect(map.get('eA')).toBe('eA')
    expect(map.get('eB')).toBe('eA')
  })

  it('matches across three frames transitively using same canonical', () => {
    const fA = frame('fA', 0, 0)
    const fB = frame('fB', 1000, 0)
    const fC = frame('fC', 2000, 0)
    const eA = ellipse('eA', 'fA', 0, 0)
    const eB = ellipse('eB', 'fB', 1000, 0)
    const eC = ellipse('eC', 'fC', 2000, 0)

    const map = buildMatchMap({ elements: [fA, fB, fC, eA, eB, eC] })

    // All three should share the same canonical (eA, the first seen)
    expect(map.get('eA')).toBe('eA')
    expect(map.get('eB')).toBe('eA')
    expect(map.get('eC')).toBe('eA')
  })
})
