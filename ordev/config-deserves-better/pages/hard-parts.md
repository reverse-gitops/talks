---
layout: default
transition: fade
---

# The hard parts

<!-- The numbers come back in the eyebrow of every answer: Hard part 1, 2, 3a–3c, 4. -->
<ol class="hard">
  <li v-click><b class="n">1</b><div><strong>Public access</strong><span>getting people outside the cluster to the API, safely</span></div></li>
  <li v-click><b class="n">2</b><div><strong>Modelling your application</strong><span>building the CRDs</span></div></li>
  <li v-click><b class="n">3</b><div><strong>Convincing people</strong>
    <ol class="sub">
      <li><b>a</b>architects</li>
      <li><b>b</b>developers</li>
      <li><b>c</b>cluster admins</li>
    </ol>
  </div></li>
  <li v-click><b class="n">4</b><div><strong>Explaining it to GitOps people</strong><span>this is the source of truth</span></div></li>
</ol>

<!--
[click] One: public access.

[click] Two: modelling your application, building CRDs.

[click] Three: convincing people. a, the architects. b, the developers. c, the cluster admins.

[click] Four: explaining to GitOps people that this is the source of truth.

Then one by one, in this order.
-->

<style>
.slidev-layout ol.hard, .slidev-layout ol.sub { padding: 0; margin-left: 0; }
.hard { list-style: none; margin: 8px 0 0; display: flex; flex-direction: column; gap: 22px; }
.hard > li { display: flex; align-items: flex-start; gap: 24px; margin: 0; }
.hard .n { flex: none; width: 56px; height: 56px; border-radius: 28px; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; color: var(--bg); background: var(--good); }
.hard > li > div { display: flex; flex-direction: column; gap: 2px; padding-top: 6px; }
.hard strong { font-size: 32px; line-height: 1.2; }
.hard > li > div > span { line-height: 1.3; }
.hard span { font-size: 22px; color: var(--soft); }
.sub { list-style: none; margin: 10px 0 0; display: flex; gap: 28px; }
.sub li { display: flex; align-items: center; gap: 10px; margin: 0; font-size: 22px; color: var(--soft); }
.sub b { width: 32px; height: 32px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 17px; color: var(--good); border: 2px solid var(--good); }
</style>
