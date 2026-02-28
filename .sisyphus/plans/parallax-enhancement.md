# ParallaxHome — Visual Enhancement (All 4 Scenes)

## TL;DR

> **Quick Summary**: Enhance all 4 parallax scenes with richer visual detail — more detailed city skyline with urban life (flickering windows, neon signs, street-level), complete rocket launch sequence with animated countdown, and improved space/constellation scenes. Performance hardening first to create headroom.
> 
> **Deliverables**:
> - Performance-hardened ParallaxHome.vue with `v-once`, `markRaw()`, `gsap.context()`
> - Scene 1: Richer nebula, detailed planet surface, improved asteroids
> - Scene 2: Denser constellation with data streams, animated orbital elements
> - Scene 3: Living city — flickering windows, neon signs, street-level details, rooftop antennas, ground vehicles
> - Scene 4: Full launch sequence — gantry tower, arm retraction, countdown (5→1→LIFTOFF), dust clouds, camera shake
> - Updated Playwright baseline screenshots
> 
> **Estimated Effort**: Large (30-45h across 5 waves)
> **Parallel Execution**: YES — 5 waves with max 6 concurrent tasks
> **Critical Path**: Perf Hardening → Scene 3 City Enhancements → Scene 4 Launch Sequence → Visual QA

---

## Context

### Original Request
User wants to enhance the ParallaxHome parallax with more visual detail on the city (Scene 3) and rocket (Scene 4). Extended to all 4 scenes. Includes animated countdown (5...4...3...2...1...LIFTOFF) and complete launch sequence with gantry, arm retraction, and visual effects.

### Interview Summary
**Key Discussions**:
- **City style**: Skyline riche + vie urbaine — flickering windows, varied architecture, smoke, street lights, ground traffic
- **Rocket style**: Complete launch sequence — countdown, launch tower, arm retraction, progressive flames, vibrations
- **Performance**: Prioritize visual impact over performance
- **Scope**: All 4 scenes enhanced (not just city + rocket)
- **Countdown**: Animated text (5→4→3→2→1→LIFTOFF) synchronized with scroll

**Research Findings**:
- ParallaxHome.vue is 3,241 lines with ~2,843 DOM nodes across 4 scenes
- Scene 3 (City) has 17 buildings + mega-tower with 1,833 SVG elements — already dense
- Scene 4 (Rocket) has detailed spacecraft with 5-layer exhaust system
- Scenes 1-2 are relatively sparse — room for significant enhancement
- Data partially extracted into 4 composables (useParallaxData, useScrollAnimations, useSceneTransitions, useLaunchSequence)

### Metis Review
**Identified Gaps** (addressed):
- **Vue reactivity overhead**: 2,200+ SVG nodes diffed every re-render → `v-once` + `markRaw()` MANDATORY as first task
- **DOM node budget**: 3,000 ceiling, currently at ~2,843 → Scene 3 must optimize existing elements, not add more geometry
- **SVG filter risks**: `feDisplacementMap` 10-100× slower on Firefox → BANNED for heat shimmer, use opacity/transform illusion
- **Window flicker strategy**: GSAP tweens on individual windows = disaster → CSS `@keyframes` on `<g>` groups
- **will-change budget**: ≤15 elements total, or mobile tab crashes
- **Countdown approach**: GSAP `textContent` with `snap` pattern, scroll-scrubbed
- **gsap.context()**: Not currently used → memory leak risk on SPA navigation → must add
- **SVG `<use>`**: Repeated window shapes should use `<use href>` to share rasterized bitmap

---

## Work Objectives

### Core Objective
Transform the parallax homepage from impressive to breathtaking — richer visual detail across all 4 scenes while maintaining scroll fluidity through smart performance optimization.

