---
layout: default
transition: fade
---

###### Hard part 3b · Convincing developers

# Stop building settings screens. <span class="green">Ship a CRD.</span>

<div class="cols">
  <div>
    <h2><span class="red">Today, per app</span></h2>
    <ul>
      <li>A settings table and a migration</li>
      <li>An admin screen with its own validation</li>
      <li>Who may change what: hand-rolled</li>
      <li>History and rollback: usually none</li>
    </ul>
  </div>
  <div v-click>
    <h2><span class="green">With kube-api, for free</span></h2>
    <ul>
      <li>Schema validation: OpenAPI and CEL rules</li>
      <li>RBAC per resource, plus an audit log</li>
      <li>Read them live from the API, with a watch</li>
      <li>Or just as a file, in a mounted volume</li>
      <li><code>kubectl</code>, any GUI, any script or AI agent</li>
    </ul>
  </div>
</div>

<Sources label="read more" :items="[{ name: 'Config Deserves Better', href: 'https://configdeservesbetter.dev', note: 'the pattern, zoomed out: 13 principles for config' }]" />

<!--
≈1:00 · Every app team rebuilds the same thing: a table, a screen, some checks, maybe an audit log.

[click] Put the settings in a CRD and the API server hands you all of that. The app reads its own objects from the API, with a watch, or simply gets them as a file through a mounted volume.

Honestly: I haven't found this one easy. People like their database. Moving settings out of it feels like giving away control, even when they keep every bit of it.
-->

<style>
.cols { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; }
.cols h2 { margin: 0 0 8px; }
.cols li { font-size: 24px; margin: 12px 0; }
</style>
