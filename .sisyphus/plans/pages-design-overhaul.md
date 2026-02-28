# Pages + Design Overhaul — Dark Premium Theme

## TL;DR

> **Quick Summary**: Overhaul the visual design of all section components to match the premium parallax homepage aesthetic (glassmorphism, gold glows, dark gradients), create 3 new pages (services redesign, booking with Cal.com, portfolio grid), and fix tempo-core PageRenderer for new section types.
> 
> **Deliverables**:
> - 10 upgraded section components with dark premium styling
> - Upgraded UiCard + UiButton with glassmorphism and glow effects
> - CSS design token utilities in theme.css
> - Services page redesigned with premium sections
> - Booking page with Cal.com embed (username: tempo-hub)
> - Portfolio page with grid of project cards + hover effects
> - PageRenderer updated to support new section types
> - Header/Footer visual consistency upgrade
> - Both FR and EN locales for all pages
> 
> **Estimated Effort**: Large (40-60h across 5 waves)
> **Parallel Execution**: YES — 5 waves with max 6 concurrent tasks
> **Critical Path**: Design Tokens → UiCard/Button → Section Upgrades → New Pages → Visual QA

---

## Context

### Original Request
User wants to create multiple pages (services, booking, portfolio) and completely overhaul the design system to match the premium dark sci-fi parallax homepage. Current sections look "moche, raougris" (ugly, rough) compared to the homepage.

### Interview Summary
**Key Discussions**:
- **Services**: Redesign existing page with all current offerings
- **Booking**: Cal.com embed, username "tempo-hub"
- **Portfolio**: Grid of cards with hover effect, inline data in markdown
- **Design**: Dark premium everywhere, glassmorphism, consistent with parallax
- **Trust**: "Fais un truc joli comme d'hab" — full creative freedom

**Research Findings**:
- Hub already overrides ALL 10 tempo-core sections — changes go in HUB, not core
- ParallaxHome uses: glassmorphism (rgba(5,8,22,0.65) + blur(16px)), gold glow shadows, gradient backgrounds
- Sections use: flat bg-muted, basic Tailwind, NO effects — stark visual gap
- AnimateOnScroll + v-animate + useAnimations composable already ready in tempo-core
- Cal.com embed component exists (IntegrationsCalEmbed.vue)
- Services page already exists (REDESIGN, not create from scratch)
- Projects collection schema exists but has zero content files

### Metis Review
**Identified Gaps** (addressed):
- **Layer architecture**: ALL visual changes go in tempo-hub overrides, NOT tempo-core
- **Services page exists**: Redesign, not create — update markdown sections
- **Cal.com config empty**: Configure username "tempo-hub" in app.config.ts
- **Zod error phantom**: Agents found no actual error — skip unless build fails
- **PageRenderer registration**: Only necessary core change — add safe fallback for missing sections
- **Content parity**: FR and EN must have identical section structures
- **Mobile performance**: Use CSS transitions for hover, GSAP only for entrance animations
- **Scanlines/vignette**: Parallax-specific effects, NOT section-level utilities

---

## Work Objectives

### Core Objective
Elevate all non-parallax pages to match the premium dark sci-fi aesthetic of the homepage — consistent glassmorphism, gold glow effects, gradient backgrounds, and scroll-triggered entrance animations.

### Concrete Deliverables
- `assets/css/theme.css` — Extended with glass, glow, text-glow utility classes
- `components/ui/Card.vue` — Glassmorphism + glow hover
- `components/ui/Button.vue` — Gold glow hover + improved variant styling
- `components/sections/SectionHero.vue` — Gradient background + text glow
- `components/sections/SectionFeatures.vue` — Glassmorphic cards + entrance animation
- `components/sections/SectionCta.vue` — Gradient background + glow border
- `components/sections/SectionTestimonials.vue` — Glassmorphic cards + gold accents
- `components/sections/SectionStats.vue` — Gold counter text + glow effect
- `components/sections/SectionPricing.vue` — Glassmorphic cards + highlighted plan glow
- `components/sections/SectionFaq.vue` — Glow on active accordion item
- `components/sections/SectionContact.vue` — Form + Cal.com embed styling
- `components/sections/SectionLogos.vue` — Subtle glow hover on logos
- `components/sections/SectionStripePricing.vue` — Minimal dark wrapper alignment
- `components/sections/SectionProjects.vue` — NEW: Grid of project cards with hover reveal
- `components/sections/SectionBooking.vue` — NEW: Cal.com embed wrapper
- `components/layout/Header.vue` — Enhanced glassmorphism consistency
- `components/layout/Footer.vue` — Dark premium styling
- `content/fr/pages/services.md` — Redesigned sections
- `content/en/pages/services.md` — Redesigned sections (parity)
- `content/fr/pages/rendez-vous.md` — NEW: Booking page
- `content/en/pages/booking.md` — NEW: Booking page EN
- `content/fr/pages/projets.md` — NEW: Portfolio page
- `content/en/pages/projects.md` — NEW: Portfolio page EN
- `app.config.ts` — Cal.com username configured
- `tempo-core/components/content/PageRenderer.vue` — Register new section types with safe fallback

### Definition of Done
- [x] `npm run build` succeeds (exit 0)
- [x] `npx vitest run` passes (31 tests)
- [x] All pages load at 3 viewports (375px, 768px, 1440px)
- [x] Glassmorphism visible on cards (backdrop-blur + border)
- [x] Gold glow effects on buttons and headings
- [x] Gradient backgrounds on sections (not flat colors)
- [x] Scroll entrance animations on sections
- [x] Navigation includes all new pages
- [x] FR and EN locales work for all pages
- [x] Cal.com embed loads on booking page
- [x] Portfolio grid renders with project cards

