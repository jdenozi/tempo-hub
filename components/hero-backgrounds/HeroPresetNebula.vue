<template>
  <div class="absolute inset-0 overflow-hidden nebula-bg">
    <!-- Layer 2: SVG star field (data-URI applied in onMounted) -->
    <div ref="starFieldRef" class="absolute inset-0 pointer-events-none" />

    <!-- Layer 3: Nebula clouds (GSAP animated drift) -->
    <div
      ref="nebulaMagentaRef"
      class="absolute pointer-events-none nebula-cloud"
      style="
        width: 60vw; height: 40vw;
        top: -10%; left: -10%;
        background: radial-gradient(ellipse at center, rgba(200,50,150,0.15) 0%, rgba(150,30,100,0.08) 40%, transparent 70%);
        border-radius: 50%;
        filter: blur(40px);
      "
    />
    <div
      ref="nebulaTealRef"
      class="absolute pointer-events-none nebula-cloud"
      style="
        width: 50vw; height: 35vw;
        top: 20%; right: -15%;
        background: radial-gradient(ellipse at center, rgba(30,180,180,0.12) 0%, rgba(20,120,140,0.06) 40%, transparent 70%);
        border-radius: 50%;
        filter: blur(35px);
      "
    />
    <div
      ref="nebulaGoldRef"
      class="absolute pointer-events-none nebula-cloud"
      style="
        width: 30vw; height: 25vw;
        bottom: 10%; left: 30%;
        background: radial-gradient(ellipse at center, rgba(220,160,40,0.10) 0%, rgba(180,120,20,0.05) 40%, transparent 70%);
        border-radius: 50%;
        filter: blur(30px);
      "
    />

    <!-- Layer 4: Canvas particles (skipped on reduced motion) -->
    <canvas
      v-if="!reducedMotion"
      ref="canvasRef"
      class="absolute inset-0 w-full h-full pointer-events-none"
    />

    <!-- Layer 5: Lens flare -->
    <div class="absolute inset-0 pointer-events-none nebula-lens-flare" />
  </div>
</template>

<script setup lang="ts">
const nebulaMagentaRef = ref<HTMLDivElement | null>(null)
const nebulaTealRef = ref<HTMLDivElement | null>(null)
const nebulaGoldRef = ref<HTMLDivElement | null>(null)
const starFieldRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const reducedMotion = ref(false)

// Layer 4: Canvas particles — composable handles lifecycle internally
useSpaceParticles(canvasRef, {
  count: 100,
  colors: ['#ffffff', '#7ee8e3', '#c87aff', '#ffb347'],
  speedMultiplier: 0.4,
  maxSize: 1.2,
  glowIntensity: 3,
})

onMounted(async () => {
  if (!import.meta.client) return

  // Reduced motion check
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Layer 2: Sparse SVG star field (40 stars, tiled)
  if (starFieldRef.value) {
    const stars: string[] = []
    for (let i = 0; i < 40; i++) {
      const cx = (Math.random() * 100).toFixed(1)
      const cy = (Math.random() * 100).toFixed(1)
      const r = (0.1 + Math.random() * 0.3).toFixed(2)
      const opacity = (0.3 + Math.random() * 0.7).toFixed(2)
      stars.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="white" opacity="${opacity}"/>`)
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${stars.join('')}</svg>`
    starFieldRef.value.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
    starFieldRef.value.style.backgroundSize = '400px 400px'
    starFieldRef.value.style.backgroundRepeat = 'repeat'
  }

  // Skip GSAP if reduced motion
  if (reducedMotion.value) return

  // Layer 3: GSAP nebula drift animations
  const gsapModule = await useGsap()
  if (!gsapModule) return
  const { gsap } = gsapModule

  const ctx = gsap.context(() => {
    // Magenta nebula — slow diagonal drift
    gsap.to(nebulaMagentaRef.value, {
      x: '8%', y: '5%', duration: 25, ease: 'sine.inOut',
      repeat: -1, yoyo: true,
    })
    // Teal nebula — opposite drift, offset timing
    gsap.to(nebulaTealRef.value, {
      x: '-6%', y: '8%', duration: 30, ease: 'sine.inOut',
      repeat: -1, yoyo: true, delay: 5,
    })
    // Gold nebula — scale pulse
    gsap.to(nebulaGoldRef.value, {
      scale: 1.2, opacity: 0.8, duration: 20, ease: 'sine.inOut',
      repeat: -1, yoyo: true, delay: 10,
    })
  })

  onUnmounted(() => ctx.revert())
})
</script>

<style scoped>
/* Layer 1: Deep space gradient */
.nebula-bg {
  background: linear-gradient(180deg, #050520 0%, #080530 60%, #0a0525 100%);
}

/* Layer 5: Lens flare at ~70% 25% */
.nebula-lens-flare {
  background: radial-gradient(ellipse at 70% 25%, rgba(255, 200, 80, 0.12) 0%, transparent 40%);
}
</style>
