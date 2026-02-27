/**
 * Canvas-based particle system for sci-fi hero banner backgrounds.
 * Renders drifting, glowing particles that wrap around edges.
 *
 * - SSR-safe: all Canvas code runs inside onMounted with import.meta.client guard
 * - DPR-aware: scales canvas for Retina displays
 * - ResizeObserver: recalculates on viewport change
 * - Respects prefers-reduced-motion: skips animation loop entirely
 * - Cleanup: cancelAnimationFrame + ResizeObserver.disconnect in onUnmounted
 */
import type { Ref } from 'vue'

export interface ParticleConfig {
  count: number           // 50-500
  colors: string[]        // e.g. ['#ffffff', '#7ee8e3', '#c87aff']
  speedMultiplier: number // 0.5-2
  maxSize: number         // 0.5-3
  glowIntensity: number   // 0-10
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  opacity: number
  life: number
  maxLife: number
}

function createParticle(width: number, height: number, config: ParticleConfig): Particle {
  const maxLife = 300 + Math.random() * 700
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.4 * config.speedMultiplier,
    vy: (Math.random() - 0.5) * 0.4 * config.speedMultiplier,
    size: 0.2 + Math.random() * config.maxSize,
    color: config.colors[Math.floor(Math.random() * config.colors.length)],
    opacity: 0,
    life: Math.random() * maxLife, // Stagger initial life so they don't all fade in sync
    maxLife,
  }
}

function updateParticle(p: Particle, width: number, height: number): void {
  // Drift
  p.x += p.vx
  p.y += p.vy

  // Wrap around edges
  if (p.x < 0) p.x += width
  else if (p.x > width) p.x -= width
  if (p.y < 0) p.y += height
  else if (p.y > height) p.y -= height

  // Advance life — oscillating opacity via sine wave over life/maxLife
  p.life += 1
  if (p.life > p.maxLife) p.life = 0

  const lifeRatio = p.life / p.maxLife
  p.opacity = Math.sin(lifeRatio * Math.PI) // 0→1→0 fade cycle
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle, glowIntensity: number): void {
  if (p.opacity <= 0.01) return

  ctx.beginPath()
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
  ctx.fillStyle = p.color
  ctx.globalAlpha = p.opacity

  if (glowIntensity > 0) {
    ctx.shadowBlur = glowIntensity
    ctx.shadowColor = p.color
  }

  ctx.fill()

  // Reset shadow after each particle to avoid bleed
  if (glowIntensity > 0) {
    ctx.shadowBlur = 0
  }
}

export function useSpaceParticles(
  canvasRef: Ref<HTMLCanvasElement | null>,
  config: ParticleConfig,
): void {
  if (import.meta.server) return

  let animFrameId: number | null = null
  let resizeObserver: ResizeObserver | null = null
  let particles: Particle[] = []
  let canvasWidth = 0
  let canvasHeight = 0
  let isInView = false
  let isTabActive = true
  let ioObserver: IntersectionObserver | null = null
  let onVisibilityChange: (() => void) | null = null

  onMounted(() => {
    if (!import.meta.client) return

    const canvas = canvasRef.value
    if (!canvas) return

    // Respect reduced motion preference — skip animation entirely
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Mobile detection — reduce particle count by 50% on small screens
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const effectiveCount = isMobile ? Math.ceil(config.count * 0.5) : config.count

    // --- DPR + sizing ---
    function applySize() {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2) // Cap at 2x — 3x DPR = 55% extra pixels for imperceptible quality gain

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx!.scale(dpr, dpr)

      canvasWidth = rect.width
      canvasHeight = rect.height
    }

    applySize()

    // --- Initialize particles ---
    particles = Array.from({ length: effectiveCount }, () =>
      createParticle(canvasWidth, canvasHeight, config),
    )

    // --- ResizeObserver ---
    resizeObserver = new ResizeObserver(() => {
      applySize()
      // Re-clamp particles into new bounds
      for (const p of particles) {
        if (p.x > canvasWidth) p.x = canvasWidth * Math.random()
        if (p.y > canvasHeight) p.y = canvasHeight * Math.random()
      }
    })
    resizeObserver.observe(canvas)

    // --- Visibility helpers ---
    function startLoop() {
      if (isInView && isTabActive && animFrameId === null) {
        animFrameId = requestAnimationFrame(animate)
      }
    }

    function stopLoop() {
      if (animFrameId !== null) {
        cancelAnimationFrame(animFrameId)
        animFrameId = null
      }
    }

    // --- Animation loop ---
    const animate = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)
      ctx.globalAlpha = 1

      for (const p of particles) {
        updateParticle(p, canvasWidth, canvasHeight)
        drawParticle(ctx, p, config.glowIntensity)
      }

      ctx.globalAlpha = 1
      if (isInView && isTabActive) {
        animFrameId = requestAnimationFrame(animate)
      }
      // Loop stops naturally when not visible — startLoop() restarts it when needed
    }

    // --- IntersectionObserver: pause when canvas off-screen ---
    ioObserver = new IntersectionObserver(([entry]) => {
      isInView = entry.isIntersecting
      if (isInView) startLoop()
      else stopLoop()
    }, { threshold: 0.01 }) // Very low threshold — pause as soon as barely off-screen
    ioObserver.observe(canvas)

    // --- visibilitychange: pause when browser tab is hidden ---
    isTabActive = !document.hidden
    onVisibilityChange = () => {
      isTabActive = !document.hidden
      if (isTabActive) startLoop()
      else stopLoop()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
  })

  onUnmounted(() => {
    if (animFrameId !== null) {
      cancelAnimationFrame(animFrameId)
      animFrameId = null
    }
    resizeObserver?.disconnect()
    resizeObserver = null
    ioObserver?.disconnect()
    ioObserver = null
    if (onVisibilityChange) {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      onVisibilityChange = null
    }
    particles = []
  })
}
