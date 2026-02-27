# Animation Performance Optimization

## TL;DR

> **Quick Summary**: Optimisation proactive des animations avant d'ajouter des fonds animés sur toutes les sections (plan section-studio-params). Score actuel: 68/100 — bonnes pratiques de cleanup mais ZERO gestion mobile, off-screen, et tab-visibility.
>
> **Deliverables**:
> - Nouveau composable `useAnimationLifecycle.ts` (IntersectionObserver + visibilitychange + mobile + reduced-motion)
> - `useSpaceParticles.ts` mis à jour (DPR cap 2x, IO pause/resume, mobile -50% particules)
> - 5 hero presets GSAP mis à jour (pause off-screen, fix GridStation reduced-motion, RetroScan feTurbulence statique)
>
> **Estimated Effort**: Medium (3-4h across 3 waves)
> **Parallel Execution**: YES — Wave 1 = T1+T2 en parallèle, Wave 2 = T3

---

## Context

### Original Request
User: "Optimise le plus possible car il y a beaucoup d'animations" — prévention proactive avant d'ajouter des fonds animés sur toutes les sections.

### Interview Decisions
- **Mobile**: Réduire la complexité (particules -50%, pas désactiver complètement)
- **Plan**: Séparé, exécuté AVANT section-studio-params
- **Architecture**: Composable générique `useAnimationLifecycle` réutilisable pour future sections

### Guardrails
- ⛔ NE PAS modifier `tempo-core/` (submodule)
- ⛔ NE PAS modifier `components/ParallaxHome.vue`
- ⛔ NE PAS ajouter de dépendances npm externes
- ⛔ Backward compat: comportement identique pour les utilisateurs sans JS ou sans détection

---

## Audit Findings

### Bugs Critiques
1. **DPR non cappé** dans `useSpaceParticles.ts` ligne 117: `window.devicePixelRatio || 1` → rendu 3x sur iPhone Pro = 55% de pixels inutiles
2. **GridStation ignore prefers-reduced-motion**: `onMounted` lance directement GSAP sans vérification
3. **feTurbulence animé** dans RetroScan: `baseFrequency` animé 2fps (yoyo 0.5s) `repeat: -1` → CPU constant pour un effet invisible

### Lacunes Majeures
4. **Aucun IntersectionObserver**: Canvas rAF + GSAP `repeat: -1` tournent même quand scrollé hors-écran
5. **Aucun visibilitychange**: Animations continuent quand l'onglet est caché
6. **Aucune optimisation mobile**: 100-120 particules Canvas identiques sur iPhone SE et desktop

### Ce qui est déjà bon (NE PAS CASSER)
- ✅ gsap.context() + onUnmounted ctx.revert() dans tous les presets GSAP
- ✅ cancelAnimationFrame + ResizeObserver.disconnect dans useSpaceParticles
- ✅ dynamic import GSAP via useGsap() (lazy, SSR-safe)
- ✅ defineAsyncComponent sur tous les hero presets dans SectionHero.vue
- ✅ prefers-reduced-motion respecté dans 6/6 presets (sauf GridStation → à fixer)

---

## Files To Create

| File | Description |
|------|-------------|
| `composables/useAnimationLifecycle.ts` | Nouveau composable générique: IO + visibilitychange + mobile + reducedMotion |

## Files To Modify

| File | Changes |
|------|---------|
| `composables/useSpaceParticles.ts` | Fix DPR cap 2x + IO pause/resume + visibilitychange + mobile -50% particules |
| `components/hero-backgrounds/HeroPresetGridStation.vue` | Fix reduced-motion + useAnimationLifecycle + GSAP pause/resume |
| `components/hero-backgrounds/HeroPresetOrbital.vue` | useAnimationLifecycle + GSAP pause/resume (store tweens) |
| `components/hero-backgrounds/HeroPresetNebula.vue` | useAnimationLifecycle + GSAP pause/resume (store tweens) |
| `components/hero-backgrounds/HeroPresetPlanetHorizon.vue` | useAnimationLifecycle + GSAP pause/resume |
| `components/hero-backgrounds/HeroPresetRetroScan.vue` | feTurbulence statique + useAnimationLifecycle + scan/flicker pause/resume |

---

## Tasks

