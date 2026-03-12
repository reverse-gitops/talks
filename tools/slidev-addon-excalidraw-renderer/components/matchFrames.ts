export interface FrameChild {
  element: any
  relX: number
  relY: number
}

/**
 * Build a map from elementId → canonicalId across all frame pairs in the file.
 * The canonicalId is the id of the first element seen in a matched group.
 *
 * Relative positions are computed using the bounding-box origin of each frame's
 * children (min x, min y), which matches the coordinate system exportToSvg() uses.
 */
export function buildMatchMap(json: any, matchHints: Record<string, string> = {}): Map<string, string> {
  const elements: any[] = json.elements ?? []
  const frames = elements.filter(e => e.type === 'frame')

  const frameChildren = new Map<string, FrameChild[]>()
  for (const frame of frames) {
    const children = elements.filter(e => e.frameId === frame.id)
    if (children.length === 0) {
      frameChildren.set(frame.id, [])
      continue
    }
    const minX = Math.min(...children.map(e => e.x))
    const minY = Math.min(...children.map(e => e.y))
    frameChildren.set(
      frame.id,
      children.map(e => ({ element: e, relX: e.x - minX, relY: e.y - minY })),
    )
  }

  const matchMap = new Map<string, string>()

  // Explicit hints take priority over the heuristic
  for (const [id1, id2] of Object.entries(matchHints)) {
    matchMap.set(id1, id1)
    matchMap.set(id2, id1)
  }

  // Heuristic matching across all frame pairs
  for (let i = 0; i < frames.length; i++) {
    for (let j = i + 1; j < frames.length; j++) {
      const childrenA = frameChildren.get(frames[i].id) ?? []
      const childrenB = frameChildren.get(frames[j].id) ?? []

      for (const a of childrenA) {
        const canonicalId = matchMap.get(a.element.id) ?? a.element.id
        for (const b of childrenB) {
          if (matchMap.has(b.element.id)) continue
          if (elementsMatch(a, b)) {
            if (!matchMap.has(a.element.id)) matchMap.set(a.element.id, canonicalId)
            matchMap.set(b.element.id, canonicalId)
            break
          }
        }
      }
    }
  }

  return matchMap
}

export function elementsMatch(a: FrameChild, b: FrameChild): boolean {
  const ae = a.element
  const be = b.element
  return (
    ae.type === be.type
    && Math.abs(a.relX - b.relX) < 20
    && Math.abs(a.relY - b.relY) < 20
    && Math.abs((ae.width ?? 0) - (be.width ?? 0)) < 10
    && Math.abs((ae.height ?? 0) - (be.height ?? 0)) < 10
    && (ae.type !== 'text' || ae.text === be.text)
  )
}
