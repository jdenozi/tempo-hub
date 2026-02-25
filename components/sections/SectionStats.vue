<template>
  <section class="section-padding gradient-section-alt">
    <div class="container-page">
      <div v-if="title" class="text-center mb-12 md:mb-16">
        <h2 class="text-hero text-white text-glow">{{ title }}</h2>
      </div>
      <div :class="gridClasses">
        <div v-for="(stat, i) in items" :key="i" class="bg-white/[0.03] rounded-xl p-6 border border-white/5 text-center space-y-2">
          <span class="block text-4xl md:text-5xl font-bold text-primary-500 text-glow">
            {{ stat.value }}
          </span>
          <span class="block text-sm text-gray-300 uppercase tracking-widest">
            {{ stat.label }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
export interface StatItem {
  value: string
  label: string
}

const props = withDefaults(defineProps<{
  title?: string
  items?: StatItem[]
}>(), {
  title: '',
  items: () => [],
})

const gridClasses = computed(() => {
  const count = props.items.length
  if (count <= 2) return 'grid grid-cols-2 gap-8'
  if (count === 3) return 'grid grid-cols-1 sm:grid-cols-3 gap-8'
  return 'grid grid-cols-2 lg:grid-cols-4 gap-8'
})
</script>