### Must Have
- Glassmorphism on ALL card-based components (Features, Testimonials, Pricing, Portfolio)
- Gold glow (#d4a853) on headings, buttons, active states
- Gradient section backgrounds (from-secondary-950 via-secondary-900 to-secondary-950)
- Scroll-triggered entrance animations via AnimateOnScroll
- Cal.com embed with dark theme on booking page
- Portfolio grid with hover reveal effect
- Both FR and EN content for ALL pages
- PageRenderer safe fallback for missing section types
- Mobile-responsive at 375px, 768px, 1440px

### Must NOT Have (Guardrails)
- ❌ Modifications to `tempo-core/components/sections/` styling (hub overrides shadow them)
- ❌ Modifications to `tempo-core/assets/` or `tempo-core/tailwind.config.ts`
- ❌ SVG art/planets/stars in section components (parallax's job)
- ❌ Scroll-driven (scrub) GSAP animations on sections — use scroll-triggered (one-shot) only
- ❌ Scanlines/vignette/scan-bar as generic utilities (parallax-specific)
- ❌ Three.js scenes on content pages (feature flag disabled)
- ❌ New animation types — use existing 9 from config/animations.ts
- ❌ Touching ParallaxHome.vue, blog pages, or 404 page
- ❌ Adding npm dependencies
- ❌ Page transition effects between routes

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed.

### Test Decision
- **Infrastructure exists**: YES (vitest + playwright)
- **Automated tests**: Tests-after (existing tests must keep passing)
- **Framework**: vitest (unit) + playwright (visual QA)

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/`.

- **Section upgrades**: Playwright screenshots at 3 viewports (375px, 768px, 1440px)
- **New pages**: Playwright navigation + content assertion
- **Design tokens**: Grep verification of CSS values

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation — design tokens + base components):
├── Task 1: CSS design token utilities in theme.css [quick]
├── Task 2: UiCard glassmorphism + glow upgrade [quick]
├── Task 3: UiButton gold glow + variant upgrade [quick]
├── Task 4: app.config.ts Cal.com username + nav config [quick]
└── Task 5: PageRenderer new section types registration [quick]

Wave 2 (Section Upgrades — batch 1, MAX PARALLEL):
├── Task 6: SectionHero premium upgrade (depends: 1) [visual-engineering]
├── Task 7: SectionFeatures premium upgrade (depends: 1, 2) [visual-engineering]
├── Task 8: SectionCta premium upgrade (depends: 1, 3) [visual-engineering]
├── Task 9: SectionTestimonials premium upgrade (depends: 1, 2) [visual-engineering]
├── Task 10: SectionStats premium upgrade (depends: 1) [visual-engineering]
└── Task 11: SectionPricing premium upgrade (depends: 1, 2) [visual-engineering]

Wave 3 (Section Upgrades — batch 2 + new components):
├── Task 12: SectionFaq + SectionLogos + SectionContact upgrade (depends: 1, 3) [visual-engineering]
├── Task 13: SectionStripePricing minimal alignment (depends: 1) [quick]
├── Task 14: SectionProjects.vue — NEW grid component (depends: 1, 2) [visual-engineering]
├── Task 15: SectionBooking.vue — NEW Cal.com wrapper (depends: 1, 4) [visual-engineering]
└── Task 16: Header + Footer premium upgrade (depends: 1) [visual-engineering]

Wave 4 (Content Pages — all in parallel):
├── Task 17: Services page redesign FR + EN (depends: 6, 7, 8, 10) [unspecified-high]
├── Task 18: Booking page FR + EN (depends: 15) [quick]
├── Task 19: Portfolio page FR + EN (depends: 14) [quick]
└── Task 20: Entrance animations on all pages (depends: 17, 18, 19) [visual-engineering]

Wave FINAL (Verification — 3 parallel):
├── Task F1: Visual QA — Playwright screenshots all pages × 3 viewports [unspecified-high + playwright]
├── Task F2: Build + test + navigation audit [unspecified-high]
└── Task F3: Content parity FR/EN check [quick]

Critical Path: Task 1 → Task 2 → Task 7 → Task 17 → Task 20 → F1
Parallel Speedup: ~65% faster than sequential
Max Concurrent: 6 (Wave 2)
```

### Dependency Matrix

| Task | Depends On | Blocks |
|------|-----------|--------|
| 1 | — | 6-16 |
| 2 | — | 7, 9, 11, 14 |
| 3 | — | 8, 12 |
| 4 | — | 15, 18 |
| 5 | — | 14, 15, 17-19 |
| 6-11 | 1 (+2/3) | 17 |
| 12-16 | 1 (+2/3/4) | 17-19 |
| 17-19 | wave 2-3 | 20 |
| 20 | 17-19 | F1-F3 |
| F1-F3 | 20 | — |

### Agent Dispatch Summary

- **Wave 1**: 5 tasks → all `quick`
- **Wave 2**: 6 tasks → all `visual-engineering`
- **Wave 3**: 5 tasks → 4 `visual-engineering` + 1 `quick`
- **Wave 4**: 4 tasks → 1 `unspecified-high` + 2 `quick` + 1 `visual-engineering`
- **Wave FINAL**: 3 tasks → 2 `unspecified-high` + 1 `quick`

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info + QA Scenarios.
> **A task WITHOUT QA Scenarios is INCOMPLETE. No exceptions.**

---

- [x] 1. CSS Design Token Utilities in theme.css

  **What to do**:
  - Open `assets/css/theme.css` and add the following utility classes after the existing `:root` and `.prose` blocks:
    - `.glass` — `background: rgba(5,8,22,0.65); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(212,168,83,0.1);`
    - `.glass-card` — Same as `.glass` plus `border-radius: var(--radius-card, 0.75rem);`
    - `.glow-gold` — `box-shadow: 0 0 20px rgba(212,168,83,0.25), 0 0 60px rgba(212,168,83,0.08);`
    - `.glow-gold-strong` — `box-shadow: 0 0 20px rgba(212,168,83,0.4), 0 0 60px rgba(212,168,83,0.12);`
    - `.glow-blue` — `box-shadow: 0 0 20px rgba(80,160,220,0.25), 0 0 60px rgba(80,160,220,0.08);`
    - `.text-glow` — `text-shadow: 0 0 20px rgba(212,168,83,0.4), 0 0 60px rgba(212,168,83,0.12);`
    - `.text-glow-subtle` — `text-shadow: 0 0 12px rgba(212,168,83,0.2);`
    - `.gradient-section` — `background: linear-gradient(180deg, var(--color-muted) 0%, #0d1230 50%, var(--color-muted) 100%);`
    - `.gradient-section-alt` — `background: linear-gradient(180deg, #050816 0%, #0a1028 50%, #050816 100%);`
    - `.border-glow` — `border: 1px solid rgba(212,168,83,0.15);` (hover version: `border-color: rgba(212,168,83,0.3);`)
    - `.hover-lift` — `transition: transform 0.3s ease, box-shadow 0.3s ease;` + on `:hover` → `transform: translateY(-4px);`
  - All utilities must use CSS classes (not Tailwind `@apply`) so they work everywhere
  - Add a comment block at the top of the new section: `/* === DARK PREMIUM DESIGN TOKENS === */`

  **Must NOT do**:
  - Do NOT add scanlines, vignette, or scan-bar utilities (parallax-specific)
  - Do NOT use `@apply` directives — plain CSS only
  - Do NOT modify existing `:root` or `.prose` blocks

  **Recommended Agent Profile**:
  > Select category + skills based on task domain.
  - **Category**: `quick`
    - Reason: Single-file CSS addition, no complex logic
  - **Skills**: `[]`
    - No special skills needed for CSS utility classes

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4, 5)
  - **Blocks**: Tasks 6-16 (all section upgrades depend on these tokens)
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `assets/css/theme.css:1-51` — Existing theme file structure. Add new block AFTER the `.prose` block (after line 51)
  - `components/ParallaxHome.vue` — Source of design tokens. Search for `rgba(5,8,22,0.65)` and `rgba(212,168,83` to see actual values used

  **API/Type References**:
  - None (pure CSS)

  **External References**:
  - MDN backdrop-filter: `https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter`

  **WHY Each Reference Matters**:
  - `theme.css` — Must append to existing file without breaking current variables
  - `ParallaxHome.vue` — These exact RGBA values create the premium look; do NOT deviate from them

  **Acceptance Criteria**:
  - [x] `assets/css/theme.css` contains all 11 utility classes listed above
  - [x] Grep: `grep -c 'glass\|glow-gold\|text-glow\|gradient-section\|hover-lift' assets/css/theme.css` returns ≥ 11
  - [x] `npm run build` succeeds (exit 0)

  **QA Scenarios:**

  ```
  Scenario: All design token classes are present in theme.css
    Tool: Bash (grep)
    Preconditions: theme.css has been modified
    Steps:
      1. Run: grep -c 'glass-card' assets/css/theme.css
      2. Run: grep -c 'glow-gold' assets/css/theme.css
      3. Run: grep -c 'text-glow' assets/css/theme.css
      4. Run: grep -c 'gradient-section' assets/css/theme.css
      5. Run: grep -c 'hover-lift' assets/css/theme.css
      6. Run: grep -c 'border-glow' assets/css/theme.css
    Expected Result: Each grep returns ≥ 1
    Failure Indicators: Any grep returns 0
    Evidence: .sisyphus/evidence/task-1-css-tokens-grep.txt

  Scenario: Build succeeds with new CSS
    Tool: Bash
    Preconditions: theme.css modified
    Steps:
      1. Run: npm run build
    Expected Result: Exit code 0, no CSS parsing errors
    Failure Indicators: Build fails or CSS parse error in output
    Evidence: .sisyphus/evidence/task-1-build-output.txt
  ```

  **Commit**: YES
  - Message: `feat(theme): add dark premium design token utilities`
  - Files: `assets/css/theme.css`
  - Pre-commit: `npm run build`

---

- [x] 2. UiCard Glassmorphism + Glow Upgrade

  **What to do**:
  - Open `components/ui/Card.vue` and upgrade it with glassmorphism and glow effects:
    - Replace the root `<div>` classes: remove `bg-white/[0.04]` and `border border-white/10`
    - Apply glassmorphism: `background: rgba(5,8,22,0.65); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(212,168,83,0.1);`
    - Add hover glow transition: on hover, apply `box-shadow: 0 0 20px rgba(212,168,83,0.15); border-color: rgba(212,168,83,0.25);`
    - Keep existing props (`bordered`, `padded`) and their behavior
    - Add a new optional prop `glow?: boolean` (default: `false`) — when true, card has permanent gold glow
    - Use `<style scoped>` for the hover/glow CSS — NOT inline styles
    - Ensure `border-radius: var(--radius-card, 0.75rem)` is preserved (from `rounded-card` class)
    - Add a subtle transition: `transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;`

  **Must NOT do**:
  - Do NOT remove the `bordered` or `padded` props
  - Do NOT add SVG decorations or complex animations
  - Do NOT import external libraries

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single component with scoped CSS changes, straightforward
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3, 4, 5)
  - **Blocks**: Tasks 7, 9, 11, 14 (section components using UiCard)
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `components/ui/Card.vue:1-15` — Current Card component (entire file). Keep `bordered`/`padded` props, upgrade visual styling
  - `components/ParallaxHome.vue` — Search for `backdrop-filter: blur(16px)` to see exact glassmorphism pattern

  **API/Type References**:
  - `components/sections/SectionFeatures.vue:11` — How UiCard is used: `<UiCard v-for="(item, i) in items" :key="i">`
  - `components/sections/SectionPricing.vue:11-15` — UiCard with conditional class: `:class="[plan.highlighted && 'ring-2 ring-primary-500']"` — `glow` prop replaces this pattern

  **WHY Each Reference Matters**:
  - `Card.vue` — Must understand current API before modifying
  - Feature/Pricing sections — These are consumers; `glow` prop should be backward-compatible (default false)

  **Acceptance Criteria**:
  - [x] `components/ui/Card.vue` has glassmorphism (backdrop-filter blur)
  - [x] Card has hover glow effect (box-shadow on hover)
  - [x] `glow` prop exists with default `false`
  - [x] Existing `bordered` and `padded` props still work
  - [x] `npm run build` succeeds

  **QA Scenarios:**

  ```
  Scenario: Card component has glassmorphism properties
    Tool: Bash (grep)
    Preconditions: Card.vue has been modified
    Steps:
      1. Run: grep 'backdrop-filter' components/ui/Card.vue
      2. Run: grep 'rgba(5,8,22' components/ui/Card.vue
      3. Run: grep 'glow' components/ui/Card.vue
    Expected Result: All three greps return matches
    Failure Indicators: Any grep returns empty
    Evidence: .sisyphus/evidence/task-2-card-grep.txt

  Scenario: Build succeeds with upgraded Card
    Tool: Bash
    Preconditions: Card.vue modified
    Steps:
      1. Run: npm run build
    Expected Result: Exit code 0
    Failure Indicators: Template compilation error or missing import
    Evidence: .sisyphus/evidence/task-2-build-output.txt
  ```

  **Commit**: YES (groups with Task 3)
  - Message: `feat(ui): upgrade Card and Button with glassmorphism and glow effects`
  - Files: `components/ui/Card.vue`, `components/ui/Button.vue`
  - Pre-commit: `npm run build`

---

- [x] 3. UiButton Gold Glow + Variant Upgrade

  **What to do**:
  - Open `components/ui/Button.vue` and enhance all variants with premium dark theme polish:
    - **primary variant**: Add gold glow on hover: `hover:shadow-[0_0_20px_rgba(212,168,83,0.3)]`. Keep existing `bg-primary-500 text-secondary-950 hover:bg-primary-400`
    - **outline variant**: Add gold glow on hover: `hover:shadow-[0_0_15px_rgba(212,168,83,0.2)]`. Keep existing border/text styles
    - **secondary variant**: Add subtle border glow: `hover:border-primary-500/20 hover:shadow-[0_0_10px_rgba(212,168,83,0.1)]`
    - **ghost variant**: No glow changes (keep subtle)
    - Add to `baseClasses`: `transition-shadow` (already has `transition-all` so shadow is covered)
    - Use Tailwind utilities for shadows where possible; fallback to `<style scoped>` for complex shadows only

  **Must NOT do**:
  - Do NOT change button sizes or padding
  - Do NOT remove any existing variants
  - Do NOT add new props

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single component, Tailwind class modifications only
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 4, 5)
  - **Blocks**: Tasks 8, 12 (sections using UiButton)
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `components/ui/Button.vue:41-54` — Current variant and size classes. Modify `variantClasses` object only

  **API/Type References**:
  - `components/ui/Button.vue:25-39` — Props interface. Do NOT modify

  **WHY Each Reference Matters**:
  - `variantClasses` at line 43-48 is the ONLY object to change — add Tailwind shadow utilities to each variant's hover state

  **Acceptance Criteria**:
  - [x] Primary variant has gold glow on hover
  - [x] Outline variant has gold glow on hover
  - [x] `npm run build` succeeds
  - [x] All 4 variants still render correctly

  **QA Scenarios:**

  ```
  Scenario: Button variants include glow shadows
    Tool: Bash (grep)
    Preconditions: Button.vue modified
    Steps:
      1. Run: grep 'shadow' components/ui/Button.vue
      2. Run: grep 'primary:' components/ui/Button.vue (check variant still exists)
      3. Run: grep 'outline:' components/ui/Button.vue
    Expected Result: shadow grep returns matches; all 4 variants present
    Failure Indicators: No shadow references; missing variant
    Evidence: .sisyphus/evidence/task-3-button-grep.txt

  Scenario: Build succeeds with upgraded Button
    Tool: Bash
    Preconditions: Button.vue modified
    Steps:
      1. Run: npm run build
    Expected Result: Exit code 0
    Failure Indicators: Build failure
    Evidence: .sisyphus/evidence/task-3-build-output.txt
  ```

  **Commit**: YES (groups with Task 2)
  - Message: `feat(ui): upgrade Card and Button with glassmorphism and glow effects`
  - Files: `components/ui/Card.vue`, `components/ui/Button.vue`
  - Pre-commit: `npm run build`

