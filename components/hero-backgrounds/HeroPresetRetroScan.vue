<script setup lang="ts">
/**
 * HeroPresetRetroScan — CRT retro terminal background (Alien 1979 aesthetic)
 *
 * Layer 1 (CSS):   Warm dark gradient — deep amber/brown tones
 * Layer 2 (CSS+GSAP): CRT scan lines — slow vertical scroll
 * Layer 3 (CSS):   Warm vignette — radial gradient darkening edges
 * Layer 4 (CSS+GSAP): CRT flicker — very subtle, occasional opacity flash
 * Layer 5 (SVG+GSAP): Film grain — feTurbulence with animated baseFrequency
 * Layer 6 (CSS):   Warm amber glow — faint radial center highlight
 *
 * Reduced motion: warm gradient + vignette + glow only (no scan lines, no flicker, no grain)
 */

const scanLinesRef = ref<HTMLDivElement | null>(null)
const flickerRef = ref<HTMLDivElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const { isPaused, isReducedMotion } = useAnimationLifecycle(containerRef)

onMounted(async () => {
  if (!import.meta.client) return

  // Guard reduced motion BEFORE loading GSAP
  if (isReducedMotion.value) return

  // Lazy-load GSAP (SSR-safe, respects feature flags)
  const gsapModule = await useGsap()
  if (!gsapModule || !containerRef.value) return
  const { gsap } = gsapModule

  const tweens: (gsap.core.Tween | gsap.core.Timeline)[] = []

  const ctx = gsap.context(() => {
    // L2: Scan lines — slow vertical scroll
    if (scanLinesRef.value) {
      tweens.push(gsap.to(scanLinesRef.value, {
        backgroundPositionY: '-100px',
        duration: 10,
        ease: 'none',
        repeat: -1,
        paused: true,
      }))
    }

    // L4: CRT flicker — very subtle, rare opacity flash
    if (flickerRef.value) {
      const flickerTimeline = gsap.timeline({
        repeat: -1,
        repeatDelay: gsap.utils.random(3, 8),
        paused: true,
      })
      flickerTimeline
        .to(flickerRef.value, { opacity: 0.97, duration: 0.05 })
        .to(flickerRef.value, { opacity: 1, duration: 0.05 })
        .to(flickerRef.value, { opacity: 0.98, duration: 0.03 })
        .to(flickerRef.value, { opacity: 1, duration: 0.05 })
      tweens.push(flickerTimeline)
    }
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
    <!-- L1: Warm dark gradient -->
    <div
      class="absolute inset-0"
      style="background: linear-gradient(180deg, #0a0805 0%, #150a05 50%, #1a0f08 100%);"
    />

    <!-- L2: CRT scan lines (hidden when reduced motion) -->
    <div
      v-if="!isReducedMotion"
      ref="scanLinesRef"
      class="absolute inset-0 pointer-events-none"
      style="
        background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px);
        background-size: 100% 4px;
      "
    />

    <!-- L3: Warm vignette -->
    <div
      class="absolute inset-0 pointer-events-none"
      style="background: radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%);"
    />

    <!-- L4: CRT flicker (hidden when reduced motion) -->
    <div
      v-if="!isReducedMotion"
      ref="flickerRef"
      class="absolute inset-0 pointer-events-none"
    />

    <!-- L5: Film grain via SVG feTurbulence (hidden when reduced motion) -->
    <svg
      v-if="!isReducedMotion"
      class="absolute inset-0 w-full h-full pointer-events-none"
      style="opacity: 0.08;"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <filter id="retro-grain-filter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#retro-grain-filter)" />
    </svg>

    <!-- L6: Warm amber glow -->
    <div
      class="absolute inset-0 pointer-events-none"
      style="background: radial-gradient(ellipse at 50% 50%, rgba(200,120,30,0.06) 0%, transparent 70%);"
    />
  </div>
</template>
