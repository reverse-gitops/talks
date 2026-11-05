<!--
  The whole talk on one slide: shown right after the title and again at the very end.
  The default slot is the line at the bottom, which is what differs between the two.
-->
<template>
  <div class="tldr">
    <div class="top">
      <div class="label">TLDR;</div>
      <a class="download" href="https://koudijs.dev/speaking" target="_blank" rel="noopener">slides at: <b>koudijs.dev/speaking</b></a>
    </div>
    <h1>Package settings <span class="green">into an image.</span></h1>

    <TalkChain at="image" />

    <div class="points">
      <div><strong>Model config text-based</strong><span>Desired state, format choice is yours: YAML, XML, INI, JPG...</span></div>
      <div><strong>A clear place to point at</strong><span>What is production running? This digest.</span></div>
      <div><strong>Promoted like code</strong><span>Workloads now get 2:<br> executable image <br>config image</span></div>
    </div>

    <p class="foot"><slot /></p>

    <Sources label="links" :items="[
      { name: 'GitOps Reverser', href: 'https://github.com/ConfigButler/gitops-reverser' },
      { name: 'settings-image', href: 'https://github.com/ConfigButler/settings-image' },
      { name: 'Reverse GitOps', href: 'https://reversegitops.dev' },
      { name: 'Config Deserves Better', href: 'https://configdeservesbetter.dev' },
    ]" />
  </div>
</template>

<style scoped>
.tldr { display: flex; flex-direction: column; height: 100%; padding-bottom: 92px; box-sizing: border-box; }
.top { display: flex; align-items: center; justify-content: space-between; gap: 32px; margin-bottom: 8px; }
.label { font-family: var(--mono); font-size: 44px; font-weight: 600; color: var(--accent); }
.download { padding: 10px 18px; font-size: 25px; color: var(--text); text-decoration: none; background: var(--panel); border: 1px solid var(--accent); border-radius: 10px; }
.download b { color: var(--accent); }
.tldr h1 { font-size: 66px; margin-bottom: 44px; }
.tldr h1 .green { color: var(--good); }
.points { display: grid; grid-template-columns: repeat(3, 1fr); gap: 48px; margin-top: 44px; }
.points div { display: flex; flex-direction: column; gap: 12px; }
.points strong { font-size: 36px; line-height: 1.2; }
.points span { font-size: 27px; line-height: 1.35; color: var(--soft); }
.foot { margin: auto 0 0; font-size: 26px; line-height: 1.35; color: var(--soft); }
</style>
