/**
 * Scroll-driven background animations for the ParallaxHome component.
 * Handles progress bar, celestial body drifts, light effects, and orbital motions.
 * Scene transitions and launch sequence remain in ParallaxHome.vue.
 */
import type { Ref } from 'vue'

interface RingDustParticle {
  id: number
  rx: number
  ry: number
  angle: number
  speed: number
  r: number
  opacity: number
  color: string
}

export function useScrollAnimations(params: {
  gsap: ReturnType<typeof Object.create> // gsap core instance (lazy-loaded via useGsap)
  driverRef: Ref<HTMLElement | null>
  progressRef: Ref<HTMLElement | null>
  starsRef: Ref<SVGElement | null>
  dustRef: Ref<SVGElement | null>
  saturnGroupRef: Ref<SVGGElement | null>
  warmBgRef: Ref<HTMLElement | null>
  scrollIndRef: Ref<HTMLElement | null>
  raysRef: Ref<SVGElement | null>
  ringDustRef: Ref<SVGElement | null>
  planetGridRef: Ref<SVGElement | null>
  ringDustParticles: RingDustParticle[]
  COS_TILT: number
  SIN_TILT: number
}): void {
  const {
    gsap, driverRef, progressRef, starsRef, dustRef, saturnGroupRef,
    warmBgRef, scrollIndRef, raysRef, ringDustRef, planetGridRef,
    ringDustParticles, COS_TILT, SIN_TILT,
  } = params

  const d = driverRef.value!

  // Progress bar
  gsap.to(progressRef.value, {
    scaleX: 1, ease: 'none',
    scrollTrigger: { trigger: d, start: 'top top', end: 'bottom bottom', scrub: 0 },
  })

  // Stars drift
  gsap.to(starsRef.value, {
    yPercent: -20, ease: 'none',
    scrollTrigger: { trigger: d, start: 'top top', end: 'bottom bottom', scrub: 1 },
  })

  // Dust drift (slower for depth)
  gsap.to(dustRef.value, {
    yPercent: -12, ease: 'none',
    scrollTrigger: { trigger: d, start: 'top top', end: 'bottom bottom', scrub: 1 },
  })

  // Saturn planet: glide from bottom-left to top-left across scenes 1→2
  // Use proxy object to animate SVG transform attribute directly (avoids CSS px vs SVG unit mismatch)
  if (saturnGroupRef.value) {
    const saturnEl = saturnGroupRef.value
    saturnEl.setAttribute('transform', 'translate(-120, 1020)')
    const saturnPos = { y: 1020 }
    gsap.to(saturnPos, {
      y: -120, ease: 'none',
      scrollTrigger: { trigger: d, start: '5% top', end: '45% top', scrub: 1 },
      onUpdate() {
        saturnEl.setAttribute('transform', `translate(-120, ${saturnPos.y})`)
      },
    })
  }

  // Warm background
  gsap.to(warmBgRef.value, {
    opacity: 0.7, ease: 'none',
    scrollTrigger: { trigger: d, start: '60% top', end: '82% top', scrub: 1 },
  })

  // Scroll indicator
  gsap.to(scrollIndRef.value, {
    opacity: 0, yPercent: -300, ease: 'none',
    scrollTrigger: { trigger: d, start: '2% top', end: '8% top', scrub: 1 },
  })

  // Light rays pulse
  if (raysRef.value) {
    gsap.fromTo(raysRef.value,
      { opacity: 0.5 },
      { opacity: 0.9, ease: 'sine.inOut', duration: 4, repeat: -1, yoyo: true },
    )
  }

  // Ring dust: animate each particle along its elliptical orbit
  if (ringDustRef.value) {
    ringDustParticles.forEach((p) => {
      const el = ringDustRef.value?.querySelector(`[data-dust="${p.id}"]`)
      if (!el) return

      const proxy = { angle: p.angle }
      gsap.to(proxy, {
        angle: p.angle + 360,
        duration: 360 / p.speed,
        repeat: -1,
        ease: 'none',
        onUpdate() {
          const rad = proxy.angle * Math.PI / 180
          const ex = p.rx * Math.cos(rad)
          const ey = p.ry * Math.sin(rad)
          // Apply ring tilt rotation (-15°)
          const x = ex * COS_TILT - ey * SIN_TILT
          const y = ex * SIN_TILT + ey * COS_TILT
          el.setAttribute('cx', String(x))
          el.setAttribute('cy', String(y))
        },
      })
    })
  }

  // Small planet: meridians rotate around vertical axis
  if (planetGridRef.value) {
    const meridians = planetGridRef.value.querySelectorAll('[data-mer]')
    const spin = { angle: 0 }
    gsap.to(spin, {
      angle: 180,
      duration: 120,
      repeat: -1,
      ease: 'none',
      onUpdate() {
        meridians.forEach((el, i) => {
          const phase = (i / 6) * 180
          const λ = ((spin.angle + phase) % 180) * Math.PI / 180
          el.setAttribute('rx', String(150 * Math.abs(Math.sin(λ))))
        })
      },
    })
  }
}