---

- [x] 4. App Config — Cal.com Username + Nav Config

  **What to do**:
  - Open `app.config.ts` and set `calcom.username` to `'tempo-hub'`:
    - Line 28: Change `username: ''` to `username: 'tempo-hub'`
  - Verify that `calcom.defaultEvent` remains `'consultation'`
  - No other changes needed — navigation is already dynamic from content queries (Header.vue:89-94)

  **Must NOT do**:
  - Do NOT change any feature flags
  - Do NOT modify contact or social sections
  - Do NOT add new config keys

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single line change in config file
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 5)
  - **Blocks**: Tasks 15, 18 (booking section and page need Cal.com configured)
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `app.config.ts:27-30` — Cal.com config block. Change line 28 only

  **API/Type References**:
  - `tempo-core/components/integrations/CalEmbed.vue:26` — `resolvedUsername` reads from `calcom.value.username`
  - `components/sections/SectionContact.vue:31` — `<IntegrationsCalEmbed v-if="calcom.username" ...>` — the `v-if` check means empty string = hidden

  **WHY Each Reference Matters**:
  - CalEmbed.vue shows the username flows through `useClientConfig()` → `calcom.username` → embed URL
  - SectionContact shows the embed only renders when username is truthy

  **Acceptance Criteria**:
  - [x] `grep 'username' app.config.ts` shows `'tempo-hub'`
  - [x] `npm run build` succeeds

  **QA Scenarios:**

  ```
  Scenario: Cal.com username is configured
    Tool: Bash (grep)
    Preconditions: app.config.ts modified
    Steps:
      1. Run: grep "username:" app.config.ts
    Expected Result: Output includes "username: 'tempo-hub'"
    Failure Indicators: username is empty string or different value
    Evidence: .sisyphus/evidence/task-4-calcom-config.txt

  Scenario: Build succeeds
    Tool: Bash
    Preconditions: app.config.ts modified
    Steps:
      1. Run: npm run build
    Expected Result: Exit code 0
    Failure Indicators: Config validation error
    Evidence: .sisyphus/evidence/task-4-build-output.txt
  ```

  **Commit**: YES
  - Message: `feat(config): configure Cal.com username for booking integration`
  - Files: `app.config.ts`
  - Pre-commit: `npm run build`

---

- [x] 5. PageRenderer — Register New Section Types

  **What to do**:
  - Open `tempo-core/components/content/PageRenderer.vue` and:
    1. Add import for `SectionsSectionProjects` and `SectionsSectionBooking` from `#components` (line 27-39)
    2. Add entries to `sectionMap` (line 68-80):
       - `'projects': SectionsSectionProjects,`
       - `'booking': SectionsSectionBooking,`
    3. Improve `resolveSection` function (line 82-84) to add a safe fallback:
       ```ts
       function resolveSection(type: string): Component {
         const component = sectionMap[type]
         if (!component) {
           console.warn(`[PageRenderer] Unknown section type: "${type}". Skipping.`)
         }
         return component ?? type
       }
       ```
  - The actual `SectionProjects.vue` and `SectionBooking.vue` components will be created in Tasks 14 and 15 — this task just registers them
  - The build will succeed because `#components` auto-resolves from the components directory

  **Must NOT do**:
  - Do NOT modify any existing section mappings
  - Do NOT change `getSectionProps` logic
  - Do NOT modify template structure
  - Do NOT touch styling — this is the ONLY legitimate tempo-core change

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 5-line addition to existing file
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 4)
  - **Blocks**: Tasks 14, 15, 17-19 (new sections and pages using them)
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `tempo-core/components/content/PageRenderer.vue:27-39` — Import block. Add two new imports following same pattern: `SectionsSectionProjects`, `SectionsSectionBooking`
  - `tempo-core/components/content/PageRenderer.vue:68-80` — `sectionMap` object. Add two entries following exact pattern: `'projects': SectionsSectionProjects,`
  - `tempo-core/components/content/PageRenderer.vue:82-84` — `resolveSection` function. Enhance with console.warn for unknown types

  **WHY Each Reference Matters**:
  - Import block pattern ensures auto-resolution from `#components` works
  - sectionMap is the registry — new entries enable markdown `type: projects` and `type: booking` to resolve
  - Safe fallback prevents blank pages when a section type is misspelled

  **Acceptance Criteria**:
  - [x] `grep 'projects' tempo-core/components/content/PageRenderer.vue` shows the mapping
  - [x] `grep 'booking' tempo-core/components/content/PageRenderer.vue` shows the mapping
  - [x] `grep 'console.warn' tempo-core/components/content/PageRenderer.vue` shows the fallback
  - [x] NOTE: Build may warn about missing components (SectionProjects/SectionBooking don't exist yet) — that's OK, they'll be created in Tasks 14-15

  **QA Scenarios:**

  ```
  Scenario: New section types registered in sectionMap
    Tool: Bash (grep)
    Preconditions: PageRenderer.vue modified
    Steps:
      1. Run: grep "'projects'" tempo-core/components/content/PageRenderer.vue
      2. Run: grep "'booking'" tempo-core/components/content/PageRenderer.vue
      3. Run: grep 'console.warn' tempo-core/components/content/PageRenderer.vue
    Expected Result: All three greps return matches
    Failure Indicators: Missing section type or fallback
    Evidence: .sisyphus/evidence/task-5-pagerenderer-grep.txt

  Scenario: Existing section types still present
    Tool: Bash (grep)
    Preconditions: PageRenderer.vue modified
    Steps:
      1. Run: grep -c "'hero'\|'features'\|'pricing'\|'testimonials'\|'faq'\|'cta'\|'contact'\|'stats'\|'logos'\|'stripe-pricing'" tempo-core/components/content/PageRenderer.vue
    Expected Result: Count ≥ 10 (all original section types preserved)
    Failure Indicators: Count < 10 means an existing mapping was accidentally removed
    Evidence: .sisyphus/evidence/task-5-existing-sections-check.txt
  ```

  **Commit**: YES
  - Message: `feat(core): register projects and booking section types in PageRenderer`
  - Files: `tempo-core/components/content/PageRenderer.vue`
  - Pre-commit: `npm run build` (may warn about missing components — acceptable)

---

- [x] 6. SectionHero Premium Upgrade

  **What to do**:
  - Open `components/sections/SectionHero.vue` and apply premium dark theme:
    - Add gradient background to the `<section>`: `class="relative min-h-[70vh] flex items-center gradient-section-alt"`
    - Add radial gradient overlay (CSS pseudo-element or inline bg): `radial-gradient(ellipse at 50% 0%, rgba(212,168,83,0.06) 0%, transparent 60%)`
    - Add `text-glow` class to the `<h1>` for gold heading glow
    - Add `text-glow-subtle` class to the `<p>` subtitle
    - Add a decorative horizontal line under the subtitle: `<div class="mt-6 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />`
    - Ensure buttons use the upgraded UiButton from Task 3 (no changes needed to button usage)
  - Use the CSS utility classes from Task 1 (`.gradient-section-alt`, `.text-glow`, `.text-glow-subtle`)

  **Must NOT do**:
  - Do NOT add SVG art, stars, or space scenes (parallax's job)
  - Do NOT add GSAP animations (entrance animations handled in Task 20)
  - Do NOT change props interface

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Visual styling work requiring design sensibility
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 7, 8, 9, 10, 11)
  - **Blocks**: Task 17 (services page needs styled Hero)
  - **Blocked By**: Task 1 (CSS design tokens)

  **References**:

  **Pattern References**:
  - `components/sections/SectionHero.vue:1-37` — Full current component. Replace class strings on `<section>` (line 2), `<h1>` (line 4), `<p>` (line 7)
  - `components/ParallaxHome.vue` — Search for `text-shadow` to see gold glow pattern used on headings

  **WHY Each Reference Matters**:
  - SectionHero is the most visible section type — sets the tone for the entire page
  - ParallaxHome's text-shadow values are the exact gold glow to replicate via `.text-glow` utility

  **Acceptance Criteria**:
  - [x] `<section>` has gradient background (not flat color)
  - [x] `<h1>` has text glow effect
  - [x] Decorative line element exists below subtitle
  - [x] `npm run build` succeeds

  **QA Scenarios:**

  ```
  Scenario: Hero section has premium styling
    Tool: Bash (grep)
    Preconditions: SectionHero.vue modified
    Steps:
      1. Run: grep 'gradient-section' components/sections/SectionHero.vue
      2. Run: grep 'text-glow' components/sections/SectionHero.vue
      3. Run: grep 'via-primary-500' components/sections/SectionHero.vue
    Expected Result: All three greps return matches
    Failure Indicators: Any grep empty — missing premium styling
    Evidence: .sisyphus/evidence/task-6-hero-grep.txt

  Scenario: Build succeeds
    Tool: Bash
    Steps:
      1. Run: npm run build
    Expected Result: Exit code 0
    Evidence: .sisyphus/evidence/task-6-build.txt
  ```

  **Commit**: YES (groups with Tasks 7-11)
  - Message: `feat(sections): premium dark theme upgrade for all section components`
  - Files: `components/sections/SectionHero.vue` + all other section files from Wave 2
  - Pre-commit: `npm run build`

---

- [x] 7. SectionFeatures Premium Upgrade

  **What to do**:
  - Open `components/sections/SectionFeatures.vue` and apply premium theme:
    - Replace `bg-[var(--color-muted)]` on `<section>` with `gradient-section`
    - Add `text-glow` to the `<h2>` heading
    - Each `<UiCard>` item: the Card component (Task 2) already provides glassmorphism. No card-level changes needed
    - Wrap the icon in a subtle glow container: `<div class="inline-flex p-2 rounded-lg bg-primary-500/10">` around `<UiIcon>`
    - Add `text-glow-subtle` to each card's `<h3>` title
    - Add `hover-lift` class to each `<UiCard>` wrapper for the hover-translate effect
  - Use classes from Task 1 for consistent styling

  **Must NOT do**:
  - Do NOT change the grid layout (3 columns on lg)
  - Do NOT modify the FeatureItem interface
  - Do NOT add GSAP — scroll animation added in Task 20

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Visual styling requiring consistent design system application
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6, 8, 9, 10, 11)
  - **Blocks**: Task 17 (services page)
  - **Blocked By**: Tasks 1, 2 (CSS tokens + Card upgrade)

  **References**:

  **Pattern References**:
  - `components/sections/SectionFeatures.vue:1-42` — Full current component. Modify class strings on `<section>` (line 2), `<h2>` (line 5), add wrapper around `<UiIcon>` (line 13), add class to `<h3>` (line 14)
  - `components/ui/Card.vue` — Card already has glassmorphism from Task 2, so `<UiCard>` usage just needs `hover-lift` class

  **WHY Each Reference Matters**:
  - Features is the most commonly used section type — appears on services and homepage
  - Card.vue upgrade (Task 2) means we only need to add hover-lift, not re-implement glassmorphism

  **Acceptance Criteria**:
  - [x] `<section>` uses gradient background
  - [x] Heading has text glow
  - [x] Icon wrapped in subtle glow container
  - [x] Cards have `hover-lift` class
  - [x] `npm run build` succeeds

  **QA Scenarios:**

  ```
  Scenario: Features section has premium styling
    Tool: Bash (grep)
    Preconditions: SectionFeatures.vue modified
    Steps:
      1. Run: grep 'gradient-section' components/sections/SectionFeatures.vue
      2. Run: grep 'text-glow' components/sections/SectionFeatures.vue
      3. Run: grep 'hover-lift' components/sections/SectionFeatures.vue
      4. Run: grep 'primary-500/10' components/sections/SectionFeatures.vue
    Expected Result: All greps return matches
    Evidence: .sisyphus/evidence/task-7-features-grep.txt
  ```

  **Commit**: YES (groups with Wave 2 tasks)
  - Message: `feat(sections): premium dark theme upgrade for all section components`

