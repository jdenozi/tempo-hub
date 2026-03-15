<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UiCookieConsent />
</template>

<script setup lang="ts">
// Track page views (from tempo-core)
useAnalytics()

// Initialize cookie consent
const { init } = useCookieConsent()
onMounted(() => init())

// --- Strapi settings → app.config sync ---
// Fetches site settings from Strapi (if available) and overrides
// app.config values so Header/Footer read the correct identity.
const { settings } = useStrapiSettings()
const appConfig = useAppConfig()
watch(settings, (s) => {
  if (!s) return
  if (s.siteName) appConfig.client.name = s.siteName
  if (s.profession) appConfig.client.profession = s.profession
  // Logo stays from file system — not runtime-changeable
}, { immediate: true })
</script>
