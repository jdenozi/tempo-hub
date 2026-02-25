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
        <div
          v-for="(item, i) in items"
          :key="i"
          class="group relative overflow-hidden rounded-card hover-lift cursor-pointer"
          style="background: rgba(5,8,22,0.65); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(212,168,83,0.1); transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;"
        >
          <img
            v-if="item.image"
            :src="item.image"
            :alt="item.title"
            class="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            loading="lazy"
          >
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
</template>

<script setup lang="ts">
export interface ProjectItem {
  title: string
  description: string
  image?: string
  tags?: string[]
  link?: string
}

withDefaults(defineProps<{
  title: string
  subtitle?: string
  items?: ProjectItem[]
}>(), {
  subtitle: '',
  items: () => [],
})
</script>
