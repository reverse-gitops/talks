# Magic Move: Animated Object Transitions Between Excalidraw Frames

## Overview

This document describes the design for implementing "Magic Move" (Keynote) / "Morph" (PowerPoint) style transitions between Excalidraw frames in Slidev.

When consecutive slides show different frames from the same Excalidraw file, objects that appear in both frames should animate smoothly to their new positions instead of disappearing and reappearing.

---

## How the Current Rendering Works

The `Excalidraw.vue` component:

1. Loads the full JSON file
2. Filters elements by `frameId`
3. Calls `ExcalidrawLib.exportToSvg()` on the filtered set
4. Injects raw SVG via `v-html`

### Two Problems

**Problem 1: Objects disappear/appear** — Each slide renders its frame independently. There is no continuity between SVG DOMs across slide transitions.

**Problem 2: Objects render slightly differently** — Excalidraw uses `roughjs` for its hand-drawn style. roughjs uses a per-element `seed` value as a random number generator seed. Different elements have different seeds, so even if two shapes are identical in type and size, they produce different stroke paths.

---

## The Solution: Seed Normalisation + CSS View Transitions

### Phase 3 (Rendering Consistency): Seed Normalisation

For matched elements (see below), the non-canonical element's `seed` is replaced with the canonical element's `seed` **before** passing the elements to `exportToSvg`. Since roughjs is deterministic on seed + shape properties, this produces pixel-identical strokes for matched shapes.

This happens at the input stage — no SVG post-processing needed.

### Phase 2 (Animation): CSS View Transitions

Slidev already uses the [CSS View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API). When two elements in consecutive slides share the same `view-transition-name`, the browser automatically morphs between them.

**Status: not yet implemented.** See the failed attempt section below.

---

## Element Matching Heuristic

Each Excalidraw element has a unique `id`, but the same "logical" shape in frame A and frame B are *different* elements with *different* IDs. We match them by:

- Same `type` (ellipse, rectangle, text, …)
- Similar position **relative to the bounding box of that frame's children** (within ~20px)
- Similar size — `width` and `height` within ~10px
- For text elements: same text content

```
minX = min(child.x for child in frame.children)
minY = min(child.y for child in frame.children)

relX = element.x - minX
relY = element.y - minY

isMatch(a, b) =
  a.type === b.type
  && |a.relX - b.relX| < 20
  && |a.relY - b.relY| < 20
  && |a.width - b.width| < 10
  && |a.height - b.height| < 10
```

Note: relative positions use the **bounding-box origin of the frame's children**, not the frame element's own `x`/`y`. This matches the coordinate system `exportToSvg()` uses.

Elements outside any frame (`frameId: null`) are ignored.

The match map produces: `Map<elementId, canonicalId>` where `canonicalId` is the id of the first-seen element in a matched group (always from the earliest frame in the file).

### Explicit Override

```vue
:matchHints="{ 'elementId-in-frame1': 'elementId-in-frame2' }"
```

Forces two specific elements to be matched, overriding the heuristic.

---

## Current Pipeline

```
1. getCachedJson(url)
   └─ fetch once, shared across all component instances

2. buildMatchMap(json, matchHints)          [only when matchFrames=true]
   └─ identify matched elements across all frame pairs
   └─ runs BEFORE export so seeds can be normalised

3. Seed normalisation                       [only when matchFrames=true]
   └─ for each non-canonical element in the current frame:
      element.seed = canonicalElement.seed
   └─ roughjs is deterministic: same seed + same shape → identical path

4. exportToSvg({ elements: filteredAndNormalised, appState })
   └─ cached per: url::filterId::darkMode::background::matchFrames
   └─ matchFrames=true uses a separate cache slot (different seeds = different SVG)

5. svg.value = svgString
   └─ rendered via v-html
```

### New component prop

```vue
<Excalidraw
  drawFilePath="/test.excalidraw"
  frame="name1"
  :matchFrames="true"
/>
```

`matchFrames` (default `false`) enables matching and seed normalisation.

---

## What Was Wrong With the Original Phase 2 / Phase 3 Plan

The original design (Phases 2 and 3) was based on the assumption that `exportToSvg()` generates SVG with `<clipPath id="clip-{elementId}">` for every element, making it possible to locate each element's `<g>` group by Excalidraw element ID:

```
// ASSUMED (never true in practice):
<clipPath id="clip-TS1d0tpnTl_bQiE6-rElo">...</clipPath>
<g clip-path="url(#clip-TS1d0tpnTl_bQiE6-rElo)">...</g>
```

**This assumption was false.** The actual SVG produced by `exportToSvg()` contains zero `clip-{id}` elements. The SVG structure does not include element IDs in any queryable attribute. As a result:

- Phase 2 (injecting `view-transition-name` onto matched `<g>` elements) silently did nothing — the DOM query always returned null.
- Phase 3 (replacing non-canonical `<g>` content with canonical content + translate offset) also did nothing for the same reason.

Additionally, Phase 3 had a **race condition**: the canonical `<g>` cache was populated as a side effect of `postProcessSvg` running on the canonical frame's slide. All slides mount in parallel in Slidev, so a non-canonical frame could run `postProcessSvg` before the canonical frame had populated the cache — resulting in a cache miss and the original different-seed rendering.

Both problems were bypassed by moving the fix to the **input stage** (seed normalisation before export) rather than the output stage (SVG DOM manipulation after export).

---

## Remaining Work

### Phase 2: view-transition-name injection

To animate matched elements between slides, `view-transition-name` must be set on the correct SVG nodes. This requires identifying individual elements inside the exported SVG. The approach needs to be determined by inspecting what `exportToSvg()` actually produces — the element ID is not currently exposed in the SVG output.

Options to investigate:
- Export each matched element individually and composite
- Patch the element objects passed to `exportToSvg` with a custom attribute that surfaces in the SVG
- Wrap each frame in a single `<div>` with a `view-transition-name` for a coarser but simpler frame-level transition

### Phase 4: matchHints prop

Already implemented. Explicit overrides for the heuristic.

---

## Implementation Phases

| Phase | Scope | Status |
|-------|-------|--------|
| 1 | Shared JSON cache | Done |
| 2 | `buildMatchMap` heuristic | Done |
| 3 | Seed normalisation for identical rendering | Done |
| 4 | `matchHints` prop | Done |
| 5 | `view-transition-name` injection for animation | Not started — SVG structure needs investigation |
