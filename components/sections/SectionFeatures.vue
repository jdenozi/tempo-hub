<template>
  <section class="section-padding gradient-section">
    <div class="container-page">
      <div class="text-center mb-12 md:mb-16">
        <h2 class="text-hero text-white text-glow">{{ title }}</h2>
        <p v-if="subtitle" class="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
          {{ subtitle }}
        </p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
</template>

<script setup lang="ts">
export interface FeatureItem {
  icon?: string
  title: string
  description: string
}

withDefaults(defineProps<{
  title: string
  subtitle?: string
  items?: FeatureItem[]
}>(), {
  subtitle: '',
  items: () => [],
})
</script>
