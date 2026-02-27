<script setup lang="ts">
/**
 * HeroPresetOrbital — Sci-fi orbital station with concentric rotating rings
 *
 * Layer 1 (CSS):    Deep space gradient with blue tint
 * Layer 2 (SVG):    Tiled SVG data-URI star field (40 stars)
 * Layer 3 (SVG):    3 concentric orbit rings (dashed ellipses) + GSAP rotation
 * Layer 4 (Canvas): Drifting glowing particles via useSpaceParticles
 * Layer 5 (CSS):    2 lens flare elements with GSAP pulse
 *
 * Reduced motion: static gradient + static rings + static lens flares (no GSAP, no Canvas)
 */

const starLayerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const ring1Ref = ref<SVGGElement | null>(null)
const ring2Ref = ref<SVGGElement | null>(null)
const ring3Ref = ref<SVGGElement | null>(null)
const lensFlare1Ref = ref<HTMLDivElement | null>(null)
const lensFlare2Ref = ref<HTMLDivElement | null>(null)
const reducedMotion = ref(false)

// --- L4: Canvas particles (composable handles lifecycle + reduced-motion internally) ---
useSpaceParticles(canvasRef, {
  count: 100,
  colors: ['#ffffff', '#7ee8e3', '#ffb347'],
  speedMultiplier: 0.2,
  maxSize: 1.0,
  glowIntensity: 1,
})

// --- SVG star field generator ---
function generateStarSVG(width: number, height: number, count: number): string {
  const colors = ['#ffffff', '#ffffff', '#7ee8e3', '#ffb347']
  const stars = Array.from({ length: count }, () => {
    const x = Math.random() * width
    const y = Math.random() * height
    const r = 0.2 + Math.random() * 0.8
    const color = colors[Math.floor(Math.random() * colors.length)]
    const opacity = 0.2 + Math.random() * 0.6
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${color}" opacity="${opacity.toFixed(2)}"/>`
  }).join('')

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>${stars}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

onMounted(async () => {
  if (!import.meta.client) return

  // Reduced motion check
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Apply tiled SVG star background
  if (starLayerRef.value) {
    starLayerRef.value.style.backgroundImage = generateStarSVG(250, 250, 40)
    starLayerRef.value.style.backgroundRepeat = 'repeat'
  }

  // Skip GSAP animations if reduced motion preferred
  if (reducedMotion.value) return

  // --- L3 + L5: GSAP animations (dynamic import, SSR-safe) ---
  const gsapModule = await useGsap()
  if (!gsapModule) return
  const { gsap } = gsapModule

  const ctx = gsap.context(() => {
    // Orbit ring rotations — different speeds and directions
    if (ring1Ref.value) {
      gsap.to(ring1Ref.value, {
        rotation: 360,
        duration: 20,
        ease: 'none',
        repeat: -1,
        transformOrigin: '400px 300px',
      })
    }
    if (ring2Ref.value) {
      gsap.to(ring2Ref.value, {
        rotation: -360,
        duration: 30,
        ease: 'none',
        repeat: -1,
        transformOrigin: '400px 300px',
      })
    }
    if (ring3Ref.value) {
      gsap.to(ring3Ref.value, {
        rotation: 360,
        duration: 45,
        ease: 'none',
        repeat: -1,
        transformOrigin: '400px 300px',
      })
    }

    // Lens flare pulses
    if (lensFlare1Ref.value) {
      gsap.to(lensFlare1Ref.value, {
        opacity: 0.6,
        scale: 1.3,
        duration: 4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    }
    if (lensFlare2Ref.value) {
      gsap.to(lensFlare2Ref.value, {
        opacity: 0.4,
        scale: 1.2,
        duration: 6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 2,
      })
    }
  })

  onUnmounted(() => ctx.revert())
})
</script>

<template>
  <div class="absolute inset-0 overflow-hidden">
    <!-- L1: Deep space gradient with blue tint -->
    <div
      class="absolute inset-0"
      style="background: linear-gradient(180deg, #020818 0%, #040d20 60%, #060a18 100%);"
    />

    <!-- L2: SVG tiled star field (applied via JS in onMounted for SSR safety) -->
    <div ref="starLayerRef" class="absolute inset-0 opacity-70" />

    <!-- L3: Concentric orbit rings (SVG inline, GSAP-animated) -->
    <svg
      class="absolute inset-0 w-full h-full"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Orbit ring 1: large, slight tilt -->
      <g ref="ring1Ref" style="transform-origin: 400px 300px;">
        <ellipse cx="400" cy="300" rx="280" ry="90" fill="none" stroke="rgba(255,255,255,0.10)" stroke-width="1" stroke-dasharray="12 6" />
        <circle cx="680" cy="300" r="2.5" fill="rgba(255,255,255,0.6)" />
      </g>

      <!-- Orbit ring 2: medium, counter-rotated with tilt -->
      <g ref="ring2Ref" style="transform-origin: 400px 300px;">
        <ellipse cx="400" cy="300" rx="200" ry="65" fill="none" stroke="rgba(74,220,220,0.15)" stroke-width="1" stroke-dasharray="8 4" transform="rotate(-15, 400, 300)" />
        <circle cx="600" cy="300" r="2" fill="rgba(74,220,220,0.7)" />
      </g>

      <!-- Orbit ring 3: small, steep tilt -->
      <g ref="ring3Ref" style="transform-origin: 400px 300px;">
        <ellipse cx="400" cy="300" rx="130" ry="40" fill="none" stroke="rgba(255,180,50,0.10)" stroke-width="1" stroke-dasharray="6 3" transform="rotate(20, 400, 300)" />
        <circle cx="530" cy="300" r="1.5" fill="rgba(255,180,50,0.8)" />
      </g>
    </svg>

    <!-- L4: Canvas particles (hidden when reduced motion preferred) -->
    <canvas
      v-if="!reducedMotion"
      ref="canvasRef"
      class="absolute inset-0 w-full h-full"
    />

    <!-- L5: Lens flare elements (static in reduced motion, GSAP-pulsed otherwise) -->
    <div
      ref="lensFlare1Ref"
      class="absolute pointer-events-none"
      style="
        width: 150px; height: 150px;
        top: 20%; left: 65%;
        background: radial-gradient(ellipse at center, rgba(255,200,80,0.15) 0%, transparent 70%);
        filter: blur(10px);
      "
    />
    <div
      ref="lensFlare2Ref"
      class="absolute pointer-events-none"
      style="
        width: 100px; height: 100px;
        top: 50%; left: 30%;
        background: radial-gradient(ellipse at center, rgba(74,220,220,0.12) 0%, transparent 70%);
        filter: blur(8px);
      "
    />
  </div>
</template>
