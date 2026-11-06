# (Ab)using the Kubernetes API as a Configuration Backend

Øredev 2026, talk 2 (Fri 6 Nov 11:15, Turing). A Slidev deck set up the same way as
[`config-deserves-better`](../config-deserves-better). See [running.md](running.md) for what to start on stage.

```sh
npm install
npm run dev       # http://localhost:3030 (presenter: /presenter)
npm run shots     # with dev running: one PNG per click in shots/ (npm run shots -- 3 for slide 3)
npm run build     # static site in dist/
npm run export    # PDF, one page per click
```

## Room to breathe

The feedback on talk 1: slides were too dense, and there was too little room to breathe. So in this deck:

- **One idea per slide.** If a slide needs a second idea, it becomes a second slide.
- **Pauses are slides.** `layout: breath` puts one short line on an empty slide. Say it, then stop talking.

## Slide order

The order is the list of `src:` blocks in [slides.md](slides.md), and follows [talk-outline.md](talk-outline.md).

The talk is one picture, [Tldr.vue](components/Tldr.vue). It starts and ends the talk complete, and each of the seven
cornerstones opens on the same picture with one block lit: `<Tldr at="auth">the one sentence</Tldr>`.

## The room

The seat map and QR default to the `ordev-2-turing` Room in [SeatMap.vue](components/SeatMap.vue) and
[RoomQRCode.vue](components/RoomQRCode.vue). The QR stays empty until the cluster has switched to that Room: see
[the checklist](../checklist.md).