### Concrete Deliverables
- `components/ParallaxHome.vue` — Enhanced with v-once, all 4 scenes enriched
- `composables/useParallaxData.ts` — Extended with new city detail data (markRaw'd)
- `composables/useLaunchSequence.ts` — Extended with gantry, arms, countdown, dust effects
- `composables/useScrollAnimations.ts` — Extended with new animation targets
- `composables/useSceneTransitions.ts` — Extended with new scene elements
- `assets/css/parallax-animations.css` — New CSS file for window flicker + neon pulse keyframes
- Updated Playwright baseline screenshots (4 scenes)

### Definition of Done
- [x] `npm run build` succeeds
- [x] `npx vitest run` passes (31 hub + 24 core)
- [x] All 4 scenes render correctly (Playwright screenshots)
- [x] Window flicker animation runs on CSS (not GSAP tweens)
- [x] Countdown text animates 5→1→LIFTOFF on scroll
- [x] Launch tower visible with arm retraction animation
- [x] No `feDisplacementMap` usage anywhere
- [x] `v-once` applied to all static SVG groups
- [x] `gsap.context()` wraps all GSAP code in onMounted

### Must Have
- Performance hardening BEFORE visual enhancements (Task 0)
- `v-once` on all static SVG groups
- `markRaw()` on all data arrays from composables
- CSS `@keyframes` for window flicker (not GSAP tweens per window)
- SVG `<use>` for repeated window shapes
- `gsap.context()` + `ctx.revert()` lifecycle
- Countdown overlay (HTML, not SVG text) with GSAP `textContent` + `snap`
- Launch tower/gantry SVG structure
- Arm retraction animation synchronized with ignition
- Dust clouds on launch (opacity/transform, no filters)
- Camera shake effect (transform translate jitter)
- Updated Playwright baselines after all changes

### Must NOT Have (Guardrails)
- ❌ `feDisplacementMap` anywhere (10-100× slower on Firefox)
- ❌ Animated `feGaussianBlur` `stdDeviation` (re-rasterizes every frame)
- ❌ Individual GSAP tweens for window flicker (use CSS `@keyframes` on `<g>` groups)
- ❌ `will-change: transform` on more than 15 elements
- ❌ Canvas or WebGL (stay pure SVG + CSS + GSAP)
- ❌ Modifying the narrative structure (4 scenes stay: Immensité → Constellation → Expertise → Ascension)
- ❌ Changing scroll trigger ranges by more than ±3% (preserve timing feel)
- ❌ Breaking existing composable APIs (extend, don't rewrite)
- ❌ Adding npm dependencies
- ❌ Touching anything outside ParallaxHome and its composables
- ❌ Creating separate Vue components (keep as one SFC — the component IS the art)

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES (Vitest + Playwright)
- **Automated tests**: Tests-after (visual work — Playwright screenshots are the primary verification)
- **Framework**: Vitest (existing tests must keep passing) + Playwright (visual regression)

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Visual verification**: Playwright — Build app, start server, navigate, scroll, screenshot at key positions
- **Performance check**: Bash — Count DOM nodes, verify no banned patterns
- **Build verification**: Bash — `npm run build` + `npx vitest run`

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 0 (PREREQUISITE — performance hardening):
└── Task 1: Performance hardening (v-once, markRaw, gsap.context, CSS file) [deep]

Wave 1 (After Wave 0 — Scenes 1 & 2, parallel):
├── Task 2: Scene 1 — Enhanced nebula, planet detail, asteroids [visual-engineering]
├── Task 3: Scene 2 — Denser constellation, data streams, orbital elements [visual-engineering]
└── Task 4: Scene 3 — Window flicker CSS + neon sign animations [visual-engineering]

Wave 2 (After Wave 1 — Scene 3 city details):
├── Task 5: Scene 3 — Street-level details (roads, lampposts, ground vehicles) [visual-engineering]
├── Task 6: Scene 3 — Rooftop details + building variety + advertising holograms [visual-engineering]
└── Task 7: Scene 4 — Launch tower/gantry + umbilical arm retraction [visual-engineering]

Wave 3 (After Wave 2 — Scene 4 launch sequence):
├── Task 8: Scene 4 — Animated countdown overlay (5→1→LIFTOFF) [visual-engineering]
├── Task 9: Scene 4 — Dust clouds + smoke + camera shake effects [visual-engineering]
└── Task 10: Scene 4 — Enhanced terrain + spaceport ground detail [visual-engineering]

Wave FINAL (After ALL — verification):
├── Task 11: Update Playwright baselines + visual QA all 4 scenes [unspecified-high]
├── Task F1: Plan compliance audit [unspecified-high]
└── Task F2: Performance audit — DOM count, banned patterns, mobile check [deep]

Critical Path: T1 → T4 → T5/T6 → T7 → T8/T9 → T11 → F1/F2
Parallel Speedup: ~55% faster than sequential
Max Concurrent: 3 (Waves 1, 2, 3)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1 | — | 2, 3, 4, 5, 6, 7, 8, 9, 10 | 0 |
| 2 | 1 | 11 | 1 |
| 3 | 1 | 11 | 1 |
| 4 | 1 | 5, 6, 11 | 1 |
| 5 | 4 | 11 | 2 |
| 6 | 4 | 11 | 2 |
| 7 | 1 | 8, 9, 10 | 2 |
| 8 | 7 | 11 | 3 |
| 9 | 7 | 11 | 3 |
| 10 | 7 | 11 | 3 |
| 11 | 2-10 | F1, F2 | FINAL |
| F1 | 11 | — | FINAL |
| F2 | 11 | — | FINAL |

### Agent Dispatch Summary

| Wave | Tasks | Categories |
|------|-------|-----------|
| 0 | 1 | T1 → `deep` |
| 1 | 3 | T2-T4 → `visual-engineering` |
| 2 | 3 | T5-T7 → `visual-engineering` |
| 3 | 3 | T8-T10 → `visual-engineering` |
| FINAL | 3 | T11 → `unspecified-high`, F1 → `unspecified-high`, F2 → `deep` |

---

## TODOs

- [x] 1. [HUB] Performance Hardening — v-once, markRaw, gsap.context, CSS file

  **What to do**:
  - Add `v-once` directive to ALL static SVG `<g>` groups in ParallaxHome.vue template:
    - Background skyline groups (far buildings at lines ~398-468)
    - Terrain layers in Scene 4 (lines ~2500-2560)
    - Static building facades in Scene 3 (buildings that don't animate after initial reveal)
    - Persistent star field + dust particles (lines ~141-200)
  - Wrap all data arrays from `useParallaxData()` with `markRaw()` before returning:
    - `stars`, `brightStars`, `dustParticles`, `ringDustParticles`, `asteroids`
    - `constNodes`, `constEdges`, `tendrils`, `orbitalParticles`
    - `gridH`, `gridV`, `services`
  - Add `gsap.context()` wrapper in `onMounted` hook:
    ```
    const ctx = gsap.context(() => { /* all existing GSAP code */ }, parallaxRef)
    onUnmounted(() => ctx.revert())
    ```
  - Create `assets/css/parallax-animations.css` with CSS `@keyframes` for:
    - `window-flicker` — 4 variants (a/b/c/d) with staggered durations (3.8s-6s) and delays
    - `neon-pulse` — subtle opacity oscillation for neon edges (2s-4s)
    - `beacon-blink` — rooftop beacon blink animation
  - Import the new CSS file in ParallaxHome.vue `<style>` block or via `@import`
  - Add `content-visibility: auto` to scene container divs (`.scene-1`, `.scene-2`, etc.)
  - Verify `will-change: transform` is on ≤15 elements total

  **Must NOT do**:
  - Do NOT change any visual appearance — this task is invisible to the user
  - Do NOT restructure the template beyond adding `v-once` directives
  - Do NOT modify scroll trigger ranges or animation timings
  - Do NOT add new SVG elements

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Performance optimization requires careful analysis of Vue reactivity + GSAP interaction
  - **Skills**: [`playwright`]
    - `playwright`: Verify visual appearance unchanged after optimization

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 0 (solo prerequisite)
  - **Blocks**: Tasks 2, 3, 4, 5, 6, 7, 8, 9, 10
  - **Blocked By**: None

  **References**:
  - `components/ParallaxHome.vue` — Full template to audit for static vs dynamic groups
  - `composables/useParallaxData.ts` — Data arrays that need `markRaw()` wrapping
  - `composables/useScrollAnimations.ts:setupScrollAnimations()` — GSAP code to wrap in `gsap.context()`
  - `composables/useSceneTransitions.ts:setupSceneTransitions()` — More GSAP code for context
  - `composables/useLaunchSequence.ts:setupLaunchSequence()` — Launch GSAP timelines for context
  - Vue docs: `v-once` directive — renders element/component once, skips future re-renders
  - GSAP docs: `gsap.context()` — scopes all tweens for clean revert on unmount

  **Acceptance Criteria**:
  - [x] `grep -c 'v-once' components/ParallaxHome.vue` → ≥ 8
  - [x] `grep 'markRaw' composables/useParallaxData.ts` → present
  - [x] `grep 'gsap.context' components/ParallaxHome.vue` → present
  - [x] `ls assets/css/parallax-animations.css` → exists
  - [x] `grep -c 'feDisplacementMap' components/ParallaxHome.vue` → 0
  - [x] `npm run build` → exit 0
  - [x] `npx vitest run` → 31+ tests pass

  **QA Scenarios:**
  ```
  Scenario: Visual appearance unchanged after optimization
    Tool: Playwright
    Preconditions: App built with `npm run build`, server started
    Steps:
      1. Navigate to http://localhost:3000
      2. Wait 3s for GSAP initialization
      3. Scroll to 0%, 50%, 75%, 100% positions
      4. Screenshot at each position
    Expected Result: Screenshots match current baseline (scene-1 through scene-4)
    Evidence: .sisyphus/evidence/task-1-visual-unchanged.png

  Scenario: No banned patterns introduced
    Tool: Bash (grep)
    Steps:
      1. grep -c 'feDisplacementMap' components/ParallaxHome.vue → 0
      2. grep -c 'will-change' components/ParallaxHome.vue → ≤ 15
    Expected Result: Zero banned patterns
    Evidence: .sisyphus/evidence/task-1-perf-audit.txt
  ```

  **Commit**: YES
  - Message: `perf(hub): harden ParallaxHome with v-once, markRaw, gsap.context`
  - Files: `components/ParallaxHome.vue`, `composables/useParallaxData.ts`, `assets/css/parallax-animations.css`
  - Pre-commit: `npm run build && npx vitest run`

- [x] 2. [HUB] Scene 1 — Enhanced Nebula, Planet Detail, Improved Asteroids

  **What to do**:
  - Enhance the nebula cloud layer (lines ~148-180):
    - Add 3-4 more ellipses with varied radii and warm gradient fills (magenta/amber/coral)
    - Add a secondary nebula cluster offset to the right
    - Use existing `s1-nebula-*` gradient defs — add 2-3 new gradient defs if needed
  - Add planet surface detail:
    - Surface texture: 4-5 crater-like circles with subtle fill on the main planet
    - Atmospheric bands: Add 2-3 more curved paths for atmospheric layers
    - Rim glow: Strengthen the existing glow with a second ellipse (larger, lower opacity)
  - Improve asteroids:
    - Current: 14 simple ellipses. Add surface detail (small inner ellipses for craters)
    - Add 2-3 more asteroids at different positions
    - Add subtle rotation animation via CSS `@keyframes` (very slow, 30-60s cycle)
  - Add 2-3 shooting stars (thin lines with gradient that animate across viewport on scroll)
  - Budget: +30 SVG elements max

  **Must NOT do**:
  - Do NOT modify scroll trigger ranges (18-30%)
  - Do NOT change the color palette significantly
  - Do NOT add more than 30 new SVG elements
  - Do NOT use animated SVG filters

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: SVG art creation with aesthetic judgment required
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 3, 4)
  - **Blocks**: Task 11
  - **Blocked By**: Task 1

  **References**:
  - `components/ParallaxHome.vue:141-269` — Scene 1 template (L'Immensité)
  - `composables/useParallaxData.ts` — `asteroids` array (14 items), `stars` array (450 items)
  - `components/ParallaxHome.vue:2850-2950` — Existing SVG gradient defs (`s1-nebula-warm`, etc.)
  - Existing nebula: 3-4 ellipses with `feGaussianBlur` filters at lines ~155-175

  **Acceptance Criteria**:
  - [x] Nebula visually richer (more cloud layers visible)
  - [x] Planet has surface detail (craters/bands visible)
  - [x] Asteroids have surface texture
  - [x] `npm run build` → exit 0

  **QA Scenarios:**
  ```
  Scenario: Scene 1 enhanced nebula visible
    Tool: Playwright
    Preconditions: App built, server running
    Steps:
      1. Navigate to http://localhost:3000
      2. Wait 3s for initialization
      3. Screenshot at scroll position 0% (scene 1 fully visible)
      4. Compare: nebula should have more visible cloud layers than baseline
    Expected Result: Richer nebula with 6+ cloud ellipses visible, planet with surface detail
    Evidence: .sisyphus/evidence/task-2-scene1-nebula.png
  ```

  **Commit**: YES (groups with Wave 1)
  - Message: `feat(hub): enhance scene 1 nebula, planet detail, asteroids`
  - Files: `components/ParallaxHome.vue`
  - Pre-commit: `npm run build`

- [x] 3. [HUB] Scene 2 — Denser Constellation with Data Streams

  **What to do**:
  - Increase constellation density:
    - In `useParallaxData.ts`: increase `constNodes` from 28 → 40-45 nodes
    - Lower edge distance threshold from 230px → 200px to create more connections
    - This creates a denser, more impressive network
  - Add data stream animations:
    - On 8-10 selected edges, add animated dashes that "flow" along the connection
    - Use CSS `@keyframes` for `stroke-dashoffset` animation (dash flows from node A to node B)
    - Different speeds (3s-8s) and directions for visual variety
  - Enhance orbital particles:
    - Increase from 8 → 14 orbital particles
    - Add size variation (r: 2-5px instead of uniform)
    - Add glow filter to larger particles
  - Add "data readout" micro-animations:
    - Numbers that increment/count in the existing data readout area
    - Blinking cursor effect on readout text
  - Budget: +50 SVG elements max

  **Must NOT do**:
  - Do NOT change scroll ranges (24-58%)
  - Do NOT change constellation generation algorithm structure
  - Do NOT use animated SVG filters (blur, displacement)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: SVG art + CSS animation creation
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 4)
  - **Blocks**: Task 11
  - **Blocked By**: Task 1

  **References**:
  - `components/ParallaxHome.vue:272-329` — Scene 2 template (La Constellation)
  - `composables/useParallaxData.ts:60-110` — `constNodes` (28), `constEdges` (50 max), `tendrils` (12 max), `orbitalParticles` (8)
  - `composables/useSceneTransitions.ts` — Scene 2 transition (24-34% in, 48-58% out)
  - Existing edge rendering: `<line>` elements with `stroke-dasharray`

  **Acceptance Criteria**:
  - [x] Constellation has 40+ nodes visible
  - [x] At least 8 edges have flowing dash animation
  - [x] 14+ orbital particles visible
  - [x] `npm run build` → exit 0

  **QA Scenarios:**
  ```
  Scenario: Scene 2 denser constellation visible
    Tool: Playwright
    Preconditions: App built, server running
    Steps:
      1. Navigate to http://localhost:3000
      2. Scroll to 35% (scene 2 fully visible)
      3. Screenshot
      4. Count visible nodes in screenshot — should be noticeably denser
    Expected Result: Denser network with flowing data streams on edges
    Evidence: .sisyphus/evidence/task-3-scene2-constellation.png
  ```

  **Commit**: YES (groups with Wave 1)
  - Message: `feat(hub): enhance scene 2 constellation density and data streams`
  - Files: `components/ParallaxHome.vue`, `composables/useParallaxData.ts`
  - Pre-commit: `npm run build`

- [x] 4. [HUB] Scene 3 — Window Flicker CSS + Neon Sign Animations

  **What to do**:
  - Apply CSS flicker animations to existing city windows:
    - Group windows into flicker classes (`.flicker-a`, `.flicker-b`, `.flicker-c`, `.flicker-d`)
    - Each class references a different `animation` from `parallax-animations.css`:
      - `.flicker-a`: `window-flicker 4s infinite`
      - `.flicker-b`: `window-flicker 5.5s infinite 1.2s`
      - `.flicker-c`: `window-flicker 3.8s infinite 2.7s`
      - `.flicker-d`: `window-flicker 6s infinite 0.8s`
    - Apply classes to window `<g>` groups (NOT individual `<rect>` elements)
    - Aim for 8-12 `<g>` groups with flicker (not every window — subtle effect)
  - Add neon sign/advertisement elements (3-4 total):
    - Building 1 rooftop: Horizontal neon bar (40×4px rect with gold glow)
    - Mega-tower: Holographic text outline ("HUB" or brand-like shape)
    - Building 10: Vertical neon strip (4×30px)
    - Each neon element gets `neon-pulse` CSS animation from `parallax-animations.css`
  - Add neon edge pulse to 3-4 building edges:
    - Apply `neon-pulse` class to selected existing neon-edge lines
    - Creates subtle breathing effect on building outlines
  - Convert existing holographic displays (lines 2165-2185) to use animated opacity:
    - Pulsing/glitching effect via CSS `@keyframes` (subtle `opacity` flicker between 0.6-1.0)
  - Budget: +15 SVG elements max (neon signs), 0 new GSAP tweens (CSS only)

  **Must NOT do**:
  - Do NOT use GSAP tweens for window flicker (CSS `@keyframes` ONLY)
  - Do NOT add individual animations to each `<rect>` window
  - Do NOT modify building geometry or positions
  - Do NOT change existing light beam animations
  - Do NOT add more than 15 new SVG elements

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: CSS animation artistry + SVG styling
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Tasks 5, 6, 11
  - **Blocked By**: Task 1

  **References**:
  - `components/ParallaxHome.vue:398-2261` — City buildings with window grids
  - `components/ParallaxHome.vue:2165-2185` — Existing holographic displays
  - `components/ParallaxHome.vue:1840-2146` — Central mega-tower with dense window grid
  - `assets/css/parallax-animations.css` — CSS keyframes (created in Task 1)
  - Pattern: Windows are `<rect>` elements grouped in `<g>` per floor/building. Apply flicker class to `<g>` group, not individual rects.

  **Acceptance Criteria**:
  - [x] At least 8 window `<g>` groups have flicker CSS class
  - [x] 3-4 neon sign elements visible on buildings
  - [x] Holographic displays have pulsing animation
  - [x] Zero new GSAP tweens for window animation
  - [x] `npm run build` → exit 0

  **QA Scenarios:**
  ```
  Scenario: City windows flicker
    Tool: Playwright
    Preconditions: App built, server running
    Steps:
      1. Navigate to http://localhost:3000
      2. Scroll to 60% (scene 3 city fully visible)
      3. Wait 6s (allows full animation cycle)
      4. Take 2 screenshots 2s apart
      5. Compare: window brightness should differ between shots
    Expected Result: Visible flicker on some window groups, neon signs glowing
    Evidence: .sisyphus/evidence/task-4-window-flicker-a.png, task-4-window-flicker-b.png

  Scenario: No GSAP tweens for flicker
    Tool: Bash (grep)
    Steps:
      1. grep -n 'window-flicker\|flicker' components/ParallaxHome.vue
      2. Verify classes are CSS-based, not gsap.to() calls
    Expected Result: Flicker classes reference CSS, no GSAP tween for windows
    Evidence: .sisyphus/evidence/task-4-no-gsap-flicker.txt
  ```

  **Commit**: YES (groups with Wave 1)
  - Message: `feat(hub): add window flicker CSS + neon sign animations to city`
  - Files: `components/ParallaxHome.vue`, `assets/css/parallax-animations.css`
  - Pre-commit: `npm run build`

- [x] 5. [HUB] Scene 3 — Street-Level Details (Roads, Lampposts, Ground Vehicles)

  **What to do**:
  - Add street-level ground plane below buildings:
    - Road surface: 2-3 dark `<rect>` elements at y:780-800 (below building bases)
    - Center lane markings: Dashed line (stroke-dasharray) in gold/white
    - Road reflections: Thin gradient rects (wet-look effect, very low opacity)
  - Add lampposts (6-8 total):
    - Lamppost: Thin `<line>` (2px wide, 20px tall) + circle at top (r:3, gold glow)
    - Cone of light below: Triangle/trapezoid `<path>` with low-opacity gold fill
    - Space evenly across the street at y:760-780
  - Add ground vehicles (4-5 silhouettes):
    - Small rounded rectangles (15×6px) at ground level
    - 2 with red tail-light dots, 2 with white headlight dots
    - 1 vehicle with animated x-position (CSS `@keyframes`, slow drift 15s)
  - Add sidewalk texture:
    - Thin horizontal lines at y:775 and y:785 (sidewalk edges)
    - Subtle grid pattern (very low opacity, 0.05-0.1)
  - Budget: +40 SVG elements max

  **Must NOT do**:
  - Do NOT modify existing building geometry
  - Do NOT add detailed pedestrian figures (too complex, wrong scale)
  - Do NOT use animated SVG filters
  - Do NOT exceed +40 new elements

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: SVG micro-art at street level requires spatial judgment
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6, 7)
  - **Blocks**: Task 11
  - **Blocked By**: Task 4 (flicker classes established)

  **References**:
  - `components/ParallaxHome.vue:2262-2268` — Existing ground base (line at y:800 + glow)
  - `components/ParallaxHome.vue:2271-2293` — Existing flying vehicles (use as style reference)
  - `assets/css/parallax-animations.css` — Add `vehicle-drift` keyframe for ground vehicle
  - City viewbox: 0 0 1440 800 — street level is y:760-800

  **Acceptance Criteria**:
  - [x] Road surface visible below buildings
  - [x] 6+ lampposts with light cones visible
  - [x] 4+ ground vehicles visible
  - [x] At least 1 vehicle has CSS drift animation
  - [x] `npm run build` → exit 0

  **QA Scenarios:**
  ```
  Scenario: Street-level details visible
    Tool: Playwright
    Preconditions: App built, server running
    Steps:
      1. Navigate to http://localhost:3000
      2. Scroll to 60% (scene 3 fully visible)
      3. Screenshot
      4. Inspect lower portion of city: roads, lights, vehicles should be visible
    Expected Result: Street-level infrastructure visible at city base
    Evidence: .sisyphus/evidence/task-5-street-level.png
  ```

  **Commit**: YES (groups with Wave 2)
  - Message: `feat(hub): add street-level details to city scene`
  - Files: `components/ParallaxHome.vue`, `assets/css/parallax-animations.css`
  - Pre-commit: `npm run build`

- [x] 6. [HUB] Scene 3 — Rooftop Details + Building Variety + Advertising Holograms

  **What to do**:
  - Add rooftop details to 5-6 largest buildings:
    - Antenna arrays: 2-3 thin `<line>` elements per roof (3-8px tall), with small dot at tip
    - Satellite dishes: Small `<path>` arc (8px wide) on 2 buildings
    - Solar panels: Small `<rect>` grid (3×2 rectangles) on 1-2 building roofs
    - Water tanks: Small `<rect>` (6×4px) with dome top `<path>` on 1 building
  - Add architectural variety to 2-3 buildings:
    - Building 4 (wide, lines 757-919): Add a curved top section (arc `<path>`)
    - Building 10 (massive, lines 1222-1350): Add a stepped pyramid crown (3 offset rects)
    - Mega-tower (lines 1840-2146): Add 2 more horizontal platforms (extending `<line>` at different heights)
  - Add holographic advertisement screens (2-3 new):
    - Large floating screen: `<rect>` (80×40px) with translucent fill, hologram-flicker CSS animation
    - Add 1-2 "scan line" `<line>` elements inside each screen (horizontal, animated downward)
    - Position near mega-tower and between buildings at varying heights
  - Add chimney smoke on 1-2 buildings:
    - 2-3 ellipses stacked vertically, decreasing opacity upward (0.15→0.05)
    - Gentle upward drift via CSS `@keyframes` (translateY -5px → -15px, 4s loop)
  - Budget: +35 SVG elements max

  **Must NOT do**:
  - Do NOT reshape existing building bodies
  - Do NOT change building positions or heights
  - Do NOT use animated SVG filters for smoke (CSS opacity/transform only)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Architectural detail work + hologram aesthetic
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 7)
  - **Blocks**: Task 11
  - **Blocked By**: Task 4

  **References**:
  - `components/ParallaxHome.vue:473-2261` — All 17 buildings (structure reference)
  - `components/ParallaxHome.vue:1840-2146` — Mega-tower (primary target for platforms)
  - `components/ParallaxHome.vue:2165-2185` — Existing holographic displays (style reference)
  - `assets/css/parallax-animations.css` — Add `hologram-scanline` and `smoke-drift` keyframes

  **Acceptance Criteria**:
  - [x] 5+ buildings have rooftop details (antennas/dishes/panels)
  - [x] 2+ buildings have architectural variety (curved/stepped tops)
  - [x] 2+ holographic advertisement screens visible
  - [x] 1+ chimney smoke effect visible
  - [x] `npm run build` → exit 0

  **QA Scenarios:**
  ```
  Scenario: Rooftop details and holograms visible
    Tool: Playwright
    Preconditions: App built, server running
    Steps:
      1. Navigate to http://localhost:3000
      2. Scroll to 60% (scene 3 fully visible)
      3. Screenshot
      4. Check building tops: antennas, dishes, varied crowns visible
      5. Check mid-height: holographic screens floating between buildings
    Expected Result: Buildings have varied tops, holograms float with scan-line effect
    Evidence: .sisyphus/evidence/task-6-rooftops-holograms.png
  ```

  **Commit**: YES (groups with Wave 2)
  - Message: `feat(hub): add rooftop details, building variety, advertising holograms`
  - Files: `components/ParallaxHome.vue`, `assets/css/parallax-animations.css`
  - Pre-commit: `npm run build`

