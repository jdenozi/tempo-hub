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
        <div
          v-for="(item, i) in items"
          :key="i"
          class="group relative overflow-hidden rounded-card hover-lift cursor-pointer"
          style="background: rgba(14,6,22,0.65); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(212,168,83,0.1); transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;"
        >
          <!-- Carousel (multiple images) -->
          <div v-if="getImages(item).length > 1" class="relative w-full h-48 overflow-hidden">
            <img
              v-for="(img, imgIdx) in getImages(item)"
              :key="imgIdx"
              :src="img"
              :alt="`${item.title} - ${imgIdx + 1}`"
              class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out"
              :class="activeSlides[i] === imgIdx ? 'opacity-80 group-hover:opacity-100' : 'opacity-0'"
              loading="lazy"
            >
            <!-- Carousel dots -->
            <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              <span
                v-for="(_, dotIdx) in getImages(item)"
                :key="dotIdx"
                class="w-1.5 h-1.5 rounded-full transition-all duration-300"
                :class="activeSlides[i] === dotIdx ? 'bg-primary-500 w-3' : 'bg-white/40'"
              />
            </div>
          </div>
          <!-- Single image -->
          <img
            v-else-if="getImages(item).length === 1"
            :src="getImages(item)[0]"
            :alt="item.title"
            class="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            loading="lazy"
          >
          <!-- No image fallback -->
          <div
            v-else
            class="w-full h-48 bg-gradient-to-br from-primary-500/20 to-secondary-900"
          />
          <div class="p-6 space-y-3">
            <h3 class="font-heading text-lg font-semibold text-white text-glow-subtle">
              {{ item.title }}
            </h3>
            <p class="text-sm text-gray-400 leading-relaxed line-clamp-3">
              {{ item.description }}
            </p>
            <div v-if="item.tags && item.tags.length" class="flex flex-wrap gap-2">
              <span
                v-for="(tag, j) in item.tags"
                :key="j"
                class="text-xs px-2 py-1 rounded-full bg-primary-500/10 text-primary-500 border border-primary-500/20"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          <a
            v-if="item.link"
            :href="item.link"
            class="absolute inset-0"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="item.title"
          />
        </div>
      </div>
    </div>
  </section>
  <UiSectionDivider :variant="dividerAfter" />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import type { SectionVisualProps } from '../../composables/useSectionStyle'

export interface ProjectItem {
  title: string
  description: string
  image?: string
  images?: string[]
  tags?: string[]
  link?: string
}

const props = withDefaults(defineProps<{
  title: string
  subtitle?: string
  items?: ProjectItem[]
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

// Resolve images array from either `images` or `image` prop
function getImages(item: ProjectItem): string[] {
  if (item.images && item.images.length > 0) return item.images
  if (item.image) return [item.image]
  return []
}

// Auto-carousel state
const activeSlides = ref<Record<number, number>>({})

let intervalId: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  // Initialize all slides to 0
  props.items.forEach((_, i) => {
    activeSlides.value[i] = 0
  })

  // Auto-advance every 3s for items with multiple images
  intervalId = setInterval(() => {
    props.items.forEach((item, i) => {
      const imgs = getImages(item)
      if (imgs.length > 1) {
        activeSlides.value[i] = ((activeSlides.value[i] ?? 0) + 1) % imgs.length
      }
    })
  }, 3000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})

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
