---
layout: default
---

<script setup>
import { getCurrentInstance } from 'vue'
const instance = getCurrentInstance()
const renderContextFromProxy = instance?.proxy?.$renderContext
</script>

# $renderContext debug

| Source | Value |
|--------|-------|
| `$renderContext` (template) | **{{ $renderContext }}** |
| `proxy.$renderContext` (script) | **{{ renderContextFromProxy }}** |

<div style="margin-top: 2rem; font-family: monospace; font-size: 0.8rem; opacity: 0.6;">
  Open overview (press O), presenter view, etc. to see this value change across contexts.
</div>
