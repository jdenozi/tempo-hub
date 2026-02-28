<template>
  <section :class="[spacingClass, bgClass, borderClass]" class="relative">
    <!-- Fond anime optionnel -->
    <div v-if="isAnimatedBg" class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <component :is="animatedBgComponent" />
    </div>
    <div class="container-page text-center relative z-10">
      <h2 :class="titleClass">{{ title }}</h2>
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
  <UiSectionDivider :variant="dividerAfter" />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import type { SectionVisualProps } from '../../composables/useSectionStyle'

const props = withDefaults(defineProps<{
  title: string
  subtitle?: string
  ctaText: string
  ctaLink?: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
} & SectionVisualProps>(), {
  subtitle: '',
  ctaLink: '/contact',
  secondaryCtaText: '',
  secondaryCtaLink: '',
  sectionBg: 'alt',
  sectionSpacing: 'normal',
  sectionBorder: 'glow',
  titleStyle: 'standard',
  dividerAfter: 'none',
})

const { bgClass, spacingClass, borderClass, titleClass, isAnimatedBg } = useSectionStyle(props)

const bgComponents: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  'starfield': defineAsyncComponent(() => import('../hero-backgrounds/HeroPresetStarfield.vue')),
  'nebula': defineAsyncComponent(() => import('../hero-backgrounds/HeroPresetNebula.vue')),
  'planet-horizon': defineAsyncComponent(() => import('../hero-backgrounds/HeroPresetPlanetHorizon.vue')),
  'grid-station': defineAsyncComponent(() => import('../hero-backgrounds/HeroPresetGridStation.vue')),
  'orbital': defineAsyncComponent(() => import('../hero-backgrounds/HeroPresetOrbital.vue')),
  'retro-scan': defineAsyncComponent(() => import('../hero-backgrounds/HeroPresetRetroScan.vue')),
}

const animatedBgComponent = computed(() =>
  props.sectionBg ? bgComponents[props.sectionBg] : null,
)
</script>
