# Hero Banners Sci-Fi 70s — Animated Backgrounds + Nuxt Studio

## TL;DR

> **Quick Summary**: Ajouter des fonds animés sci-fi 70s à toutes les bannières hero des pages intérieures de tempo-hub. 6 presets sélectionnables + mode image, le tout configurable depuis Nuxt Studio via les props MDC.
> 
> **Deliverables**:
> - 6 preset components animés (Starfield, Nebula, Planet Horizon, Grid Station, Orbital, Retro Scan)
> - Mode image (upload image + overlay animé optionnel)
> - SectionHero étendu avec prop `heroPreset` configurable depuis Nuxt Studio
> - Composable partagé `useSpaceParticles.ts` pour les particules Canvas
> - Schema Zod dans `content.config.ts` pour l'édition Studio
> - Toutes les pages intérieures habillées avec un preset
> 
> **Estimated Effort**: Large (6-8h across 4 waves)
> **Parallel Execution**: YES — 4 waves
> **Critical Path**: T1-T4 (foundation) → T5-T10 (presets) → T11 (content) → F1-F3 (verify + commit)

---

## Context

### Original Request
User: "Est-ce que tu peux mettre des images pour les bannières ? Et faire en sorte qu'on puisse le changer depuis Nuxt Studio. Ou refaire des petites animations dans les bannières. Je veux que ça fasse sci-fi toujours, sci-fi années 70. C'est important que chaque page soit habillé avec une belle bannière. Et je dois pouvoir depuis Nuxt Studio paramétrer ça."

### Interview Summary
**Key Discussions**:
- Type de bannière → Mix : animations procédurales OU images, selon la page, choix depuis Studio
- Système de presets → 6 presets sélectionnables (tous les 6 choisis par l'utilisateur)
- Core vs Hub → Hub uniquement (pas de modification de tempo-core)
- Homepage → Exclue (ParallaxHome garde son animation massive)
- Fallback reduced-motion → Possibilité de mettre une image statique directement
- Tests → Build seul + vérification visuelle manuelle

**Research Findings (3 agents)**:
- **Pipeline**: MDC → ContentRenderer → `components/content/SectionHero.vue` (wrapper) → `components/sections/SectionHero.vue`
- **Nuxt Studio**: Configuré avec 12 composants dans `studio.meta.components.include`
- **CRITICAL**: Studio ne lit PAS `defineProps` — il faut un schema Zod dans `content.config.ts`
- **Performance**: SVG <200 nodes pour 60fps mobile. Canvas pour les particules denses.
- **GSAP**: Lazy-load dans `onMounted`, cleanup via `gsap.context()` + `ctx.revert()`
- **Approach recommandée**: Hybrid CSS + SVG + Canvas (GSAP pour les timelines)

### Metis Review
**Critical Gaps Identified**:
- ⚠️ **Zod Schema MANQUANT** → Studio ne peut PAS éditer les props sans schema dans `content.config.ts`. Tâche ajoutée.
- ⚠️ **Canvas vs SVG est preset-dépendant** → SVG pour 4/6 presets, Canvas seulement si >200 particules (Orbital, Retro Scan)
- ⚠️ **Flat props > nested object** → `heroPreset: z.enum(...)` rend un dropdown en Studio. Object nested rend un accordion awkward.

**Gaps Addressed**:
- Schema Zod → Tâche dédiée dans Wave 1
- Canvas/SVG → Décision par preset dans les specs individuelles
- Flat props → `heroPreset`, `heroImage`, `heroOverlay` au lieu de `heroBackground: { type, preset, image, overlay }`

---

## Work Objectives

### Core Objective
Transformer les bannières hero plates des pages intérieures en expériences visuelles sci-fi 70s animées, configurables depuis Nuxt Studio.

### Concrete Deliverables
- `components/hero-backgrounds/HeroPresetStarfield.vue` — Champ d'étoiles animé
- `components/hero-backgrounds/HeroPresetNebula.vue` — Nébuleuse gazeuse animée
- `components/hero-backgrounds/HeroPresetPlanetHorizon.vue` — Courbe planétaire + horizon
- `components/hero-backgrounds/HeroPresetGridStation.vue` — Grille perspective TRON-like
- `components/hero-backgrounds/HeroPresetOrbital.vue` — Éléments en orbite
- `components/hero-backgrounds/HeroPresetRetroScan.vue` — CRT scan lines rétro
- `components/hero-backgrounds/HeroImageBackground.vue` — Image de fond + overlay
- `composables/useSpaceParticles.ts` — Composable Canvas partagé
- `components/sections/SectionHero.vue` — Étendu avec heroPreset prop + rendu dynamique
- `components/content/SectionHero.vue` — MDC wrapper étendu
- `content.config.ts` — Schema Zod pour Studio
- Toutes pages intérieures mises à jour avec un preset

### Definition of Done
- [x] `npm run build` exits 0
- [x] Chaque page intérieure a un fond animé visible
- [x] Preset sélectionnable depuis la prop MDC `heroPreset`
- [x] Mode image fonctionne avec `heroImage` prop
- [x] `prefers-reduced-motion` respecté (fallback image statique ou gradient)
- [x] Parité FR/EN maintenue

### Must Have
- 6 presets animés fonctionnels
- Mode image avec overlay optionnel
- Props éditables depuis Nuxt Studio
- Accessibilité (reduced-motion)
- SSR-safe (pas de crash côté serveur)
- Build qui passe

### Must NOT Have (Guardrails)
- ⛔ NE PAS modifier tempo-core submodule
- ⛔ NE PAS toucher ParallaxHome.vue (homepage exclue)
- ⛔ NE PAS ajouter de dépendances externes (tsParticles, Three.js, etc.)
- ⛔ NE PAS animer `left/top/width/height` — uniquement `transform`, `opacity`, `filter` (GPU)
- ⛔ NE PAS mettre `will-change` sur tous les layers simultanément
- ⛔ NE PAS utiliser >200 nœuds SVG animés par preset (cliff performance mobile)
- ⛔ NE PAS oublier `ctx.revert()` dans `onUnmounted` pour GSAP
- ⛔ NE PAS oublier `cancelAnimationFrame` + null refs pour Canvas
- ⛔ NE PAS importer GSAP au top-level (SSR crash) — dynamic import dans `onMounted` uniquement
- ⛔ NE PAS casser la parité FR/EN sur le contenu

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** for automated checks. Visual QA is manual per user decision.

### Test Decision
- **Infrastructure exists**: YES (vitest)
- **Automated tests**: None (user choice: build seul)
- **Framework**: N/A
- **Primary verification**: `npm run build` exits 0 + manual visual inspection

### QA Policy
- Build must pass after each wave
- Each preset must render without console errors
- prefers-reduced-motion must be testable via Playwright emulation

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation — infrastructure, ALL parallel):
├── Task 1: Extend SectionHero + MDC wrapper (props + dynamic background rendering) [deep]
├── Task 2: Update content.config.ts Zod schema for Studio [quick]
├── Task 3: Create useSpaceParticles.ts composable (Canvas particle system) [deep]
└── Task 4: Create HeroImageBackground.vue (image mode + overlay) [quick]