### Wave 1: Foundation (T1 + T2 en parallèle — AUCUNE dépendance entre eux)

- [x] T1: Créer `composables/useAnimationLifecycle.ts`
- [x] T2: Mettre à jour `composables/useSpaceParticles.ts`

### Wave 2: GSAP Presets (T3 — après T1)

- [x] T3: Mettre à jour les 5 hero presets GSAP (Grid, Orbital, Nebula, Planet, RetroScan)

### Wave 3: Verification

- [x] F1: Vérification build `bun run build`
- [ ] F2: Git commit

---

## T1 — Detailed Spec: `composables/useAnimationLifecycle.ts`

**File to create**: `/home/denozi/WebstormProjects/tempo-hub/composables/useAnimationLifecycle.ts`

**Purpose**: Composable réutilisable qui centralise les patterns de performance animation: IntersectionObserver (pause hors-écran), visibilitychange (pause tab cachée), détection mobile, reduced-motion.

**API signature**:
```typescript
export function useAnimationLifecycle(containerRef: Ref<HTMLElement | null>): {
  isVisible: Readonly<Ref<boolean>>    // true quand element dans viewport
  isPaused: ComputedRef<boolean>        // true quand hors-écran OU tab cachée
  isMobile: Readonly<Ref<boolean>>     // true quand viewport <= 768px
  isReducedMotion: Readonly<Ref<boolean>> // true quand prefers-reduced-motion: reduce
}
```

**Implementation requirements**:
1. Guard `if (import.meta.server) return` early with static false values
2. `isVisible` starts false, set via IntersectionObserver (threshold: 0.1)
3. `isTabHidden` starts with `document.hidden` (initial page state), updated via `visibilitychange`
4. `isPaused = computed(() => isTabHidden.value || !isVisible.value)`
5. `isMobile` = `window.matchMedia('(max-width: 768px)').matches` (checked once on mount, no listener needed)
6. `isReducedMotion` = `window.matchMedia('(prefers-reduced-motion: reduce)').matches` (checked once on mount)
7. `onMounted`: create IO, add visibilitychange listener
8. `onUnmounted`: `observer?.disconnect()`, `document.removeEventListener('visibilitychange', ...)`
9. Return `readonly()` refs to prevent external mutation

**Full implementation**:
```typescript
import { computed, onMounted, onUnmounted, readonly, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'

export interface AnimationLifecycle {
  isVisible: Readonly<Ref<boolean>>
  isPaused: ComputedRef<boolean>
  isMobile: Readonly<Ref<boolean>>
  isReducedMotion: Readonly<Ref<boolean>>
}

export function useAnimationLifecycle(containerRef: Ref<HTMLElement | null>): AnimationLifecycle {
  const isVisible = ref(false)
  const isTabHidden = ref(false)
  const isMobile = ref(false)
  const isReducedMotion = ref(false)

  const isPaused = computed(() => isTabHidden.value || !isVisible.value)

  let observer: IntersectionObserver | null = null

  function onVisibilityChange() {
    isTabHidden.value = document.hidden
  }

  onMounted(() => {
    if (!import.meta.client) return

    isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    isMobile.value = window.matchMedia('(max-width: 768px)').matches
    isTabHidden.value = document.hidden

    observer = new IntersectionObserver(
      ([entry]) => { isVisible.value = entry.isIntersecting },
      { threshold: 0.1 }
    )

    if (containerRef.value) {
      observer.observe(containerRef.value)
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
    document.removeEventListener('visibilitychange', onVisibilityChange)
  })

  return {
    isVisible: readonly(isVisible),
    isPaused,
    isMobile: readonly(isMobile),
    isReducedMotion: readonly(isReducedMotion),
  }
}
```

---

## T2 — Detailed Spec: `composables/useSpaceParticles.ts`

**File to modify**: `/home/denozi/WebstormProjects/tempo-hub/composables/useSpaceParticles.ts`

**IMPORTANT**: Read the current file first before modifying. Preserve ALL existing logic.

**Changes required**:

### Change 1: Fix DPR cap (line ~117)
```typescript
// BEFORE (line 117):
const dpr = window.devicePixelRatio || 1

// AFTER:
const dpr = Math.min(window.devicePixelRatio || 1, 2) // Cap at 2x — 3x DPR (iPhone Pro) = 55% extra pixels
```

