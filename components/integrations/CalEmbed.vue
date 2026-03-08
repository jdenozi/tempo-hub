<template>
  <div ref="calContainer" class="cal-embed w-full min-h-[500px]" />
</template>

<script setup lang="ts">
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

const resolvedUsername = computed(() => props.username || calcom.value.username)
const resolvedEvent = computed(() => props.eventSlug || calcom.value.defaultEvent)
const resolvedBaseUrl = computed(() => calcom.value.baseUrl || 'https://app.cal.com')

onMounted(() => {
  if (!resolvedUsername.value || !calContainer.value) return

  const scriptUrl = `${resolvedBaseUrl.value}/embed/embed.js`
  const win = window as Record<string, unknown>

  // Standard Cal.com bootstrap — script loads INSIDE the function body
  // This ensures Cal.q exists BEFORE embed.js checks for it
  ;(function (C: Record<string, unknown>, A: string, L: string) {
    const p = function (a: { q: unknown[] }, ar: unknown) { a.q.push(ar) }
    const d = document
    C.Cal = C.Cal || function () {
      const cal = C.Cal as { loaded?: boolean; ns: Record<string, unknown>; q: unknown[] }
      const ar = arguments
      if (!cal.loaded) {
        cal.ns = {}
        cal.q = cal.q || []
        d.head.appendChild(d.createElement('script')).src = A
        cal.loaded = true
      }
      if (ar[0] === L) {
        const api = function () { p(api as unknown as { q: unknown[] }, arguments) } as unknown as { q: unknown[] }
        const namespace = ar[1] as string
        api.q = api.q || []
        if (typeof namespace === 'string') {
          cal.ns[namespace] = cal.ns[namespace] || api
          p(cal.ns[namespace] as { q: unknown[] }, ar as unknown as unknown)
          p(cal, ['initNamespace', namespace])
        } else p(cal, ar as unknown as unknown)
        return
      }
      p(cal, ar as unknown as unknown)
    }
  })(win, scriptUrl, 'init')

  // Cal('init') triggers: sets up q/ns/loaded + loads embed.js script
  const Cal = win.Cal as (...args: unknown[]) => void
  Cal('init', { origin: resolvedBaseUrl.value })

  // Cal('inline') queues the command — embed.js processes it when loaded
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
</script>
