# Reverser deck

An animated, step-through presentation about **Reverser** (Reverse GitOps): how
kube-apiserver activity becomes attributed Git commits, and how config ships back
to the app as an OCI artifact.

Plain HTML, CSS and JavaScript. Vite is used for the dev server and the build; there
is no framework and there are no runtime dependencies besides two self-hosted fonts,
so the built deck works offline on stage.

## Run it

```sh
npm install
npm run dev       # http://localhost:5173 with live reload
npm run build     # static site in dist/
npm run preview   # serve dist/ locally
npm run shots     # one PNG per step of every slide in shots/ (npm run shots -- big-picture for one slide)
```

`dist/` is a static site (relative paths), so you can host it anywhere: GitHub Pages,
any web server, or `python3 -m http.server` inside `dist/`. Opening
`dist/index.html` straight from disk does not work, because browsers block ES
modules on `file://`.

## Presenting

| Input | Action |
| --- | --- |
| → · PageDown · Space · Enter · click | next step, then the next slide |
| ← · PageUp · Backspace · right-click | previous step, then the previous slide (it opens on its last step) |
| F | fullscreen |
| Home · End · 1–7 | first, last, or slide *n* |

A step plays at most 2.5 s; pressing again while it plays finishes it at once, so
fast clicking skips animations. Background motion (order traffic, emails, window
timers, the failing-emails counter) keeps running while you talk.

The **Play** button runs a slide as one continuous animation, and the bar at the bottom
works as a scrub slider; this is handy when the deck is embedded on a website.

The URL hash remembers the slide (`#two-streams`).

## How it is built

```
index.html                 stage shell
src/main.js                fonts, base styles, starts the deck
src/deck.js                Deck: slide order, keyboard/mouse, fullscreen, hash, scaling
src/engine.js              SlideEngine: steps, live timers, freezes, play/scrub
src/parts/timeline.js      shared bottom bar: step labels, ticks, progress, scrub
src/parts/controls.js      shared top-right buttons: next slide, play/pause
src/styles/base.css        tokens, stage, animation primitives, part styles
src/slides/index.js        slide order
src/slides/<id>/
  slide.html               markup: one 1600×900 root
  slide.css                that slide's keyframes (loaded only while it is shown)
  index.js                 seconds, timeline labels, optional hooks
tools/import_canvas.py     one-off importer from the original design canvas
```

### Anatomy of a slide

Each slide is a single CSS-keyframe timeline. Every animated element has the class
`an` plus its own class with an `@keyframes`, written as percentages of the slide's
duration (`--T`, set from `seconds` in `index.js`). The engine presents that timeline
as steps, controlled by attributes in the markup:

| Markup | Meaning |
| --- | --- |
| `data-steps="0.29,0.44,0.69"` on the root | stop points, as fractions of the timeline |
| `data-live="0.1,0.43"` | keeps running in real time while you stand on a stop inside that range (window timers) |
| `data-freeze="0.44"` | looping animation that pauses while you stand on stop 0.44 |
| `class="intro"` | arrival zoom, played once when the slide opens |
| `data-zoom` + `data-zoom-origin` | the slide zooms into this point when you go to the next slide |
| `class="prog"` | invisible master clock (one per slide) |
| `data-bind="failCount"` | text filled from the slide's `vals()` hook |
| `data-part="timeline"` | where the shared timeline goes (its `top` is taken from the inline style) |

Optional hooks in `index.js`, called with `this` bound to the engine:

- `extraState()`: extra state fields
- `vals()`: values for `data-bind` elements
- `vars(seconds)`: CSS custom properties for the root
- `onFrame()`: runs every frame (the failing-emails counters use this)

### Adding a slide

1. Copy a folder in `src/slides/`, give it a new id and edit `slide.html` and `slide.css`.
2. Set `seconds`, `marks` (timeline labels) and `next` (the label of the top-right button) in `index.js`.
3. Add it to `src/slides/index.js`.
