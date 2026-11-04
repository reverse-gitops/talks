# Configuration Deserves a Software Delivery Process Too

Øredev 2026, talk 1 (Thu 5 Nov 14:55, Stamp). A Slidev deck that started as a copy of
[`settings-that-break`](../../settings-that-break); that folder's README explains how diagram slides
and their animations are built. See [running.md](running.md) for what to start on stage.

```sh
npm install
npm run dev       # http://localhost:3030 (presenter: /presenter)
npm run shots     # with dev running: one PNG per click in shots/ (npm run shots -- 3 for slide 3)
npm run build     # static site in dist/
npm run export    # PDF, one page per click
```

## Slide order

The order is the list of `src:` blocks in [slides.md](slides.md), and follows
[talk-outline.md](talk-outline.md). The talk starts and ends with the TLDR
([Tldr.vue](components/Tldr.vue)). The slides after `tldr-end` come from the old deck and carry
`hide: true`: remove that line, and move the block, to bring one into the talk.

## The big equation

[components/ProductionEquation.vue](components/ProductionEquation.vue) is the code + config + infra
equation. It is one still slide in [equation.md](pages/equation.md) (the intro). To bring it back later in the
talk, add a page that drives it from `$clicks`. Two pages that are no longer in the deck show how:
[equation-tools.md](pages/equation-tools.md) (what each part gets, in its `#code`, `#config` and `#infra` slots)
and [equation-registry.md](pages/equation-registry.md) (the delivery chain: CI under code, CD under infra, the registry between them).

## The room

The seat map and QR default to the `ordev-1-stamp` Room in
[SeatMap.vue](components/SeatMap.vue) and [RoomQRCode.vue](components/RoomQRCode.vue). The seat map's
size has to match that Room's SeatingPlan in `external/k8s`: 15 rows of 20 is still a placeholder.
