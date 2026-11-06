---
layout: default
transition: fade
---

<script setup>
import { renderSVG } from 'uqr'

const linkedin = 'https://www.linkedin.com/in/simonkoudijs'
const qrOptions = { ecc: 'M', border: 2, whiteColor: '#FFFFFF', blackColor: '#0B0F14' }
const linkedinQr = renderSVG(linkedin, qrOptions)
</script>

###### One ask

# What's the ingredient <span class="green">I'm missing?</span>

<div class="ask">
  <div class="main">
    <p class="lead">If this appeals somewhere: <span class="green">connect or let me know!</span></p>
    <p class="detail">Tell me <strong>one more ingredient</strong>. Critical questions are the most welcome. I won't spam you. I'd just love to hear from you.</p>
    <a class="mail" href="mailto:simon@koudijs.dev">simon@koudijs.dev</a>
    <p v-click class="close">The most valuable thing for me: <span class="green">people who give feedback.</span></p>
    <a class="slides" href="https://koudijs.dev/speaking" target="_blank" rel="noopener">
      <span class="when">koudijs.dev/speaking</span>
      <span class="what">The slides of both talks</span>
    </a>
  </div>
  <div class="room">
    <span class="kind">the room · turing</span>
    <SeatMap size="medium" :preview="60" />
  </div>
  <div class="cards">
    <a class="card" href="https://www.linkedin.com/in/simonkoudijs" target="_blank">
      <span class="kind">connect · LinkedIn</span>
      <div class="code" v-html="linkedinQr" />
      <span class="url">linkedin.com/in/simonkoudijs</span>
    </a>
    <div class="card feedback">
      <span class="kind">feedback · Sessionize</span>
      <img class="code" src="/images/qr-sessionize-feedback.png" alt="QR code for session feedback on Sessionize">
      <span class="url">rate this session</span>
    </div>
  </div>
</div>

<style>
.slidev-layout h1 { font-size: 56px; margin-bottom: 20px; }
.ask { display: grid; grid-template-columns: 1fr auto 340px; gap: 36px; align-items: stretch; }
.main { display: flex; flex-direction: column; gap: 22px; }
.lead { font-size: 36px; line-height: 1.2; font-weight: 700; margin: 0; }
.detail { font-size: 26px; line-height: 1.35; color: var(--soft); margin: 0; }
.mail { align-self: flex-start; font-family: var(--mono); font-size: 38px; font-weight: 600; color: var(--good); text-decoration: none; }
.close { font-size: 26px; line-height: 1.3; margin: 0; }
.slides { margin-top: auto; display: flex; text-decoration: none; flex-direction: column; gap: 6px; padding: 18px 22px; background: var(--panel); border: 1px solid var(--accent); border-radius: 14px; }
.slides .when { font-size: 34px; font-weight: 700; color: var(--accent); }
.slides .what { font-size: 21px; line-height: 1.3; color: var(--soft); }
.room { display: flex; flex-direction: column; gap: 12px; }
.kind { font-family: var(--mono); font-size: 13px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }
.cards { display: flex; flex-direction: column; gap: 16px; }
.card { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 12px 18px; background: var(--panel); border: 1px solid var(--good); border-radius: 16px; text-decoration: none; color: inherit; }
.code { width: 240px; height: 240px; flex: none; border-radius: 10px; overflow: hidden; background: #fff; }
.code :deep(svg) { display: block; width: 100%; height: 100%; }
.card.feedback { border-color: var(--amber); }
.card .url { font-family: var(--mono); font-size: 14px; color: var(--soft); white-space: nowrap; }
</style>

<!--
**35:30 · stays up**

One ask, not a pitch. Connect or mail. One more ingredient I'm missing. Critical questions especially.

[click] Most valuable right now: people who give feedback.

Second QR: Sessionize, one minute. Slides at koudijs.dev/speaking. The room is still live.

Then questions.
-->
