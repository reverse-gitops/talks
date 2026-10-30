---
layout: default
transition: fade
---

###### Who am I?

<div class="about">
  <img src="/images/simon-portret.jpg" alt="Simon Koudijs" />
  <div>
    <h1>Simon Koudijs</h1>
    <p class="role"><code>[Software|Product|Cloud|AI] engineer</code></p>
    <ul>
      <li>From the Netherlands</li>
      <li>Left my job in 2025 to build my own company</li>
      <li><a href="https://koudijs.dev" target="_blank"><strong>koudijs.dev</strong></a>: consultancy, training, speaking</li>
      <li><a href="https://reversegitops.dev" target="_blank"><strong>reversegitops.dev</strong></a>: the pattern, and a manifesto</li>
      <li><a href="https://configbutler.ai" target="_blank"><strong>ConfigButler</strong></a>: the hosted product of this idea</li>
    </ul>
  </div>
</div>

<!--
≈0:45, hard stop. Nobody is here for the bio.
-->

<style>
.about { display: grid; grid-template-columns: 520px 1fr; gap: 72px; align-items: center; margin-top: 8px; }
.about img { width: 520px; height: 640px; object-fit: cover; object-position: 50% 20%; border-radius: 16px; border: 1px solid var(--line-strong); }
.about h1 { margin-bottom: 8px; }
.about .role { font-size: 22px; margin: 0 0 24px; }
.about li { font-size: 26px; margin: 14px 0; }
.about li a { color: inherit; text-decoration: none; border-bottom: 2px solid var(--accent); }
.about li a:hover { color: var(--accent); }
</style>
