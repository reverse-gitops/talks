<template>
  <p v-if="loading">Loading Excalidraw...</p>
  <div :class="$attrs.class" v-if="svg" v-html="svg"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { buildMatchMap } from './matchFrames'

defineOptions({ inheritAttrs: false })

// Shared JSON cache — fetched once, shared across all component instances
const jsonCache = new Map<string, Promise<any>>()

// SVG export cache — exportToSvg (with font subsetting) is expensive
// Key: `${url}::${filterId ?? ''}::${darkMode}::${background}::${seedsNormalized}`
// seedsNormalized=1 when matchFrames is active; ensures different cache slot from raw export
const svgExportCache = new Map<string, Promise<string>>()

function getCachedJson(url: string): Promise<any> {
  if (!jsonCache.has(url)) {
    jsonCache.set(url, fetch(url).then(r => r.json()))
  }
  return jsonCache.get(url)!
}

const loading = ref(false)
const svg = ref<string | null>(null)

const props = withDefaults(defineProps<{
  drawFilePath: string
  darkMode?: boolean
  background?: boolean
  frameId?: string | null | undefined
  frame?: string | null | undefined
  /**
   * Enable Magic Move: normalize roughjs seeds for matched elements across frames
   * so they render with identical strokes. roughjs is deterministic on seed, so
   * same seed + same shape + same dimensions = identical rendered path.
   */
  matchFrames?: boolean
  /** Explicit element matches to override heuristic. Keys and values are Excalidraw element IDs. */
  matchHints?: Record<string, string>
}>(), {
  darkMode: false,
  background: false,
  matchFrames: false,
})

onMounted(async () => {
  loading.value = true
  try {
    ;(window as any).EXCALIDRAW_ASSET_PATH = '/'
    const { exportToSvg } = await import('@excalidraw/excalidraw')
    await loadJsonAndExport(props, exportToSvg)
  } catch (error) {
    console.error('Failed to load Excalidraw', error)
  } finally {
    loading.value = false
  }
})

const loadJsonAndExport = async (
  { drawFilePath: path, darkMode = false, background = false, frameId, frame, matchFrames, matchHints }: {
    drawFilePath: string; darkMode: boolean; background: boolean
    frameId?: string | null; frame?: string | null
    matchFrames?: boolean; matchHints?: Record<string, string>
  },
  exportToSvg: Function,
) => {
  const url = new URL(path, window.location.origin + (import.meta as any).env.BASE_URL).href
  const json = await getCachedJson(url)

  const filterId = frameId
    ? frameId
    : (json.elements.find((e: any) => e.type === 'frame' && e.name === frame)?.id ?? null)

  // Build match map before export so we can normalize seeds prior to calling exportToSvg
  const matchMap = (matchFrames && filterId)
    ? buildMatchMap(json, matchHints ?? {})
    : null

  const frameName = filterId
    ? (json.elements.find((e: any) => e.id === filterId)?.name ?? filterId.slice(0, 8))
    : '(all)'
  const frameChildren: any[] = filterId
    ? json.elements.filter((e: any) => e.frameId === filterId)
    : json.elements.filter((e: any) => e.type !== 'frame')

  if (matchMap) {
    const matched = frameChildren.filter(e => matchMap.has(e.id))
    const unmatched = frameChildren.filter(e => !matchMap.has(e.id))
    //console.log(`[MagicMove] frame "${frameName}": ${frameChildren.length} elements, ${matched.length} matched, ${unmatched.length} unmatched`)
    matchMap.forEach((canonicalId, elementId) => {
      const isInThisFrame = frameChildren.some(e => e.id === elementId)
      if (!isInThisFrame) return
      const label = canonicalId === elementId ? 'canonical' : `→ canonical=${canonicalId.slice(0, 8)}`
      const elem = frameChildren.find(e => e.id === elementId)
      //console.log(`[MagicMove]   ${elementId.slice(0, 8)} (${elem?.type}) ${label}`)
    })
    if (unmatched.length > 0) {
      //console.log(`[MagicMove]   unmatched:`, unmatched.map(e => `${e.id.slice(0, 8)}(${e.type})`).join(', '))
    }
  }

  // matchFrames uses a separate cache slot because seed normalization changes the export output
  const exportKey = `${url}::${filterId ?? ''}::${darkMode}::${background}::${matchMap ? '1' : '0'}`
  const cacheHit = svgExportCache.has(exportKey)
  //console.log(`[MagicMove] frame "${frameName}": exportKey=${exportKey.split('::').slice(-3).join('::')} cache=${cacheHit ? 'HIT' : 'MISS'}`)

  if (!cacheHit) {
    let filteredElements: any[] = filterId
      ? json.elements.filter((e: any) => e.frameId === filterId)
      : [...json.elements]

    // Normalize roughjs seeds for non-canonical matched elements.
    // Each element's seed is replaced with the canonical element's seed so that
    // roughjs generates the same stroke path for visually equivalent shapes.
    if (matchMap) {
      filteredElements = filteredElements.map((e: any) => {
        const canonicalId = matchMap.get(e.id)
        if (!canonicalId || canonicalId === e.id) return e
        const canonicalElem = json.elements.find((c: any) => c.id === canonicalId)
        if (!canonicalElem) return e
        //console.log(`[MagicMove]   seed ${e.id.slice(0, 8)}: ${e.seed} → ${canonicalElem.seed}`)
        return { ...e, seed: canonicalElem.seed }
      })
    }

    svgExportCache.set(exportKey, exportToSvg({
      ...json,
      elements: filteredElements,
      appState: { ...(json.appState as any), exportWithDarkMode: darkMode, exportBackground: background },
    }).then((el: any) => el.outerHTML))
  }

  svg.value = await svgExportCache.get(exportKey)!
}
</script>
