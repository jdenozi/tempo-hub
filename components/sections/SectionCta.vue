<template>
  <section class="section-padding gradient-section-alt border-glow">
    <div class="container-page text-center">
      <h2 class="text-hero text-white text-glow">{{ title }}</h2>
      <p v-if="subtitle" class="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
        {{ subtitle }}
      </p>
      <div class="mx-auto w-32 h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent mb-8" />
      <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <UiButton :to="ctaLink" size="lg">
          {{ ctaText }}
        </UiButton>
        <UiButton v-if="secondaryCtaText" :to="secondaryCtaLink" size="lg" variant="outline">
          {{ secondaryCtaText }}
        </UiButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  subtitle?: string
  ctaText: string
  ctaLink?: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
}>(), {
  subtitle: '',
  ctaLink: '/contact',
  secondaryCtaText: '',
  secondaryCtaLink: '',
})
</script>
