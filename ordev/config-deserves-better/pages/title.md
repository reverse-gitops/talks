---
layout: default
transition: fade
---

<script setup>
import { useNav } from '@slidev/client'

const { isPrintMode } = useNav()
</script>

<div class="title-bg" />

<div class="upper">
  <template v-if="!isPrintMode">
    <RoomQRCode :size="300" />
    <p class="ask"><strong>Config your chairs <span class="color">color</span>!</strong><span class="together">Get creative together</span><span class="hint">Scan it now and influence my presentation</span></p>
  </template>
  <div class="room">
    <SeatMap size="medium" :preview="60" />
    <div class="scribble">
      <span>live map of STAMP</span>
      <svg width="96" height="56" viewBox="0 0 96 56" fill="none" stroke="#0B0F14" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M4 42 C 26 54, 58 50, 88 16" />
        <path d="M70 15 L 89 14 L 87 34" />
      </svg>
    </div>
  </div>
</div>

<div class="title">
  <h6>Øredev 2026</h6>
  <h1>Configuration deserves<br><span class="green">a software delivery process too.</span></h1>
  <p class="by"><strong>Simon Koudijs</strong><span class="company">ConfigButler</span></p>
</div>

<!--
Up while the room fills: doors open → scan, log in, answer the question, claim a seat.
The QR follows the ordev-1-stamp Room's rotating join code; the squares fill in as people claim their seat.
The room: 240 seats, 16 rows of 8 and 7 with the aisle between them. Row 1 is at the stage.
Seats 1–8 are left of the aisle, 9–15 right, counted as you face the stage.

0:00 · "You've all just changed a setting. Remember that." Then the big equation.
-->

<style>
.title-bg {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background: url('/images/view-hotel-malmo.jpg') center / cover no-repeat;
}
/* The upper half of the slide, where the sky is light: so the components' light text turns dark. */
.upper {
  --text: #0B0F14; --soft: #0B0F14; --muted: #0B0F14;
  position: absolute; z-index: 1; left: 0; right: 0; top: 0; height: 490px;
  display: flex; align-items: center; justify-content: center; gap: 64px;
}
.ask { margin: 0; color: #0B0F14; text-align: center; transform: rotate(-3deg); }
.ask strong { display: block; font-size: 46px; line-height: 1.15; color: #0B0F14; }
.ask .color { padding: 0 .18em; border-radius: 10px; background: #7EE0A1; }
.ask .together { display: block; margin-top: 14px; font-size: 30px; font-style: italic; }
.ask .hint { display: block; margin-top: 10px; font-size: 20px; line-height: 1.3; opacity: .75; }
.room { position: relative; }
.scribble {
  position: absolute; right: calc(100% + 10px); bottom: 44px;
  display: flex; align-items: flex-end; gap: 6px; white-space: nowrap;
  font-family: 'Caveat', cursive; font-size: 40px; font-weight: 600; line-height: 1; color: #0B0F14;
  transform: rotate(-3deg);
}
.title { position: absolute; z-index: 1; left: 0; right: 0; bottom: 56px; text-align: center; }
.title h6 { color: var(--text); }
.title h1 { font-size: 64px; line-height: 1.1; margin-bottom: 16px; }
.title .by { font-size: 26px; color: var(--text); margin: 0; }
.title .company { margin-left: .7em; }
</style>
