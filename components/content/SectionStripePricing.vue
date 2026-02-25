<template>
  <AnimationsAnimateOnScroll
    v-if="animation && hasAnimations"
    :animation="animation.name"
    :delay="animation.delay"
    :stagger="animation.stagger"
  >
    <SectionsSectionStripePricing v-bind="sectionProps" />
  </AnimationsAnimateOnScroll>
  <SectionsSectionStripePricing v-else v-bind="sectionProps" />
</template>

<script setup lang="ts">
import type { AnimationName } from '../../tempo-core/config/animations'

const props = defineProps<{
  title?: string
  subtitle?: string
  tables: Array<{
    pricingTableId: string
    label?: string
  }>
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
