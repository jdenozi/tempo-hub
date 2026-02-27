# Learnings — animation-optimization

## 2026-02-27 — Pre-execution audit

### Bugs critiques confirmés (lire le code source, pas les rapports agents)
- `useSpaceParticles.ts` ligne 117: `const dpr = window.devicePixelRatio || 1` — PAS de cap 2x (rapport agent était incorrect!)
- `HeroPresetGridStation.vue`: onMounted ne vérifie JAMAIS prefers-reduced-motion avant GSAP
- `HeroPresetRetroScan.vue`: feTurbulence animé avec `baseFrequency` 0.5s repeat:-1 yoyo — CPU constant inutile

### Pattern actuel des presets GSAP
Tous utilisent: `const ctx = gsap.context(() => { gsap.to(...) }, containerRef.value)` + `onUnmounted(() => ctx.revert())`
- GridStation: a déjà `containerRef` sur root div
- Orbital, Nebula, PlanetHorizon, RetroScan: AUCUN containerRef sur root div (à ajouter)

### Auto-imports Nuxt
- `composables/` = auto-importé → useAnimationLifecycle sera dispo sans import explicite
- Mais: import explicite pour TypeScript types si nécessaire

### Starfield = no changes needed
HeroPresetStarfield.vue n'a aucun GSAP — uniquement Canvas via useSpaceParticles. Optimisé automatiquement par T2.

### Subtilité timing watch + GSAP
Le `watch(isPaused, ...)` DOIT être créé APRÈS les tweens (i.e., dans le callback async de onMounted, après await useGsap()). Utiliser `paused: true` sur les tweens pour qu'ils démarrent en pause, puis watch avec `{ immediate: true }` pour démarrer quand isPaused=false.

### ioObserver scope dans useSpaceParticles
L'ioObserver doit être déclaré au même niveau que resizeObserver (avant onMounted si hors composable, ou au top du scope de onMounted) pour être accessible dans onUnmounted.

## T1 DONE — useAnimationLifecycle.ts created
- File: composables/useAnimationLifecycle.ts
- Exports: useAnimationLifecycle(containerRef) → { isVisible, isPaused, isMobile, isReducedMotion }
- isPaused = isTabHidden || !isVisible (IO-driven)
- All refs are readonly() to prevent external mutation

## T2 DONE — useSpaceParticles.ts updated
- DPR fixed: Math.min(... , 2)
- IO observer: canvas observe, startLoop/stopLoop
- visibilitychange: pause/resume
- Mobile: effectiveCount = isMobile ? ceil(count * 0.5) : count
- ioObserver et onVisibilityChange déclarés au niveau de la fonction (avant onMounted) pour accès dans onUnmounted
- startLoop references animate (const) via closure — works because startLoop is only called after animate is initialized

## T3 DONE — 5 GSAP hero presets updated
- GridStation: reduced-motion fix + useAnimationLifecycle (BUG: had no check before GSAP)
- Orbital: containerRef added + 5 tweens with paused: true + watch
- Nebula: containerRef added + 3 tweens with paused: true + watch
- PlanetHorizon: containerRef added + 1 tween with paused: true + watch
- RetroScan: containerRef added + feTurbulence animation removed + 2 tweens with paused: true + watch
- turbulenceRef var + template ref supprimés dans RetroScan
- RetroScan tweens typed as (gsap.core.Tween | gsap.core.Timeline)[] due to flickerTimeline
- All presets: tweens start paused, controlled via watch(isPaused) with { immediate: true }
- All presets: onUnmounted → ctx.revert() + tweens.length = 0
