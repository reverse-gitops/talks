# Reverser deck (Slidev)

The animated Reverser deck from [`../reverser-deck`](../reverser-deck), rebuilt as a native
Slidev presentation. The steps are Slidev clicks, there are speaker notes, and presenter mode,
overview and export all work.

```sh
npm install
npm run dev       # http://localhost:3030 (presenter: /presenter)
npm run shots     # with dev running: one PNG per click in shots/ (npm run shots -- 2 for slide 2)
npm run build     # static site in dist/
npm run export    # PDF, one page per click
```

The PDF linked from the [main README](../README.md) is `task export-reverser-pdf` from the repo root:
one page per slide, in `dist/settings-that-break-production.pdf`. In that export the demo
terminals show their commands instead of a live shell, and the title slide leaves out the
rotating join code.

## Adding a slide

The order is the list of `src:` blocks in [slides.md](slides.md). To add a slide, add a file in
`pages/` and a block where it should go. A plain markdown slide only needs a built-in layout
(`cover`, `default`, `center`, `two-cols`, …); [styles/index.css](styles/index.css) gives those the
Reverser look. See [title.md](pages/title.md) and [wishlist.md](pages/wishlist.md):

```md
---
layout: default
transition: fade
---

###### Small caps eyebrow

# Title

<v-clicks>

- **first point**, shown on click 1
- **second point**, shown on click 2

</v-clicks>
```

Text colours: `<span class="green">…</span>` (also `red`, `blue`, `amber`, `violet`).

Code lives in real files under [snippets/](snippets) and is pulled in with Slidev's
`<<< @/snippets/…` import (Shiki highlighting, stock theme). For code that changes on a click,
wrap two imports in a Magic Move block, as [delivery.md](pages/delivery.md) does for the
42 → 43 tag bump:

`````md
````md magic-move {at:2}
<<< @/snippets/delivery/deployment-42.yaml
<<< @/snippets/delivery/deployment-43.yaml
````
`````

## How a diagram slide is built

Every slide uses the `diagram` layout ([layouts/diagram.vue](layouts/diagram.vue)), a 1600×900
canvas (`canvasWidth: 1600`). Coordinates are copied from the original design, so `left`/`top`
values are canvas pixels.

```md
---
eyebrow: The problem          # small caps line above the title
clicks: 3                     # number of steps after the slide opens
diveIn: 300px 330px           # where the zoom lands when the slide arrives (optional)
diveOut: 950px 460px          # where the zoom dives in when you leave (optional)
---

# Title with <span class="red">a red part</span>

Lead paragraph under the title.

<div class="stage" :class="{ frozen: $clicks === 1 }">
  …boxes, arrows, moving dots…
</div>

<Story>

- **label** Caption for click 0.
- **label** Caption for click 1.

</Story>

<!-- speaker notes, with [click] markers -->

<style>/* this slide's own classes and @keyframes (scoped by Slidev) */</style>
```

The animation rules are kept to four, all plain Vue and CSS:

| What | How |
| --- | --- |
| A state that changes at a click (border turns red, label swaps, text appears) | `:class="{ bad: $clicks >= 2 }"` and a CSS `transition`, or `v-click="3"` for something that only appears |
| A one-shot motion during a step (a dot travelling a path, a flash) | `<i v-if="$clicks === 1" class="…" />` with a CSS `@keyframes`: it plays when the click mounts it |
| Background motion (traffic, emails, heartbeats) | an infinite CSS animation with class `loop`; a `.frozen` ancestor pauses it |
| Something timed inside a step | `animation-delay` / `transition-delay` (see `.late` in [problem.md](pages/problem.md)) |

Going back a click lands on that step's finished state: one-shot motions jump to their end
instead of replaying (a rule on Slidev's `slidev-nav-go-backward` class in
[styles/index.css](styles/index.css)). Background loops keep running.

For delays that should only apply on the click that makes the change, put the click on the stage
(`` :class="`s${$clicks}`" ``) and scope the delay: `.s4 .commit { transition-delay: 1.7s }`
(see [big-picture.md](pages/big-picture.md)). Use `.off` to hide things, not `.hidden`: that name
is a UnoCSS `display: none` utility and kills the fade.

Shared building blocks:

- [styles/index.css](styles/index.css): colour tokens, `.box` (card), `.zone` (region), `.tag`,
  `.kicker`, `.at` (absolute), `.off`/`.fade`, `.bad`/`.good` (border + glow), `.loop`/`.frozen`,
  text colours `.red`/`.green`/`.blue`, and the `dive` slide transition.
- [components/Arrow.vue](components/Arrow.vue): `<Arrow points="x,y x,y …" />`, with an arrowhead on the
  last point, `:head="false"`, `color`, `dash`.
- [components/Story.vue](components/Story.vue): the captions and the step timeline at the bottom.
- [components/Counter.vue](components/Counter.vue): `<Counter :from="2" :rate="1" />` counts up in real
  time from click 2.