- [x] 7. [HUB] Scene 4 — Launch Tower/Gantry + Umbilical Arm Retraction

  **What to do**:
  - Add launch tower/gantry structure next to landing platform:
    - Main tower: `<rect>` (12×80px) at x:310, y:480 (left of spacecraft position at x:340, y:560)
    - Tower lattice: 4-5 diagonal `<line>` cross-braces (stroke: #6878a0, stroke-width: 0.8)
    - Tower top platform: `<rect>` (20×4px) at top of tower
    - Service crane: `<line>` extending right from tower top (toward spacecraft)
    - Tower base: Wider `<rect>` (18×6px) at ground level
    - Red warning beacon at tower top: `<circle>` r:2 with `beacon-blink` CSS animation
  - Add umbilical arm (fuel/power connection):
    - Arm: `<line>` or `<path>` from tower mid-height to spacecraft hull
    - Arm tip: Small `<rect>` (connector shape)
    - GSAP animation: On launch (82% scroll), arm rotates/retracts:
      - `rotation: -90` (swings away from spacecraft)
      - `duration: 0.3s` within launch sequence timeline
      - `ease: 'power2.in'`
    - Add arm ref to template: `ref="umbilicalArmRef"`
  - Add secondary support arm (lower):
    - Same structure as primary but shorter, positioned at tower lower third
    - Retracts 0.1s after primary arm
  - Add fuel line details:
    - 2 thin curved `<path>` lines from tower base to platform (fuel hoses)
    - Low opacity (0.15-0.2), stroke: #d4a853
  - Extend `useLaunchSequence.ts` with arm retraction animation:
    - New timeline step: arm retraction at launch progress 0→0.1 (before spacecraft lifts)
    - Accept `umbilicalArmRef` and `secondaryArmRef` as new parameters
  - Budget: +30 SVG elements max

  **Must NOT do**:
  - Do NOT modify existing spacecraft shape
  - Do NOT change ignition/blast timing
  - Do NOT move the landing platform position

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Structural SVG engineering + GSAP timeline integration
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 6)
  - **Blocks**: Tasks 8, 9, 10
  - **Blocked By**: Task 1

  **References**:
  - `components/ParallaxHome.vue:2500-2560` — Existing landing platform + control tower
  - `components/ParallaxHome.vue:2624-2777` — Launch sequence elements (ignition, blast, spacecraft)
  - `composables/useLaunchSequence.ts` — Launch timeline to extend (ignition at 0→0.15, blast at 0.15→0.3, spacecraft at 0.3→1.0)
  - `components/ParallaxHome.vue:2671-2777` — Spacecraft ref and position (translate 340,560, rotate -25°)
  - Existing tower pattern: Control tower at lines ~2580-2600 (14×25px) — use similar style

  **Acceptance Criteria**:
  - [x] Launch tower visible next to platform (80+ px tall lattice structure)
  - [x] Umbilical arm connects to spacecraft
  - [x] Arm retracts on scroll past 82%
  - [x] Tower has red warning beacon blinking
  - [x] `npm run build` → exit 0

  **QA Scenarios:**
  ```
  Scenario: Launch tower and arm retraction
    Tool: Playwright
    Preconditions: App built, server running
    Steps:
      1. Navigate to http://localhost:3000
      2. Scroll to 80% (scene 4 visible, pre-launch)
      3. Screenshot: tower should be visible with arm connected
      4. Scroll to 90% (launch in progress)
      5. Screenshot: arm should be retracted away from spacecraft
    Expected Result: Tower with lattice structure, arm connected at 80%, retracted at 90%
    Evidence: .sisyphus/evidence/task-7-tower-prelaunch.png, task-7-tower-launched.png
  ```

  **Commit**: YES (groups with Wave 2)
  - Message: `feat(hub): add launch tower gantry and umbilical arm retraction`
  - Files: `components/ParallaxHome.vue`, `composables/useLaunchSequence.ts`
  - Pre-commit: `npm run build`

