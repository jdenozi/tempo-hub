/**
 * Scene fade/slide transitions for the ParallaxHome component.
 * Handles the 4-scene scroll-driven transitions: Scene 1→out, Scene 2→in/out,
 * Scene 3→in/out, Scene 4→in (with horizon glow + rays).
 * Launch sequence remains in ParallaxHome.vue.
 */
import type { Ref } from 'vue'

export function useSceneTransitions(params: {
  gsap: ReturnType<typeof Object.create>
  driverRef: Ref<HTMLElement | null>
  scene1Ref: Ref<HTMLElement | null>
  scene2Ref: Ref<HTMLElement | null>
  scene3Ref: Ref<HTMLElement | null>
  scene4Ref: Ref<HTMLElement | null>
  constSvg: Ref<SVGElement | null>
  buildingsGroup: Ref<SVGGElement | null>
  shipRef: Ref<SVGGElement | null>
  cardsRef: Ref<HTMLElement | null>
  horizonGlow: Ref<HTMLElement | null>
  horizonRaysRef: Ref<SVGGElement | null>
}): void {
  const {
    gsap, driverRef, scene1Ref, scene2Ref, scene3Ref, scene4Ref,
    constSvg, buildingsGroup, shipRef, cardsRef, horizonGlow, horizonRaysRef,
  } = params

  const d = driverRef.value!

  // ========== SCENE 1 → out ==========
  gsap.to(scene1Ref.value, {
    opacity: 0, yPercent: -12, ease: 'none',
    scrollTrigger: { trigger: d, start: '18% top', end: '30% top', scrub: 1 },
  })

  // ========== SCENE 2 → in ==========
  gsap.fromTo(scene2Ref.value,
    { opacity: 0, yPercent: 8 },
    { opacity: 1, yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: d, start: '24% top', end: '34% top', scrub: 1 },
    },
  )
  if (constSvg.value) {
    gsap.fromTo(constSvg.value.querySelectorAll('[data-anim="node"]'),
      { scale: 0, opacity: 0, transformOrigin: 'center' },
      { scale: 1, opacity: 1, stagger: 0.02, ease: 'none',
        scrollTrigger: { trigger: d, start: '26% top', end: '36% top', scrub: 1 },
      },
    )
    gsap.fromTo(constSvg.value.querySelectorAll('[data-anim="edge"]'),
      { opacity: 0 },
      { opacity: 0.3, stagger: 0.01, ease: 'none',
        scrollTrigger: { trigger: d, start: '28% top', end: '38% top', scrub: 1 },
      },
    )
    gsap.fromTo(constSvg.value.querySelectorAll('[data-anim="tendril"]'),
      { opacity: 0, strokeDashoffset: 40 },
      { opacity: 0.2, strokeDashoffset: 0, stagger: 0.02, ease: 'none',
        scrollTrigger: { trigger: d, start: '32% top', end: '40% top', scrub: 1 },
      },
    )
  }
  // SCENE 2 → out
  gsap.to(scene2Ref.value, {
    opacity: 0, yPercent: -12, ease: 'none',
    scrollTrigger: { trigger: d, start: '48% top', end: '58% top', scrub: 1 },
  })

  // ========== SCENE 3 → in ==========
  gsap.fromTo(scene3Ref.value,
    { opacity: 0, yPercent: 8 },
    { opacity: 1, yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: d, start: '52% top', end: '62% top', scrub: 1 },
    },
  )
  if (buildingsGroup.value) {
    gsap.fromTo(buildingsGroup.value.querySelectorAll('[data-anim="building"]'),
      { scaleY: 0, transformOrigin: 'bottom' },
      { scaleY: 1, stagger: 0.02, ease: 'none',
        scrollTrigger: { trigger: d, start: '54% top', end: '63% top', scrub: 1 },
      },
    )
  }
  if (shipRef.value) {
    gsap.fromTo(shipRef.value,
      { opacity: 0, x: -60 },
      { opacity: 0.15, x: 0, ease: 'none',
        scrollTrigger: { trigger: d, start: '58% top', end: '66% top', scrub: 1 },
      },
    )
  }
  if (cardsRef.value) {
    gsap.fromTo(cardsRef.value.querySelectorAll('[data-anim="card"]'),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.04, ease: 'none',
        scrollTrigger: { trigger: d, start: '56% top', end: '65% top', scrub: 1 },
      },
    )
  }
  // SCENE 3 → out (slightly slower fade for smoother transition)
  gsap.to(scene3Ref.value, {
    opacity: 0, yPercent: -8, ease: 'none',
    scrollTrigger: { trigger: d, start: '72% top', end: '82% top', scrub: 1 },
  })

  // ========== SCENE 4 → in (overlaps with scene 3 fadeout for crossfade) ==========
  gsap.fromTo(scene4Ref.value,
    { opacity: 0, yPercent: 5 },
    { opacity: 1, yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: d, start: '76% top', end: '86% top', scrub: 1 },
    },
  )
  // Horizon glow intensify (starts early for warm transition)
  gsap.fromTo(horizonGlow.value,
    { opacity: 0 },
    { opacity: 1, ease: 'none',
      scrollTrigger: { trigger: d, start: '78% top', end: '90% top', scrub: 1 },
    },
  )
  // Horizon light rays (sunrise breaking through)
  if (horizonRaysRef.value) {
    gsap.fromTo(horizonRaysRef.value,
      { opacity: 0 },
      { opacity: 0.7, ease: 'none',
        scrollTrigger: { trigger: d, start: '80% top', end: '88% top', scrub: 1 },
      },
    )
  }
}