Wave 2 (Presets — 6 components, ALL parallel):
├── Task 5: HeroPresetStarfield (depends: T1, T3) [visual-engineering]
├── Task 6: HeroPresetNebula (depends: T1, T3) [visual-engineering]
├── Task 7: HeroPresetPlanetHorizon (depends: T1) [visual-engineering]
├── Task 8: HeroPresetGridStation (depends: T1) [visual-engineering]
├── Task 9: HeroPresetOrbital (depends: T1, T3) [visual-engineering]
└── Task 10: HeroPresetRetroScan (depends: T1) [visual-engineering]

Wave 3 (Content — all pages updated):
└── Task 11: Update all interior page content with heroPreset assignments (depends: T5-T10) [quick]

Wave FINAL (Verification + Commit):
├── Task F1: Build verification [quick]
├── Task F2: Scope fidelity check [deep]
└── Task F3: Git commit [quick, git-master]
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1 | — | 4-10, F1 | 1 |
| 2 | — | F1 | 1 |
| 3 | — | 5, 6, 9, F1 | 1 |
| 4 | 1 | 11, F1 | 1 |
| 5 | 1, 3 | 11, F1 | 2 |
| 6 | 1, 3 | 11, F1 | 2 |
| 7 | 1 | 11, F1 | 2 |
| 8 | 1 | 11, F1 | 2 |
| 9 | 1, 3 | 11, F1 | 2 |
| 10 | 1 | 11, F1 | 2 |
| 11 | 5-10 | F1 | 3 |
| F1 | 1-11 | F2, F3 | FINAL |
| F2 | F1 | — | FINAL |
| F3 | F1-F2 | — | FINAL |

### Agent Dispatch Summary

