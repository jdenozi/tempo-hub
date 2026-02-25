/**
 * Launch sequence animations for the ParallaxHome component.
 * Orchestrates 11 scroll-driven timelines: umbilical arm retraction,
 * ignition flash, launch blast, spacecraft trajectory, exhaust plume,
 * contrail, countdown, dust clouds, smoke columns, camera shake, and heat shimmer.
 * Orchestrates 8 scroll-driven timelines: umbilical arm retraction,
 * ignition flash, launch blast, spacecraft trajectory, exhaust plume, contrail, and countdown.
 */
import type { Ref } from 'vue'

export function useLaunchSequence(params: {
  gsap: ReturnType<typeof Object.create> // gsap core instance (lazy-loaded via useGsap)
  driverRef: Ref<HTMLElement | null>
  ignitionFlashRef: Ref<SVGGElement | null>
  launchBlastRef: Ref<SVGGElement | null>
  saucerRef: Ref<SVGGElement | null>
  exhaustRef: Ref<SVGGElement | null>
  contrailRef: Ref<SVGGElement | null>
  umbilicalArmRef: Ref<SVGGElement | null>
  secondaryArmRef: Ref<SVGGElement | null>
  countdownRef: Ref<HTMLElement | null>
  dustCloudsRef: Ref<SVGGElement | null>
  smokeColumnsRef: Ref<SVGGElement | null>
  scene4ContainerRef: Ref<SVGGElement | null>
}): void {
  const { gsap, driverRef, ignitionFlashRef, launchBlastRef, saucerRef, exhaustRef, contrailRef, umbilicalArmRef, secondaryArmRef, countdownRef, dustCloudsRef, smokeColumnsRef, scene4ContainerRef } = params
  const d = driverRef.value!

  // 0) Umbilical arm retraction — arms swing away from spacecraft just before ignition
  if (umbilicalArmRef.value) {
    const armTl = gsap.timeline({
      scrollTrigger: { trigger: d, start: '80% top', end: '83% top', scrub: 1 },
    })
    armTl.fromTo(umbilicalArmRef.value,
      { rotation: 0 },
      { rotation: -90, duration: 0.8, ease: 'power2.in', transformOrigin: '0% 50%' },
    )
  }

  if (secondaryArmRef.value) {
    const arm2Tl = gsap.timeline({
      scrollTrigger: { trigger: d, start: '80.5% top', end: '83.5% top', scrub: 1 },
    })
    arm2Tl.fromTo(secondaryArmRef.value,
      { rotation: 0 },
      { rotation: -90, duration: 0.8, ease: 'power2.in', transformOrigin: '0% 50%' },
    )
  }

  // 1) Ignition flash — brief bright pulse at takeoff point
  if (ignitionFlashRef.value) {
    const flashTl = gsap.timeline({
      scrollTrigger: { trigger: d, start: '81% top', end: '87% top', scrub: 1 },
    })
    flashTl
      .fromTo(ignitionFlashRef.value, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1.2, duration: 0.4, ease: 'power2.out' })
      .to(ignitionFlashRef.value, { opacity: 0, scale: 1.8, duration: 0.6, ease: 'power1.in' })
  }

  // 2) Launch blast — ground effects (shockwaves, smoke, sparks)
  if (launchBlastRef.value) {
    const blastTl = gsap.timeline({
      scrollTrigger: { trigger: d, start: '82% top', end: '97% top', scrub: 1 },
    })
    blastTl
      .fromTo(launchBlastRef.value, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out' })
      .to(launchBlastRef.value, { opacity: 0, scale: 1.4, duration: 0.8, ease: 'power1.in' })
  }

  // 3) Spacecraft — appears on pad, then accelerates diagonally
  if (saucerRef.value) {
    const shipTl = gsap.timeline({
      scrollTrigger: { trigger: d, start: '80% top', end: '98% top', scrub: 1 },
    })
    // Phase 1 (0→0.15): ship fades in, sitting on launch pad
    shipTl.fromTo(saucerRef.value,
      { opacity: 0, x: 0, y: 0 },
      { opacity: 1, x: 0, y: 0, duration: 0.15, ease: 'none' },
    )
    // Phase 2 (0.15→0.3): slow initial lift — engines warming up
    shipTl.to(saucerRef.value, {
      x: 30, y: -20, duration: 0.15, ease: 'power1.in',
    })
    // Phase 3 (0.3→1.0): full throttle — accelerates off-screen upper-right
    shipTl.to(saucerRef.value, {
      x: 750, y: -520, duration: 0.7, ease: 'power3.in',
    })
  }

  // 4) Exhaust plume — grows from nothing to full blaze
  if (exhaustRef.value) {
    const exhaustTl = gsap.timeline({
      scrollTrigger: { trigger: d, start: '81% top', end: '96% top', scrub: 1 },
    })
    // Ignition: exhaust appears small
    exhaustTl.fromTo(exhaustRef.value,
      { opacity: 0, scaleX: 0.15, scaleY: 0.3 },
      { opacity: 0.6, scaleX: 0.4, scaleY: 0.5, duration: 0.15, ease: 'power1.out' },
    )
    // Warming up: plume grows
    exhaustTl.to(exhaustRef.value, {
      opacity: 1, scaleX: 0.7, scaleY: 0.8, duration: 0.2, ease: 'none',
    })
    // Full thrust: plume at max
    exhaustTl.to(exhaustRef.value, {
      scaleX: 1.3, scaleY: 1.1, duration: 0.65, ease: 'power1.in',
    })
  }

  // 5) Contrail — fades in as ship crosses the sky, lingers
  if (contrailRef.value) {
    const trailTl = gsap.timeline({
      scrollTrigger: { trigger: d, start: '84% top', end: '98% top', scrub: 1 },
    })
    trailTl
      .fromTo(contrailRef.value, { opacity: 0 }, { opacity: 0.8, duration: 0.5, ease: 'none' })
      .to(contrailRef.value, { opacity: 0.3, duration: 0.5, ease: 'power1.in' })
  }

  // 6) Countdown overlay — 5→4→3→2→1→LIFTOFF synced to scroll
  if (countdownRef.value) {
    const counter = { value: 5 }
    gsap.to(counter, {
      value: 0,
      snap: { value: 1 },
      ease: 'none',
      scrollTrigger: { trigger: d, start: '80% top', end: '88% top', scrub: 0.5 },
      onUpdate() {
        if (countdownRef.value) {
          countdownRef.value.textContent = counter.value === 0 ? 'LIFTOFF' : String(counter.value)
        }
      },
    })

    // Fade out after countdown completes
    gsap.fromTo(countdownRef.value,
      { opacity: 1 },
      {
        opacity: 0,
        scrollTrigger: { trigger: d, start: '90% top', end: '92% top', scrub: 0.5 },
      },
    )
  }

  // 7) Dust clouds — expand from platform level during launch
  if (dustCloudsRef?.value) {
    const dustEllipses = dustCloudsRef.value.querySelectorAll('ellipse')
    // Phase 1: expand outward and become visible
    gsap.to(dustEllipses, {
      scaleX: 4, scaleY: 2.5, opacity: 0.2,
      stagger: 0.05,
      scrollTrigger: { trigger: d, start: '82% top', end: '90% top', scrub: 0.5 },
    })
    // Phase 2: dissipate
    gsap.to(dustEllipses, {
      opacity: 0,
      scrollTrigger: { trigger: d, start: '90% top', end: '95% top', scrub: 0.5 },
    })
  }

  // 8) Smoke columns — rise from blast area
  if (smokeColumnsRef?.value) {
    const smokeEls = smokeColumnsRef.value.querySelectorAll('ellipse')
    gsap.to(smokeEls, {
      y: -80, opacity: 0.15,
      stagger: 0.1,
      scrollTrigger: { trigger: d, start: '83% top', end: '95% top', scrub: 0.5 },
    })
  }

  // 9) Camera shake — Scene 4 container vibrates during ignition
  if (scene4ContainerRef?.value) {
    const shakeTl = gsap.timeline({
      scrollTrigger: { trigger: d, start: '81% top', end: '85% top', scrub: 0.3 },
    })
    shakeTl
      .to(scene4ContainerRef.value, { x: 2, y: -1.5, duration: 0.1 })
      .to(scene4ContainerRef.value, { x: -3, y: 2, duration: 0.1 })
      .to(scene4ContainerRef.value, { x: 1.5, y: -2, duration: 0.1 })
      .to(scene4ContainerRef.value, { x: -2, y: 1, duration: 0.1 })
      .to(scene4ContainerRef.value, { x: 3, y: -1, duration: 0.1 })
      .to(scene4ContainerRef.value, { x: -1, y: 2.5, duration: 0.1 })
      .to(scene4ContainerRef.value, { x: 2, y: -2, duration: 0.1 })
      .to(scene4ContainerRef.value, { x: 0, y: 0, duration: 0.15 })

    // 10) Heat shimmer — subtle scaleX oscillation above exhaust (NO feDisplacementMap)
    const heatShimmers = scene4ContainerRef.value.querySelectorAll('.heat-shimmer')
    if (heatShimmers.length) {
      gsap.fromTo(heatShimmers,
        { scaleX: 0.98, opacity: 0 },
        {
          scaleX: 1.02, opacity: 0.06,
          stagger: 0.08,
          scrollTrigger: { trigger: d, start: '82% top', end: '95% top', scrub: 0.5 },
        },
      )
    }
  }
}
