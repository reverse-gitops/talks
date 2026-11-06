---
layout: default
transition: fade
---

<script setup>
import { useNav } from '@slidev/client'

const { isPrintMode } = useNav()
</script>

###### Who am I?

<div class="about">
  <img class="portrait" src="/images/simon-portret.jpg" alt="Simon Koudijs" />
  <div class="bio">
    <h1>Simon Koudijs</h1>
    <p class="role"><code>[Software|Product|Cloud|AI] engineer</code></p>
    <ul>
      <li>From the Netherlands</li>
      <li>Left my engineering job in 2025 to build my own company</li>
      <li>Frustrated by settings pages: do we still build that ourselves?</li>
      <li><a href="https://koudijs.dev" target="_blank"><strong>koudijs.dev</strong></a>: consultancy, training, speaking</li>
      <li><a href="https://configbutler.ai" target="_blank"><strong>ConfigButler</strong></a>: the hosted product of this idea</li>
    </ul>
  </div>
  <div v-if="!isPrintMode" class="join">
    <RoomQRCode :size="300" />
    <p><strong>Not in yet?</strong> Scan it, and pick your chair</p>
  </div>
</div>

<style>
.about { display: grid; grid-template-columns: 430px 1fr 320px; gap: 44px; align-items: center; margin-top: 8px; }
.portrait { width: 430px; height: 620px; object-fit: cover; object-position: 50% 20%; border-radius: 16px; border: 1px solid var(--line-strong); }
.bio h1 { margin-bottom: 8px; font-size: 56px; }
.bio .role { font-size: 19px; margin: 0 0 20px; opacity: 1; }
.bio ul { margin: 0; }
.slidev-layout .bio li { font-size: 25px; line-height: 1.3; margin: 14px 0; }
.bio li a { color: inherit; text-decoration: none; border-bottom: 2px solid var(--accent); }
.bio li a:hover { color: var(--accent); }
.join { display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; }
.join p { margin: 0; font-size: 24px; line-height: 1.3; color: var(--soft); opacity: 1; }
</style>

<!--
**1:25 · 0:20**

Hard stop. Nobody is here for the bio. Leave the QR up a moment.
-->
