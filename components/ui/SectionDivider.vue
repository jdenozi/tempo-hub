<template>
  <div v-if="variant !== 'none'" class="w-full overflow-hidden" aria-hidden="true">
    <!-- line -->
    <div v-if="variant === 'line'" class="mx-auto max-w-4xl h-px bg-white/10" />

    <!-- gradient -->
    <div v-else-if="variant === 'gradient'" class="mx-auto max-w-4xl h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent" />

    <!-- stars -->
    <div v-else-if="variant === 'stars'" class="flex items-center justify-center gap-2 py-2">
      <span class="w-1 h-1 rounded-full bg-primary-500/40" />
      <span class="w-1.5 h-1.5 rounded-full bg-primary-500/60" />
      <span class="w-1 h-1 rounded-full bg-primary-500/40" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'none' | 'line' | 'gradient' | 'stars'
}>(), {
  variant: 'none',
})
</script>
