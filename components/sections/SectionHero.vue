<template>
  <section class="relative min-h-[70vh] flex items-center gradient-section-alt">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,168,83,0.06)_0%,transparent_60%)] pointer-events-none" />
    <div class="container-page section-padding text-center">
      <h1 class="text-display text-white max-w-4xl mx-auto text-glow">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto text-glow-subtle">
        {{ subtitle }}
      </p>
      <div class="mt-6 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
      <div v-if="ctaText" class="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <UiButton :to="ctaLink" size="lg">
          {{ ctaText }}
        </UiButton>
        <UiButton v-if="secondaryCtaText" :to="secondaryCtaLink" variant="outline" size="lg">
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
  ctaText?: string
  ctaLink?: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
}>(), {
  subtitle: '',
  ctaText: '',
  ctaLink: '/contact',
  secondaryCtaText: '',
  secondaryCtaLink: '',
})
</script>