- [x] 8. [HUB] Scene 4 — Animated Countdown Overlay (5→1→LIFTOFF)

  **What to do**:
  - Add countdown HTML overlay (NOT SVG `<text>` — better typography):
    - Position: Centered in viewport, large text (font-size: clamp(4rem, 8vw, 8rem))
    - Font: `font-heading` (Poppins) from existing Tailwind config, font-weight: 700
    - Color: `#d4a853` (gold) with `text-shadow` glow
    - HTML structure: `<div ref="countdownRef" class="countdown-overlay">5</div>`
    - Position with Tailwind: `absolute inset-0 flex items-center justify-center pointer-events-none z-40`
  - Implement GSAP scroll-driven countdown:
    ```javascript
    const counter = { value: 5 }
    gsap.to(counter, {
      value: 0,
      snap: { value: 1 },
      ease: 'none',
      scrollTrigger: { trigger: scene4Ref, start: '80% top', end: '88% top', scrub: 0.5 },
      onUpdate() {
        countdownRef.value.textContent = counter.value === 0 ? 'LIFTOFF' : String(counter.value)
      }
    })
    ```
  - Add scale/opacity animation for dramatic effect:
    - Each number change: quick scale pulse (1.0 → 1.3 → 1.0, 0.2s)
    - LIFTOFF text: scale 0.5 → 1.5 with glow intensification
    - Fade out LIFTOFF after 2s (scroll-driven, ~90-92%)
  - Add subtle screen vibration during countdown:
    - Apply `animation: countdown-shake 0.1s linear` to countdown container
    - Shake intensity increases with each number (CSS custom property)
  - CSS in `parallax-animations.css`:
    - `.countdown-overlay` styles (positioning, typography, glow)
    - `@keyframes countdown-shake` (translateX/Y ±1-3px)
    - `@keyframes countdown-pulse` (scale 1→1.3→1)

  **Must NOT do**:
  - Do NOT use SVG `<text>` for countdown (poor typography control)
  - Do NOT use `innerHTML` or `v-html` (XSS risk)
  - Do NOT change existing scroll trigger ranges for other elements
  - Do NOT create the countdown as a separate Vue component

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Typography + animation design + scroll synchronization
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 9, 10)
  - **Blocks**: Task 11
  - **Blocked By**: Task 7 (tower must be positioned before countdown timing is finalized)

  **References**:
  - `components/ParallaxHome.vue:2334-2400` — Scene 4 container and scroll trigger setup
  - `composables/useLaunchSequence.ts` — Launch timeline (ignition at 81%, blast at 82%, spacecraft at 80-98%)
  - `tailwind.config.ts` — `fontFamily.heading: ['Poppins']` for countdown font
  - GSAP `textContent` with `snap` — canonical countdown pattern from GSAP docs
  - Scroll ranges: countdown should precede ignition (80-88%), overlapping early launch

  **Acceptance Criteria**:
  - [x] Countdown text visible at 80% scroll showing "5"
  - [x] Text decrements to 4, 3, 2, 1 as scroll progresses
  - [x] "LIFTOFF" appears at ~88% scroll
  - [x] Text has gold color + glow shadow
  - [x] Text fades out by 92% scroll
  - [x] `npm run build` → exit 0

  **QA Scenarios:**
  ```
  Scenario: Countdown text animates 5→1→LIFTOFF
    Tool: Playwright
    Preconditions: App built, server running
    Steps:
      1. Navigate to http://localhost:3000
      2. Scroll to 80% → screenshot (should show "5")
      3. Scroll to 82% → screenshot (should show "4" or "3")
      4. Scroll to 86% → screenshot (should show "2" or "1")
      5. Scroll to 89% → screenshot (should show "LIFTOFF")
      6. Scroll to 93% → screenshot (countdown should be faded out)
    Expected Result: Text decrements with scroll, shows LIFTOFF, then fades
    Evidence: .sisyphus/evidence/task-8-countdown-5.png through task-8-countdown-liftoff.png
  ```

  **Commit**: YES (groups with Wave 3)
  - Message: `feat(hub): add animated countdown overlay to launch sequence`
  - Files: `components/ParallaxHome.vue`, `assets/css/parallax-animations.css`
  - Pre-commit: `npm run build`

