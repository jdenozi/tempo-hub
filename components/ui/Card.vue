<template>
  <div :class="['rounded-card overflow-hidden', bordered && 'border', padded && 'p-6', glow && 'glow-gold']" class="card-glass">
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  bordered?: boolean
  padded?: boolean
  glow?: boolean
}>(), {
  bordered: true,
  padded: true,
  glow: false,
})
</script>

<style scoped>
.card-glass {
  background: rgba(5, 8, 22, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(212, 168, 83, 0.1);
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}

.card-glass:hover {
  box-shadow: 0 0 20px rgba(212, 168, 83, 0.15);
  border-color: rgba(212, 168, 83, 0.25);
  transform: translateY(-2px);
}

.card-glass.glow-gold {
  box-shadow: 0 0 20px rgba(212, 168, 83, 0.15);
  border-color: rgba(212, 168, 83, 0.25);
}
</style>
