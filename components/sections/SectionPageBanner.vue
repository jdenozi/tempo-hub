<template>
  <section class="relative min-h-[50vh] flex items-center gradient-section-alt -mt-16 md:-mt-20">
    <!-- Dynamic background layer (behind everything) -->
    <div
      v-if="activeBackground"
      class="absolute inset-0 z-0 overflow-hidden pointer-events-none"
    >
      <component :is="activeBackground" v-bind="backgroundProps" />
    </div>

    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,168,83,0.06)_0%,transparent_60%)] pointer-events-none" />
    <div class="container-page section-padding pt-16 md:pt-20 text-center">
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
import { defineAsyncComponent } from 'vue'

const props = withDefaults(defineProps<{
  title: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
  heroPreset?: string
  heroImage?: string
  heroOverlay?: string
}>(), {
  subtitle: '',
  ctaText: '',
  ctaLink: '/contact',
  secondaryCtaText: '',
  secondaryCtaLink: '',
  heroPreset: '',
  heroImage: '',
  heroOverlay: '',
})

// Lazy-loaded preset background components (SSR-safe, code-split)
const backgroundComponents: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  'starfield': defineAsyncComponent(() => import('../hero-backgrounds/HeroPresetStarfield.vue')),
  'nebula': defineAsyncComponent(() => import('../hero-backgrounds/HeroPresetNebula.vue')),
  'planet-horizon': defineAsyncComponent(() => import('../hero-backgrounds/HeroPresetPlanetHorizon.vue')),
  'grid-station': defineAsyncComponent(() => import('../hero-backgrounds/HeroPresetGridStation.vue')),
  'orbital': defineAsyncComponent(() => import('../hero-backgrounds/HeroPresetOrbital.vue')),
  'retro-scan': defineAsyncComponent(() => import('../hero-backgrounds/HeroPresetRetroScan.vue')),
}

const HeroImageBackground = defineAsyncComponent(() => import('../hero-backgrounds/HeroImageBackground.vue'))

// Reduced motion preference (SSR-safe)
const prefersReducedMotion = ref(false)

onMounted(() => {
  if (import.meta.client) {
    prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
})

// Resolve active background component
const activeBackground = computed(() => {
  // Image background takes priority
  if (props.heroImage) {
    return HeroImageBackground
  }

  // Skip animated presets when user prefers reduced motion
  if (prefersReducedMotion.value) {
    return null
  }

  // Resolve preset component
  const preset = props.heroPreset
  if (preset && preset !== 'none' && backgroundComponents[preset]) {
    return backgroundComponents[preset]
  }

  return null
})

// Props to pass to the active background component
const backgroundProps = computed(() => {
  if (props.heroImage) {
    return { image: props.heroImage, overlay: props.heroOverlay }
  }
  return {}
})
</script>
