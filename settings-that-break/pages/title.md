---
layout: default
transition: fade
---

<script setup>
import { useNav } from '@slidev/client'

const { isPrintMode } = useNav()
</script>

<div class="title-bg" />

###### Dutch Cloud Native Day · Mission 2

<div class="title">
  <div class="left">
    <h1>We GitOps'd everything<br><span class="green">except the settings that break production.</span></h1>
    <p class="by"><strong>Simon Koudijs</strong></p>
    <SeatMap size="medium" :preview="60" />
  </div>
</div>

<!-- Bottom right, so the light at the top of the photo stays in view.
     Not in the PDF: the join code rotates, so a printed one is always stale. -->
<div v-if="!isPrintMode" class="qr">
  <p class="ask">Scan, pick a name,<br><strong>claim your seat.</strong></p>
  <RoomQRCode :size="360" />
  <p class="hint">Seats 1–8 left of the aisle, 9–16 right.<br>Swipe the map sideways to find yours.</p>
</div>

<!--
Up while the room fills: doors open → scan, log in, answer the GitOps question, claim a seat.
The QR follows the mission2 Room's rotating join code; the squares fill in as people claim their seat.
The room: 160 seats, 10 rows of two blocks of 8 with the aisle between them. Row 1 is at the stage.
Seats 1–8 are left of the aisle, 9–16 right, counted as you face the stage. The phone map opens on
the aisle and is wider than the screen: say "swipe sideways to find your seat".

0:00 · "You've all just changed a setting. Remember that." Then straight into Alice.
-->

<style>
.title-bg {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background:
    linear-gradient(90deg, rgba(0,0,0,.85) 0%, rgba(0,0,0,.6) 55%, rgba(0,0,0,.75) 100%),
    url('/images/station-utrecht-color.jpg') center / cover no-repeat;
}
h6, .title { position: relative; z-index: 1; }
.title { margin-top: 8px; }
.title .left { max-width: 1048px; } /* the width it had beside the QR: the title wraps as before */
.title h1 { font-size: 64px; line-height: 1.1; margin-bottom: 16px; }
.title .by { font-size: 26px; color: var(--soft); margin: 0 0 32px; }
.qr { position: absolute; z-index: 1; right: 64px; bottom: 56px; display: flex; flex-direction: column; align-items: center; gap: 20px; }
.qr .ask { font-size: 30px; line-height: 1.3; text-align: center; color: var(--soft); margin: 0; }
.qr .hint { font-size: 20px; line-height: 1.4; text-align: center; color: var(--muted); margin: 0; }
</style>