---

- [x] 8. SectionCta Premium Upgrade

  **What to do**:
  - Open `components/sections/SectionCta.vue` and apply premium theme:
    - Replace `bg-white/[0.03] border-y border-white/10` on `<section>` with `gradient-section-alt border-glow`
    - Add `text-glow` to the `<h2>`
    - Add a decorative gold line above the section: `<div class="mx-auto w-32 h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent mb-8" />`
    - Add subtle radial glow behind the CTA buttons area: wrap buttons `<div>` with a container having `bg-primary-500/5 rounded-2xl p-8` or similar
  - This section should feel like an invitation — warm gold tones

  **Must NOT do**:
  - Do NOT change props interface
  - Do NOT add animations

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Visual styling with emphasis on CTA visual hierarchy
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6, 7, 9, 10, 11)
  - **Blocks**: Task 17 (services page)
  - **Blocked By**: Tasks 1, 3 (CSS tokens + Button upgrade)

  **References**:

  **Pattern References**:
  - `components/sections/SectionCta.vue:1-34` — Full component. Modify `<section>` class (line 2), `<h2>` (line 4), button wrapper (line 8)

  **Acceptance Criteria**:
  - [x] `<section>` uses gradient background with glow border
  - [x] Heading has text glow
  - [x] Decorative line element present
  - [x] `npm run build` succeeds

  **QA Scenarios:**

  ```
  Scenario: CTA section has premium styling
    Tool: Bash (grep)
    Preconditions: SectionCta.vue modified
    Steps:
      1. Run: grep 'gradient-section' components/sections/SectionCta.vue
      2. Run: grep 'text-glow' components/sections/SectionCta.vue
      3. Run: grep 'via-primary-500' components/sections/SectionCta.vue
    Expected Result: All greps return matches
    Evidence: .sisyphus/evidence/task-8-cta-grep.txt
  ```

  **Commit**: YES (groups with Wave 2 tasks)
  - Message: `feat(sections): premium dark theme upgrade for all section components`

---

- [x] 9. SectionTestimonials Premium Upgrade

  **What to do**:
  - Open `components/sections/SectionTestimonials.vue` and apply premium theme:
    - Replace `bg-[var(--color-muted)]` on `<section>` with `gradient-section`
    - Add `text-glow` to the `<h2>`
    - Replace the star icon color `text-primary-500` with a gold glow wrapper: `<div class="inline-flex"><UiIcon name="star" size="md" class="text-primary-500 drop-shadow-[0_0_6px_rgba(212,168,83,0.4)]" /></div>`
    - Add `hover-lift` class to each `<UiCard>`
    - Style the quote text to be more premium: replace `text-gray-300` with `text-gray-200` and add a left gold border: `border-l-2 border-primary-500/30 pl-4` on the blockquote
    - Author name: add `text-glow-subtle` class
  - UiCard already provides glassmorphism from Task 2

  **Must NOT do**:
  - Do NOT change the TestimonialItem interface
  - Do NOT add a carousel/slider (keep static grid)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Visual refinement of card-based layout
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6, 7, 8, 10, 11)
  - **Blocks**: None directly (used via content)
  - **Blocked By**: Tasks 1, 2 (CSS tokens + Card upgrade)

  **References**:

  **Pattern References**:
  - `components/sections/SectionTestimonials.vue:1-43` — Full component. Modify section class (line 2), heading (line 5), star icon (line 13), blockquote (line 14), author (line 18)

  **Acceptance Criteria**:
  - [x] `<section>` uses gradient background
  - [x] Star icons have gold drop-shadow
  - [x] Blockquote has left gold border
  - [x] Cards have `hover-lift`
  - [x] `npm run build` succeeds

  **QA Scenarios:**

  ```
  Scenario: Testimonials section has premium styling
    Tool: Bash (grep)
    Preconditions: SectionTestimonials.vue modified
    Steps:
      1. Run: grep 'gradient-section' components/sections/SectionTestimonials.vue
      2. Run: grep 'text-glow' components/sections/SectionTestimonials.vue
      3. Run: grep 'hover-lift' components/sections/SectionTestimonials.vue
      4. Run: grep 'border-primary-500' components/sections/SectionTestimonials.vue
    Expected Result: All greps return matches
    Evidence: .sisyphus/evidence/task-9-testimonials-grep.txt
  ```

  **Commit**: YES (groups with Wave 2 tasks)
  - Message: `feat(sections): premium dark theme upgrade for all section components`

---

- [x] 10. SectionStats Premium Upgrade

  **What to do**:
  - Open `components/sections/SectionStats.vue` and apply premium theme:
    - Replace `bg-white/[0.03] border-y border-white/10` on `<section>` with `gradient-section-alt`
    - Add `text-glow` to the `<h2>` (if title exists)
    - Stat value `<span>` (line 9): add `text-glow` class for gold number glow
    - Stat label: upgrade from `text-gray-400` to `text-gray-300` and add `uppercase tracking-widest`
    - Add decorative dividers between stats on desktop: `divide-x divide-primary-500/20` on the grid (or gold vertical lines between items)
    - Each stat item: wrap in a subtle glass container: `bg-white/[0.03] rounded-xl p-6 border border-white/5`

  **Must NOT do**:
  - Do NOT add counter animations (those would need GSAP, handled in Task 20 if desired)
  - Do NOT change StatItem interface or computed grid classes

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Visual styling with number emphasis
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6, 7, 8, 9, 11)
  - **Blocks**: Task 17 (services page)
  - **Blocked By**: Task 1 (CSS tokens)

  **References**:

  **Pattern References**:
  - `components/sections/SectionStats.vue:1-41` — Full component. Modify section class (line 2), stat value (line 9), stat label (line 12-13)
  - `components/sections/SectionStats.vue:35-40` — `gridClasses` computed. Consider adding `divide-x` here or as separate class

  **Acceptance Criteria**:
  - [x] `<section>` uses gradient background
  - [x] Stat values have gold text glow
  - [x] Stat items have glass container
  - [x] `npm run build` succeeds

  **QA Scenarios:**

  ```
  Scenario: Stats section has premium styling
    Tool: Bash (grep)
    Preconditions: SectionStats.vue modified
    Steps:
      1. Run: grep 'gradient-section' components/sections/SectionStats.vue
      2. Run: grep 'text-glow' components/sections/SectionStats.vue
      3. Run: grep 'bg-white' components/sections/SectionStats.vue
    Expected Result: Gradient and glow present
    Evidence: .sisyphus/evidence/task-10-stats-grep.txt
  ```

  **Commit**: YES (groups with Wave 2 tasks)
  - Message: `feat(sections): premium dark theme upgrade for all section components`

---

- [x] 11. SectionPricing Premium Upgrade

  **What to do**:
  - Open `components/sections/SectionPricing.vue` and apply premium theme:
    - Add `gradient-section` class to `<section>` (line 2, currently no background)
    - Add `text-glow` to the `<h2>` (line 5)
    - Highlighted plan: replace `ring-2 ring-primary-500 scale-[1.02]` with `glow-gold scale-[1.02]` — uses the gold glow shadow instead of a ring. Also add `:glow="true"` prop to the UiCard for the highlighted plan
    - Non-highlighted plans: add `hover-lift` class to `<UiCard>`
    - Price text (line 21): add `text-glow-subtle` class for subtle gold number glow
    - Feature list checkmarks: add `drop-shadow-[0_0_4px_rgba(212,168,83,0.3)]` to the check icon for a subtle glow
    - Ensure button inside card uses proper variant from Task 3 (already does: `plan.highlighted ? 'primary' : 'outline'`)

  **Must NOT do**:
  - Do NOT change PricingPlan interface
  - Do NOT modify grid layout

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Pricing cards need careful visual hierarchy (highlighted vs normal)
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6, 7, 8, 9, 10)
  - **Blocks**: None directly
  - **Blocked By**: Tasks 1, 2 (CSS tokens + Card upgrade)

  **References**:

  **Pattern References**:
  - `components/sections/SectionPricing.vue:1-67` — Full component. Key lines: section (2), heading (5), card loop (11-15), price (21), checkmarks (29)
  - `components/sections/SectionPricing.vue:14` — Highlighted plan class. Replace `ring-2 ring-primary-500` with `glow-gold`

  **Acceptance Criteria**:
  - [x] `<section>` uses gradient background
  - [x] Highlighted plan has gold glow (not ring)
  - [x] Price values have subtle text glow
  - [x] Non-highlighted cards have hover-lift
  - [x] `npm run build` succeeds

  **QA Scenarios:**

  ```
  Scenario: Pricing section has premium styling
    Tool: Bash (grep)
    Preconditions: SectionPricing.vue modified
    Steps:
      1. Run: grep 'gradient-section' components/sections/SectionPricing.vue
      2. Run: grep 'glow-gold' components/sections/SectionPricing.vue
      3. Run: grep 'text-glow' components/sections/SectionPricing.vue
      4. Run: grep 'hover-lift' components/sections/SectionPricing.vue
    Expected Result: All greps return matches
    Evidence: .sisyphus/evidence/task-11-pricing-grep.txt
  ```

  **Commit**: YES (groups with Wave 2 tasks)
  - Message: `feat(sections): premium dark theme upgrade for all section components`

---