- **Wave 1**: 4 tasks — T1 `deep`, T2 `quick`, T3 `deep`, T4 `quick`
- **Wave 2**: 6 tasks — T5-T10 all `visual-engineering` + `frontend-ui-ux` skill
- **Wave 3**: 1 task — T11 `quick`
- **FINAL**: 3 tasks — F1 `quick`, F2 `deep`, F3 `quick` + `git-master`

---

## TODOs

---

## Final Verification Wave

- [x] 1. Extend SectionHero + MDC Wrapper (Props + Dynamic Background Rendering)

  **What to do**:
  - Modify `components/sections/SectionHero.vue`:
    - Add 3 new flat props: `heroPreset?: string` (enum), `heroImage?: string`, `heroOverlay?: string`
    - Add a dynamic background layer BEHIND the existing text content (absolute positioned, z-0)
    - Use `<component :is="resolvedBackground" />` to dynamically render the preset or image background
    - Create a computed that resolves preset name → component (lazy import): `HeroPresetStarfield`, `HeroPresetNebula`, etc.
    - If `heroPreset === 'none'` or undefined → keep current gradient-only background (no change)
    - If `heroImage` is set → render `HeroImageBackground` component
    - Add `prefers-reduced-motion` check: if reduced motion AND no heroImage → show static gradient only
    - Keep ALL existing text/CTA rendering unchanged — background is a new layer underneath
  - Modify `components/content/SectionHero.vue` (MDC wrapper):
    - Add `heroPreset`, `heroImage`, `heroOverlay` to the props destructuring
    - Pass them through to `<SectionsSectionHero>` via v-bind
    - These props are NOT part of animation config — they're separate

  **Must NOT do**:
  - Do NOT change the existing text, CTA, or animation behavior
  - Do NOT change existing CSS classes or margins
  - Do NOT import GSAP at module level (SSR crash)
  - Do NOT modify the core SectionHero in tempo-core/

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T2, T3, T4)
  - **Blocks**: T4, T5-T10, F1
  - **Blocked By**: None

  **References**:
  - `components/sections/SectionHero.vue` — Current hub hero (39 lines, dark theme, radial gradient)
  - `components/content/SectionHero.vue` — MDC wrapper (animation handling)
  - `tempo-core/components/sections/SectionHero.vue` — Core version (DO NOT MODIFY, reference only)
  - `tempo-core/components/content/PageRenderer.vue` — How sections are resolved dynamically
  - `tempo-core/composables/useFeatures.ts` — Feature flag system (`hasAnimations`)

  **WHY Each Reference Matters**:
  - Hub SectionHero: The file to modify — understand current structure before adding background layer
  - MDC wrapper: Must pass new props through — understand the prop extraction pattern
  - Core SectionHero: Reference only — ensure hub override doesn't break fallback
  - PageRenderer: Shows how dynamic component resolution works (copy the pattern)
  - useFeatures: Check if animations are enabled before loading GSAP backgrounds

  **Acceptance Criteria**:
  - [x] SectionHero accepts `heroPreset`, `heroImage`, `heroOverlay` props
  - [x] MDC wrapper passes these props through
  - [x] `heroPreset: 'none'` or undefined → existing gradient background (no change)
  - [x] Dynamic component renders behind text content
  - [x] Build passes

  **QA Scenarios**:
  ```
  Scenario: SectionHero renders without heroPreset (backward compat)
    Tool: Bash
    Steps:
      1. npm run build
      2. Verify no errors mentioning SectionHero
    Expected Result: Build passes, existing pages render unchanged
    Evidence: .sisyphus/evidence/task-1-build.md
  ```

  **Commit**: YES (part of final commit)
  - Files: `components/sections/SectionHero.vue`, `components/content/SectionHero.vue`

---

- [x] 2. Update content.config.ts Zod Schema for Nuxt Studio

  **What to do**:
  - Read `tempo-core/content.config.ts` (or `content.config.ts` at hub root) to understand the current schema
  - Add Zod fields to the `pages` collection schema:
    ```typescript
    heroPreset: z.enum(['starfield', 'nebula', 'planet-horizon', 'grid-station', 'orbital', 'retro-scan', 'none']).default('none'),
    heroImage: z.string().optional(),
    heroOverlay: z.enum(['particles', 'scanlines', 'grid', 'none']).default('none'),
    ```
  - CRITICAL: Without this, Nuxt Studio CANNOT display dropdowns for preset selection
  - If the hub doesn't have its own content.config.ts, check if one can be created that extends the core's

  **Must NOT do**:
  - Do NOT modify the core's content.config.ts
  - Do NOT remove existing schema fields

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: F1
  - **Blocked By**: None

  **References**:
  - `tempo-core/content.config.ts` — Core schema (pages, blog, testimonials, faq, projects, settings collections)
  - `nuxt.config.ts` — Studio configuration (studio.meta.components.include)

  **Acceptance Criteria**:
  - [x] Zod schema includes `heroPreset`, `heroImage`, `heroOverlay`
  - [x] Build passes

  **QA Scenarios**:
  ```
  Scenario: Schema fields present
    Tool: Bash
    Steps:
      1. grep heroPreset content.config.ts (or wherever the schema lives)
      2. Verify the enum values are present
    Expected Result: heroPreset field with all 6 preset names + 'none'
    Evidence: .sisyphus/evidence/task-2-schema.md
  ```

  **Commit**: YES (part of final commit)
  - Files: `content.config.ts`

