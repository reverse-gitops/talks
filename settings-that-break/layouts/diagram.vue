<!--
  A 1600×900 diagram slide. Markdown in the slide gives the title block:
    # Heading                 → the big title
    first paragraph           → the lead text under it
  Frontmatter:
    eyebrow   small caps line above the title
    diveIn    transform-origin for the zoom when this slide arrives ("300px 330px")
    diveOut   transform-origin for the zoom when this slide is left with `transition: dive`
-->
<template>
  <div
    class="slidev-layout diagram"
    :style="{ '--dive-in': $frontmatter.diveIn, '--dive-out': $frontmatter.diveOut }"
  >
    <div v-if="$frontmatter.eyebrow" class="eyebrow">{{ $frontmatter.eyebrow }}</div>
    <slot />
  </div>
</template>

<style>
.slidev-layout.diagram {
  position: relative; width: 1600px; height: 900px; padding: 0; overflow: hidden;
  background: var(--bg); color: var(--text); font-family: var(--sans);
}
.diagram > .eyebrow {
  position: absolute; left: 64px; top: 56px;
  font-family: var(--mono); font-size: 13px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted);
}
.diagram > h1 {
  position: absolute; left: 64px; top: 84px; width: 1100px; margin: 0;
  font-size: 44px; line-height: 54px; font-weight: 700; letter-spacing: -.02em; color: var(--text);
}
.diagram > h1 + p {
  position: absolute; left: 64px; top: 146px; width: 1100px; margin: 0;
  font-size: 19px; line-height: 28px; color: var(--soft); opacity: 1;
}
.slidev-layout .red { color: var(--bad); }
.slidev-layout .green { color: var(--good); }
.slidev-layout .blue { color: var(--accent); }
.slidev-layout .amber { color: var(--amber); }
.slidev-layout .violet { color: var(--violet); }
</style>
