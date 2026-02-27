<script setup lang="ts">
/**
 * HeroPresetGridStation — TRON-like perspective grid with station nodes and orbit ring
 *
 * Layer 1 (CSS):   Dark space gradient with teal tint
 * Layer 2 (SVG):   Perspective grid (vanishing point at 400,210 in 800×600 viewBox)
 *                  — 8 horizontal lines converging toward VP
 *                  — 10 radial lines from VP to bottom edge
 *                  — 5 station nodes at grid intersections
 *                  — Dashed orbit ring ellipse around VP
 * Layer 3 (CSS):   Horizontal scan line overlay
 *
 * GSAP animations: grid line pulse, station node stagger, orbit ring rotation
 * Reduced motion:  static grid visible, no pulse/rotation
 */

const containerRef = ref<HTMLElement | null>(null)
const orbitRingRef = ref<SVGEllipseElement | null>(null)

const { isPaused, isReducedMotion } = useAnimationLifecycle(containerRef)

onMounted(async () => {
  if (!import.meta.client) return

  // Guard reduced motion BEFORE loading GSAP
  if (isReducedMotion.value) return

  const gsapModule = await useGsap()
  if (!gsapModule || !containerRef.value) return
  const { gsap } = gsapModule

  const tweens: gsap.core.Tween[] = []

  const ctx = gsap.context(() => {
    // Grid line subtle pulse
    tweens.push(gsap.to('.grid-line', {
      opacity: 0.25,
      duration: 6,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: 0.3,
      paused: true,
    }))

    // Station nodes stagger pulse
    tweens.push(gsap.to('.station-node', {
      opacity: 0.8,
      scale: 1.5,
      duration: 2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: 0.5,
      transformOrigin: 'center',
      paused: true,
    }))

    // Orbit ring continuous rotation
    if (orbitRingRef.value) {
      tweens.push(gsap.to(orbitRingRef.value, {
        rotation: 360,
        duration: 40,
        ease: 'none',
        repeat: -1,
        transformOrigin: '400px 210px',
        paused: true,
      }))
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

// --- Perspective grid geometry ---
// Vanishing point at (400, 210) in 800×600 viewBox

// 8 horizontal lines at increasing y positions
const horizontalYs = [280, 320, 360, 400, 440, 480, 520, 560]

// 10 radial lines from VP to bottom edge
const radialXs = [0, 90, 180, 270, 360, 440, 530, 620, 710, 800]

// Vanishing point
const vpX = 400
const vpY = 210
</script>

<template>
  <div ref="containerRef" class="absolute inset-0 overflow-hidden">
    <!-- L1: Dark space gradient with teal tint -->
    <div
      class="absolute inset-0"
      style="background: linear-gradient(180deg, #020818 0%, #031020 60%, #041828 100%);"
    />

    <!-- L2: Perspective grid SVG -->
    <svg
      class="absolute inset-0 w-full h-full"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Horizontal lines spanning full width -->
      <line
        v-for="y in horizontalYs"
        :key="'h-' + y"
        class="grid-line"
        x1="0"
        :y1="y"
        x2="800"
        :y2="y"
        stroke="rgba(74,158,255,0.15)"
        stroke-width="0.5"
      />

      <!-- Radial lines from vanishing point to bottom edge -->
      <line
        v-for="x in radialXs"
        :key="'r-' + x"
        class="grid-line"
        :x1="vpX"
        :y1="vpY"
        :x2="x"
        y2="600"
        stroke="rgba(74,158,255,0.15)"
        stroke-width="0.5"
      />

      <!-- Station nodes at grid intersections -->
      <circle
        class="station-node"
        :cx="vpX"
        :cy="vpY"
        r="4"
        fill="rgba(74,158,255,0.4)"
      />
      <circle
        class="station-node"
        cx="200"
        cy="360"
        r="3"
        fill="rgba(74,158,255,0.3)"
      />
      <circle
        class="station-node"
        cx="600"
        cy="360"
        r="3"
        fill="rgba(74,158,255,0.3)"
      />
      <circle
        class="station-node"
        cx="100"
        cy="480"
        r="2"
        fill="rgba(74,158,255,0.2)"
      />
      <circle
        class="station-node"
        cx="700"
        cy="480"
        r="2"
        fill="rgba(74,158,255,0.2)"
      />

      <!-- Orbit ring (dashed ellipse around VP) -->
      <ellipse
        ref="orbitRingRef"
        :cx="vpX"
        :cy="vpY"
        rx="120"
        ry="40"
        fill="none"
        stroke="rgba(74,158,255,0.2)"
        stroke-width="1"
        stroke-dasharray="8 4"
      />
    </svg>

    <!-- L3: Scan line overlay -->
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
    rgba(74, 158, 255, 0.02) 3px,
    rgba(74, 158, 255, 0.02) 4px
  );
}
</style>
