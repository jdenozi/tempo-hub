<template>
  <section :class="[spacingClass, bgClass, borderClass]" class="relative">
    <!-- Fond anime optionnel -->
    <div v-if="isAnimatedBg" class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <component :is="animatedBgComponent" />
    </div>
    <div class="container-page relative z-10">
      <p v-if="title" class="text-center text-sm text-secondary-400 uppercase tracking-wider mb-8 text-glow-subtle">
        {{ title }}
      </p>
      <div class="flex flex-wrap items-center justify-center gap-8 md:gap-12">
        <img
          v-for="(logo, i) in items"
          :key="i"
          :src="logo.src"
          :alt="logo.alt"
          width="120"
          height="40"
          loading="lazy"
          class="h-8 md:h-10 w-auto object-contain opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 hover:drop-shadow-[0_0_8px_rgba(212,168,83,0.3)]"
        >
      </div>
    </div>
  </section>
  <UiSectionDivider :variant="dividerAfter" />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import type { SectionVisualProps } from '../../composables/useSectionStyle'

export interface LogoItem {
  src: string
  alt: string
}

const props = withDefaults(defineProps<{
  title?: string
  items?: LogoItem[]
} & SectionVisualProps>(), {
  title: '',
  items: () => [],
  sectionBg: 'alt',
  sectionSpacing: 'normal',
  sectionBorder: 'none',
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
