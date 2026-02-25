<template>
  <section class="section-padding gradient-section-alt">
    <div class="container-page">
      <p v-if="title" class="text-center text-sm text-secondary-400 uppercase tracking-wider mb-8 text-glow-subtle">
        {{ title }}
      </p>
      <div class="flex flex-wrap items-center justify-center gap-8 md:gap-12">
        <img
          v-for="(logo, i) in items"
          :key="i"
          :src="logo.src"
          :alt="logo.alt"
          width="120"
          height="40"
          loading="lazy"
          class="h-8 md:h-10 w-auto object-contain opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 hover:drop-shadow-[0_0_8px_rgba(212,168,83,0.3)]"
        >
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
export interface LogoItem {
  src: string
  alt: string
}

withDefaults(defineProps<{
  title?: string
  items?: LogoItem[]
}>(), {
  title: '',
  items: () => [],
})
</script>
