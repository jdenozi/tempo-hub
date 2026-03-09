<template>
  <ParallaxHome />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

useSeoMeta({
  ogImage: '/og-image.jpg',
})

defineOgImage({ component: 'NuxtSeo' })
</script>
