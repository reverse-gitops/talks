---
layout: default
transition: fade
---

<script setup>
import { renderSVG } from 'uqr'

const linkedin = 'https://www.linkedin.com/in/simonkoudijs'
const repo = 'https://github.com/ConfigButler/gitops-reverser'
const qrOptions = { ecc: 'M', border: 2, whiteColor: '#FFFFFF', blackColor: '#0B0F14' }
const linkedinQr = renderSVG(linkedin, qrOptions)
const repoQr = renderSVG(repo, qrOptions)
</script>

###### One ask

# What's the ingredient <span class="green">I'm missing?</span>

<div class="ask">
  <div class="main">
    <p class="lead">Connect with me, and tell me <strong>one more ingredient</strong>. Critical questions are the most welcome.</p>
    <p class="promise">I won't spam you. I'd just love to hear from you.</p>
    <p v-click class="close">The most valuable thing for me: <span class="green">people who give feedback.</span></p>
  </div>
  <a class="card" href="https://www.linkedin.com/in/simonkoudijs" target="_blank">
    <span class="kind">connect · LinkedIn</span>
    <div class="code big" v-html="linkedinQr" />
    <span class="url">linkedin.com/in/simonkoudijs</span>
  </a>
  <a class="card small" href="https://github.com/ConfigButler/gitops-reverser" target="_blank">
    <span class="kind">or ⭐ star it</span>
    <div class="code" v-html="repoQr" />
    <span class="url">gitops-reverser</span>
  </a>
</div>

<!--
≈1:00 · One ask, not a sales pitch.

Connect on LinkedIn, and tell me one more ingredient that I'm missing. I won't spam you, I just want to hear from you. Critical questions too: especially those.

Or star GitOps Reverser on GitHub: it helps more than you think. Issues are welcome too.

[click] The most valuable thing for me right now is people who give feedback. Then questions.
-->

<style>
.ask { display: grid; grid-template-columns: 1fr 340px 220px; gap: 40px; align-items: end; margin-top: 16px; }
.main { align-self: center; }
.lead { font-size: 34px; line-height: 1.35; margin: 0 0 24px; }
.promise { font-size: 24px; color: var(--soft); margin: 0 0 40px; }
.close { font-size: 28px; margin: 0; }
.card { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 22px; background: var(--panel); border: 1px solid var(--good); border-radius: 16px; text-decoration: none; color: inherit; }
.card.small { border-color: var(--line-strong); }
.card .kind { font-family: var(--mono); font-size: 13px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }
.code { width: 170px; height: 170px; border-radius: 10px; overflow: hidden; background: #fff; }
.code.big { width: 290px; height: 290px; }
.code :deep(svg) { display: block; width: 100%; height: 100%; }
.card .url { font-family: var(--mono); font-size: 14px; color: var(--soft); white-space: nowrap; }
</style>
