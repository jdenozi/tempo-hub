<template>
  <AnimationsAnimateOnScroll
    v-if="animation && hasAnimations"
    :animation="animation.name"
    :delay="animation.delay"
    :stagger="animation.stagger"
  >
    <SectionsSectionLogos v-bind="sectionProps" />
  </AnimationsAnimateOnScroll>
  <SectionsSectionLogos v-else v-bind="sectionProps" />
</template>

<script setup lang="ts">
import type { AnimationName } from '../../tempo-core/config/animations'

interface LogoItem {
  src: string
  alt: string
}

const props = defineProps<{
  title?: string
  items?: LogoItem[]
  sectionBg?: 'default' | 'alt' | 'transparent' | 'starfield' | 'nebula' | 'planet-horizon' | 'grid-station' | 'orbital' | 'retro-scan'
  sectionSpacing?: 'compact' | 'normal' | 'spacious'
  sectionBorder?: 'none' | 'glow' | 'subtle'
  titleStyle?: 'standard' | 'large' | 'hero'
  dividerAfter?: 'none' | 'line' | 'gradient' | 'stars'
  columns?: '2' | '3' | '4' | 'auto'
  animation?: {
    name: AnimationName
    delay?: number
    stagger?: number
  }
}>()

const { hasAnimations } = useFeatures()

const sectionProps = computed(() => {
  const { animation, ...rest } = props
  return rest
})
</script>
