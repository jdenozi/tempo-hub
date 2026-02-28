<template>
  <section :class="[spacingClass, bgClass, borderClass]">
    <div class="container-page">
      <div class="text-center mb-12 md:mb-16">
        <h2 :class="titleClass">{{ title }}</h2>
        <p v-if="subtitle" class="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
          {{ subtitle }}
        </p>
      </div>
      <div class="glass-card p-6 md:p-8 max-w-3xl mx-auto">
        <IntegrationsCalEmbed :theme="theme" />
      </div>
    </div>
  </section>
  <UiSectionDivider :variant="dividerAfter" />
</template>

<script setup lang="ts">
import type { SectionVisualProps } from '../../composables/useSectionStyle'

const props = withDefaults(defineProps<{
  title: string
  subtitle?: string
  theme?: 'light' | 'dark' | 'auto'
} & SectionVisualProps>(), {
  subtitle: '',
  theme: 'dark',
  sectionBg: 'default',
  sectionSpacing: 'normal',
  sectionBorder: 'none',
  titleStyle: 'standard',
  dividerAfter: 'none',
})

const { bgClass, spacingClass, borderClass, titleClass } = useSectionStyle(props)
</script>
