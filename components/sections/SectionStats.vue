<template>
  <section :class="[spacingClass, bgClass, borderClass]" class="relative">
    <!-- Fond anime optionnel -->
    <div v-if="isAnimatedBg" class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <component :is="animatedBgComponent" />
    </div>
    <div class="container-page relative z-10">
      <div v-if="title" class="text-center mb-12 md:mb-16">
        <h2 :class="titleClass">{{ title }}</h2>
      </div>
      <div :class="gridClass">
        <div v-for="(stat, i) in items" :key="i" class="bg-white/[0.03] rounded-xl p-6 border border-white/5 text-center space-y-2">
          <span class="block text-4xl md:text-5xl font-bold text-primary-500 text-glow">
            {{ stat.value }}
          </span>
          <span class="block text-sm text-gray-300 uppercase tracking-widest">
            {{ stat.label }}
          </span>
        </div>
      </div>
    </div>
  </section>
  <UiSectionDivider :variant="dividerAfter" />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import type { SectionVisualProps } from '../../composables/useSectionStyle'

export interface StatItem {
  value: string
  label: string
}

const props = withDefaults(defineProps<{
  title?: string
  items?: StatItem[]
} & SectionVisualProps>(), {
  title: '',
  items: () => [],
  sectionBg: 'alt',
  sectionSpacing: 'normal',
  sectionBorder: 'none',
  titleStyle: 'standard',
  dividerAfter: 'none',
  columns: 'auto',
})

const { bgClass, spacingClass, borderClass, titleClass, isAnimatedBg } = useSectionStyle(props)

const gridClass = computed(() => {
  // Si columns est explicitement fourni (pas 'auto'), l'utiliser
  if (props.columns && props.columns !== 'auto') {
    switch (props.columns) {
      case '2': return 'grid grid-cols-2 gap-8'
      case '3': return 'grid grid-cols-1 sm:grid-cols-3 gap-8'
      case '4': return 'grid grid-cols-2 lg:grid-cols-4 gap-8'
    }
  }
  // Sinon, logique auto basee sur le nombre d'items (comportement actuel)
  const count = props.items.length
  if (count <= 2) return 'grid grid-cols-2 gap-8'
  if (count === 3) return 'grid grid-cols-1 sm:grid-cols-3 gap-8'
  return 'grid grid-cols-2 lg:grid-cols-4 gap-8'
})

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
