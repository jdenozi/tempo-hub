<script setup lang="ts">
/**
 * SolarSystemBackground — Animated solar system with orbiting planets
 *
 * Layer 1 (CSS):    Deep space gradient
 * Layer 2 (SVG):    Tiled SVG data-URI star field (40 stars)
 * Layer 3 (SVG):    Sun + 6 elliptical orbits + planets with GSAP rotation
 * Layer 4 (Canvas): Drifting particles via useSpaceParticles
 *
 * Planet periods chosen so they roughly align every ~60s (LCM convergence).
 * Reduced motion: static gradient + static orbits + static planets (no GSAP, no Canvas)
 */

const starLayerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

// Planet orbit group refs
const mercuryOrbitRef = ref<SVGGElement | null>(null)
const venusOrbitRef = ref<SVGGElement | null>(null)
const earthOrbitRef = ref<SVGGElement | null>(null)
const marsOrbitRef = ref<SVGGElement | null>(null)
const jupiterOrbitRef = ref<SVGGElement | null>(null)
const saturnOrbitRef = ref<SVGGElement | null>(null)

const { isPaused, isReducedMotion, isMobile } = useAnimationLifecycle(containerRef)

// --- L4: Canvas particles ---
useSpaceParticles(canvasRef, {
  count: 60,
  colors: ['#ffffff', '#d4a853', '#7ee8e3'],
  speedMultiplier: 0.15,
  maxSize: 0.8,
  glowIntensity: 0.5,
})

// --- SVG star field generator ---
function generateStarSVG(width: number, height: number, count: number): string {
  const colors = ['#ffffff', '#ffffff', '#d4a853', '#7ee8e3']
  const stars = Array.from({ length: count }, () => {
    const x = Math.random() * width
    const y = Math.random() * height
    const r = 0.2 + Math.random() * 0.6
    const color = colors[Math.floor(Math.random() * colors.length)]
    const opacity = 0.15 + Math.random() * 0.45
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${color}" opacity="${opacity.toFixed(2)}"/>`
  }).join('')

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>${stars}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

onMounted(async () => {
  if (!import.meta.client) return

  // Apply tiled SVG star background
  if (starLayerRef.value) {
    starLayerRef.value.style.backgroundImage = generateStarSVG(250, 250, 40)
    starLayerRef.value.style.backgroundRepeat = 'repeat'
  }

  if (isReducedMotion.value) return

  const gsapModule = await useGsap()
  if (!gsapModule || !containerRef.value) return
  const { gsap } = gsapModule

  const tweens: gsap.core.Tween[] = []
  const center = '400px 300px'

  // Planet periods in seconds — chosen so rough LCM ~ 60s
  // Mercury: 6s, Venus: 10s, Earth: 12s, Mars: 15s, Jupiter: 30s, Saturn: 60s
  const planets = [
    { ref: mercuryOrbitRef, duration: 6 },
    { ref: venusOrbitRef, duration: 10 },
    { ref: earthOrbitRef, duration: 12 },
    { ref: marsOrbitRef, duration: 15 },
    { ref: jupiterOrbitRef, duration: 30 },
    { ref: saturnOrbitRef, duration: 60 },
  ]

  const ctx = gsap.context(() => {
    for (const planet of planets) {
      if (planet.ref.value) {
        tweens.push(gsap.to(planet.ref.value, {
          rotation: 360,
          duration: planet.duration,
          ease: 'none',
          repeat: -1,
          transformOrigin: center,
          paused: true,
        }))
      }
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
    <!-- L1: Deep space gradient -->
    <div
      class="absolute inset-0"
      style="background: linear-gradient(180deg, #0e0616 0%, #180a28 40%, #0e0616 100%);"
    />

    <!-- L2: SVG tiled star field -->
    <div ref="starLayerRef" class="absolute inset-0 opacity-60" />

    <!-- L3: Solar system SVG -->
    <svg
      class="absolute inset-0 w-full h-full"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <!-- Sun glow gradient -->
        <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#d4a853" stop-opacity="1" />
          <stop offset="40%" stop-color="#d4a853" stop-opacity="0.6" />
          <stop offset="70%" stop-color="#d4a853" stop-opacity="0.15" />
          <stop offset="100%" stop-color="#d4a853" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- Sun -->
      <circle cx="400" cy="300" r="30" fill="url(#sun-glow)" />
      <circle cx="400" cy="300" r="10" fill="#d4a853" opacity="0.9" />

      <!-- Orbit 1: Mercury (r~60) -->
      <ellipse cx="400" cy="300" rx="60" ry="25" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" stroke-dasharray="4 3" />
      <g ref="mercuryOrbitRef" style="transform-origin: 400px 300px;">
        <circle cx="460" cy="300" r="2" fill="#a0a0a0" opacity="0.8" />
      </g>

      <!-- Orbit 2: Venus (r~95) -->
      <ellipse cx="400" cy="300" rx="95" ry="38" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="0.5" stroke-dasharray="5 3" />
      <g ref="venusOrbitRef" style="transform-origin: 400px 300px;">
        <circle cx="495" cy="300" r="3" fill="#e8c88a" opacity="0.8" />
      </g>

      <!-- Orbit 3: Earth (r~135) -->
      <ellipse cx="400" cy="300" rx="135" ry="52" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="0.5" stroke-dasharray="6 3" />
      <g ref="earthOrbitRef" style="transform-origin: 400px 300px;">
        <circle cx="535" cy="300" r="3.5" fill="#4a9edc" opacity="0.85" />
      </g>

      <!-- Orbit 4: Mars (r~175) -->
      <ellipse cx="400" cy="300" rx="175" ry="66" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="0.5" stroke-dasharray="6 4" />
      <g ref="marsOrbitRef" style="transform-origin: 400px 300px;">
        <circle cx="575" cy="300" r="2.5" fill="#c85a3a" opacity="0.8" />
      </g>

      <!-- Orbit 5: Jupiter (r~230) -->
      <ellipse cx="400" cy="300" rx="230" ry="85" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="0.5" stroke-dasharray="8 4" />
      <g ref="jupiterOrbitRef" style="transform-origin: 400px 300px;">
        <circle cx="630" cy="300" r="6" fill="#d4b882" opacity="0.75" />
      </g>

      <!-- Orbit 6: Saturn (r~290) -->
      <ellipse cx="400" cy="300" rx="290" ry="105" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="0.5" stroke-dasharray="10 5" />
      <g ref="saturnOrbitRef" style="transform-origin: 400px 300px;">
        <!-- Saturn body -->
        <circle cx="690" cy="300" r="5" fill="#c8a84e" opacity="0.75" />
        <!-- Saturn ring -->
        <ellipse cx="690" cy="300" rx="9" ry="2.5" fill="none" stroke="#c8a84e" stroke-width="0.8" opacity="0.5" />
      </g>
    </svg>

    <!-- L4: Canvas particles -->
    <canvas
      v-if="!isReducedMotion"
      ref="canvasRef"
      class="absolute inset-0 w-full h-full"
    />
  </div>
</template>
