---
layout: default
clicks: 2
transition: fade
---

###### From Git to an image

# From a commit to an image: <span class="green">just a CI step.</span>

<div class="two">
<div class="yaml">

```yaml
on:
  push:
    branches: [main]
    paths: [coffee/**]

jobs:
  publish:
    steps:
      - uses: actions/checkout@v7
        with:
          fetch-depth: 0
      - uses: ConfigButler/settings-image@v0.2.2
        with:
          path: coffee
          repository: cr.k8s.koudijs.dev/configbutler/coffee-settings
```

</div>

<div class="road">
  <div class="stop"><span class="label">A COMMIT</span><b>7fb011e</b><span>a change in the coffee/ folder</span></div>
  <div class="down" :class="{ off: $clicks < 1 }">↓</div>
  <div class="stop" :class="{ off: $clicks < 1 }"><span class="label">CI</span><b>build and push</b><span>the same kind of job you run for code</span></div>
  <div class="down" :class="{ off: $clicks < 2 }">↓</div>
  <div class="stop image" :class="{ off: $clicks < 2 }"><span class="label">AN IMAGE</span><b>coffee-settings:main-1793863598-7fb011e</b><span>sha256:00b28189…</span></div>
</div>
</div>

<Sources slim :items="[{ name: 'settings-image', href: 'https://github.com/ConfigButler/settings-image' }, { name: 'coffee-settings', href: 'https://github.com/ConfigButler/coffee-settings' }]" />

<!--
18:00. This is the real workflow of the coffee-settings repository, shortened. Nothing special: a push to main that touches that folder starts a job.

[click] Two steps: check out the repository, and call settings-image with the folder and where the image should go. That's all it takes.

[click] And out comes an image. This one is real: its tag still names the commit, and the digest is what we'll point at later. No registry password in the workflow either: the job logs in with its own OIDC token. That's the part I left out here.
-->

<style>
.slidev-layout .green { color: var(--good); }
.two { display: grid; grid-template-columns: 800px 1fr; gap: 48px; align-items: center; margin-top: 32px; }
.yaml :deep(pre) { font-size: 20px !important; line-height: 1.45 !important; padding: 20px 24px !important; border-radius: 12px; }
.yaml :deep(pre code) { background: none; padding: 0; }
.road { display: flex; flex-direction: column; }
.off { opacity: 0; }
.stop, .down { transition: opacity .5s ease; }
.stop { display: flex; flex-direction: column; gap: 4px; padding: 16px 20px; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 12px; }
.stop .label { font-family: var(--mono); font-size: 13px; letter-spacing: .1em; color: var(--muted); }
.stop b { font-family: var(--mono); font-size: 22px; line-height: 1.3; font-weight: 600; overflow-wrap: anywhere; }
.stop span:last-child { font-size: 20px; line-height: 1.3; color: var(--soft); }
.stop.image { border: 2px solid var(--good); }
.stop.image b, .stop.image span:last-child { color: var(--good); }
.stop.image span:last-child { font-family: var(--mono); }
.down { text-align: center; font-size: 34px; line-height: 44px; color: var(--good); }
</style>