- [x] 9. [HUB] Scene 4 — Dust Clouds + Smoke + Camera Shake Effects

  **What to do**:
  - Add launch dust clouds (ground-level):
    - 6-8 ellipses at platform level (y:555-570) expanding outward on launch:
      - Start: small (rx:10-20, ry:5-8), opacity 0
      - Animate: rx grows 3-5×, ry grows 2-3×, opacity 0→0.25→0.08
      - Colors: `#8090a0` (gray-blue), `#605040` (dusty brown), low opacity
    - GSAP animation in useLaunchSequence.ts:
      - Triggered at launch progress 0.1→0.4 (after ignition, during liftoff)
      - Stagger: 0.05s between each ellipse for expanding wave effect
    - Add ref: `dustCloudsRef`
  - Add smoke columns (rising from blast):
    - 4 tall narrow ellipses (rx:8-12, ry:40-80) rising from platform
    - Animate: translateY -30px to -120px, opacity 0.2→0.05 over 1.5s
    - Colors: `#1a1535` (dark blue-gray), `#2a2040` (slightly lighter)
  - Add camera shake effect:
    - Apply to the entire Scene 4 container `<g>` group
    - GSAP `translateX` and `translateY` jitter (±2-4px)
    - Triggered at ignition (progress 0.05→0.2), decreasing intensity
    - Pattern: `x: 'random(-3, 3)'`, `y: 'random(-2, 2)'`, repeat 8, yoyo
    - `ease: 'rough({ strength: 3, points: 20 })'` if available, otherwise `steps(8)`
  - Add heat shimmer effect (NO `feDisplacementMap`!):
    - 2-3 transparent `<rect>` elements above exhaust nozzle area
    - Animate: subtle `scaleX` oscillation (0.98→1.02) + `opacity` flicker (0.02→0.06)
    - Creates visual distortion illusion without SVG filters
  - Extend `useLaunchSequence.ts` with new refs: `dustCloudsRef`, `smokeColumnsRef`, `scene4ContainerRef`
  - Budget: +20 SVG elements max

  **Must NOT do**:
  - Do NOT use `feDisplacementMap` for heat shimmer (BANNED — Firefox performance)
  - Do NOT use animated `feGaussianBlur`
  - Do NOT apply camera shake to elements outside Scene 4
  - Do NOT modify existing ignition/blast animations

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: VFX-style animation engineering
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 8, 10)
  - **Blocks**: Task 11
  - **Blocked By**: Task 7

  **References**:
  - `composables/useLaunchSequence.ts` — Existing launch timeline to extend
  - `components/ParallaxHome.vue:2632-2653` — Existing blast elements (shockwaves, smoke, sparks)
  - `components/ParallaxHome.vue:2624-2629` — Ignition flash (timing reference)
  - Landing platform position: x:160-500, y:554 (dust clouds expand from here)
  - GSAP `rough` ease: Creates organic-feeling jitter for camera shake

  **Acceptance Criteria**:
  - [x] Dust clouds expand from platform on launch scroll
  - [x] Smoke columns rise from blast area
  - [x] Camera shake visible during ignition phase
  - [x] No `feDisplacementMap` in component (`grep` check)
  - [x] `npm run build` → exit 0

  **QA Scenarios:**
  ```
  Scenario: Dust and smoke effects on launch
    Tool: Playwright
    Preconditions: App built, server running
    Steps:
      1. Scroll to 80% (pre-launch): screenshot — no dust visible
      2. Scroll to 85% (mid-launch): screenshot — dust clouds expanding from platform
      3. Scroll to 92% (post-launch): screenshot — smoke rising, dust dissipating
    Expected Result: Expanding dust wave + rising smoke columns during launch
    Evidence: .sisyphus/evidence/task-9-dust-prelaunch.png, task-9-dust-midlaunch.png

  Scenario: No banned filter patterns
    Tool: Bash
    Steps:
      1. grep -c 'feDisplacementMap' components/ParallaxHome.vue → 0
    Expected Result: Zero feDisplacementMap usage
    Evidence: .sisyphus/evidence/task-9-no-displacement.txt
  ```

  **Commit**: YES (groups with Wave 3)
  - Message: `feat(hub): add dust clouds, smoke, camera shake to launch`
  - Files: `components/ParallaxHome.vue`, `composables/useLaunchSequence.ts`
  - Pre-commit: `npm run build`

