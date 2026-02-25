<template>
  <section class="section-padding gradient-section">
    <div class="container-page">
      <div class="text-center mb-12 md:mb-16">
        <h2 class="text-hero text-white text-glow">{{ title }}</h2>
        <p v-if="subtitle" class="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
          {{ subtitle }}
        </p>
      </div>
      <div class="glass-card p-6 md:p-8 max-w-3xl mx-auto">
        <IntegrationsCalEmbed :theme="theme" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  subtitle?: string
  theme?: 'light' | 'dark' | 'auto'
}>(), {
  subtitle: '',
  theme: 'dark',
})
</script>
