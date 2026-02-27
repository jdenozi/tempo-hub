<script setup lang="ts">
/**
 * HeroPresetPlanetHorizon — Sci-fi 70s planet horizon with warm atmosphere glow
 *
 * Layer 1 (CSS):   Deep space → warm horizon gradient
 * Layer 2 (SVG):   Sparse star field (data-URI, applied in onMounted)
 * Layer 3 (CSS):   Oversized dark planet curve at bottom
 * Layer 4 (CSS+GSAP): Atmosphere halo — radial gradient with slow pulse
 * Layer 5 (CSS):   Lens flare at horizon point
 *
 * Reduced motion: static planet + static atmosphere (no GSAP pulse)
 */

const starsRef = ref<HTMLDivElement | null>(null)
const atmosphereRef = ref<HTMLDivElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const { isPaused, isReducedMotion } = useAnimationLifecycle(containerRef)

// --- SVG star field generator ---
function generateStarSVG(width: number, height: number, count: number): string {
  const colors = ['#ffffff', '#ffffff', '#c8d8ff', '#ffe8c0', '#7ec8e3']
  const stars = Array.from({ length: count }, () => {
    const x = Math.random() * width
    const y = Math.random() * height
    const r = 0.2 + Math.random() * 1.0
    const color = colors[Math.floor(Math.random() * colors.length)]
    const opacity = 0.2 + Math.random() * 0.7
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${color}" opacity="${opacity.toFixed(2)}"/>`
  }).join('')

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>${stars}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

onMounted(async () => {
  if (!import.meta.client) return

  // L2: Apply star field as tiled SVG background
  if (starsRef.value) {
    starsRef.value.style.backgroundImage = generateStarSVG(250, 250, 50)
    starsRef.value.style.backgroundRepeat = 'repeat'
  }

  // L4: GSAP atmosphere pulse (skipped for reduced motion)
  if (isReducedMotion.value || !atmosphereRef.value) return

  const gsapModule = await useGsap()
  if (!gsapModule || !containerRef.value) return
  const { gsap } = gsapModule

  const tweens: gsap.core.Tween[] = []

  const ctx = gsap.context(() => {
    tweens.push(gsap.to(atmosphereRef.value, {
      opacity: 0.6,
      duration: 8,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      paused: true,
    }))
  }, containerRef.value)

  // Watch isPaused to control playback
  watch(isPaused, (paused) => {
    tweens.forEach(t => paused ? t.pause() : t.resume())
  }, { immediate: true })

  onUnmounted(() => {
    ctx.revert()
    tweens.length = 0
  })
})
</script>

<template>
  <div ref="containerRef" class="absolute inset-0 overflow-hidden">
    <!-- L1: Deep space → warm horizon gradient -->
    <div
      class="absolute inset-0"
      style="background: linear-gradient(180deg, #020818 0%, #0a1a3a 50%, #1a0a05 85%, #2a1505 100%);"
    />

    <!-- L2: SVG star field (applied via JS in onMounted for SSR safety) -->
    <div ref="starsRef" class="absolute inset-0" />

    <!-- L3: Planet curve — oversized dark circle at bottom -->
    <div
      class="absolute pointer-events-none"
      style="
        width: 140vw;
        height: 140vw;
        border-radius: 50%;
        bottom: -60vw;
        left: 50%;
        transform: translateX(-50%);
        background: radial-gradient(ellipse at 50% 30%, #1a1535 0%, #0d0d25 50%, #080818 100%);
        border: 1px solid rgba(100,150,255,0.15);
        box-shadow: 0 0 60px rgba(100,150,255,0.08), inset 0 0 80px rgba(0,0,0,0.5);
      "
    />

    <!-- L4: Atmosphere halo — warm radial glow above planet curve -->
    <div
      ref="atmosphereRef"
      class="absolute pointer-events-none"
      style="
        width: 100%;
        height: 30%;
        bottom: 0;
        left: 0;
        background: radial-gradient(ellipse at 50% 100%, rgba(255,140,50,0.25) 0%, rgba(200,100,30,0.12) 30%, transparent 70%);
      "
    />

    <!-- L5: Lens flare at horizon center -->
    <div
      class="absolute pointer-events-none"
      style="
        width: 200px;
        height: 200px;
        bottom: 5%;
        left: 50%;
        transform: translateX(-50%);
        background: radial-gradient(ellipse at center, rgba(255,220,100,0.15) 0%, transparent 70%);
        filter: blur(15px);
      "
    />
  </div>
</template>