- [x] 10. [HUB] Scene 4 — Enhanced Terrain + Spaceport Ground Detail

  **What to do**:
  - Enhance terrain layers (existing 3 curved paths):
    - Add surface texture: 10-15 small `<circle>` elements (r:1-3px) scattered on terrain
    - Rock formations: 4-5 small `<path>` triangular shapes at terrain edge
    - Alien vegetation: 3-4 abstract organic `<path>` shapes (fern-like, 8-15px tall)
    - Use earthy/dark colors (#0c1225, #1a1535) with very low opacity (0.3-0.5)
  - Enhance spaceport ground:
    - Runway markings: 2 parallel dashed lines extending from platform (left and right)
    - Runway edge lights: 8-10 small `<circle>` (r:1.5) in gold along runway, with `beacon-blink` CSS
    - Fuel storage tanks: 2-3 `<rect>` with rounded tops near platform (industrial detail)
    - Supply vehicle: 1 small rectangular shape near tower base
  - Add atmospheric depth:
    - Low-lying fog layer: `<rect>` at y:540-555 with very low opacity gradient (0.03-0.08)
    - Horizon dust: Thin gradient `<rect>` at city silhouette base for atmospheric separation
  - Enhance city silhouette on horizon:
    - Add 5-6 more building outlines to existing distant skyline
    - Add 2-3 tiny window-like dots on largest silhouette buildings (distant city lights)
  - Budget: +35 SVG elements max

  **Must NOT do**:
  - Do NOT modify terrain curve paths (just add detail ON them)
  - Do NOT change sunrise gradient
  - Do NOT add detail above the spacecraft flight path

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Environmental SVG art + atmospheric effects
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 8, 9)
  - **Blocks**: Task 11
  - **Blocked By**: Task 7

  **References**:
  - `components/ParallaxHome.vue:2480-2560` — Existing terrain layers (3 paths) + texture
  - `components/ParallaxHome.vue:2570-2620` — Existing spaceport (platform, tower, outbuildings)
  - `components/ParallaxHome.vue:2420-2460` — Existing cloud layers (style reference)
  - `components/ParallaxHome.vue:2605-2619` — Existing distant structures (left/right)
  - Landing platform position: x:160-500, y:554

  **Acceptance Criteria**:
  - [x] Terrain has visible rock/vegetation details
  - [x] Runway markings + edge lights visible
  - [x] Fuel tanks or supply vehicle near spaceport
  - [x] Fog layer adds atmospheric depth
  - [x] `npm run build` → exit 0

  **QA Scenarios:**
  ```
  Scenario: Enhanced terrain and spaceport ground
    Tool: Playwright
    Preconditions: App built, server running
    Steps:
      1. Scroll to 80% (scene 4 fully visible)
      2. Screenshot
      3. Inspect: terrain should have rocks/vegetation, runway with lights
    Expected Result: Rich spaceport environment with runway, fuel tanks, terrain detail
    Evidence: .sisyphus/evidence/task-10-terrain-spaceport.png
  ```

  **Commit**: YES (groups with Wave 3)
  - Message: `feat(hub): enhance terrain and spaceport ground detail`
  - Files: `components/ParallaxHome.vue`
  - Pre-commit: `npm run build`

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 3 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [x] 11. **Update Playwright Baselines + Visual QA** — `unspecified-high` + `playwright` skill
  Build the app, start server, scroll through all 4 scenes. Capture screenshots at 0%, 25%, 50%, 75%, 90%, 100% scroll positions. Save as new baselines. Verify: city windows flicker, neon signs pulse, launch tower visible, countdown text appears, dust clouds animate, camera shake triggers.
  Output: `Screenshots [N captured] | Scenes [4/4 verified] | VERDICT`