---

- [x] 3. Create useSpaceParticles.ts Composable (Canvas Particle System)

  **What to do**:
  - Create `composables/useSpaceParticles.ts` — a reusable Canvas-based particle system composable
  - Interface:
    ```typescript
    interface ParticleConfig {
      count: number         // 50-500
      colors: string[]      // e.g. ['#ffffff', '#7ee8e3', '#c87aff']
      speedMultiplier: number // 0.5-2
      maxSize: number       // 0.5-3
      glowIntensity: number // 0-10
    }
    export function useSpaceParticles(canvasRef: Ref<HTMLCanvasElement | null>, config: ParticleConfig)
    ```
  - Each particle: position, velocity, size, color, opacity, life/maxLife (fade in/out)
  - Particles wrap around edges (not respawn)
  - Handle DPR (devicePixelRatio) for Retina displays: `canvas.width = rect.width * dpr`
  - Use `ResizeObserver` or window resize to recalculate on viewport change
  - SSR-safe: all Canvas code in `onMounted` with `import.meta.client` guard
  - Cleanup: `cancelAnimationFrame` + null all refs in `onUnmounted`
  - Respect `prefers-reduced-motion`: check `window.matchMedia` → skip particle loop

  **Must NOT do**:
  - Do NOT use external particle libraries (tsParticles, etc.)
  - Do NOT animate if prefers-reduced-motion is active
  - Do NOT forget DPR scaling (blurry on Retina)

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: T5, T6, T9, F1
  - **Blocked By**: None

  **References**:
  - `tempo-core/composables/useGsap.ts` — Pattern for lazy-loaded composable with cleanup
  - `tempo-core/composables/useFeatures.ts` — Pattern for feature flag checks

  **Acceptance Criteria**:
  - [x] Composable file exists at `composables/useSpaceParticles.ts`
  - [x] Handles DPR, resize, reduced-motion, cleanup
  - [x] Build passes (no TS errors)

  **QA Scenarios**:
  ```
  Scenario: Composable compiles
    Tool: Bash
    Steps:
      1. npm run build
      2. No errors in composables/useSpaceParticles.ts
    Expected Result: Clean compilation
    Evidence: .sisyphus/evidence/task-3-build.md
  ```

  **Commit**: YES (part of final commit)
  - Files: `composables/useSpaceParticles.ts`

---

- [x] 4. Create HeroImageBackground.vue (Image Mode + Overlay)

  **What to do**:
  - Create `components/hero-backgrounds/HeroImageBackground.vue`
  - Props: `image: string` (image URL), `overlay?: 'particles' | 'scanlines' | 'grid' | 'none'`
  - Renders a full-bleed `<img>` or `background-image` with `object-fit: cover`
  - Optional overlay layer on top of the image (CSS-only overlays):
    - `particles`: Subtle floating dots overlay (CSS animation, no Canvas)
    - `scanlines`: CRT-style horizontal scan lines (repeating-linear-gradient)
    - `grid`: Subtle grid pattern overlay
    - `none`: No overlay, just the image
  - Dark gradient overlay at bottom for text readability
  - Use `<NuxtImg>` if available, otherwise `<img>` with lazy loading
  - This component also serves as reduced-motion fallback: if user sets `heroImage`, it displays even with reduced-motion

  **Must NOT do**:
  - Do NOT use Canvas for image backgrounds (overkill)
  - Do NOT forget the dark gradient overlay for text readability

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: T11, F1
  - **Blocked By**: T1 (needs SectionHero to resolve the component)

  **References**:
  - `components/sections/SectionHero.vue` — Where HeroImageBackground will be rendered
  - `components/sections/SectionProjects.vue` — Has existing image rendering pattern

  **Acceptance Criteria**:
  - [x] Component renders an image with object-fit cover
  - [x] Dark gradient overlay present for text readability
  - [x] Optional overlay effects work (scanlines, grid)
  - [x] Build passes

  **QA Scenarios**:
  ```
  Scenario: Component compiles and exports
    Tool: Bash
    Steps:
      1. npm run build
      2. Verify components/hero-backgrounds/HeroImageBackground.vue compiles
    Expected Result: No build errors
    Evidence: .sisyphus/evidence/task-4-build.md
  ```

  **Commit**: YES (part of final commit)
  - Files: `components/hero-backgrounds/HeroImageBackground.vue`

