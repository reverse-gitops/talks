<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useSlideContext } from '@slidev/client'

const props = withDefaults(defineProps<{
  session?: string
}>(), {
  session: 'demo',
})

const getManifestCommand = (session: string) =>
  `kubectl get quizsession ${session} -n vote -o yaml | yq 'del(.metadata.annotations, .metadata.labels)'`

const manifest = ref('Loading manifest from the cluster...')
const command = ref(getManifestCommand(props.session))
const fetchError = ref<string | null>(null)
const updatedAt = ref<string | null>(null)
const { $renderContext: renderContext } = useSlideContext()

const POLL_INTERVAL_MS = 2000
const ACTIVE_CONTEXTS = new Set(['slide', 'presenter'])

let refreshTimeout: ReturnType<typeof setTimeout> | null = null
let activeRequest: Promise<void> | null = null
let abortController: AbortController | null = null

const shouldPoll = computed(() => ACTIVE_CONTEXTS.has(renderContext.value))
const refreshStatus = computed(() => {
  if (fetchError.value) return 'Refresh failed'
  if (!shouldPoll.value) return 'Refresh paused in preview'
  return 'Refreshes every 2s'
})

const formattedUpdatedAt = computed(() => {
  if (!updatedAt.value) return 'Waiting for first refresh'

  return new Date(updatedAt.value).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
})

function clearRefreshTimeout() {
  if (refreshTimeout) {
    clearTimeout(refreshTimeout)
    refreshTimeout = null
  }
}

function cancelActiveRequest() {
  abortController?.abort()
  abortController = null
}

function scheduleNextRefresh() {
  clearRefreshTimeout()
  if (!shouldPoll.value) return
  refreshTimeout = setTimeout(() => {
    void fetchManifest()
  }, POLL_INTERVAL_MS)
}

async function fetchManifest() {
  if (!shouldPoll.value) return
  if (activeRequest) return activeRequest

  abortController = new AbortController()

  activeRequest = (async () => {
  try {
    const res = await fetch(`/api/live-cluster-manifest?session=${encodeURIComponent(props.session)}`, {
      cache: 'no-store',
      signal: abortController?.signal,
    })
    const data = await res.json()

    if (!res.ok || data.error) {
      throw new Error(data.error ?? `Request failed with ${res.status}`)
    }

    manifest.value = data.manifest
    command.value = data.command ?? getManifestCommand(props.session)
    updatedAt.value = data.updatedAt ?? null
    fetchError.value = null
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return
    fetchError.value = error instanceof Error ? error.message : 'Failed to fetch manifest'
  } finally {
    abortController = null
    activeRequest = null
    scheduleNextRefresh()
  }
  })()

  return activeRequest
}

onMounted(() => {
  if (!shouldPoll.value) return
  void fetchManifest()
})

onUnmounted(() => {
  clearRefreshTimeout()
  cancelActiveRequest()
})

watch(shouldPoll, enabled => {
  clearRefreshTimeout()
  if (!enabled) {
    cancelActiveRequest()
    return
  }
  void fetchManifest()
}, { immediate: false })

watch(() => props.session, session => {
  command.value = getManifestCommand(session)
  if (!shouldPoll.value) return
  void fetchManifest()
})
</script>

<template>
  <div class="live-manifest">
    <div class="manifest-header">
      <div>
        <div class="manifest-label">Live from the Kubernetes API</div>
        <div class="manifest-updated">Last refresh: {{ formattedUpdatedAt }}</div>
      </div>

      <div class="manifest-refresh" :class="{ 'manifest-refresh-error': fetchError }">
        <span class="manifest-dot" />
        {{ refreshStatus }}
      </div>
    </div>

    <div class="manifest-command">{{ command }}</div>

    <div class="manifest-shell">
      <pre>{{ manifest }}</pre>
    </div>

    <div v-if="fetchError" class="manifest-error">{{ fetchError }}</div>
  </div>
</template>

<style scoped>
.live-manifest {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  height: 100%;
}

.manifest-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.manifest-label {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #94a3b8;
}

.manifest-updated {
  margin-top: 0.25rem;
  font-size: 0.95rem;
  color: #cbd5e1;
}

.manifest-refresh {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.14);
  color: #86efac;
  font-size: 0.9rem;
  white-space: nowrap;
}

.manifest-refresh-error {
  background: rgba(248, 113, 113, 0.14);
  color: #fca5a5;
}

.manifest-dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  background: currentColor;
  box-shadow: 0 0 12px currentColor;
}

.manifest-command {
  padding: 0.85rem 1rem;
  border-radius: 0.85rem;
  background: rgba(15, 23, 42, 0.88);
  color: #e2e8f0;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.76rem;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.manifest-shell {
  flex: 1;
  min-height: 0;
  padding: 1rem;
  border-radius: 1rem;
  background: rgba(2, 6, 23, 0.96);
  border: 1px solid rgba(148, 163, 184, 0.16);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  overflow: auto;
}

.manifest-shell pre {
  margin: 0;
  color: #e2e8f0;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85rem;
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-word;
}

.manifest-error {
  color: #fecaca;
  font-size: 0.9rem;
}
</style>
