---
layout: default
transition: fade
---

###### One chair, in any format

# It's all text-based files.<br><span class="green">What format do you like?</span>

<div class="tiles" :class="{ picked: $clicks >= 2 }">
  <div class="tile"><b>seat.ini</b><pre v-pre>[seat]
row = 6
column = 6
color = "#a8e05f"</pre></div>
  <div class="tile"><b>seat.xml</b><pre v-pre>&lt;seat row="6" column="6"&gt;
  &lt;color&gt;#a8e05f&lt;/color&gt;
&lt;/seat&gt;</pre></div>
  <div class="tile"><b>seat.json</b><pre v-pre>{
  "row": 6,
  "column": 6,
  "color": "#a8e05f"
}</pre></div>
  <div class="tile pick"><b>seat.yaml</b><pre v-pre>row: 6
column: 6
color: "#a8e05f"</pre></div>
  <div v-click class="tile avatar"><b>simon.jpg</b><img src="/images/simon-portret.jpg" alt="An uploaded avatar" /><span class="even">even this</span></div>
</div>

<p v-click class="how">My suggestion: <span class="green">use YAML.</span></p>

<!--
11:30. INI, XML, JSON, YAML. It's all text-based files. We have a lot of valuable formats, and your application already reads one of them. It doesn't have to change.

[click] And think wider than text: the pictures people upload as an avatar. Those are also something a user configured.

[click] You don't need or want all of them. My suggestion: use YAML.
-->

<style>
.slidev-layout .green { color: var(--good); }
.tiles { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 20px; margin-top: 32px; }
.tile { transition: opacity .4s, border-color .4s; display: flex; flex-direction: column; gap: 14px; height: 250px; box-sizing: border-box; padding: 18px 16px; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 12px; }
.tile b { font-family: var(--mono); font-size: 21px; font-weight: 600; color: var(--accent); }
.tile pre { margin: 0; font-family: var(--mono); font-size: 16px; line-height: 1.6; color: var(--text); background: none; white-space: pre; }
.avatar img { flex: 1; min-height: 0; width: 100%; object-fit: cover; object-position: 50% 20%; border-radius: 8px; }
.even { font-size: 18px; text-align: center; color: var(--amber); }
.picked .tile { opacity: .35; }
.picked .tile.pick { opacity: 1; border-color: var(--good); }
.how { margin: 48px 0 0; font-size: 44px; font-weight: 600; line-height: 1.2; color: var(--text); opacity: 1; }
</style>
