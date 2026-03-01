<script setup lang="ts">
/**
 * HeroPresetStarfield — Deep space with shooting stars and twinkling
 *
 * Layer 1 (CSS):    Deep space gradient
 * Layer 2 (SVG):    Two tiled SVG star fields at prime tile sizes
 * Layer 3 (Canvas): Drifting glowing particles via useSpaceParticles
 * Layer 4 (CSS):    Lens flares (multiple)
 * Layer 5 (GSAP):   Shooting stars + twinkle pulse on star layers
 *
 * Reduced motion: static gradient + static SVG stars only
 */

const starLayer1Ref = ref<HTMLDivElement | null>(null)
const starLayer2Ref = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const shootingStarsRef = ref<SVGElement | null>(null)
const { isPaused, isReducedMotion } = useAnimationLifecycle(containerRef)

useSpaceParticles(canvasRef, {
  count: 150,
  colors: ['#ffffff', '#7ee8e3', '#c87aff', '#ff9a3c', '#d4a853'],
  speedMultiplier: 0.35,
  maxSize: 1.8,
  glowIntensity: 3,
})

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

onMounted(async () => {
  if (!import.meta.client) return

  if (starLayer1Ref.value) {
    starLayer1Ref.value.style.backgroundImage = generateStarSVG(200, 200, 75)
    starLayer1Ref.value.style.backgroundRepeat = 'repeat'
  }
  if (starLayer2Ref.value) {
    starLayer2Ref.value.style.backgroundImage = generateStarSVG(317, 317, 60)
    starLayer2Ref.value.style.backgroundRepeat = 'repeat'
  }

  if (isReducedMotion.value) return

  const gsapModule = await useGsap()
  if (!gsapModule || !containerRef.value) return
  const { gsap } = gsapModule

  const tweens: (gsap.core.Tween | gsap.core.Timeline)[] = []

  const ctx = gsap.context(() => {
    // Twinkle: subtle opacity pulse on star layers
    if (starLayer1Ref.value) {
      tweens.push(gsap.to(starLayer1Ref.value, {
        opacity: 0.7,
        duration: 4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        paused: true,
      }))
    }
    if (starLayer2Ref.value) {
      tweens.push(gsap.to(starLayer2Ref.value, {
        opacity: 0.8,
        duration: 5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 2,
        paused: true,
      }))
    }

    // Shooting stars — repeating timeline
    if (shootingStarsRef.value) {
      const lines = shootingStarsRef.value.querySelectorAll('.shooting-star')
      lines.forEach((line, i) => {
        const tl = gsap.timeline({
          repeat: -1,
          repeatDelay: 4 + i * 3,
          delay: i * 2.5,
          paused: true,
        })
        tl.set(line, { opacity: 0, attr: { x2: line.getAttribute('x1'), y2: line.getAttribute('y1') } })
          .to(line, {
            opacity: 0.8,
            attr: { x2: `+=${80 + i * 20}`, y2: `+=${40 + i * 10}` },
            duration: 0.4,
            ease: 'power2.in',
          })
          .to(line, {
            opacity: 0,
            attr: { x1: `+=${80 + i * 20}`, y1: `+=${40 + i * 10}` },
            duration: 0.3,
            ease: 'power1.out',
          })
        tweens.push(tl)
      })
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
      style="background: linear-gradient(180deg, #0e0616 0%, #150a28 60%, #180a20 100%);"
    />

    <!-- L2: SVG star fields -->
    <div ref="starLayer1Ref" class="absolute inset-0" />
    <div ref="starLayer2Ref" class="absolute inset-0 opacity-60" />

    <!-- L3: Canvas particles -->
    <canvas
      v-if="!isReducedMotion"
      ref="canvasRef"
      class="absolute inset-0 w-full h-full"
    />

    <!-- L4: Lens flares -->
    <div
      class="absolute inset-0 pointer-events-none"
      style="background: radial-gradient(ellipse at 75% 20%, rgba(255,200,80,0.10) 0%, transparent 50%);"
    />
    <div
      class="absolute inset-0 pointer-events-none"
      style="background: radial-gradient(ellipse at 20% 70%, rgba(200,122,255,0.06) 0%, transparent 40%);"
    />

    <!-- L5: Shooting stars SVG -->
    <svg
      v-if="!isReducedMotion"
      ref="shootingStarsRef"
      class="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line class="shooting-star" x1="150" y1="80" x2="150" y2="80" stroke="url(#star-trail)" stroke-width="1.5" stroke-linecap="round" opacity="0" />
      <line class="shooting-star" x1="500" y1="40" x2="500" y2="40" stroke="url(#star-trail)" stroke-width="1" stroke-linecap="round" opacity="0" />
      <line class="shooting-star" x1="680" y1="150" x2="680" y2="150" stroke="url(#star-trail)" stroke-width="1.2" stroke-linecap="round" opacity="0" />
      <defs>
        <linearGradient id="star-trail" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="white" stop-opacity="0" />
          <stop offset="100%" stop-color="white" stop-opacity="1" />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>
