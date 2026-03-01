<script setup lang="ts">
/**
 * HeroPresetGridStation — TRON-like perspective grid with energy pulses
 *
 * Layer 1 (CSS):   Dark space gradient with purple tint
 * Layer 2 (SVG):   Perspective grid + station nodes + orbit ring + energy arcs
 * Layer 3 (Canvas): Drifting particles via useSpaceParticles
 * Layer 4 (CSS):   Scan line overlay
 *
 * GSAP: grid pulse, station node stagger, orbit ring rotation, energy arc pulse
 */

const containerRef = ref<HTMLElement | null>(null)
const orbitRingRef = ref<SVGEllipseElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const vpGlowRef = ref<HTMLDivElement | null>(null)

const { isPaused, isReducedMotion } = useAnimationLifecycle(containerRef)

useSpaceParticles(canvasRef, {
  count: 80,
  colors: ['#7e9eff', '#c87aff', '#ffffff'],
  speedMultiplier: 0.2,
  maxSize: 1.0,
  glowIntensity: 2,
})

onMounted(async () => {
  if (!import.meta.client) return
  if (isReducedMotion.value) return

  const gsapModule = await useGsap()
  if (!gsapModule || !containerRef.value) return
  const { gsap } = gsapModule

  const tweens: gsap.core.Tween[] = []

  const ctx = gsap.context(() => {
    // Grid lines — breathing pulse
    tweens.push(gsap.to('.grid-line', {
      opacity: 0.3,
      duration: 4,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: 0.2,
      paused: true,
    }))

    // Station nodes — staggered scale pulse
    tweens.push(gsap.to('.station-node', {
      opacity: 0.9,
      scale: 1.8,
      duration: 2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: 0.4,
      transformOrigin: 'center',
      paused: true,
    }))

    // Energy arcs — opacity wave
    tweens.push(gsap.to('.energy-arc', {
      opacity: 0.4,
      duration: 3,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: 0.8,
      paused: true,
    }))

    // Orbit ring — continuous rotation
    if (orbitRingRef.value) {
      tweens.push(gsap.to(orbitRingRef.value, {
        rotation: 360,
        duration: 30,
        ease: 'none',
        repeat: -1,
        transformOrigin: '400px 210px',
        paused: true,
      }))
    }

    // VP glow pulse
    if (vpGlowRef.value) {
      tweens.push(gsap.to(vpGlowRef.value, {
        opacity: 0.8,
        scale: 1.4,
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

const horizontalYs = [260, 300, 340, 380, 420, 460, 500, 540, 570]
const radialXs = [0, 80, 160, 250, 340, 460, 550, 640, 720, 800]
const vpX = 400
const vpY = 210
</script>

<template>
  <div ref="containerRef" class="absolute inset-0 overflow-hidden">
    <!-- L1: Dark space gradient -->
    <div
      class="absolute inset-0"
      style="background: linear-gradient(180deg, #0e0616 0%, #120820 60%, #150a28 100%);"
    />

    <!-- VP glow -->
    <div
      ref="vpGlowRef"
      class="absolute pointer-events-none"
      style="
        width: 200px; height: 200px;
        top: 25%; left: 50%;
        transform: translate(-50%, -50%);
        background: radial-gradient(ellipse at center, rgba(120,160,255,0.12) 0%, transparent 70%);
        filter: blur(20px);
      "
    />

    <!-- L2: Perspective grid SVG -->
    <svg
      class="absolute inset-0 w-full h-full"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Horizontal lines -->
      <line
        v-for="y in horizontalYs"
        :key="'h-' + y"
        class="grid-line"
        x1="0"
        :y1="y"
        x2="800"
        :y2="y"
        stroke="rgba(120,140,255,0.15)"
        stroke-width="0.5"
      />

      <!-- Radial lines from VP -->
      <line
        v-for="x in radialXs"
        :key="'r-' + x"
        class="grid-line"
        :x1="vpX"
        :y1="vpY"
        :x2="x"
        y2="600"
        stroke="rgba(120,140,255,0.15)"
        stroke-width="0.5"
      />

      <!-- Energy arcs connecting nodes -->
      <path class="energy-arc" d="M200,360 Q300,300 400,210" fill="none" stroke="rgba(200,122,255,0.15)" stroke-width="0.8" stroke-dasharray="4 4" opacity="0.1" />
      <path class="energy-arc" d="M600,360 Q500,300 400,210" fill="none" stroke="rgba(200,122,255,0.15)" stroke-width="0.8" stroke-dasharray="4 4" opacity="0.1" />
      <path class="energy-arc" d="M100,480 Q250,400 400,210" fill="none" stroke="rgba(120,160,255,0.10)" stroke-width="0.6" stroke-dasharray="3 5" opacity="0.1" />
      <path class="energy-arc" d="M700,480 Q550,400 400,210" fill="none" stroke="rgba(120,160,255,0.10)" stroke-width="0.6" stroke-dasharray="3 5" opacity="0.1" />

      <!-- Station nodes -->
      <circle class="station-node" :cx="vpX" :cy="vpY" r="5" fill="rgba(120,160,255,0.5)" />
      <circle class="station-node" cx="200" cy="360" r="3.5" fill="rgba(200,122,255,0.4)" />
      <circle class="station-node" cx="600" cy="360" r="3.5" fill="rgba(200,122,255,0.4)" />
      <circle class="station-node" cx="100" cy="480" r="2.5" fill="rgba(120,160,255,0.25)" />
      <circle class="station-node" cx="700" cy="480" r="2.5" fill="rgba(120,160,255,0.25)" />
      <circle class="station-node" cx="300" cy="420" r="2" fill="rgba(200,122,255,0.2)" />
      <circle class="station-node" cx="500" cy="420" r="2" fill="rgba(200,122,255,0.2)" />

      <!-- Orbit ring -->
      <ellipse
        ref="orbitRingRef"
        :cx="vpX"
        :cy="vpY"
        rx="140"
        ry="45"
        fill="none"
        stroke="rgba(120,160,255,0.2)"
        stroke-width="1"
        stroke-dasharray="8 4"
      />
    </svg>

    <!-- L3: Canvas particles -->
    <canvas
      v-if="!isReducedMotion"
      ref="canvasRef"
      class="absolute inset-0 w-full h-full"
    />

    <!-- L4: Scan line overlay -->
    <div
      class="absolute inset-0 pointer-events-none grid-scanlines"
      aria-hidden="true"
    />
  </div>
</template>

<style scoped>
.grid-scanlines {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(120, 140, 255, 0.02) 3px,
    rgba(120, 140, 255, 0.02) 4px
  );
}
</style>
