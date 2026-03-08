<template>
  <div ref="calContainer" class="cal-embed w-full min-h-[500px]" />
</template>

<script setup lang="ts">
interface CalFunction {
  (action: string, ...args: unknown[]): void
  q: unknown[]
  ns: Record<string, unknown>
  loaded: boolean
}

const props = withDefaults(defineProps<{
  username?: string
  eventSlug?: string
  theme?: 'light' | 'dark' | 'auto'
  hideEventTypeDetails?: boolean
}>(), {
  username: '',
  eventSlug: '',
  theme: 'auto',
  hideEventTypeDetails: false,
})

const { calcom } = useClientConfig()
const calContainer = ref<HTMLElement>()

// Resolve username: prop > config
const resolvedUsername = computed(() => props.username || calcom.value.username)
const resolvedEvent = computed(() => props.eventSlug || calcom.value.defaultEvent)
// Resolve base URL: config > default cal.com
const resolvedBaseUrl = computed(() => calcom.value.baseUrl || 'https://app.cal.com')

onMounted(async () => {
  if (!resolvedUsername.value || !calContainer.value) return

  // Dynamically load Cal.com embed script from the configured instance
  const Cal = await loadCalScript()
  if (!Cal) return

  Cal('init', { origin: resolvedBaseUrl.value })

  Cal('inline', {
    elementOrSelector: calContainer.value,
    calLink: resolvedEvent.value
      ? `${resolvedUsername.value}/${resolvedEvent.value}`
      : resolvedUsername.value,
    config: {
      theme: props.theme,
      hideEventTypeDetails: props.hideEventTypeDetails,
    },
  })
})

// Load Cal.com embed script once — from self-hosted or SaaS
// Must bootstrap Cal namespace queue BEFORE loading embed.js
function loadCalScript(): Promise<CalFunction | null> {
  return new Promise((resolve) => {
    const win = window as Window & { Cal?: CalFunction }
    if (win.Cal) {
      resolve(win.Cal)
      return
    }

    // Bootstrap Cal.com namespace queue (standard Cal.com pattern)
    // embed.js expects window.Cal to exist as a queue function before it loads
    const scriptUrl = `${resolvedBaseUrl.value}/embed/embed.js`
    ;(function (C: typeof window, A: string, L: string) {
      const p = function (a: { q: unknown[] }, ar: IArguments | unknown[]) { a.q.push(ar) }
      C.Cal = C.Cal || function () {
        const cal = C.Cal as CalFunction
        const ar = arguments
        if (!cal.loaded) {
          cal.ns = {}
          cal.q = cal.q || []
          cal.loaded = true
        }
        if (ar[0] === L) {
          const api = function () { p(api as unknown as { q: unknown[] }, arguments) } as unknown as { q: unknown[] }
          const namespace = ar[1] as string
          api.q = api.q || []
          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api
            p(cal.ns[namespace] as { q: unknown[] }, ar as unknown as unknown[])
            p(cal, ['initNamespace', namespace])
          } else p(cal, ar as unknown as unknown[])
          return
        }
        p(cal, ar as unknown as unknown[])
      } as CalFunction
    })(window, scriptUrl, 'init')

    // Now load the actual embed.js script
    const script = document.createElement('script')
    script.src = scriptUrl
    script.async = true
    script.onload = () => resolve(win.Cal ?? null)
    script.onerror = () => resolve(null)
    document.head.appendChild(script)
  })
}
</script>
