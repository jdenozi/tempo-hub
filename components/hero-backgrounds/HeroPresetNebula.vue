<template>
  <div ref="containerRef" class="absolute inset-0 overflow-hidden nebula-bg">
    <!-- Layer 2: SVG star field -->
    <div ref="starFieldRef" class="absolute inset-0 pointer-events-none" />

    <!-- Layer 3: Nebula clouds (GSAP animated drift) -->
    <div
      ref="nebulaMagentaRef"
      class="absolute pointer-events-none nebula-cloud"
      style="
        width: 70vw; height: 50vw;
        top: -15%; left: -15%;
        background: radial-gradient(ellipse at center, rgba(200,50,150,0.20) 0%, rgba(150,30,100,0.10) 40%, transparent 70%);
        border-radius: 50%;
        filter: blur(50px);
      "
    />
    <div
      ref="nebulaTealRef"
      class="absolute pointer-events-none nebula-cloud"
      style="
        width: 55vw; height: 40vw;
        top: 15%; right: -20%;
        background: radial-gradient(ellipse at center, rgba(30,180,180,0.15) 0%, rgba(20,120,140,0.08) 40%, transparent 70%);
        border-radius: 50%;
        filter: blur(40px);
      "
    />
    <div
      ref="nebulaGoldRef"
      class="absolute pointer-events-none nebula-cloud"
      style="
        width: 40vw; height: 30vw;
        bottom: 5%; left: 25%;
        background: radial-gradient(ellipse at center, rgba(212,168,83,0.14) 0%, rgba(180,120,20,0.06) 40%, transparent 70%);
        border-radius: 50%;
        filter: blur(35px);
      "
    />
    <div
      ref="nebulaPurpleRef"
      class="absolute pointer-events-none nebula-cloud"
      style="
        width: 45vw; height: 35vw;
        top: 30%; left: 10%;
        background: radial-gradient(ellipse at center, rgba(120,40,200,0.12) 0%, rgba(80,20,150,0.06) 40%, transparent 70%);
        border-radius: 50%;
        filter: blur(45px);
      "
    />

    <!-- Layer 4: Canvas particles -->
    <canvas
      v-if="!isReducedMotion"
      ref="canvasRef"
      class="absolute inset-0 w-full h-full pointer-events-none"
    />

    <!-- Layer 5: Lens flares -->
    <div class="absolute inset-0 pointer-events-none nebula-lens-flare" />
    <div
      class="absolute inset-0 pointer-events-none"
      style="background: radial-gradient(ellipse at 25% 60%, rgba(200,50,150,0.06) 0%, transparent 35%);"
    />
  </div>
</template>

<script setup lang="ts">
const nebulaMagentaRef = ref<HTMLDivElement | null>(null)
const nebulaTealRef = ref<HTMLDivElement | null>(null)
const nebulaGoldRef = ref<HTMLDivElement | null>(null)
const nebulaPurpleRef = ref<HTMLDivElement | null>(null)
const starFieldRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const { isPaused, isReducedMotion } = useAnimationLifecycle(containerRef)

useSpaceParticles(canvasRef, {
  count: 120,
  colors: ['#ffffff', '#7ee8e3', '#c87aff', '#ffb347', '#d4a853'],
  speedMultiplier: 0.5,
  maxSize: 1.4,
  glowIntensity: 4,
})

onMounted(async () => {
  if (!import.meta.client) return

  if (starFieldRef.value) {
    const stars: string[] = []
    for (let i = 0; i < 50; i++) {
      const cx = (Math.random() * 100).toFixed(1)
      const cy = (Math.random() * 100).toFixed(1)
      const r = (0.1 + Math.random() * 0.4).toFixed(2)
      const opacity = (0.3 + Math.random() * 0.7).toFixed(2)
      stars.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="white" opacity="${opacity}"/>`)
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${stars.join('')}</svg>`
    starFieldRef.value.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
    starFieldRef.value.style.backgroundSize = '350px 350px'
    starFieldRef.value.style.backgroundRepeat = 'repeat'
  }

  if (isReducedMotion.value) return

  const gsapModule = await useGsap()
  if (!gsapModule || !containerRef.value) return
  const { gsap } = gsapModule

  const tweens: gsap.core.Tween[] = []

  const ctx = gsap.context(() => {
    // Magenta — diagonal drift + scale
    tweens.push(gsap.to(nebulaMagentaRef.value, {
      x: '12%', y: '8%', scale: 1.15, duration: 20, ease: 'sine.inOut',
      repeat: -1, yoyo: true, paused: true,
    }))
    // Teal — opposite drift
    tweens.push(gsap.to(nebulaTealRef.value, {
      x: '-10%', y: '10%', scale: 1.1, duration: 25, ease: 'sine.inOut',
      repeat: -1, yoyo: true, delay: 3, paused: true,
    }))
    // Gold — scale pulse + drift
    tweens.push(gsap.to(nebulaGoldRef.value, {
      scale: 1.3, x: '5%', y: '-5%', duration: 18, ease: 'sine.inOut',
      repeat: -1, yoyo: true, delay: 7, paused: true,
    }))
    // Purple — slow rotate + drift
    tweens.push(gsap.to(nebulaPurpleRef.value, {
      x: '-8%', y: '6%', scale: 1.2, rotation: 15, duration: 30, ease: 'sine.inOut',
      repeat: -1, yoyo: true, delay: 5, paused: true,
    }))
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

<style scoped>
.nebula-bg {
  background: linear-gradient(180deg, #0e0616 0%, #120828 60%, #0e0520 100%);
}

.nebula-lens-flare {
  background: radial-gradient(ellipse at 70% 25%, rgba(255, 200, 80, 0.14) 0%, transparent 40%);
}
</style>