### Change 2: Mobile particle count reduction (after DPR fix, before particles init)
```typescript
// Add AFTER the ctx check (line ~111), BEFORE applySize():
const isMobile = window.matchMedia('(max-width: 768px)').matches
const effectiveCount = isMobile ? Math.ceil(config.count * 0.5) : config.count
// Then use effectiveCount instead of config.count when initializing particles
```

### Change 3: Add visibility tracking variables (before onMounted)
```typescript
// Add before onMounted (after let particles = []):
let isInView = false
let isTabActive = true
```

### Change 4: Add startLoop/stopLoop helpers (inside onMounted, before animate())
```typescript
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
```

### Change 5: Modify animate() to check visibility
```typescript
// BEFORE last line of animate():
animFrameId = requestAnimationFrame(animate)

// AFTER:
if (isInView && isTabActive) {
  animFrameId = requestAnimationFrame(animate)
}
// (No else needed - loop stops naturally if conditions not met)
```

### Change 6: Replace `animate()` call with IntersectionObserver + visibilitychange (after ResizeObserver setup)
```typescript
// REMOVE: animate() // direct call

// ADD: IntersectionObserver
const ioObserver = new IntersectionObserver(([entry]) => {
  isInView = entry.isIntersecting
  if (isInView) startLoop()
  else stopLoop()
}, { threshold: 0.01 }) // Very low threshold — pause as soon as barely off-screen
ioObserver.observe(canvas)

// ADD: visibilitychange
isTabActive = !document.hidden
function onVisibilityChange() {
  isTabActive = !document.hidden
  if (isTabActive) startLoop()
  else stopLoop()
}
document.addEventListener('visibilitychange', onVisibilityChange)
```

### Change 7: Cleanup in onUnmounted
```typescript
// ADD to existing onUnmounted:
ioObserver?.disconnect()
document.removeEventListener('visibilitychange', onVisibilityChange)
```

### Change 8: Update particles initialization to use effectiveCount
```typescript
// BEFORE:
particles = Array.from({ length: config.count }, () =>
  createParticle(canvasWidth, canvasHeight, config),
)

// AFTER:
particles = Array.from({ length: effectiveCount }, () =>
  createParticle(canvasWidth, canvasHeight, config),
)
```

**Note**: The `ioObserver` variable needs to be declared at the right scope so onUnmounted can access it. Declare it alongside `resizeObserver` at the top of onMounted scope.

---

## T3 — Detailed Spec: 5 GSAP Hero Presets

**Files to modify** (read each one before modifying):
1. `components/hero-backgrounds/HeroPresetGridStation.vue`
2. `components/hero-backgrounds/HeroPresetOrbital.vue`
3. `components/hero-backgrounds/HeroPresetNebula.vue`
4. `components/hero-backgrounds/HeroPresetPlanetHorizon.vue`
5. `components/hero-backgrounds/HeroPresetRetroScan.vue`

**Depends on**: T1 must be complete (useAnimationLifecycle.ts must exist)

### Pattern for GSAP presets (apply to all 5)

**Step A**: Ensure root div has `ref="containerRef"`:
```html
<div ref="containerRef" class="absolute inset-0 overflow-hidden">
```

**Step B**: Add `containerRef` ref in script setup (if not already):
```typescript
const containerRef = ref<HTMLElement | null>(null)
```

**Step C**: Replace direct `window.matchMedia(...)` with useAnimationLifecycle:
```typescript
// REMOVE:
const reducedMotion = ref(false)
// ...
reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ADD (top-level in setup, outside onMounted):
const { isPaused, isReducedMotion } = useAnimationLifecycle(containerRef)
// Then use isReducedMotion.value wherever reducedMotion.value was used
```

**Step D**: Store GSAP tweens and add pause/resume watch.

Replace the current pattern:
```typescript
// BEFORE (current pattern):
const ctx = gsap.context(() => {
  gsap.to('.element', { repeat: -1, ... })
}, containerRef.value)
onUnmounted(() => ctx.revert())
```

