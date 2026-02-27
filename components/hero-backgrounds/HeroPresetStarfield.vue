<script setup lang="ts">
/**
 * HeroPresetStarfield — Deep space sci-fi 70s retro-futurism star field
 *
 * Layer 1 (CSS):   Deep space gradient — navy → indigo → dark purple
 * Layer 2 (SVG):   Two tiled SVG data-URI star fields at prime tile sizes
 * Layer 3 (Canvas): Drifting glowing particles via useSpaceParticles
 * Layer 4 (CSS):   Faint radial gradient lens flare
 *
 * Reduced motion: static gradient + static SVG stars only (no Canvas)
 */

const starLayer1Ref = ref<HTMLDivElement | null>(null)
const starLayer2Ref = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const reducedMotion = ref(false)

// --- L3: Canvas particles (composable handles its own lifecycle + reduced-motion) ---
useSpaceParticles(canvasRef, {
  count: 120,
  colors: ['#ffffff', '#7ee8e3', '#c87aff', '#ff9a3c'],
  speedMultiplier: 0.3,
  maxSize: 1.5,
  glowIntensity: 2,
})

// --- SVG star field generator ---
function generateStarSVG(width: number, height: number, count: number): string {
  const colors = ['#ffffff', '#ffffff', '#ffffff', '#7ee8e3', '#c87aff', '#ff9a3c']
  const stars = Array.from({ length: count }, () => {
    const x = Math.random() * width
    const y = Math.random() * height
    const r = 0.3 + Math.random() * 1.2
    const color = colors[Math.floor(Math.random() * colors.length)]
    const opacity = 0.3 + Math.random() * 0.7
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${color}" opacity="${opacity.toFixed(2)}"/>`
  }).join('')

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>${stars}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

onMounted(() => {
  if (!import.meta.client) return

  // Reduced motion check — hides canvas via v-if
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Apply tiled SVG star backgrounds (prime tile sizes avoid visible repetition)
  if (starLayer1Ref.value) {
    starLayer1Ref.value.style.backgroundImage = generateStarSVG(200, 200, 75)
    starLayer1Ref.value.style.backgroundRepeat = 'repeat'
  }
  if (starLayer2Ref.value) {
    starLayer2Ref.value.style.backgroundImage = generateStarSVG(317, 317, 60)
    starLayer2Ref.value.style.backgroundRepeat = 'repeat'
  }
})
</script>

<template>
  <div class="absolute inset-0 overflow-hidden">
    <!-- L1: Deep space gradient -->
    <div
      class="absolute inset-0"
      style="background: linear-gradient(180deg, #020818 0%, #050d2a 60%, #0a0520 100%);"
    />

    <!-- L2: SVG star fields (applied via JS in onMounted for SSR safety) -->
    <div ref="starLayer1Ref" class="absolute inset-0" />
    <div ref="starLayer2Ref" class="absolute inset-0 opacity-60" />

    <!-- L3: Canvas particles (hidden when reduced motion preferred) -->
    <canvas
      v-if="!reducedMotion"
      ref="canvasRef"
      class="absolute inset-0 w-full h-full"
    />

    <!-- L4: Lens flare -->
    <div
      class="absolute inset-0 pointer-events-none"
      style="background: radial-gradient(ellipse at 75% 20%, rgba(255,200,80,0.08) 0%, transparent 50%);"
    />
  </div>
</template>
