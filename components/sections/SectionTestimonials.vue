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
          <div class="space-y-4">
            <UiIcon name="star" size="md" class="text-primary-500 drop-shadow-[0_0_6px_rgba(212,168,83,0.4)]" />
            <blockquote class="text-sm text-gray-300 leading-relaxed italic border-l-2 border-primary-500/30 pl-4">
              "{{ item.quote }}"
            </blockquote>
            <div class="pt-2 border-t border-white/10">
              <p class="font-medium text-sm text-white text-glow-subtle">{{ item.author }}</p>
              <p v-if="item.role" class="text-xs text-gray-400">{{ item.role }}</p>
            </div>
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

export interface TestimonialItem {
  quote: string
  author: string
  role?: string
}

const props = withDefaults(defineProps<{
  title: string
  subtitle?: string
  items?: TestimonialItem[]
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
