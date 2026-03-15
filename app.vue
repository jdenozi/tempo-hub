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
</script>