---

- [x] 5. Create HeroPresetStarfield.vue

  **What to do**:
  - Create `components/hero-backgrounds/HeroPresetStarfield.vue`
  - Aesthetic: Deep space noir/bleu. Champ d'étoiles qui dérivent lentement. Parallaxe subtile.
  - **Layers**:
    - L1 (CSS): Deep space gradient base `linear-gradient(180deg, #020818, #050d2a, #0a0520)` 
    - L2 (CSS): SVG data-URI tiled star field (2-3 layers at prime-number tile sizes for non-repeating effect). ~80 circles per layer with varied sizes (0.5-2px), colors (#ffffff, #7ee8e3, #c87aff, #ff9a3c), and opacities.
    - L3 (Canvas): `useSpaceParticles` with 100-150 particles, slow speed (0.3), max size 1.5, low glow (2). Colors: white + teal + faint gold.
    - L4 (CSS): Faint radial gradient lens flare at ~75% 20% position, gold tint rgba(255,200,80,0.08)
  - GSAP (optional): Subtle parallax on the star layers via ScrollTrigger (scrub:true, y: '10%')
  - ALL layers absolute positioned, pointer-events:none, z under the text
  - Reduced motion: Show L1 + L2 only (static gradients + static stars). No Canvas, no GSAP.
  - Reference images: `/reference_idea/tumblr_f93640ce9c50f8a31d74d5ef5c73ad3d_7c16c461_1280.jpg` (deep space station)

  **Must NOT do**:
  - Do NOT exceed 200 SVG animated nodes
  - Do NOT animate background-color or width/height
  - Do NOT forget cleanup (cancelAnimationFrame, ctx.revert)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T6-T10)
  - **Blocks**: T11, F1
  - **Blocked By**: T1, T3

  **References**:
  - `components/sections/SectionHero.vue` — Where this component will be rendered (check how background is resolved)
  - `composables/useSpaceParticles.ts` — Canvas particle composable to use
  - `tempo-core/components/sections/SectionSciFiParallax.vue` — Reference for SVG star layer patterns
  - `reference_idea/tumblr_f93640ce9c50f8a31d74d5ef5c73ad3d_7c16c461_1280.jpg` — Visual reference

  **Acceptance Criteria**:
  - [x] Component renders a deep space star field background
  - [x] Stars have varied sizes, colors, and opacities
  - [x] Canvas particles float gently
  - [x] Build passes

  **Commit**: YES (part of final commit)

---

