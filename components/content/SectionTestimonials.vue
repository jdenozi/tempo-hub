<template>
  <AnimationsAnimateOnScroll
    v-if="animation && hasAnimations"
    :animation="animation.name"
    :delay="animation.delay"
    :stagger="animation.stagger"
  >
    <SectionsSectionTestimonials v-bind="sectionProps" />
  </AnimationsAnimateOnScroll>
  <SectionsSectionTestimonials v-else v-bind="sectionProps" />
</template>

<script setup lang="ts">
import type { AnimationName } from '../../tempo-core/config/animations'

interface TestimonialItem {
  quote: string
  author: string
  role?: string
}

const props = defineProps<{
  title: string
  subtitle?: string
  items?: TestimonialItem[]
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
