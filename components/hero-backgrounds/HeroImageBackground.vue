<template>
  <div class="absolute inset-0 overflow-hidden">
    <!-- Base image -->
    <img
      :src="image"
      alt=""
      class="absolute inset-0 h-full w-full object-cover"
      loading="eager"
      width="1920"
      height="1080"
      fetchpriority="high"
    >

    <!-- Dark gradient overlay for text readability -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />

    <!-- Optional overlay effects (CSS-only, no Canvas) -->
    <!-- scanlines: CRT horizontal lines -->
    <div
      v-if="overlay === 'scanlines'"
      class="absolute inset-0 pointer-events-none"
      style="background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px);"
    />

    <!-- grid: subtle grid pattern -->
    <div
      v-if="overlay === 'grid'"
      class="absolute inset-0 pointer-events-none"
      style="background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 40px 40px;"
    />

    <!-- particles: CSS floating dots (no Canvas) -->
    <div
      v-if="overlay === 'particles'"
      class="absolute inset-0 pointer-events-none hero-particles-overlay"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  image: string
  overlay?: string
}>(), {
  overlay: 'none',
})
</script>

<style scoped>
/* CSS-only floating particles for image overlay */
@keyframes float-particle {
  0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
  25% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
  50% { transform: translateY(-10px) translateX(-5px); opacity: 0.4; }
  75% { transform: translateY(-30px) translateX(15px); opacity: 0.5; }
}

.hero-particles-overlay::before,
.hero-particles-overlay::after {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  animation: float-particle 8s ease-in-out infinite;
}

.hero-particles-overlay::before {
  top: 20%;
  left: 15%;
  animation-delay: 0s;
}

.hero-particles-overlay::after {
  top: 60%;
  left: 75%;
  animation-delay: 4s;
}

@media (prefers-reduced-motion: reduce) {
  .hero-particles-overlay::before,
  .hero-particles-overlay::after {
    animation: none;
  }
}
</style>
