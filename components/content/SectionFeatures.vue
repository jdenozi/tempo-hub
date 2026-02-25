<template>
  <AnimationsAnimateOnScroll
    v-if="animation && hasAnimations"
    :animation="animation.name"
    :delay="animation.delay"
    :stagger="animation.stagger"
  >
    <SectionsSectionFeatures v-bind="sectionProps" />
  </AnimationsAnimateOnScroll>
  <SectionsSectionFeatures v-else v-bind="sectionProps" />
</template>

<script setup lang="ts">
import type { AnimationName } from '../../tempo-core/config/animations'

interface FeatureItem {
  icon?: string
  title: string
  description: string
}

const props = defineProps<{
  title: string
  subtitle?: string
  items?: FeatureItem[]
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