- [x] F1. **Plan Compliance Audit** — `unspecified-high`
  Read plan end-to-end. For each "Must Have": verify implementation exists. For each "Must NOT Have": grep codebase for forbidden patterns. Check all deliverables exist.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | VERDICT`

- [x] F2. **Performance Audit** — `deep`
  Count total DOM nodes in ParallaxHome template (grep for `<rect`, `<circle`, `<line`, `<path`, `<ellipse`, `<g`, `<text`, `<use`). Verify `v-once` on static groups. Verify no `feDisplacementMap`. Verify `will-change` on ≤15 elements. Verify `gsap.context()` usage. Check CSS file exists for window flicker.
  Output: `DOM Nodes [N] | v-once [N groups] | Banned Patterns [CLEAN/N] | will-change [N/15 max] | VERDICT`

---

## Commit Strategy

| Wave | Commit Message | Pre-commit |
|------|---------------|------------|
| 0 | `perf(hub): harden ParallaxHome with v-once, markRaw, gsap.context` | `npm run build && npx vitest run` |
| 1 | `feat(hub): enhance scenes 1-2 + add window flicker CSS` | `npm run build` |
| 2 | `feat(hub): enrich city street-level + rooftops + launch tower` | `npm run build` |
| 3 | `feat(hub): add countdown, dust clouds, camera shake to launch` | `npm run build` |
| FINAL | `test(hub): update playwright baselines for enhanced parallax` | `npm run build && npx vitest run` |

---

## Success Criteria

### Verification Commands
```bash
# Build
npm run build  # Expected: exit 0

# Tests
npx vitest run --reporter=verbose  # Expected: 31+ tests pass

# DOM node count (rough)
grep -cE '<(rect|circle|line|path|ellipse|g |text|use)' components/ParallaxHome.vue
# Expected: < 3200 (optimized from current ~2843)

# Banned patterns
grep -c 'feDisplacementMap' components/ParallaxHome.vue  # Expected: 0
grep -c 'will-change' components/ParallaxHome.vue  # Expected: ≤ 15

# v-once usage
grep -c 'v-once' components/ParallaxHome.vue  # Expected: ≥ 8

# gsap.context
grep -c 'gsap.context' components/ParallaxHome.vue  # Expected: ≥ 1

# CSS animations file
ls assets/css/parallax-animations.css  # Expected: exists

# Playwright (requires built app)
npx playwright test tests/parallax-home.spec.ts  # Expected: all pass
```

### Final Checklist
- [x] All "Must Have" items present
- [x] All "Must NOT Have" items absent
- [x] All tests pass (`npx vitest run`)
- [x] Build succeeds
- [x] 4 updated Playwright baseline screenshots
- [x] Countdown text visible and animating
- [x] City windows flickering
- [x] Launch tower + arm retraction visible
