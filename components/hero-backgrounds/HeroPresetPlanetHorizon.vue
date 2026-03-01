<script setup lang="ts">
/**
 * HeroPresetPlanetHorizon — Planet seen from orbit with warm atmosphere
 *
 * Layer 1 (CSS):   Deep space → warm horizon gradient
 * Layer 2 (SVG):   Star field (tiled)
 * Layer 3 (CSS):   Oversized dark planet at bottom
 * Layer 4 (GSAP):  Atmosphere halo pulse + corona flicker
 * Layer 5 (Canvas): Drifting particles
 * Layer 6 (CSS):   Lens flares at horizon
 *
 * Reduced motion: static planet + atmosphere
 */

const starsRef = ref<HTMLDivElement | null>(null)
const atmosphereRef = ref<HTMLDivElement | null>(null)
const coronaRef = ref<HTMLDivElement | null>(null)
const lensFlareRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const { isPaused, isReducedMotion } = useAnimationLifecycle(containerRef)

useSpaceParticles(canvasRef, {
  count: 80,
  colors: ['#ffffff', '#ffe8c0', '#c8d8ff', '#ffb060'],
  speedMultiplier: 0.25,
  maxSize: 1.2,
  glowIntensity: 2,
})

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

  if (starsRef.value) {
    starsRef.value.style.backgroundImage = generateStarSVG(250, 250, 60)
    starsRef.value.style.backgroundRepeat = 'repeat'
  }

  if (isReducedMotion.value) return

  const gsapModule = await useGsap()
  if (!gsapModule || !containerRef.value) return
  const { gsap } = gsapModule

  const tweens: gsap.core.Tween[] = []

  const ctx = gsap.context(() => {
    // Atmosphere halo pulse
    if (atmosphereRef.value) {
      tweens.push(gsap.to(atmosphereRef.value, {
        opacity: 0.7,
        duration: 6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        paused: true,
      }))
    }

    // Corona shimmer — faster subtle flicker
    if (coronaRef.value) {
      tweens.push(gsap.to(coronaRef.value, {
        opacity: 0.6,
        scaleX: 1.1,
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1,
        paused: true,
      }))
    }

    // Lens flare scale pulse
    if (lensFlareRef.value) {
      tweens.push(gsap.to(lensFlareRef.value, {
        scale: 1.3,
        opacity: 0.8,
        duration: 5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 2,
        paused: true,
      }))
    }

    // Star layer subtle twinkle
    if (starsRef.value) {
      tweens.push(gsap.to(starsRef.value, {
        opacity: 0.7,
        duration: 5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        paused: true,
      }))
    }
  }, containerRef.value)

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
      style="background: linear-gradient(180deg, #0e0616 0%, #1a1038 45%, #2a1520 75%, #3a1808 100%);"
    />

    <!-- L2: SVG star field -->
    <div ref="starsRef" class="absolute inset-0" />

    <!-- L3: Planet curve -->
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
        border: 1px solid rgba(200,120,50,0.15);
        box-shadow: 0 0 80px rgba(200,120,50,0.10), 0 0 30px rgba(100,150,255,0.05), inset 0 0 80px rgba(0,0,0,0.5);
      "
    />

    <!-- L4: Atmosphere halo -->
    <div
      ref="atmosphereRef"
      class="absolute pointer-events-none"
      style="
        width: 100%;
        height: 35%;
        bottom: 0;
        left: 0;
        background: radial-gradient(ellipse at 50% 100%, rgba(255,140,50,0.30) 0%, rgba(200,100,30,0.15) 30%, transparent 70%);
      "
    />

    <!-- Corona — thin bright line at planet edge -->
    <div
      ref="coronaRef"
      class="absolute pointer-events-none"
      style="
        width: 80%;
        height: 4px;
        bottom: 18%;
        left: 10%;
        background: radial-gradient(ellipse at 50% 50%, rgba(255,180,80,0.35) 0%, rgba(255,140,50,0.15) 40%, transparent 80%);
        filter: blur(3px);
      "
    />

    <!-- L5: Canvas particles -->
    <canvas
      v-if="!isReducedMotion"
      ref="canvasRef"
      class="absolute inset-0 w-full h-full"
    />

    <!-- L6: Lens flare at horizon center -->
    <div
      ref="lensFlareRef"
      class="absolute pointer-events-none"
      style="
        width: 250px;
        height: 250px;
        bottom: 8%;
        left: 50%;
        transform: translateX(-50%);
        background: radial-gradient(ellipse at center, rgba(255,220,100,0.18) 0%, rgba(255,160,60,0.06) 40%, transparent 70%);
        filter: blur(15px);
      "
    />

    <!-- Secondary flare -->
    <div
      class="absolute pointer-events-none"
      style="
        width: 100%;
        height: 2px;
        bottom: 19%;
        left: 0;
        background: linear-gradient(90deg, transparent 10%, rgba(255,180,80,0.12) 35%, rgba(255,200,100,0.20) 50%, rgba(255,180,80,0.12) 65%, transparent 90%);
      "
    />
  </div>
</template>