With pause/resume capable pattern:
```typescript
// AFTER:
const tweens: gsap.core.Tween[] = []

const ctx = gsap.context(() => {
  tweens.push(gsap.to('.element', { repeat: -1, paused: true, ... }))
  // NOTE: paused: true — start paused, watch controls playback
}, containerRef.value)

// Watch isPaused to control playback
watch(isPaused, (paused) => {
  tweens.forEach(t => paused ? t.pause() : t.resume())
}, { immediate: true })

onUnmounted(() => {
  ctx.revert()
  tweens.length = 0
})
```

**IMPORTANT**: Add `paused: true` to every GSAP tween. The watch with `immediate: true` will start them when `isPaused` becomes false (= element visible + tab active).

### HeroPresetGridStation — CRITICAL FIX

Current bug: NO reduced-motion check before GSAP animations. Must add:
```typescript
// In onMounted, BEFORE gsap init:
if (isReducedMotion.value) return // Early exit — static grid only
```

Apply the full pattern above (containerRef already exists in GridStation ✅).

### HeroPresetRetroScan — Special: feTurbulence Static

**Do NOT animate feTurbulence baseFrequency**. The `gsap.to(turbulenceRef.value, { attr: { baseFrequency: '0.68' }, repeat: -1 })` is the expensive CPU operation.

**Remove** the entire turbulence animation block:
```typescript
// REMOVE these lines from the gsap.context():
if (turbulenceRef.value) {
  gsap.to(turbulenceRef.value, {
    attr: { baseFrequency: '0.68' },
    duration: 0.5,
    ease: 'none',
    repeat: -1,
    yoyo: true,
  })
}
```

Keep the SVG feTurbulence in the template (static), just don't animate it. Static grain is fine and costs nothing.

Keep scan lines + flicker in the tweens array (they're cheap — CSS backgroundPositionY + tiny opacity changes).

### HeroPresetOrbital — Note
- Has `gsap.context()` but no containerRef currently → must add `const containerRef = ref<HTMLElement | null>(null)` and `ref="containerRef"` on root div
- Store ring1/ring2/ring3 and lensFlare1/lensFlare2 tweens in tweens array

### HeroPresetNebula — Note
- Same: no containerRef on root div currently → must add
- Nebula cloud refs are not selectors, they're `.value` refs — use them directly in gsap.to()
- Store 3 nebula tweens in tweens array

### HeroPresetPlanetHorizon — Note
- No containerRef on root div → must add
- Single atmosphere tween → simplest case

---

## F1 — Build Verification

Run `bun run build` and verify exit code 0.
Check `bun run typecheck` for TypeScript errors.

---

## F2 — Git Commit

Commit message: `perf: optimize animations with IntersectionObserver, tab-visibility pause, mobile throttle`

Include all modified files.

---

## Verification Checklist

After each task, verify:
- [ ] `bun run build` exits 0
- [ ] No TypeScript errors
- [ ] useSpaceParticles: DPR capped (check: `Math.min(... , 2)` in source)
- [ ] GridStation: reduced-motion check present before GSAP
- [ ] RetroScan: no `gsap.to(turbulenceRef` call in source
- [ ] All presets: `ref="containerRef"` on root div
- [ ] All presets: `useAnimationLifecycle` imported and called

---

## Notes For Subagents

### Imports needed in hero presets
```typescript
import { useAnimationLifecycle } from '~/composables/useAnimationLifecycle'
// Note: Nuxt auto-imports composables, so this import may not be needed
// BUT: explicitly import to be safe and for TypeScript type resolution
```

### Auto-import: Nuxt auto-imports composables/
Nuxt auto-imports all files in `composables/`. So `useAnimationLifecycle` and `useSpaceParticles` are available globally. However, be explicit about imports for TypeScript types.

### The `watch` must be inside onMounted
The `watch(isPaused, ...)` must be set up AFTER the GSAP tweens are created (i.e., inside the async `onMounted` callback, after `await useGsap()`). Setting it up before the tweens exist would result in calls to undefined tween references.

### Template: reducedMotion → isReducedMotion
In templates that use `v-if="!reducedMotion"`, replace with `v-if="!isReducedMotion"` (computed ref, not plain ref).

### Starfield preset: NO CHANGES NEEDED
`HeroPresetStarfield.vue` uses only Canvas (via useSpaceParticles) and no GSAP. After T2, it's automatically optimized.