- [x] 12. SectionFaq + SectionLogos + SectionContact Premium Upgrade

  **What to do**:
  - This task bundles 3 smaller section components into one:

  **SectionFaq** (`components/sections/SectionFaq.vue`):
    - Add `gradient-section` to `<section>` (line 2)
    - Add `text-glow` to `<h2>` (line 5)
    - Each FAQ item container: replace `border border-white/10` with `border border-primary-500/10` and add `bg-white/[0.02]`
    - Active/open item: add `bg-white/[0.04] border-primary-500/20` conditional class when `openIndex === i`
    - Question text: on hover, add `text-primary-500` transition
    - Chevron icon: change `text-gray-400` to `text-primary-500/60`

  **SectionLogos** (`components/sections/SectionLogos.vue`):
    - Add subtle gradient to `<section>`: `gradient-section-alt`
    - Logo images: add `hover:drop-shadow-[0_0_8px_rgba(212,168,83,0.3)]` for gold glow on hover
    - Keep existing grayscale-to-color hover effect
    - Title: add `text-glow-subtle`

  **SectionContact** (`components/sections/SectionContact.vue`):
    - Add `gradient-section` to `<section>` (line 2)
    - Add `text-glow` to `<h2>` (line 7)
    - Contact info items: add gold icon glow: `drop-shadow-[0_0_6px_rgba(212,168,83,0.3)]` on `<UiIcon>` elements
    - Email/phone links: add `hover:text-shadow-[0_0_8px_rgba(212,168,83,0.2)]` on hover (or via CSS)
    - Form area: the `IntegrationsContactForm` is in tempo-core, so just wrap it in a glass container div: `<div class="glass-card p-6">` around the form

  **Must NOT do**:
  - Do NOT modify any interfaces (FaqItem, LogoItem)
  - Do NOT change FAQ toggle logic or schema.org structured data
  - Do NOT modify IntegrationsContactForm (it's in tempo-core)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 3 small visual upgrades bundled together
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 13, 14, 15, 16)
  - **Blocks**: None directly
  - **Blocked By**: Tasks 1, 3 (CSS tokens + Button upgrade)

  **References**:

  **Pattern References**:
  - `components/sections/SectionFaq.vue:1-79` — Full FAQ component. Key: section class (2), heading (5), item container (11-15), button (16-17), open state check (25-26 `openIndex === i`)
  - `components/sections/SectionLogos.vue:1-36` — Full Logos component. Key: section (2), img (8-17 with hover classes)
  - `components/sections/SectionContact.vue:1-52` — Full Contact component. Key: section (2), heading (7), icons (13, 19, 25), CalEmbed (31), ContactForm (35)

  **WHY Each Reference Matters**:
  - These 3 components are simple enough to bundle but each has unique structure
  - FAQ's open state needs conditional glass class — check `openIndex === i` pattern at line 25-26
  - Contact embeds Cal.com — wrapping ContactForm in glass-card improves visual consistency

  **Acceptance Criteria**:
  - [x] All 3 components have gradient backgrounds
  - [x] FAQ active item has visual distinction
  - [x] Logo hover has gold drop-shadow
  - [x] Contact form wrapped in glass container
  - [x] `npm run build` succeeds

  **QA Scenarios:**

  ```
  Scenario: All three sections have premium styling
    Tool: Bash (grep)
    Steps:
      1. Run: grep 'gradient-section' components/sections/SectionFaq.vue
      2. Run: grep 'gradient-section' components/sections/SectionLogos.vue
      3. Run: grep 'gradient-section' components/sections/SectionContact.vue
      4. Run: grep 'glass-card' components/sections/SectionContact.vue
      5. Run: grep 'drop-shadow' components/sections/SectionLogos.vue
    Expected Result: All greps return matches
    Evidence: .sisyphus/evidence/task-12-trio-grep.txt

  Scenario: Build succeeds
    Tool: Bash
    Steps:
      1. Run: npm run build
    Expected Result: Exit code 0
    Evidence: .sisyphus/evidence/task-12-build.txt
  ```

  **Commit**: YES
  - Message: `feat(sections): premium upgrade for FAQ, Logos, and Contact sections`
  - Files: `components/sections/SectionFaq.vue`, `components/sections/SectionLogos.vue`, `components/sections/SectionContact.vue`
  - Pre-commit: `npm run build`

---

- [x] 13. SectionStripePricing Minimal Dark Alignment

  **What to do**:
  - Open `components/sections/SectionStripePricing.vue` and make minimal dark theme alignment:
    - Add `gradient-section-alt` to `<section>` (line 2)
    - Add `text-glow` to `<h2>` (line 4)
    - The Stripe pricing table itself is an iframe — we CANNOT style its internals
    - Wrap the `<stripe-pricing-table>` in a glass container: `<div class="glass-card p-4">` around each table div
    - Add `text-glow-subtle` to the `<h3>` table labels (line 13)
  - This is minimal because Stripe controls the iframe styling

  **Must NOT do**:
  - Do NOT try to style Stripe's iframe content
  - Do NOT remove ClientOnly wrapper
  - Do NOT change useStripeConfig or useHead

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Minimal wrapper changes around an iframe component
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 12, 14, 15, 16)
  - **Blocks**: None
  - **Blocked By**: Task 1 (CSS tokens)

  **References**:

  **Pattern References**:
  - `components/sections/SectionStripePricing.vue:1-44` — Full component. Add gradient to section (2), glow to h2 (4), glass wrapper around stripe-pricing-table (16-19)

  **Acceptance Criteria**:
  - [x] Section has gradient background
  - [x] Stripe table wrapped in glass container
  - [x] `npm run build` succeeds

  **QA Scenarios:**

  ```
  Scenario: StripePricing has dark alignment
    Tool: Bash (grep)
    Steps:
      1. Run: grep 'gradient-section' components/sections/SectionStripePricing.vue
      2. Run: grep 'glass-card' components/sections/SectionStripePricing.vue
    Expected Result: Both greps return matches
    Evidence: .sisyphus/evidence/task-13-stripe-grep.txt
  ```

  **Commit**: YES
  - Message: `feat(sections): dark theme alignment for StripePricing section`
  - Files: `components/sections/SectionStripePricing.vue`
  - Pre-commit: `npm run build`

---

