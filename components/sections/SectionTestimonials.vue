<template>
  <section class="section-padding gradient-section">
    <div class="container-page">
      <div class="text-center mb-12 md:mb-16">
        <h2 class="text-hero text-white text-glow">{{ title }}</h2>
        <p v-if="subtitle" class="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
          {{ subtitle }}
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
</template>

<script setup lang="ts">
export interface TestimonialItem {
  quote: string
  author: string
  role?: string
}

withDefaults(defineProps<{
  title: string
  subtitle?: string
  items?: TestimonialItem[]
}>(), {
  subtitle: '',
  items: () => [],
})
</script>
