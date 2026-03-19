# Terminal Rendering: Current State

This document captures the current rendering story for the xterm.js terminal embedded in Slidev presentations: Nerd Font glyphs, font loading, WebGL selection, and why the terminal can still look soft on large screens.

---

## Current Stack

This addon now targets:

- `@xterm/xterm@^6.0.0`
- `@xterm/addon-webgl@^0.19.0`

As of **xterm.js 6.0.0 (December 22, 2025)**, the Canvas renderer was removed (breaking change, issue #5105). For this project the renderer choices are now effectively:

- **WebGL addon** when real GPU acceleration is available
- **DOM renderer** as the built-in fallback

That means the old `WebGL -> Canvas -> DOM` cascade is no longer relevant.

---

## Problem 1: DOM Renderer Clips Nerd Font Glyphs

Starship prompt and tools like k9s use **Nerd Font glyphs** mapped into the Unicode private use area. Some of these glyphs are visually wider than a standard monospace cell.

In xterm's DOM renderer, each character is placed into a fixed-width HTML element. Wide glyphs can overflow their cell and get clipped by the neighboring span boundary. The result is a hard vertical cut through the icon.

This is a documented xterm.js limitation: **issue #3807**. The maintainers confirmed the problem is specific to the DOM renderer and does not affect the WebGL renderer.

**Current conclusion:** if we want reliable Nerd Font rendering, **WebGL is the preferred renderer**.

---

## Problem 2: `@font-face` Inside `<style scoped>` Does Not Work

To load JetBrains Mono Nerd Font from a CDN, the first attempt placed `@font-face` inside `<style scoped>`.

Vue scopes normal CSS rules by rewriting selectors with a component attribute such as `[data-v-xxxx]`. `@font-face` has no selector, so it cannot be scoped and is dropped.

**Fix:** keep `@font-face` in the component's non-scoped `<style>` block.

---

## Problem 3: WebGL Can Cache Glyphs Before the Font Loads

The WebGL renderer builds a glyph atlas on first render. If the Nerd Font has not finished downloading yet, xterm rasterizes glyphs using the fallback font and caches the wrong bitmaps.

The fix is to wait for the browser font load promise, then invalidate the atlas and refit:

```ts
document.fonts.ready.then(() => {
    if (runId !== initRunId || !terminal) return
    terminal.clearTextureAtlas?.()
    safeFit('fonts-ready')
})
```

Why this matters:

- `document.fonts.ready` waits until declared fonts have loaded or timed out
- `clearTextureAtlas()` forces xterm to rebuild cached glyph bitmaps
- `safeFit()` recalculates terminal geometry after the real font metrics are available

`font-display: block` is also important here. It prevents the browser from briefly measuring layout with a fallback font and then swapping later, which would make xterm fit against the wrong character dimensions.

---

## Problem 4: WebGL May Be Available but Not Truly Accelerated

In devcontainers, VMs, and some remote environments, Chrome may expose WebGL through **SwiftShader** or another software implementation instead of a real GPU.

Symptoms include console messages such as:

```text
Automatic fallback to software WebGL has been deprecated.
GL Driver Message (OpenGL, Performance): GPU stall due to ReadPixels
```

Software WebGL is usually a bad trade:

- slower than real GPU-backed WebGL
- still susceptible to scaling softness
- likely to get less friendly browser support over time

The component detects software renderers before loading the addon:

```ts
const isSoftwareWebGL = (): boolean => {
    try {
        const probe = document.createElement('canvas')
        const gl = probe.getContext('webgl2') ?? probe.getContext('webgl')
        const ext = gl?.getExtension('WEBGL_debug_renderer_info')
        const renderer = ext ? gl!.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string : ''
        return /swiftshader|software|llvmpipe|mesa offscreen/i.test(renderer)
    } catch { return false }
}
```

**Current conclusion:** WebGL is still the right primary renderer, but only when it is actually hardware-accelerated.

---

## Current Renderer Strategy

The renderer strategy is now:

```text
Real GPU available?
  YES -> WebGL addon
   |
   \-> if WebGL context is lost at runtime, fall back to DOM
  NO  -> DOM renderer
```

Trade-offs:

- **WebGL**: best option for Nerd Font glyphs and overall terminal fidelity
- **DOM**: safe fallback, but wide Nerd Font glyphs may clip

---

## Problem 5: WebGL Still Looks Soft Inside Slidev

This is the main remaining quality problem.

Slidev renders slides at a fixed logical size and then scales them with CSS `transform: scale()` to fit the browser window. That means the terminal's canvas is often rendered at its layout-pixel size and then enlarged again by Slidev.

Example:

- xterm renders a canvas at `371px` wide
- Slidev visually scales that slide so the canvas appears around `864px` wide
- the browser upscales the bitmap
- text looks softer than expected, especially on larger external displays where the slide scale factor is higher

This softness is not the same problem as software WebGL. It can happen even on a laptop with a real GPU if Slidev is scaling the slide aggressively.

---

## What We Learned from the DPR Experiment

A previous experiment overrode `window.devicePixelRatio` to compensate for Slidev's CSS scale.

The idea was directionally correct:

- if Slidev scales the slide by `2.0x`
- and xterm believes the effective DPR is `nativeDpr * 2.0`
- then the WebGL canvas backing store can be sized closer to the final visual pixel size
- which makes the terminal noticeably sharper

So the experiment proved something important:

**WebGL can look much crisper if its backing store matches the post-scale visual size.**

The problem was not the rendering principle. The problem was the way the override was applied.

A global DPR override interacted badly with initialization:

- xterm sometimes starts before a meaningful fit can run
- when fit is skipped, xterm temporarily assumes default geometry such as 80 columns
- with an inflated DPR, that default geometry produces an oversized canvas
- the result is text that looks huge or overflows during mount

That means the old conclusion of "DPR compensation is wrong" was too strong.

A better conclusion is:

- **global DPR override is too blunt**
- **scale-aware backing-store compensation is still promising**
- the missing piece is stable initialization and tighter scoping

---

## What To Focus On Next for Crisper WebGL

If the goal is sharper rendering, these are the most promising directions.

### 1. Make scale compensation local, not global

Instead of overriding `window.devicePixelRatio` for the whole page, compute the terminal's effective Slidev scale from its container:

- `visualWidth = getBoundingClientRect().width`
- `layoutWidth = offsetWidth`
- `scale = visualWidth / layoutWidth`

Then use that value only for the terminal instance when sizing or refreshing the renderer.

The key idea is to increase the backing-store resolution without lying to the rest of the page.

### 2. Only apply crispness logic after a successful fit

Do not apply any scale compensation while the container is tiny, hidden, or still in a thumbnail context.

The terminal should first satisfy the same conditions already enforced by `safeFit()`:

- container is large enough
- active slide, not a tiny preview
- real layout has settled

Only then should we try to sharpen the renderer.

### 3. Re-run the renderer path when scale changes materially

A big monitor change, presenter view change, or browser resize can alter Slidev's scale factor significantly. If the scale crosses a threshold, we should treat that like a renderer-quality event:

- recalculate effective scale
- rerun fit
- clear the texture atlas if font metrics or rasterization assumptions changed
- refresh the terminal

### 4. Keep the long-term escape hatch in mind

If Slidev's scaled ancestor keeps fighting xterm internals, the strongest fix is architectural: render the live terminal **outside** the scaled slide tree and visually position it over the slide.

In Vue terms, that likely means a `Teleport`-based overlay mounted under `document.body` and synchronized to the placeholder element's `getBoundingClientRect()`.

That approach avoids CSS transform upscaling entirely.

---

## Supporting Fixes That Still Matter

### Mouse coordinate correction

Because Slidev scales the slide with CSS transforms, mouse coordinates arriving from the browser do not line up with xterm's internal layout math. The component already corrects mouse events by dividing by the ancestor scale factor before xterm sees them.

That fix remains valid.

### Textarea listener cleanup

Focus and blur listeners attached to `terminal.textarea` must be removable. Anonymous handlers leaked across remounts; named handlers fixed that.

### `clearTextureAtlas()` usage

`terminal.clearTextureAtlas()` is still useful, but only at specific times:

- after webfonts finish loading
- after renderer state changes materially

Do not call it on every resize.

---

## Font Stack

```text
'JetBrainsMono Nerd Font Mono', 'Symbols Nerd Font Mono', monospace
```

This is loaded via `@font-face` from the jsDelivr Nerd Fonts CDN. The font is mainly required for Nerd Font glyphs used by Starship and terminal UIs such as k9s.

---

## Bottom Line

The rendering story is now simpler than it used to be:

- **Canvas is gone in xterm v6** and should not be part of the design discussion
- **WebGL is the right renderer** when hardware acceleration is real
- the main remaining quality issue is **Slidev's CSS scaling**, which softens even hardware-accelerated WebGL on large displays
- the most promising path is **scale-aware WebGL sharpening**, not giving up on WebGL

If we want the terminal to look better on big screens, the next experiments should focus on per-instance scale compensation and, if needed, rendering the terminal outside Slidev's scaled DOM tree.