- [x] 14. SectionProjects.vue — NEW Grid Component

  **What to do**:
  - Create `components/sections/SectionProjects.vue` — a new section component for portfolio/project grid:
  - **Props interface**:
    ```ts
    interface ProjectItem {
      title: string
      description: string
      image?: string
      tags?: string[]
      link?: string
    }
    props: {
      title: string
      subtitle?: string
      items: ProjectItem[]
    }
    ```
  - **Template structure**:
    - `<section class="section-padding gradient-section">`
    - Header: `<h2>` with `text-glow`, optional subtitle
    - Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8`
    - Each project card:
      - Wrap in a div (NOT UiCard — custom structure for hover reveal):
        ```
        <div class="group relative overflow-hidden rounded-card glass-card hover-lift cursor-pointer">
          <img v-if="item.image" :src="item.image" class="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
          <div v-else class="w-full h-48 bg-gradient-to-br from-primary-500/20 to-secondary-900" />
          <div class="p-6 space-y-3">
            <h3 class="font-heading text-lg font-semibold text-white text-glow-subtle">{{ item.title }}</h3>
            <p class="text-sm text-gray-400 leading-relaxed line-clamp-3">{{ item.description }}</p>
            <div v-if="item.tags" class="flex flex-wrap gap-2">
              <span v-for="tag" class="text-xs px-2 py-1 rounded-full bg-primary-500/10 text-primary-500 border border-primary-500/20">{{ tag }}</span>
            </div>
          </div>
          <!-- Hover overlay with link -->
          <a v-if="item.link" :href="item.link" class="absolute inset-0" target="_blank" rel="noopener" />
        </div>
        ```
    - If no image, show a gradient placeholder (from-primary-500/20 to-secondary-900)
  - Use glassmorphism, hover-lift, gold tag styling — consistent with all other sections

  **Must NOT do**:
  - Do NOT fetch from a collection — items come from markdown frontmatter
  - Do NOT add a detail/modal view
  - Do NOT add GSAP (entrance animations in Task 20)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: New component from scratch with design emphasis
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 12, 13, 15, 16)
  - **Blocks**: Task 19 (portfolio page needs this component)
  - **Blocked By**: Tasks 1, 2 (CSS tokens + Card patterns for reference)

  **References**:

  **Pattern References**:
  - `components/sections/SectionFeatures.vue:1-42` — Structure reference: section > container > header > grid of items. Follow this EXACT layout pattern
  - `components/sections/SectionPricing.vue:48-57` — Props interface pattern to follow for defining `ProjectItem`
  - `components/ui/Card.vue` — Glassmorphism pattern. But for projects, use inline glass classes instead of UiCard (custom hover behavior needed)

  **API/Type References**:
  - `tempo-core/components/content/PageRenderer.vue:47-52` — `PageSection` interface. Section receives props as flat fields via `getSectionProps`

  **WHY Each Reference Matters**:
  - SectionFeatures shows the canonical section structure: section wrapper > container > header > grid > items
  - PageRenderer's `getSectionProps` means items come as a flat prop from markdown frontmatter

  **Acceptance Criteria**:
  - [x] `components/sections/SectionProjects.vue` exists
  - [x] Component accepts `title`, `subtitle`, `items` props
  - [x] Grid layout: 1/2/3 columns responsive
  - [x] Cards have glassmorphism + hover-lift
  - [x] Tags rendered as gold pills
  - [x] `npm run build` succeeds

  **QA Scenarios:**

  ```
  Scenario: SectionProjects component exists and has correct structure
    Tool: Bash (grep + file check)
    Steps:
      1. Run: test -f components/sections/SectionProjects.vue && echo "EXISTS"
      2. Run: grep 'gradient-section' components/sections/SectionProjects.vue
      3. Run: grep 'glass-card' components/sections/SectionProjects.vue
      4. Run: grep 'hover-lift' components/sections/SectionProjects.vue
      5. Run: grep 'ProjectItem' components/sections/SectionProjects.vue
      6. Run: grep 'grid-cols-3' components/sections/SectionProjects.vue
    Expected Result: File exists, all greps match
    Evidence: .sisyphus/evidence/task-14-projects-grep.txt

  Scenario: Build succeeds with new component
    Tool: Bash
    Steps:
      1. Run: npm run build
    Expected Result: Exit code 0
    Evidence: .sisyphus/evidence/task-14-build.txt
  ```

  **Commit**: YES
  - Message: `feat(sections): create SectionProjects grid component for portfolio pages`
  - Files: `components/sections/SectionProjects.vue`
  - Pre-commit: `npm run build`

---

- [x] 15. SectionBooking.vue — NEW Cal.com Wrapper

  **What to do**:
  - Create `components/sections/SectionBooking.vue` — a new section component that wraps Cal.com embed:
  - **Props interface**:
    ```ts
    props: {
      title: string
      subtitle?: string
      theme?: 'light' | 'dark' | 'auto'
    }
    ```
  - **Template structure**:
    ```html
    <section class="section-padding gradient-section">
      <div class="container-page">
        <div class="text-center mb-12 md:mb-16">
          <h2 class="text-hero text-white text-glow">{{ title }}</h2>
          <p v-if="subtitle" class="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">{{ subtitle }}</p>
        </div>
        <div class="glass-card p-6 md:p-8 max-w-3xl mx-auto">
          <IntegrationsCalEmbed :theme="theme" />
        </div>
      </div>
    </section>
    ```
  - The `IntegrationsCalEmbed` component from tempo-core reads `calcom.username` from config (set in Task 4)
  - Pass `theme` prop (default 'dark') to match dark premium aesthetic
  - Wrap embed in glass-card for visual consistency

  **Must NOT do**:
  - Do NOT duplicate Cal.com script loading (CalEmbed handles it)
  - Do NOT hardcode the username (it comes from app.config.ts)
  - Do NOT add form fallback

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: New component with focus on visual wrapping of an embed
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 12, 13, 14, 16)
  - **Blocks**: Task 18 (booking page needs this component)
  - **Blocked By**: Tasks 1, 4 (CSS tokens + Cal.com config)

  **References**:

  **Pattern References**:
  - `components/sections/SectionContact.vue:30-31` — Shows how CalEmbed is used: `<IntegrationsCalEmbed v-if="calcom.username" class="mt-8" />`
  - `tempo-core/components/integrations/CalEmbed.vue:1-67` — Full CalEmbed component. Accepts `username`, `eventSlug`, `theme` props. Reads config via `useClientConfig()`
  - `components/sections/SectionHero.vue` — Header pattern to follow (h2 + subtitle + container)

  **WHY Each Reference Matters**:
  - SectionContact shows CalEmbed usage pattern — but SectionBooking is a full-page dedicated embed, not a sidebar
  - CalEmbed source shows it auto-resolves username from config, so we just pass theme

  **Acceptance Criteria**:
  - [x] `components/sections/SectionBooking.vue` exists
  - [x] Component uses `IntegrationsCalEmbed`
  - [x] Wrapped in glass-card container
  - [x] Default theme is 'dark'
  - [x] `npm run build` succeeds

  **QA Scenarios:**

  ```
  Scenario: SectionBooking component exists and is properly structured
    Tool: Bash (grep + file check)
    Steps:
      1. Run: test -f components/sections/SectionBooking.vue && echo "EXISTS"
      2. Run: grep 'IntegrationsCalEmbed' components/sections/SectionBooking.vue
      3. Run: grep 'glass-card' components/sections/SectionBooking.vue
      4. Run: grep 'gradient-section' components/sections/SectionBooking.vue
      5. Run: grep 'dark' components/sections/SectionBooking.vue
    Expected Result: File exists, all greps match
    Evidence: .sisyphus/evidence/task-15-booking-grep.txt

  Scenario: Build succeeds
    Tool: Bash
    Steps:
      1. Run: npm run build
    Expected Result: Exit code 0
    Evidence: .sisyphus/evidence/task-15-build.txt
  ```

  **Commit**: YES
  - Message: `feat(sections): create SectionBooking Cal.com embed wrapper`
  - Files: `components/sections/SectionBooking.vue`
  - Pre-commit: `npm run build`

---

- [x] 16. Header + Footer Premium Upgrade

  **What to do**:
  - **Header** (`components/layout/Header.vue`):
    - Enhance the `<header>` glassmorphism: replace `bg-secondary-950/70 backdrop-blur-md` with `bg-secondary-950/80 backdrop-blur-xl border-b border-primary-500/10`
    - Brand name: add `text-glow-subtle` to the `<span>` at line 14
    - CTA button in header (line 23): already uses UiButton which gets gold glow from Task 3. No changes needed
    - Mobile menu: replace `bg-secondary-950/95` with `bg-secondary-950/98 backdrop-blur-xl`
    - Mobile nav links: add `hover:pl-6` transition for a slide-in effect on hover

  - **Footer** (`components/layout/Footer.vue`):
    - Replace plain `bg-secondary-950` with `gradient-section-alt border-t border-primary-500/10`
    - Brand name `<span>`: add `text-glow-subtle`
    - Section headings (Contact, Social): add `text-primary-500/80` instead of plain `text-white`
    - Links: add `hover:text-glow-subtle` (via CSS class or inline)
    - Bottom bar: add `text-gray-500` (slightly brighter than current `text-gray-600`) and border color to `border-primary-500/10`
    - Add a subtle top glow line: the `border-t` is already there, just change `border-white/10` to `border-primary-500/15`

  **Must NOT do**:
  - Do NOT change navigation logic or dynamic nav query
  - Do NOT modify mobile menu open/close behavior
  - Do NOT add new elements to footer (just restyle existing)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Layout components with consistent brand application
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 12, 13, 14, 15)
  - **Blocks**: None (header/footer render on all pages)
  - **Blocked By**: Task 1 (CSS tokens)

  **References**:

  **Pattern References**:
  - `components/layout/Header.vue:1-151` — Full Header. Key lines: header tag (2), brand span (14), CTA button (23), mobile overlay (38)
  - `components/layout/Footer.vue:1-76` — Full Footer. Key lines: footer tag (2), brand span (7), section headings (17, 39), bottom bar (61)

  **WHY Each Reference Matters**:
  - Header line 2 is the only glassmorphism change needed — enhance existing blur
  - Footer line 2 needs gradient + gold border to match section styling

  **Acceptance Criteria**:
  - [x] Header has enhanced glassmorphism (`backdrop-blur-xl` + gold border)
  - [x] Footer uses gradient background
  - [x] Brand names have text glow
  - [x] `npm run build` succeeds

  **QA Scenarios:**

  ```
  Scenario: Header and Footer have premium styling
    Tool: Bash (grep)
    Steps:
      1. Run: grep 'backdrop-blur-xl' components/layout/Header.vue
      2. Run: grep 'primary-500' components/layout/Header.vue
      3. Run: grep 'gradient-section' components/layout/Footer.vue
      4. Run: grep 'text-glow' components/layout/Footer.vue
    Expected Result: All greps return matches
    Evidence: .sisyphus/evidence/task-16-layout-grep.txt

  Scenario: Build succeeds
    Tool: Bash
    Steps:
      1. Run: npm run build
    Expected Result: Exit code 0
    Evidence: .sisyphus/evidence/task-16-build.txt
  ```

  **Commit**: YES
  - Message: `feat(layout): premium dark theme upgrade for Header and Footer`
  - Files: `components/layout/Header.vue`, `components/layout/Footer.vue`
  - Pre-commit: `npm run build`

---

- [x] 17. Services Page Redesign FR + EN

  **What to do**:
  - Redesign both `content/fr/pages/services.md` and `content/en/pages/services.md` with premium section types:
  - **FR (`content/fr/pages/services.md`)** — replace current content with:
    ```yaml
    ---
    title: Services
    description: Découvrez nos services de création web sur-mesure
    navLabel: Services
    order: 1
    showInNav: true
    sections:
      - type: hero
        title: Nos services
        subtitle: Des solutions digitales sur-mesure pour propulser votre activité
        ctaText: Prendre rendez-vous
        ctaLink: /rendez-vous
      - type: features
        title: Ce que nous proposons
        subtitle: De la conception à la mise en production, nous couvrons tous vos besoins
        items:
          - icon: globe
            title: Sites vitrine
            description: Un site professionnel pour présenter votre activité et attirer de nouveaux clients. Design sur-mesure, responsive et optimisé SEO.
          - icon: shopping-cart
            title: Sites e-commerce
            description: Vendez vos produits en ligne avec une boutique performante et sécurisée. Intégration Stripe, gestion des stocks et tableau de bord.
          - icon: code
            title: Applications web
            description: Des outils sur-mesure pour digitaliser vos processus métier. Tableaux de bord, automatisations et intégrations API.
          - icon: rocket
            title: Landing pages
            description: Des pages d'atterrissage optimisées pour la conversion. A/B testing, analytics et suivi des performances.
          - icon: palette
            title: Identité visuelle
            description: Charte graphique complète, logo, typographie et palette de couleurs pour une image de marque cohérente.
          - icon: server
            title: Hébergement & maintenance
            description: Hébergement sécurisé, mises à jour régulières et support technique pour garder votre site au top.
        animation:
          name: stagger
      - type: stats
        items:
          - value: "50+"
            label: Projets livrés
          - value: "100%"
            label: Clients satisfaits
          - value: "24/7"
            label: Support technique
          - value: "5 ans"
            label: D'expérience
        animation:
          name: fadeUp
      - type: stripe-pricing
        title: Nos offres
        subtitle: Choisissez la formule adaptée à votre projet
        tables:
          - pricingTableId: prctbl_1Szf80CuCsLyVwsnL07sI8KS
          - pricingTableId: prctbl_1Szf5dCuCsLyVwsnfYPVzqKg
      - type: cta
        title: Un projet en tête ?
        subtitle: Discutons-en autour d'un café virtuel, c'est gratuit.
        ctaText: Prendre rendez-vous
        ctaLink: /rendez-vous
        secondaryCtaText: Nous contacter
        secondaryCtaLink: /contact
    ---
    ```
  - **EN (`content/en/pages/services.md`)** — mirror the FR structure with English text:
    - Same section types and structure
    - Translate all text to English
    - Keep SAME pricingTableId values (Stripe tables are language-agnostic)
    - Use `/booking` for CTA links (EN version of rendez-vous)
  - Add `animation` blocks to features and stats sections to enable scroll animations
  - Keep `stripe-pricing` section (it was in FR but missing from EN — fix the parity issue)

  **Must NOT do**:
  - Do NOT change the pricingTableId values
  - Do NOT add sections that don't have corresponding components
  - Do NOT remove `showInNav: true`

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Content creation + markdown structure requiring attention to i18n parity
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 18, 19)
  - **Blocks**: Task 20 (entrance animations need content to animate)
  - **Blocked By**: Tasks 6, 7, 8, 10 (section components must be upgraded before pages look right)

  **References**:

  **Pattern References**:
  - `content/fr/pages/services.md:1-36` — Current FR services page. REDESIGN, keep same file path
  - `content/en/pages/services.md:1-27` — Current EN services page. NOTE: Missing `stripe-pricing` section (parity issue to fix)

  **API/Type References**:
  - `tempo-core/components/content/PageRenderer.vue:41-52` — PageSection interface. Each section in YAML becomes a prop object
  - `tempo-core/config/animations.ts:1-73` — Available animation names for `animation` blocks: fadeUp, stagger, scaleIn, etc.

  **WHY Each Reference Matters**:
  - Current services files show exact YAML structure expected by PageRenderer
  - animations.ts shows valid `name` values for the `animation` block

  **Acceptance Criteria**:
  - [x] FR services.md has: hero + features (6 items) + stats + stripe-pricing + cta
  - [x] EN services.md has: identical structure with English text
  - [x] Both have `animation` blocks on features and stats
  - [x] EN has `stripe-pricing` section (parity fix)
  - [x] `npm run build` succeeds

  **QA Scenarios:**

  ```
  Scenario: FR and EN services pages have matching structure
    Tool: Bash (grep)
    Steps:
      1. Run: grep -c 'type:' content/fr/pages/services.md
      2. Run: grep -c 'type:' content/en/pages/services.md
      3. Run: grep 'stripe-pricing' content/en/pages/services.md
      4. Run: grep 'animation' content/fr/pages/services.md
    Expected Result: Same section count in both files; stripe-pricing present in EN; animation blocks present
    Failure Indicators: Section count mismatch; missing stripe-pricing in EN
    Evidence: .sisyphus/evidence/task-17-services-grep.txt

  Scenario: Build succeeds with new content
    Tool: Bash
    Steps:
      1. Run: npm run build
    Expected Result: Exit code 0
    Evidence: .sisyphus/evidence/task-17-build.txt
  ```

  **Commit**: YES
  - Message: `feat(content): redesign services page with premium sections and EN parity`
  - Files: `content/fr/pages/services.md`, `content/en/pages/services.md`
  - Pre-commit: `npm run build`

---

- [x] 18. Booking Page FR + EN

  **What to do**:
  - Create `content/fr/pages/rendez-vous.md`:
    ```yaml
    ---
    title: Rendez-vous
    description: Réservez un créneau pour discuter de votre projet
    navLabel: Rendez-vous
    order: 3
    showInNav: true
    sections:
      - type: hero
        title: Prenez rendez-vous
        subtitle: Réservez un créneau gratuit de 30 minutes pour discuter de votre projet
      - type: booking
        title: Choisissez un créneau
        subtitle: Tous les créneaux sont en heure de Paris (CET)
        theme: dark
      - type: cta
        title: Vous préférez nous écrire ?
        subtitle: Pas de problème, envoyez-nous un message.
        ctaText: Formulaire de contact
        ctaLink: /contact
    ---
    ```
  - Create `content/en/pages/booking.md`:
    ```yaml
    ---
    title: Booking
    description: Book a slot to discuss your project
    navLabel: Booking
    order: 3
    showInNav: true
    sections:
      - type: hero
        title: Book a meeting
        subtitle: Reserve a free 30-minute slot to discuss your project
      - type: booking
        title: Choose a time slot
        subtitle: All times are in Paris time (CET)
        theme: dark
      - type: cta
        title: Prefer to write?
        subtitle: No problem, send us a message.
        ctaText: Contact form
        ctaLink: /contact
    ---
    ```
  - Both pages use the `booking` section type (created in Task 15, registered in Task 5)
  - Order 3 places them after Services (1) and A propos (2) in nav

  **Must NOT do**:
  - Do NOT hardcode Cal.com URL in markdown (component reads from config)
  - Do NOT add testimonials or extra sections (keep booking page focused)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Creating two simple markdown files with known structure
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 17, 19)
  - **Blocks**: Task 20 (entrance animations)
  - **Blocked By**: Task 15 (SectionBooking component must exist)

  **References**:

  **Pattern References**:
  - `content/fr/pages/services.md:1-8` — Frontmatter structure to follow: title, description, navLabel, order, showInNav, sections
  - `content/fr/pages/a-propos.md` — Another page example for structure reference

  **API/Type References**:
  - `tempo-core/components/content/PageRenderer.vue:47-52` — PageSection interface. The `booking` type maps to SectionBooking component

  **WHY Each Reference Matters**:
  - services.md shows exact frontmatter keys needed for PageRenderer and navigation
  - PageSection shows that props are passed as flat YAML keys under each section

  **Acceptance Criteria**:
  - [x] `content/fr/pages/rendez-vous.md` exists with hero + booking + cta sections
  - [x] `content/en/pages/booking.md` exists with matching structure
  - [x] Both have `showInNav: true`
  - [x] `npm run build` succeeds

  **QA Scenarios:**

  ```
  Scenario: Booking pages exist with correct sections
    Tool: Bash
    Steps:
      1. Run: test -f content/fr/pages/rendez-vous.md && echo "FR EXISTS"
      2. Run: test -f content/en/pages/booking.md && echo "EN EXISTS"
      3. Run: grep 'type: booking' content/fr/pages/rendez-vous.md
      4. Run: grep 'type: booking' content/en/pages/booking.md
      5. Run: grep 'showInNav: true' content/fr/pages/rendez-vous.md
    Expected Result: Both files exist, both have booking section type, nav enabled
    Failure Indicators: Missing files or missing booking section
    Evidence: .sisyphus/evidence/task-18-booking-pages.txt

  Scenario: Build succeeds
    Tool: Bash
    Steps:
      1. Run: npm run build
    Expected Result: Exit code 0
    Evidence: .sisyphus/evidence/task-18-build.txt
  ```

  **Commit**: YES
  - Message: `feat(content): create booking pages with Cal.com embed (FR + EN)`
  - Files: `content/fr/pages/rendez-vous.md`, `content/en/pages/booking.md`
  - Pre-commit: `npm run build`

---

- [x] 19. Portfolio Page FR + EN

  **What to do**:
  - Create `content/fr/pages/projets.md`:
    ```yaml
    ---
    title: Projets
    description: Découvrez nos réalisations et projets clients
    navLabel: Projets
    order: 2
    showInNav: true
    sections:
      - type: hero
        title: Nos réalisations
        subtitle: Découvrez une sélection de projets qui illustrent notre expertise
      - type: projects
        title: Portfolio
        subtitle: Chaque projet est unique, comme votre vision
        items:
          - title: E-commerce Mode
            description: Boutique en ligne complète avec gestion des stocks, paiement Stripe et tableau de bord vendeur. Design premium adapté mobile.
            tags: ["E-commerce", "Stripe", "Nuxt 3"]
            image: /images/projects/ecommerce-preview.jpg
          - title: Dashboard Analytics
            description: Tableau de bord temps réel pour le suivi des KPI métier. Graphiques interactifs, exports PDF et alertes automatisées.
            tags: ["Dashboard", "Vue.js", "API REST"]
            image: /images/projects/dashboard-preview.jpg
          - title: Site Vitrine Restaurant
            description: Site élégant pour un restaurant étoilé. Réservation en ligne, menu dynamique et galerie photo immersive.
            tags: ["Vitrine", "Réservation", "Design"]
            image: /images/projects/restaurant-preview.jpg
          - title: Application SaaS B2B
            description: Plateforme de gestion de projet pour équipes distribuées. Temps réel, intégrations Slack/GitHub et facturation automatisée.
            tags: ["SaaS", "B2B", "Node.js"]
            image: /images/projects/saas-preview.jpg
          - title: Landing Page Startup
            description: Page d'atterrissage haute conversion pour une startup fintech. A/B testing intégré, analytics et capture de leads.
            tags: ["Landing", "Conversion", "Fintech"]
            image: /images/projects/landing-preview.jpg
          - title: Blog Tech
            description: Blog technique avec CMS headless, markdown, recherche full-text et newsletter intégrée. Optimisé SEO et performances.
            tags: ["Blog", "CMS", "SEO"]
            image: /images/projects/blog-preview.jpg
        animation:
          name: stagger
      - type: cta
        title: Votre projet est le prochain ?
        subtitle: Parlons de votre vision et transformons-la en réalité.
        ctaText: Démarrer un projet
        ctaLink: /rendez-vous
        secondaryCtaText: Voir nos services
        secondaryCtaLink: /services
    ---
    ```
  - Create `content/en/pages/projects.md` — mirror with English text:
    - Same structure, translate titles/descriptions/subtitles
    - Same tags (keep in English since they're technical terms)
    - Same image paths
    - CTA links: `/booking` and `/services`
  - **Note about images**: The `image` paths reference `/images/projects/*.jpg`. These images may not exist yet. The SectionProjects component (Task 14) has a gradient placeholder fallback when `item.image` is falsy or the image 404s. The agent should NOT worry about creating image files — the gradient fallback will display instead.

  **Must NOT do**:
  - Do NOT create actual image files (gradient placeholder handles missing images)
  - Do NOT use collection queries (data is inline in frontmatter)
  - Do NOT add more than 6 project items (keeps the grid balanced at 3×2)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Creating two markdown files with inline data
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 17, 18)
  - **Blocks**: Task 20 (entrance animations)
  - **Blocked By**: Task 14 (SectionProjects component must exist)

  **References**:

  **Pattern References**:
  - `content/fr/pages/services.md` — Frontmatter structure reference
  - Task 14 specification — `ProjectItem` interface: `{ title, description, image?, tags?, link? }`

  **WHY Each Reference Matters**:
  - Services.md shows the YAML structure that PageRenderer expects
  - ProjectItem interface defines what fields are valid in the `items` array

  **Acceptance Criteria**:
  - [x] `content/fr/pages/projets.md` exists with hero + projects (6 items) + cta
  - [x] `content/en/pages/projects.md` exists with matching structure
  - [x] Both have `showInNav: true` and `order: 2`
  - [x] Projects section has 6 items with title, description, tags
  - [x] `npm run build` succeeds

  **QA Scenarios:**

  ```
  Scenario: Portfolio pages exist with correct structure
    Tool: Bash
    Steps:
      1. Run: test -f content/fr/pages/projets.md && echo "FR EXISTS"
      2. Run: test -f content/en/pages/projects.md && echo "EN EXISTS"
      3. Run: grep -c 'title:' content/fr/pages/projets.md
      4. Run: grep 'type: projects' content/fr/pages/projets.md
      5. Run: grep 'type: projects' content/en/pages/projects.md
      6. Run: grep 'stagger' content/fr/pages/projets.md
    Expected Result: Both files exist; 6+ title entries; projects section type; stagger animation
    Failure Indicators: Missing files or wrong section type
    Evidence: .sisyphus/evidence/task-19-portfolio-pages.txt

  Scenario: Build succeeds
    Tool: Bash
    Steps:
      1. Run: npm run build
    Expected Result: Exit code 0
    Evidence: .sisyphus/evidence/task-19-build.txt
  ```

  **Commit**: YES
  - Message: `feat(content): create portfolio pages with project grid (FR + EN)`
  - Files: `content/fr/pages/projets.md`, `content/en/pages/projects.md`
  - Pre-commit: `npm run build`

---

- [x] 20. Entrance Animations on All Pages

  **What to do**:
  - Add `animation` blocks to ALL section definitions across ALL content pages to enable scroll-triggered entrance animations:
  - **Animation assignment strategy** (use existing animations from `tempo-core/config/animations.ts`):
    - `hero` sections: `fadeUp` (dramatic entrance)
    - `features` sections: `stagger` (items appear one by one)
    - `stats` sections: `fadeUp`
    - `pricing` / `stripe-pricing` sections: `scaleIn`
    - `testimonials` sections: `stagger`
    - `projects` sections: `stagger`
    - `faq` sections: `fadeUp`
    - `cta` sections: `fadeUp` with `delay: 0.2`
    - `booking` sections: `fadeUp`
    - `contact` sections: `fadeUp`
    - `logos` sections: `fadeUp`
  - Update ALL markdown files that have sections:
    - `content/fr/pages/services.md` (already has animations from Task 17 — verify)
    - `content/en/pages/services.md`
    - `content/fr/pages/rendez-vous.md`
    - `content/en/pages/booking.md`
    - `content/fr/pages/projets.md` (already has animation from Task 19 — verify)
    - `content/en/pages/projects.md`
    - `content/fr/pages/a-propos.md` (if it has sections)
    - `content/en/pages/about.md` (if it has sections)
  - The `AnimateOnScroll` wrapper in PageRenderer (lines 4-9) already checks for `section.animation` and applies it via GSAP ScrollTrigger. No code changes needed — just add animation blocks to YAML.

  **Must NOT do**:
  - Do NOT create new animation types (use existing 9 from config/animations.ts)
  - Do NOT add scroll-driven/scrub animations (one-shot only)
  - Do NOT modify PageRenderer or AnimateOnScroll components
  - Do NOT add `animation` to `hero` sections at top of page (they're above the fold, animation adds no value)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Animation assignment requires visual design sense for appropriate timing/type per section
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (after Wave 4 content tasks)
  - **Blocks**: F1-F3 (final verification)
  - **Blocked By**: Tasks 17, 18, 19 (all content pages must exist first)

  **References**:

  **Pattern References**:
  - `tempo-core/config/animations.ts:1-73` — All 9 animation definitions. Use `name` values: fadeUp, fadeDown, fadeLeft, fadeRight, scaleIn, stagger, clipReveal, textReveal, parallax
  - `tempo-core/components/content/PageRenderer.vue:3-14` — AnimateOnScroll wrapper. Checks `section.animation && hasAnimations`. YAML structure: `animation: { name: fadeUp, delay: 0.2 }`

  **WHY Each Reference Matters**:
  - animations.ts defines exact `name` values — misspelling means no animation
  - PageRenderer shows the YAML format expected: `animation.name`, `animation.delay`, `animation.stagger`

  **Acceptance Criteria**:
  - [x] ALL section definitions (except top-of-page hero) have `animation` blocks
  - [x] Only animation names from config/animations.ts are used
  - [x] `npm run build` succeeds

  **QA Scenarios:**

  ```
  Scenario: All content pages have animation blocks
    Tool: Bash (grep)
    Steps:
      1. Run: grep -c 'animation:' content/fr/pages/services.md
      2. Run: grep -c 'animation:' content/en/pages/services.md
      3. Run: grep -c 'animation:' content/fr/pages/rendez-vous.md
      4. Run: grep -c 'animation:' content/en/pages/booking.md
      5. Run: grep -c 'animation:' content/fr/pages/projets.md
      6. Run: grep -c 'animation:' content/en/pages/projects.md
    Expected Result: Each file returns ≥ 2 (at least 2 animated sections per page, excluding hero)
    Failure Indicators: Any file returns 0
    Evidence: .sisyphus/evidence/task-20-animations-grep.txt

  Scenario: Build succeeds
    Tool: Bash
    Steps:
      1. Run: npm run build
    Expected Result: Exit code 0
    Evidence: .sisyphus/evidence/task-20-build.txt
  ```

  **Commit**: YES
  - Message: `feat(content): add scroll entrance animations to all page sections`
  - Files: `content/fr/pages/*.md`, `content/en/pages/*.md`
  - Pre-commit: `npm run build`

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 3 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [x] F1. **Visual QA — Playwright Screenshots All Pages × 3 Viewports**

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `['playwright']`

  **What to do**:
  - Start the dev server: `npm run dev`
  - Use Playwright to navigate to EVERY page at 3 viewports (375px, 768px, 1440px) and take screenshots:
    - Homepage: `/` (verify parallax still works)
    - Services FR: `/fr/pages/services`
    - Services EN: `/en/pages/services`
    - Booking FR: `/fr/pages/rendez-vous`
    - Booking EN: `/en/pages/booking`
    - Portfolio FR: `/fr/pages/projets`
    - Portfolio EN: `/en/pages/projects`
    - About FR: `/fr/pages/a-propos`
    - About EN: `/en/pages/about`
    - Contact: `/contact`
  - For each page:
    1. Navigate to URL
    2. Wait for network idle
    3. Scroll through entire page to trigger lazy content
    4. Take full-page screenshot
    5. Verify: glassmorphism visible (backdrop-blur on cards), gold glow on headings, gradient backgrounds (NOT flat colors)
  - Specific checks:
    - Services page: verify 6 feature cards render with icons
    - Booking page: verify Cal.com embed container exists (may not load without real API key)
    - Portfolio page: verify 6 project cards in grid with tags
    - Header: verify gold border and enhanced blur
    - Footer: verify gradient background
  - Save all screenshots to `.sisyphus/evidence/final-qa/`

  **Acceptance Criteria**:
  - [x] Screenshots captured for ALL pages at ALL 3 viewports
  - [x] No pages show flat/unstyled sections (bg-muted without gradient)
  - [x] Glassmorphism visible on card elements
  - [x] Gold glow visible on headings
  - [x] Navigation includes Services, Projets/Projects, Rendez-vous/Booking links

  **Output**: `Pages [N/N rendered] | Viewports [3/3] | Visual Consistency [PASS/FAIL] | VERDICT: APPROVE/REJECT`

---

- [x] F2. **Build + Test + Navigation Audit**

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `[]`

  **What to do**:
  1. Run `npm run build` — must succeed (exit 0)
  2. Run `npx vitest run --reporter=verbose` — must pass all existing tests (≥31)
  3. Run `npx nuxi typecheck` (if available) — no new TypeScript errors
  4. Check for common issues:
     - `grep -r 'console.log' components/sections/ components/ui/ components/layout/ --include='*.vue'` — should return 0 hits
     - `grep -r 'as any' components/sections/ components/ui/ components/layout/ --include='*.vue'` — should return 0 hits
     - `grep -r '@ts-ignore' components/sections/ components/ui/ components/layout/ --include='*.vue'` — should return 0 hits
  5. Verify navigation works:
     - Check that Header.vue dynamic nav query still works (query pages with `showInNav: true`)
     - Verify nav includes: Services, Projets/Projects, Rendez-vous/Booking, Contact

  **Acceptance Criteria**:
  - [x] Build succeeds (exit 0)
  - [x] All tests pass (≥31)
  - [x] No console.log, as any, or @ts-ignore in changed files
  - [x] No new TypeScript errors

  **Output**: `Build [PASS/FAIL] | Tests [N pass/N fail] | TypeCheck [PASS/FAIL] | Code Quality [CLEAN/N issues] | VERDICT`

---

- [x] F3. **Content Parity FR/EN Check**

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **What to do**:
  1. For each page pair, verify section count matches:
     - `grep -c 'type:' content/fr/pages/services.md` vs `grep -c 'type:' content/en/pages/services.md`
     - `grep -c 'type:' content/fr/pages/rendez-vous.md` vs `grep -c 'type:' content/en/pages/booking.md`
     - `grep -c 'type:' content/fr/pages/projets.md` vs `grep -c 'type:' content/en/pages/projects.md`
  2. Verify section TYPES match (not just count):
     - `grep 'type:' content/fr/pages/services.md` vs `grep 'type:' content/en/pages/services.md` — same types in same order
  3. Verify animation blocks match:
     - `grep -c 'animation:' content/fr/pages/services.md` vs EN equivalent
  4. Verify `showInNav: true` on ALL page files
  5. Verify `order:` values are consistent between FR and EN

  **Acceptance Criteria**:
  - [x] All FR/EN page pairs have identical section types and counts
  - [x] All FR/EN page pairs have identical animation blocks
  - [x] All pages have `showInNav: true`
  - [x] No section type in FR missing from EN or vice versa

  **Output**: `Pairs [N/N matched] | Sections [N/N parity] | Animations [N/N parity] | VERDICT`

---

## Commit Strategy

| Wave | Commit Message | Files |
|------|---------------|-------|
| 1a | `feat(theme): add dark premium design token utilities` | `assets/css/theme.css` |
| 1b | `feat(ui): upgrade Card and Button with glassmorphism and glow effects` | `components/ui/Card.vue`, `components/ui/Button.vue` |
| 1c | `feat(config): configure Cal.com username for booking integration` | `app.config.ts` |
| 1d | `feat(core): register projects and booking section types in PageRenderer` | `tempo-core/components/content/PageRenderer.vue` |
| 2 | `feat(sections): premium dark theme upgrade for all section components` | `components/sections/SectionHero.vue`, `SectionFeatures.vue`, `SectionCta.vue`, `SectionTestimonials.vue`, `SectionStats.vue`, `SectionPricing.vue` |
| 3a | `feat(sections): premium upgrade for FAQ, Logos, and Contact sections` | `components/sections/SectionFaq.vue`, `SectionLogos.vue`, `SectionContact.vue` |
| 3b | `feat(sections): dark theme alignment for StripePricing section` | `components/sections/SectionStripePricing.vue` |
| 3c | `feat(sections): create SectionProjects grid component for portfolio pages` | `components/sections/SectionProjects.vue` |
| 3d | `feat(sections): create SectionBooking Cal.com embed wrapper` | `components/sections/SectionBooking.vue` |
| 3e | `feat(layout): premium dark theme upgrade for Header and Footer` | `components/layout/Header.vue`, `components/layout/Footer.vue` |
| 4a | `feat(content): redesign services page with premium sections and EN parity` | `content/fr/pages/services.md`, `content/en/pages/services.md` |
| 4b | `feat(content): create booking pages with Cal.com embed (FR + EN)` | `content/fr/pages/rendez-vous.md`, `content/en/pages/booking.md` |
| 4c | `feat(content): create portfolio pages with project grid (FR + EN)` | `content/fr/pages/projets.md`, `content/en/pages/projects.md` |
| 4d | `feat(content): add scroll entrance animations to all page sections` | `content/fr/pages/*.md`, `content/en/pages/*.md` |

---

## Success Criteria

### Verification Commands
```bash
npm run build                         # Expected: exit 0
npx vitest run --reporter=verbose     # Expected: ≥31 tests pass
```

### Final Checklist
- [x] `npm run build` succeeds
- [x] All existing tests pass (≥31)
- [x] All 10 section components have gradient backgrounds (no flat bg-muted)
- [x] UiCard has glassmorphism (backdrop-blur + gold border)
- [x] UiButton has gold glow on hover
- [x] Services page: 5 sections (hero, features, stats, stripe-pricing, cta)
- [x] Booking page: 3 sections (hero, booking, cta) with Cal.com embed
- [x] Portfolio page: 3 sections (hero, projects with 6 cards, cta)
- [x] All pages exist in both FR and EN with identical section structure
- [x] Navigation includes all new pages
- [x] Header has enhanced glassmorphism
- [x] Footer has gradient background
- [x] Scroll entrance animations on all sections (except top hero)
- [x] No `console.log`, `as any`, or `@ts-ignore` in changed files
- [x] No SVG art, scanlines, or vignette in section components