- [x] 6. Create HeroPresetNebula.vue

  **What to do**:
  - Create `components/hero-backgrounds/HeroPresetNebula.vue`
  - Aesthetic: Nébuleuse gazeuse cosmique. Gradients magenta/bleu/or qui ondulent. Ambiance chaleureuse et cosmique.
  - **Layers**:
    - L1 (CSS): Deep space gradient base (darker than starfield, more purple: #050520)
    - L2 (CSS): SVG data-URI star field (sparser than starfield preset — ~40 stars per layer)
    - L3 (CSS+GSAP): 2-3 nebula cloud divs with huge border-radius, radial-gradient fills, and GSAP nebula-drift animation:
      - `.nebula-magenta`: 60vw x 40vw, magenta radial gradient, drift animation 25s, ease sine.inOut
      - `.nebula-teal`: 50vw x 35vw, teal radial gradient, drift animation 30s, offset
      - `.nebula-gold`: 30vw x 25vw, gold radial gradient, pulse animation 20s
      - Use `filter: blur(40px)` for soft edges. Animate with transform only (GPU).
    - L4 (Canvas): `useSpaceParticles` with 80-120 particles, colors matching nebula palette
    - L5 (CSS): Lens flare pseudo-element, warm gold, position ~70% 25%, pulsing opacity via GSAP
  - GSAP: Use `gsap.context()` for all timelines. `ctx.revert()` in onUnmounted.
  - Reduced motion: L1 + L2 + static nebula clouds (no animation, just gradient blobs)
  - Reference images: `/reference_idea/tumblr_nxxsjh2RSY1sndzdgo1_1280.jpg` (magenta nebula + asteroid)

  **Must NOT do**:
  - Do NOT animate filter values at runtime (set once, animate transform/opacity only)
  - Do NOT use more than 5 nebula cloud elements (keep DOM light)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: T11, F1
  - **Blocked By**: T1, T3

  **References**:
  - `components/sections/SectionHero.vue` — Rendering context
  - `composables/useSpaceParticles.ts` — Canvas particles
  - `reference_idea/tumblr_nxxsjh2RSY1sndzdgo1_1280.jpg` — Visual reference (magenta nebula)

  **Acceptance Criteria**:
  - [x] Nebula clouds visually drift and pulse
  - [x] Magenta, teal, and gold colors present
  - [x] Build passes

  **Commit**: YES (part of final commit)

---

- [x] 7. Create HeroPresetPlanetHorizon.vue

  **What to do**:
  - Create `components/hero-backgrounds/HeroPresetPlanetHorizon.vue`
  - Aesthetic: Courbe de planète en bas de l'écran avec halo lumineux. Gradient orange/or → bleu espace. Ambiance exploration.
  - **Layers**:
    - L1 (CSS): Space gradient top → warm horizon bottom: `linear-gradient(180deg, #020818 0%, #0a1a3a 50%, #1a0a05 85%, #2a1505 100%)`
    - L2 (CSS): SVG data-URI sparse star field (40-60 stars)
    - L3 (CSS): Planet curve div — oversized circle `width: 140vw, height: 140vw, border-radius: 50%` positioned at `bottom: -60vw, left: 50%, translateX(-50%)`. Dark purple/blue gradient fill. Subtle border `rgba(100,150,255,0.15)`. Box-shadow for atmosphere glow.
    - L4 (CSS+GSAP): Atmosphere halo — radial-gradient positioned just above planet curve, warm orange/gold. GSAP subtle pulse (opacity 0.3→0.5→0.3, 8s, repeat:-1, yoyo).
    - L5 (CSS): Lens flare at horizon point — positioned at ~50% 85%, warm white/gold, `filter: blur(15px)`.
  - ALL SVG, no Canvas needed for this preset (element count <50).
  - Reduced motion: L1 + L2 + L3 + static L4 (atmosphere glow visible but not pulsing)
  - Reference: `/reference_idea/images.jpeg` (planet horizon with explorers) + `/reference_idea/tumblr_px2qe3a4Qf1sndzdgo1_1280---Copy.jpg` (warm horizon)

  **Must NOT do**:
  - Do NOT make the planet too bright (it should be dark, the glow comes from the atmosphere)
  - Do NOT position planet curve above 40% of viewport (must stay in lower portion)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: T11, F1
  - **Blocked By**: T1

  **References**:
  - `reference_idea/images.jpeg` — Planet exploration scene
  - `reference_idea/tumblr_px2qe3a4Qf1sndzdgo1_1280---Copy.jpg` — Warm horizon with spacecraft

  **Acceptance Criteria**:
  - [x] Planet curve visible at bottom of hero
  - [x] Warm atmosphere glow around planet edge
  - [x] Deep space stars above
  - [x] Build passes

  **Commit**: YES (part of final commit)

---

- [x] 8. Create HeroPresetGridStation.vue

  **What to do**:
  - Create `components/hero-backgrounds/HeroPresetGridStation.vue`
  - Aesthetic: Grille perspective sci-fi (TRON-like) avec lignes qui convergent vers un point de fuite. Ambiance tech/rétro.
  - **Layers**:
    - L1 (CSS): Dark space gradient with slight teal tint: `linear-gradient(180deg, #020818 0%, #031020 60%, #041828 100%)`
    - L2 (SVG inline): Perspective grid — inline `<svg viewBox="0 0 800 600">` with:
      - 8-10 horizontal lines converging to vanishing point at ~50% 35%
      - 10-12 vertical lines with perspective (wider at bottom, narrow at top)
      - Stroke: `rgba(74, 158, 255, 0.15)` (teal/blue), stroke-width: 0.5
      - GSAP: Subtle pulse on grid opacity (0.1→0.2→0.1, 6s, repeat:-1)
    - L3 (SVG inline): Station UI elements — 4-6 small circles/rectangles at grid intersections, pulsing opacity via GSAP stagger
    - L4 (SVG inline): Orbit ring — dashed ellipse, slow rotation via GSAP (40s, ease:none, repeat:-1)
    - L5 (CSS): Horizontal scan line effect — subtle `repeating-linear-gradient` moving down slowly
  - ALL SVG inline, no Canvas (element count ~60, well under 200 limit)
  - GSAP: `gsap.context()` for grid pulse, station nodes stagger, orbit rotation
  - Reduced motion: Static grid visible, no pulse/rotation/scan
  - Reference: TRON Legacy aesthetic, space station HUD

  **Must NOT do**:
  - Do NOT make grid lines too bright (subtle, 10-20% opacity)
  - Do NOT add too many station nodes (4-6 max)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: T11, F1
  - **Blocked By**: T1

  **References**:
  - `tempo-core/components/sections/SectionSciFiParallax.vue` — SVG layer patterns and GSAP integration

  **Acceptance Criteria**:
  - [x] Perspective grid renders with vanishing point
  - [x] Station elements pulse subtly
  - [x] Orbit ring rotates
  - [x] Build passes

  **Commit**: YES (part of final commit)

---

- [x] 9. Create HeroPresetOrbital.vue

  **What to do**:
  - Create `components/hero-backgrounds/HeroPresetOrbital.vue`
  - Aesthetic: Éléments en orbite lente (arcs, cercles) avec lens flares subtils. Ambiance station spatiale, connexion.
  - **Layers**:
    - L1 (CSS): Deep space gradient with slight blue tint
    - L2 (CSS): SVG data-URI star field
    - L3 (SVG inline): 3-4 concentric orbit rings (dashed ellipses) at different tilts and sizes. GSAP: each rotates at different speeds (20s, 30s, 45s). Different stroke colors (white/10%, teal/15%, gold/10%).
    - L4 (SVG inline): 3-5 small orbiting dots (circles following the ring paths). GSAP motionPath or simple rotation matching the parent ring.
    - L5 (Canvas): `useSpaceParticles` with 100 particles, very slow (0.2 speed), white/teal colors. Creates floating dust effect.
    - L6 (CSS): 2 lens flare elements — warm gold radial gradients. GSAP pulse (opacity, scale, 4s yoyo).
  - GSAP: `gsap.context()`. Orbit rings rotate continuously. Dots orbit. Lens flares pulse.
  - Reduced motion: Static rings visible, no rotation. No particles. Lens flares static.

  **Must NOT do**:
  - Do NOT use >5 orbit rings (keep elegant, not busy)
  - Do NOT make orbiting dots too large (1-3px max)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: T11, F1
  - **Blocked By**: T1, T3

  **References**:
  - `composables/useSpaceParticles.ts` — Canvas particles
  - `reference_idea/tumblr_f93640ce9c50f8a31d74d5ef5c73ad3d_7c16c461_1280.jpg` — Space station with orbiting elements

  **Acceptance Criteria**:
  - [x] Orbit rings rotate at different speeds
  - [x] Lens flares pulse
  - [x] Floating particles visible
  - [x] Build passes

  **Commit**: YES (part of final commit)

---

- [x] 10. Create HeroPresetRetroScan.vue

  **What to do**:
  - Create `components/hero-backgrounds/HeroPresetRetroScan.vue`
  - Aesthetic: CRT scan lines + bruit de grain filmique + lueur chaude. Ambiance terminal rétro années 70.
  - **Layers**:
    - L1 (CSS): Warm dark gradient: `linear-gradient(180deg, #0a0805 0%, #150a05 50%, #1a0f08 100%)`
    - L2 (CSS): CRT scan lines — `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)` covering full viewport. GSAP: Slow vertical translate (scroll effect, -100% over 10s, repeat:-1).
    - L3 (CSS): Warm vignette — `radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)`
    - L4 (CSS): CRT flicker — occasional full-screen opacity flash (GSAP: opacity 1→0.97→1, random timing via gsap.utils.random)
    - L5 (SVG inline): Film grain noise — `<svg>` with `<filter><feTurbulence>` animated (baseFrequency change via GSAP, very subtle)
    - L6 (CSS): Warm glow — radial-gradient centered, amber/orange, low opacity (0.05-0.1). Static.
  - No Canvas needed (all CSS + SVG filter).
  - Reduced motion: L1 + L3 + L6 only (warm dark gradient + vignette + glow. No scan lines, no flicker, no grain.)
  - Reference: Old CRT monitors, 70s terminal screens, Alien (1979) computer interfaces

  **Must NOT do**:
  - Do NOT make scan lines too visible (subtle, 10-15% opacity)
  - Do NOT make flicker distracting (very rare, very subtle)
  - Do NOT use Canvas for grain (SVG feTurbulence is more performant for this)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: T11, F1
  - **Blocked By**: T1

  **References**:
  - `components/ParallaxHome.vue:3158-3170` — Existing SVG feTurbulence grain filter in Scene 4 (use same pattern)

  **Acceptance Criteria**:
  - [x] Scan lines visible and moving
  - [x] Warm amber/orange ambiance
  - [x] Film grain effect via SVG feTurbulence
  - [x] Build passes

  **Commit**: YES (part of final commit)

---

- [x] 11. Update All Interior Page Content with heroPreset Assignments

  **What to do**:
  - Update MDC frontmatter in ALL interior page content files (FR + EN) to add `heroPreset` prop:
    | Page | FR file | EN file | Preset |
    |------|---------|---------|--------|
    | Services | `content/fr/pages/services.md` | `content/en/pages/services.md` | grid-station |
    | À propos | `content/fr/pages/a-propos.md` | `content/en/pages/about.md` | nebula |
    | Projets | `content/fr/pages/projets.md` | `content/en/pages/projects.md` | planet-horizon |
    | Rendez-vous | `content/fr/pages/rendez-vous.md` | `content/en/pages/booking.md` | orbital |
  - For each page, add `heroPreset: <preset-name>` to the `::section-hero` block:
    ```
    ::section-hero
    ---
    title: "..."
    subtitle: "..."
    heroPreset: nebula
    ---
    ::
    ```
  - Service sub-pages (`services/site-vitrine.md`, `services/micro-entrepreneur.md`) use YAML frontmatter sections format — add `heroPreset` to the hero section item in the `sections:` array.
  - Blog listing page: check if `/blog` has a hero section. If yes, add `heroPreset: starfield`. If blog pages don't use SectionHero, skip.
  - Maintain FR/EN parity (same preset on both locales of each page).

  **Must NOT do**:
  - Do NOT change existing titles, subtitles, or CTA links
  - Do NOT change the homepage (ParallaxHome)
  - Do NOT change blog article pages (different layout)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (after all presets built)
  - **Blocks**: F1
  - **Blocked By**: T5-T10 (presets must exist)

  **References**:
  - `content/fr/pages/a-propos.md` — Example MDC hero syntax
  - `content/fr/pages/services/site-vitrine.md` — Example YAML sections syntax

  **Acceptance Criteria**:
  - [x] At least 4 interior pages have `heroPreset` assigned (FR + EN)
  - [x] FR/EN parity maintained
  - [x] Build passes

  **Commit**: YES (part of final commit)
  - Files: `content/**/*.md`
- [x] F1. **Build Verification** — `quick`
  Run `npm run build 2>&1` — verify exit 0, no errors. Start dev server, manually check each interior page loads with its preset background visible.
  Output: `Build [PASS/FAIL] | Pages [N/N rendered] | VERDICT`

- [x] F2. **Scope Fidelity Check** — `deep`
  Verify: (1) ParallaxHome.vue NOT modified, (2) tempo-core NOT modified, (3) no new dependencies added, (4) all presets render, (5) content.config.ts has Zod schema, (6) FR/EN parity maintained.
  Output: `Scope [CLEAN/N issues] | VERDICT`

- [x] F3. **Git Commit** — `quick` + `git-master`
  Stage all new and modified files. Commit: `feat: add animated sci-fi hero banners with 6 presets + Nuxt Studio configuration`
  DO NOT push.

---

## Commit Strategy

| Tasks | Commit Message | Key Files |
|-------|---------------|-----------|
| ALL (1-11) | `feat: add animated sci-fi hero banners with 6 presets + Nuxt Studio configuration` | components/hero-backgrounds/*.vue, components/sections/SectionHero.vue, composables/useSpaceParticles.ts, content.config.ts, content/**/*.md |

---

## Success Criteria

### Verification Commands
```bash
npm run build 2>&1                    # Expected: exit 0
grep "heroPreset" content.config.ts   # Expected: found (Zod schema)
ls components/hero-backgrounds/       # Expected: 7 .vue files
```

### Final Checklist
- [x] 6 presets animés fonctionnels
- [x] Mode image avec overlay
- [x] Props éditables depuis Nuxt Studio (Zod schema en place)
- [x] prefers-reduced-motion respecté
- [x] SSR-safe (dynamic imports dans onMounted)
- [x] Build passe
- [x] Parité FR/EN
- [x] ParallaxHome non touché
- [x] tempo-core non modifié
