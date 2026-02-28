<template>
  <section :class="[spacingClass, bgClass, borderClass]" class="relative">
    <!-- Fond anime optionnel -->
    <div v-if="isAnimatedBg" class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <component :is="animatedBgComponent" />
    </div>
    <div class="container-page relative z-10">
      <div class="text-center mb-12 md:mb-16">
        <h2 :class="titleClass">{{ title }}</h2>
        <p v-if="subtitle" class="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
          {{ subtitle }}
        </p>
      </div>
      <div :class="gridClass">
        <UiCard v-for="(item, i) in items" :key="i" class="hover-lift">
          <div class="space-y-3">
            <div v-if="item.icon" class="inline-flex p-2 rounded-lg bg-primary-500/10">
              <UiIcon :name="item.icon" size="lg" class="text-primary-500" />
            </div>
            <h3 class="font-heading text-lg font-semibold text-white text-glow-subtle">
              {{ item.title }}
            </h3>
            <p class="text-sm text-gray-400 leading-relaxed">
              {{ item.description }}
            </p>
          </div>
        </UiCard>
      </div>
    </div>
  </section>
  <UiSectionDivider :variant="dividerAfter" />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import type { SectionVisualProps } from '../../composables/useSectionStyle'

export interface FeatureItem {
  icon?: string
  title: string
  description: string
}

const props = withDefaults(defineProps<{
  title: string
  subtitle?: string
  items?: FeatureItem[]
} & SectionVisualProps>(), {
  subtitle: '',
  items: () => [],
  sectionBg: 'default',
  sectionSpacing: 'normal',
  sectionBorder: 'none',
  titleStyle: 'standard',
  dividerAfter: 'none',
  columns: '3',
})

const { bgClass, spacingClass, borderClass, titleClass, isAnimatedBg } = useSectionStyle(props)

const gridClass = computed(() => {
  switch (props.columns) {
    case '2': return 'grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8'
    case '4': return 'grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8'
    case 'auto': return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'
    default: return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'
  }
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
