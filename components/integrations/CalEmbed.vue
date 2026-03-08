<template>
  <div ref="calContainer" class="cal-embed w-full min-h-[500px]" />
</template>

<script setup lang="ts">
interface CalFunction {
  (action: string, ...args: unknown[]): void
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
function loadCalScript(): Promise<CalFunction | null> {
  return new Promise((resolve) => {
    const win = window as Window & { Cal?: CalFunction }
    if (win.Cal) {
      resolve(win.Cal)
      return
    }

    const script = document.createElement('script')
    script.src = `${resolvedBaseUrl.value}/embed/embed.js`
    script.async = true
    script.onload = () => resolve(win.Cal ?? null)
    script.onerror = () => resolve(null)
    document.head.appendChild(script)
  })
}
</script>
