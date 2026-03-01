<script setup lang="ts">
/**
 * HeroPresetOrbital — Concentric rotating rings with station core
 *
 * Layer 1 (CSS):    Deep space gradient
 * Layer 2 (SVG):    Tiled star field
 * Layer 3 (SVG):    4 concentric orbit rings + dots + center core glow
 * Layer 4 (Canvas): Drifting particles
 * Layer 5 (CSS):    Lens flares with GSAP pulse
 *
 * Reduced motion: static rings + lens flares
 */

const starLayerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const ring1Ref = ref<SVGGElement | null>(null)
const ring2Ref = ref<SVGGElement | null>(null)
const ring3Ref = ref<SVGGElement | null>(null)
const ring4Ref = ref<SVGGElement | null>(null)
const lensFlare1Ref = ref<HTMLDivElement | null>(null)
const lensFlare2Ref = ref<HTMLDivElement | null>(null)
const coreGlowRef = ref<HTMLDivElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const { isPaused, isReducedMotion } = useAnimationLifecycle(containerRef)

useSpaceParticles(canvasRef, {
  count: 130,
  colors: ['#ffffff', '#7ee8e3', '#c87aff', '#ffb347', '#d4a853'],
  speedMultiplier: 0.25,
  maxSize: 1.2,
  glowIntensity: 2,
})

function generateStarSVG(width: number, height: number, count: number): string {
  const colors = ['#ffffff', '#ffffff', '#7ee8e3', '#ffb347', '#c87aff']
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

  if (starLayerRef.value) {
    starLayerRef.value.style.backgroundImage = generateStarSVG(250, 250, 50)
    starLayerRef.value.style.backgroundRepeat = 'repeat'
  }

  if (isReducedMotion.value) return

  const gsapModule = await useGsap()
  if (!gsapModule || !containerRef.value) return
  const { gsap } = gsapModule

  const tweens: gsap.core.Tween[] = []
  const center = '400px 300px'

  const ctx = gsap.context(() => {
    // 4 rings at different speeds and directions
    const rings = [
      { ref: ring1Ref, duration: 18, dir: 1 },
      { ref: ring2Ref, duration: 28, dir: -1 },
      { ref: ring3Ref, duration: 40, dir: 1 },
      { ref: ring4Ref, duration: 55, dir: -1 },
    ]
    for (const ring of rings) {
      if (ring.ref.value) {
        tweens.push(gsap.to(ring.ref.value, {
          rotation: 360 * ring.dir,
          duration: ring.duration,
          ease: 'none',
          repeat: -1,
          transformOrigin: center,
          paused: true,
        }))
      }
    }

    // Lens flare pulses
    if (lensFlare1Ref.value) {
      tweens.push(gsap.to(lensFlare1Ref.value, {
        opacity: 0.7,
        scale: 1.4,
        duration: 4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        paused: true,
      }))
    }
    if (lensFlare2Ref.value) {
      tweens.push(gsap.to(lensFlare2Ref.value, {
        opacity: 0.5,
        scale: 1.3,
        duration: 6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 2,
        paused: true,
      }))
    }

    // Core glow pulse
    if (coreGlowRef.value) {
      tweens.push(gsap.to(coreGlowRef.value, {
        opacity: 0.8,
        scale: 1.2,
        duration: 3,
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
    <!-- L1: Deep space gradient -->
    <div
      class="absolute inset-0"
      style="background: linear-gradient(180deg, #0e0616 0%, #150a20 60%, #0e0616 100%);"
    />

    <!-- L2: SVG tiled star field -->
    <div ref="starLayerRef" class="absolute inset-0 opacity-70" />

    <!-- Core glow at center -->
    <div
      ref="coreGlowRef"
      class="absolute pointer-events-none"
      style="
        width: 120px; height: 120px;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        background: radial-gradient(ellipse at center, rgba(212,168,83,0.20) 0%, rgba(200,122,255,0.08) 50%, transparent 70%);
        filter: blur(15px);
      "
    />

    <!-- L3: Concentric orbit rings -->
    <svg
      class="absolute inset-0 w-full h-full"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Central station dot -->
      <circle cx="400" cy="300" r="3" fill="rgba(212,168,83,0.6)" />

      <!-- Ring 1: tight, fast -->
      <g ref="ring1Ref" style="transform-origin: 400px 300px;">
        <ellipse cx="400" cy="300" rx="100" ry="35" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="0.8" stroke-dasharray="6 4" />
        <circle cx="500" cy="300" r="3" fill="rgba(255,255,255,0.7)" />
        <circle cx="300" cy="300" r="1.5" fill="rgba(255,255,255,0.4)" />
      </g>

      <!-- Ring 2: medium -->
      <g ref="ring2Ref" style="transform-origin: 400px 300px;">
        <ellipse cx="400" cy="300" rx="190" ry="62" fill="none" stroke="rgba(74,220,220,0.12)" stroke-width="0.8" stroke-dasharray="8 4" transform="rotate(-12, 400, 300)" />
        <circle cx="590" cy="300" r="2.5" fill="rgba(74,220,220,0.7)" />
      </g>

      <!-- Ring 3: large -->
      <g ref="ring3Ref" style="transform-origin: 400px 300px;">
        <ellipse cx="400" cy="300" rx="280" ry="90" fill="none" stroke="rgba(200,122,255,0.10)" stroke-width="0.8" stroke-dasharray="10 5" transform="rotate(18, 400, 300)" />
        <circle cx="680" cy="300" r="2" fill="rgba(200,122,255,0.7)" />
        <circle cx="120" cy="300" r="1.5" fill="rgba(200,122,255,0.4)" />
      </g>

      <!-- Ring 4: very large, slow -->
      <g ref="ring4Ref" style="transform-origin: 400px 300px;">
        <ellipse cx="400" cy="300" rx="360" ry="110" fill="none" stroke="rgba(255,180,50,0.08)" stroke-width="0.6" stroke-dasharray="12 6" transform="rotate(-8, 400, 300)" />
        <circle cx="760" cy="300" r="1.8" fill="rgba(255,180,50,0.6)" />
      </g>
    </svg>

    <!-- L4: Canvas particles -->
    <canvas
      v-if="!isReducedMotion"
      ref="canvasRef"
      class="absolute inset-0 w-full h-full"
    />

    <!-- L5: Lens flares -->
    <div
      ref="lensFlare1Ref"
      class="absolute pointer-events-none"
      style="
        width: 180px; height: 180px;
        top: 20%; left: 65%;
        background: radial-gradient(ellipse at center, rgba(255,200,80,0.15) 0%, transparent 70%);
        filter: blur(12px);
      "
    />
    <div
      ref="lensFlare2Ref"
      class="absolute pointer-events-none"
      style="
        width: 120px; height: 120px;
        top: 55%; left: 25%;
        background: radial-gradient(ellipse at center, rgba(200,122,255,0.10) 0%, transparent 70%);
        filter: blur(10px);
      "
    />
  </div>
</template>
