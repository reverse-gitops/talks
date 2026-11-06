<!--
  The open-source projects behind a slide, as a row of links along its bottom edge.
    <Sources :items="[{ name: 'krm-foyer', href: 'https://github.com/ConfigButler/krm-foyer', note: '…' }]" />
  A logo (from public/images/logos) sits on a light tile, so dark logos still read on the dark slide.
  `slim` puts them on one line in the top-right corner, for slides whose bottom edge is taken by a caption or a terminal.
-->
<script setup>
defineProps({
  items: { type: Array, required: true }, // { name, href, note?, logo? }
  label: { type: String, default: 'open source' },
  slim: Boolean,
})

const short = (href) => href.replace(/^https?:\/\//, '').replace(/\/$/, '')
// Logos are root paths into public/; prefix the base so they also load when the deck is hosted under a path.
const asset = (path) => path.startsWith('/') ? import.meta.env.BASE_URL + path.slice(1) : path
</script>

<template>
  <div class="sources" :class="{ slim }">
    <span class="label">{{ label }}</span>
    <a v-for="item in items" :key="item.href" class="source" :href="item.href" target="_blank" rel="noopener">
      <img v-if="item.logo" class="logo" :src="asset(item.logo)" :alt="''">
      <span class="text">
        <b>{{ item.name }}</b>
        <span class="url">{{ short(item.href) }}</span>
        <span v-if="item.note" class="note">{{ item.note }}</span>
      </span>
    </a>
  </div>
</template>

<style scoped>
.sources { position: absolute; left: 64px; right: 64px; bottom: 40px; z-index: 1; display: flex; align-items: center; gap: 16px; }
.label { font-family: var(--mono); font-size: 12px; letter-spacing: .2em; text-transform: uppercase; color: var(--muted); writing-mode: vertical-rl; transform: rotate(180deg); }
.source { display: flex; align-items: center; gap: 14px; padding: 12px 18px; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 12px; text-decoration: none; color: var(--text); }
.source:hover { border-color: var(--accent); }
.logo { width: 44px; height: 44px; padding: 6px; box-sizing: border-box; object-fit: contain; background: #fff; border-radius: 10px; }
.text { display: flex; flex-direction: column; gap: 2px; }
.text b { font-size: 19px; line-height: 1.2; }
.url { font-family: var(--mono); font-size: 13px; color: var(--accent); }
.note { font-size: 14px; color: var(--soft); }
.slim { left: auto; right: 64px; top: 20px; bottom: auto; gap: 10px; }
.slim .label { display: none; }
.slim .source { padding: 6px 12px; border-radius: 9px; }
.slim .text { flex-direction: row; align-items: baseline; gap: 10px; }
.slim .text b { font-size: 16px; }
.slim .url { font-size: 14px; }
</style>
