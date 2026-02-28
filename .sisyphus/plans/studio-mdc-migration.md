# Studio MDC Migration — Page Builder for Nuxt Studio

## TL;DR

> **Quick Summary**: Migrate all section-based pages from frontmatter YAML arrays to MDC (Markdown Components) in the body, enabling Nuxt Studio's full page builder UX — drag-and-drop section reordering, `/` command palette for inserting new sections, and live preview.
> 
> **Deliverables**:
> - 12 MDC wrapper components in `components/content/` forwarding to existing section components
> - All 8 content pages migrated from frontmatter sections to MDC body blocks (4 FR + 4 EN)
> - `pages/[...slug].vue` override using `<ContentRenderer>` for MDC body rendering
> - `studio.meta.components.include` configured to whitelist section components
> - `content.config.ts` schema cleaned up (sections field removed)
> - Visual regression verified via Playwright across all pages
> 
> **Estimated Effort**: Medium (15-25h across 4 waves)
> **Parallel Execution**: YES — 4 waves with max 6 concurrent tasks
> **Critical Path**: Prototype (about) → MDC Wrappers → Content Migration → Studio Config + Validation

---

## Context

### Original Request
User wants Nuxt Studio to function as a full page builder — editors should be able to add, remove, and reorder sections visually. Currently sections are YAML frontmatter arrays which only get accordion forms in Studio (no drag-and-drop, no palette, no live preview).

### Interview Summary
**Key Discussions**:
- **Architecture**: Migrate frontmatter YAML sections → MDC components in markdown body
- **Animations**: Each MDC component accepts `animation` prop and self-wraps with AnimateOnScroll
- **Scope**: ALL section-based pages (services, booking, portfolio, about) — FR + EN
- **Backward compat**: None — full migration, remove frontmatter sections support
- **Usage**: For developer (faster page editing) AND future clients (non-tech editors)

**Research Findings**:
- Studio's TipTap editor supports drag-and-drop for top-level MDC blocks ✅
- `/` command palette lists globally registered components from `components/content/` ✅
- `.editor()` annotations DON'T work on MDC component props — only on frontmatter schema fields ❌
- Nested child MDC components (`:::child` inside `::parent`) are NOT draggable ❌
- Named slots are NOT editable in visual editor — code editor only ❌
- v3 broke frontmatter-to-MDC-prop binding — all data must be self-contained in YAML prop blocks
- `ContentDoc` doesn't exist in v3 — must use `ContentRenderer`

### Metis Review
**Identified Gaps** (addressed):
- **MDC format**: Must use Option A (YAML props blocks), NOT nested child components. Confirmed.
- **`.editor()` limitation**: Removed from scope for component props. Only for frontmatter fields.
- **Studio AST round-trip**: Document that editors should use code editor for MDC props.
- **ContentRenderer AST types**: Must handle both `body.type: 'root'` and `body.type: 'minimal'`.
- **scifi-parallax skip**: Homepage uses ParallaxHome directly — no MDC wrapper needed for scifi-parallax.
- **Prototype first**: Migrate `about.md` first to validate the full pipeline before bulk migration.

---

## Work Objectives

### Core Objective
Enable Nuxt Studio as a drag-and-drop page builder by migrating all section-based pages from frontmatter YAML to MDC components in the markdown body.

### Concrete Deliverables
- `components/content/SectionHero.vue` — MDC wrapper for hero section
- `components/content/SectionFeatures.vue` — MDC wrapper for features section
- `components/content/SectionCta.vue` — MDC wrapper for CTA section
- `components/content/SectionStats.vue` — MDC wrapper for stats section
- `components/content/SectionPricing.vue` — MDC wrapper for pricing section
- `components/content/SectionTestimonials.vue` — MDC wrapper for testimonials section
- `components/content/SectionFaq.vue` — MDC wrapper for FAQ section
- `components/content/SectionContact.vue` — MDC wrapper for contact section
- `components/content/SectionLogos.vue` — MDC wrapper for logos section
- `components/content/SectionStripePricing.vue` — MDC wrapper for Stripe pricing section
- `components/content/SectionProjects.vue` — MDC wrapper for projects section
- `components/content/SectionBooking.vue` — MDC wrapper for booking section
- `pages/[...slug].vue` — Hub override using ContentRenderer
- 8 migrated content files (4 FR + 4 EN)
- Updated `content.config.ts` schema
- Updated `nuxt.config.ts` Studio config

### Definition of Done
- [x] `npm run build` succeeds (exit 0)
- [x] All pages render identically to before (visual regression)
- [x] Sections can be reordered via drag-and-drop in Studio
- [x] New sections can be added via `/` command in Studio
- [x] Section props editable via Studio props panel

### Must Have
- MDC wrapper for all 12 section types used in pages
- All 8 content pages migrated to MDC format
- Animation support via `animation` prop on each MDC wrapper
- ContentRenderer in `[...slug].vue`
- Studio component whitelist

### Must NOT Have (Guardrails)
- Do NOT create nested child MDC components (`::: child` inside `::parent`) — Studio can't drag them
- Do NOT use `.editor()` on component props — only works on frontmatter fields
- Do NOT use `:propName="frontmatterKey"` binding — broken in v3
- Do NOT touch `ParallaxHome.vue` or homepage rendering
- Do NOT touch blog pages
- Do NOT touch 404 page
- Do NOT add new npm dependencies
- Do NOT remove the visual section components in `components/sections/` — MDC wrappers import them

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES (vitest)
- **Automated tests**: Tests-after (verify non-regression)
- **Framework**: vitest + Playwright for visual QA
- **Primary verification**: Playwright screenshots before/after migration

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) — Navigate, screenshot, compare
- **Build**: Use Bash — `npm run build` exit 0
- **Content**: Use Bash/Read — verify MDC syntax in .md files

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation — prototype + baseline):
├── Task 1: Baseline screenshots of all pages before migration [quick]
├── Task 2: Create MDC wrapper pattern — prototype with SectionHero [quick]
├── Task 3: Override [slug].vue with ContentRenderer + fallback [quick]
└── Task 4: Prototype migration — about.md (FR only) end-to-end [quick]

Wave 2 (MDC Wrappers — all 12, MAX PARALLEL):
├── Task 5: MDC wrappers batch A — Features, Cta, Stats, Pricing (depends: 2) [quick]
├── Task 6: MDC wrappers batch B — Testimonials, Faq, Contact, Logos (depends: 2) [quick]
└── Task 7: MDC wrappers batch C — StripePricing, Projects, Booking (depends: 2) [quick]

Wave 3 (Content Migration — all pages, PARALLEL):
├── Task 8: Migrate services FR + EN (depends: 5, 7) [quick]
├── Task 9: Migrate booking FR + EN (depends: 7) [quick]
├── Task 10: Migrate portfolio FR + EN (depends: 7) [quick]
├── Task 11: Migrate about EN + verify FR (depends: 4, 5, 6) [quick]
└── Task 12: Schema cleanup + Studio config (depends: 5, 6, 7) [quick]

Wave 4 (Validation — PARALLEL):
├── Task 13: Visual regression — Playwright all pages × 3 viewports (depends: 8-12) [unspecified-high]
├── Task 14: Build + test + code quality audit (depends: 8-12) [unspecified-low]
└── Task 15: Studio editing UX verification (depends: 12, 13) [unspecified-high]

Wave FINAL (After ALL — independent review):
├── F1: Plan compliance audit (oracle)
├── F2: Code quality review (unspecified-high)
└── F3: Visual regression comparison (unspecified-high)

Critical Path: Task 2 → Task 5 → Task 8 → Task 13 → F1-F3
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 5 (Wave 3)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1 | — | 13 | 1 |
| 2 | — | 4, 5, 6, 7 | 1 |
| 3 | — | 4 | 1 |
| 4 | 2, 3 | 11 | 1 |
| 5 | 2 | 8, 11 | 2 |
| 6 | 2 | 11 | 2 |
| 7 | 2 | 8, 9, 10 | 2 |
| 8 | 5, 7 | 13, 14 | 3 |
| 9 | 7 | 13, 14 | 3 |
| 10 | 7 | 13, 14 | 3 |
| 11 | 4, 5, 6 | 13, 14 | 3 |
| 12 | 5, 6, 7 | 15 | 3 |
| 13 | 8-12 | F1-F3 | 4 |
| 14 | 8-12 | F1-F3 | 4 |
| 15 | 12, 13 | — | 4 |

### Agent Dispatch Summary

- **Wave 1**: 4 tasks — T1 `unspecified-low` + `playwright`, T2-T4 `quick`
- **Wave 2**: 3 tasks — T5-T7 `quick`
- **Wave 3**: 5 tasks — T8-T12 `quick`
- **Wave 4**: 3 tasks — T13 `unspecified-high` + `playwright`, T14 `unspecified-low`, T15 `unspecified-high` + `playwright`
- **FINAL**: 3 tasks — F1 `oracle`, F2 `unspecified-high`, F3 `unspecified-high` + `playwright`

---

## TODOs


- [x] 1. Baseline Screenshots — All Pages Before Migration

  **What to do**:
  - Start dev server (`npm run dev`)
  - Navigate to every section-based page at 1440px viewport
  - Pages: `/services`, `/rendez-vous`, `/projets`, `/a-propos` (FR) + `/en/services`, `/en/booking`, `/en/projects`, `/en/about` (EN)
  - Also screenshot `/` (homepage) as regression baseline
  - Save all screenshots to `.sisyphus/evidence/baseline/`
  - Name format: `{locale}-{page}-baseline.png`

  **Must NOT do**:
  - Do NOT modify any files
  - Do NOT touch homepage or blog pages

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: [`playwright`]
    - `playwright`: Browser automation for screenshots

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Task 13 (visual regression comparison)
  - **Blocked By**: None

  **References**:
  - `.sisyphus/evidence/final-qa/v2/` — previous screenshot evidence pattern
  - `content/fr/pages/` — FR page content files (to know which pages exist)
  - `content/en/pages/` — EN page content files

  **Acceptance Criteria**:
  - [x] 9+ screenshots saved to `.sisyphus/evidence/baseline/`
  - [x] All pages load (HTTP 200, content visible)

  ```
  Scenario: Capture baseline screenshots of all section pages
    Tool: Playwright
    Steps:
      1. Start dev server on available port
      2. Navigate to each of the 9 URLs (4 FR + 4 EN + homepage)
      3. Wait for page load (network idle)
      4. Capture full-page screenshot at 1440px viewport
    Expected Result: 9+ .png files in `.sisyphus/evidence/baseline/`
    Evidence: .sisyphus/evidence/baseline/*.png
  ```

  **Commit**: NO

---

- [x] 2. Create MDC Wrapper Pattern — Prototype with SectionHero

  **What to do**:
  - Create `components/content/SectionHero.vue` — the MDC wrapper component
  - This wrapper:
    1. Accepts all props that `components/sections/SectionHero.vue` expects (title, subtitle, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink)
    2. Accepts an optional `animation` prop (object with `name`, `delay?`, `stagger?`)
    3. If `animation` prop is present AND `hasAnimations` feature flag is on, wraps content in `<AnimationsAnimateOnScroll>`
    4. Renders the visual `<SectionsSectionHero>` component from `components/sections/` with all props forwarded
  - The MDC component will be used in markdown as:
    ```
    ::section-hero
    ---
    title: "Page Title"
    subtitle: "Page subtitle"
    ctaText: "Click me"
    ctaLink: "/some-path"
    animation:
      name: fadeUp
    ---
    ::
    ```

  **Must NOT do**:
  - Do NOT modify the existing `components/sections/SectionHero.vue` visual component
  - Do NOT use nested child MDC syntax (`:::child` inside `::parent`)
  - Do NOT use slot-based content — all data via YAML props block

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3)
  - **Blocks**: Tasks 4, 5, 6, 7 (all other wrappers follow this pattern)
  - **Blocked By**: None

  **References**:
  - `components/sections/SectionHero.vue` — visual component to wrap (check defineProps for exact prop types)
  - `tempo-core/components/content/PageRenderer.vue:3-20` — current animation wrapping pattern to replicate
  - `tempo-core/config/animations.ts` — AnimationName type definition
  - `tempo-core/composables/useFeatures.ts` — `hasAnimations` feature flag

  **Acceptance Criteria**:
  - [x] `components/content/SectionHero.vue` exists
  - [x] `npm run build` succeeds
  - [x] Component accepts all Hero props + animation prop
  - [x] Component wraps with AnimateOnScroll when animation prop present

  ```
  Scenario: Verify MDC wrapper renders correctly
    Tool: Bash
    Steps:
      1. Read the created component file
      2. Verify it imports SectionsSectionHero from #components
      3. Verify it has animation prop handling with AnimationsAnimateOnScroll
      4. Run `npm run build`
    Expected Result: Build passes, component has correct structure
    Evidence: .sisyphus/evidence/task-2-hero-wrapper.md
  ```

  **Commit**: YES
  - Message: `feat(content): create MDC wrapper pattern for SectionHero`
  - Files: `components/content/SectionHero.vue`

---

- [x] 3. Override [slug].vue — ContentRenderer with Fallback

  **What to do**:
  - Create `pages/[...slug].vue` in the HUB repo (overrides `tempo-core/pages/[...slug].vue`)
  - New rendering logic:
    1. Query page from `pages` collection (same as current)
    2. If page has MDC body content (check `page.body` exists and has children): render `<ContentRenderer :value="page" />`
    3. Else if page has `sections` in frontmatter: render `<PageRenderer :sections="page.sections" />` (backward compat during migration)
    4. Else: render raw ContentRenderer (for prose pages)
  - Keep all existing logic: SEO meta, 404 handling, locale routing
  - Import ContentRenderer from `@nuxt/content`

  **Must NOT do**:
  - Do NOT remove PageRenderer support yet (needed during incremental migration)
  - Do NOT use `ContentDoc` (doesn't exist in v3)
  - Do NOT touch `pages/index.vue` (homepage)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: Task 4 (prototype migration needs this)
  - **Blocked By**: None

  **References**:
  - `tempo-core/pages/[...slug].vue` — current implementation to override (exact code in context)
  - `tempo-core/components/content/PageRenderer.vue` — fallback rendering
  - Nuxt Content v3 docs: `<ContentRenderer>` renders MDC body

  **Acceptance Criteria**:
  - [x] `pages/[...slug].vue` exists in hub root
  - [x] `npm run build` succeeds
  - [x] Existing frontmatter pages still render (backward compat)

  ```
  Scenario: Verify slug override works with existing pages
    Tool: Bash
    Steps:
      1. Read the created file
      2. Verify ContentRenderer and PageRenderer imports
      3. Verify body detection logic
      4. Run `npm run build`
    Expected Result: Build passes, file has correct dual-render logic
    Evidence: .sisyphus/evidence/task-3-slug-override.md
  ```

  **Commit**: YES
  - Message: `feat(pages): override slug page with ContentRenderer for MDC support`
  - Files: `pages/[...slug].vue`

---

- [x] 4. Prototype Migration — about.md (FR) End-to-End

  **What to do**:
  - Migrate `content/fr/pages/a-propos.md` from frontmatter sections to MDC body blocks
  - Keep page-level frontmatter: `title`, `description`, `navLabel`, `order`, `showInNav`
  - Remove `sections:` array from frontmatter
  - Add MDC body using the section components, e.g.:
    ```
    ::section-hero
    ---
    title: "À propos"
    subtitle: "..."
    ---
    ::
    ```
  - Each section from the old frontmatter becomes a `::section-xxx` block in the body
  - Verify the page renders correctly by starting dev server and checking
  - This is the PROTOTYPE — validates the full pipeline works before bulk migration

  **Must NOT do**:
  - Do NOT migrate other pages yet
  - Do NOT modify the EN about page yet (that's Task 11)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`playwright`]
    - `playwright`: Visual verification of rendered page

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (depends on Tasks 2 + 3)
  - **Blocks**: Task 11
  - **Blocked By**: Tasks 2, 3

  **References**:
  - `content/fr/pages/a-propos.md` — current frontmatter format to migrate
  - `components/content/SectionHero.vue` — MDC wrapper (created in Task 2)
  - `components/sections/SectionHero.vue` — visual component (check props)
  - `components/sections/SectionCta.vue` — CTA section props
  - `components/sections/SectionFeatures.vue` — features section props

  **Acceptance Criteria**:
  - [x] `content/fr/pages/a-propos.md` uses MDC body (no `sections:` in frontmatter)
  - [x] Page renders at `/a-propos` with all sections visible
  - [x] `npm run build` succeeds

  ```
  Scenario: Verify about page renders with MDC content
    Tool: Playwright
    Steps:
      1. Start dev server
      2. Navigate to `/a-propos` at 1440px viewport
      3. Verify hero section visible (h1 with title)
      4. Verify other sections visible
      5. Screenshot
    Expected Result: Page renders with all sections, identical to baseline
    Evidence: .sisyphus/evidence/task-4-about-mdc.png
  ```

  **Commit**: YES
  - Message: `feat(content): prototype MDC migration with about page FR`
  - Files: `content/fr/pages/a-propos.md`

---

- [x] 5. MDC Wrappers Batch A — Features, Cta, Stats, Pricing

  **What to do**:
  - Create 4 MDC wrapper components following the EXACT same pattern as SectionHero (Task 2):
    - `components/content/SectionFeatures.vue` — wraps `SectionsSectionFeatures`
    - `components/content/SectionCta.vue` — wraps `SectionsSectionCta`
    - `components/content/SectionStats.vue` — wraps `SectionsSectionStats`
    - `components/content/SectionPricing.vue` — wraps `SectionsSectionPricing`
  - Each wrapper: accepts visual component's props + `animation` prop, wraps with AnimateOnScroll if animation present
  - Check each visual component's `defineProps` to know exact props to accept

  **Must NOT do**:
  - Do NOT modify visual components in `components/sections/`
  - Do NOT use nested child MDC components

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6, 7)
  - **Blocks**: Tasks 8, 11
  - **Blocked By**: Task 2 (pattern reference)

  **References**:
  - `components/content/SectionHero.vue` — pattern to replicate (created in Task 2)
  - `components/sections/SectionFeatures.vue` — defineProps (title, subtitle, items[])
  - `components/sections/SectionCta.vue` — defineProps (title, subtitle, ctaText, ctaLink, secondary*)
  - `components/sections/SectionStats.vue` — defineProps (title, items[] with value/label)
  - `components/sections/SectionPricing.vue` — defineProps (title, subtitle, plans[])

  **Acceptance Criteria**:
  - [x] 4 files created in `components/content/`
  - [x] `npm run build` succeeds

  ```
  Scenario: Build verification for batch A wrappers
    Tool: Bash
    Steps:
      1. Verify 4 .vue files exist in components/content/
      2. Each file imports from #components and has animation handling
      3. `npm run build` exits 0
    Expected Result: All 4 wrappers valid, build passes
    Evidence: .sisyphus/evidence/task-5-batch-a-wrappers.md
  ```

  **Commit**: YES (groups with Tasks 6, 7)
  - Message: `feat(content): create MDC wrappers for all section types`
  - Files: `components/content/Section*.vue`

---

- [x] 6. MDC Wrappers Batch B — Testimonials, Faq, Contact, Logos

  **What to do**:
  - Create 4 MDC wrapper components:
    - `components/content/SectionTestimonials.vue` — wraps `SectionsSectionTestimonials`
    - `components/content/SectionFaq.vue` — wraps `SectionsSectionFaq`
    - `components/content/SectionContact.vue` — wraps `SectionsSectionContact`
    - `components/content/SectionLogos.vue` — wraps `SectionsSectionLogos`
  - Same pattern as Task 2/5 — check each visual component's `defineProps`

  **Must NOT do**:
  - Do NOT modify visual components

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 7)
  - **Blocks**: Task 11
  - **Blocked By**: Task 2

  **References**:
  - `components/content/SectionHero.vue` — pattern to replicate
  - `components/sections/SectionTestimonials.vue` — defineProps
  - `components/sections/SectionFaq.vue` — defineProps
  - `components/sections/SectionContact.vue` — defineProps
  - `components/sections/SectionLogos.vue` — defineProps

  **Acceptance Criteria**:
  - [x] 4 files created in `components/content/`
  - [x] `npm run build` succeeds

  **Commit**: YES (groups with Tasks 5, 7)

---

- [x] 7. MDC Wrappers Batch C — StripePricing, Projects, Booking

  **What to do**:
  - Create 3 MDC wrapper components:
    - `components/content/SectionStripePricing.vue` — wraps `SectionsSectionStripePricing`
    - `components/content/SectionProjects.vue` — wraps `SectionsSectionProjects`
    - `components/content/SectionBooking.vue` — wraps `SectionsSectionBooking`
  - Same pattern as Task 2/5/6

  **Must NOT do**:
  - Do NOT modify visual components

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 6)
  - **Blocks**: Tasks 8, 9, 10
  - **Blocked By**: Task 2

  **References**:
  - `components/content/SectionHero.vue` — pattern to replicate
  - `components/sections/SectionStripePricing.vue` — defineProps
  - `components/sections/SectionProjects.vue` — defineProps
  - `components/sections/SectionBooking.vue` — defineProps

  **Acceptance Criteria**:
  - [x] 3 files created in `components/content/`
  - [x] `npm run build` succeeds

  **Commit**: YES (groups with Tasks 5, 6)

---

- [x] 8. Migrate Services Pages FR + EN

  **What to do**:
  - Migrate `content/fr/pages/services.md` and `content/en/pages/services.md`
  - Keep page-level frontmatter: `title`, `description`, `navLabel`, `order`, `showInNav`
  - Remove `sections:` array from frontmatter
  - Convert each section to MDC body block:
    - `type: hero` → `::section-hero`
    - `type: features` → `::section-features`
    - `type: stats` → `::section-stats`
    - `type: stripe-pricing` → `::section-stripe-pricing`
    - `type: cta` → `::section-cta`
  - All section props go in the `---` YAML block within each MDC component
  - Animation props go inside the YAML block too
  - Verify both FR and EN pages render correctly

  **Must NOT do**:
  - Do NOT change the section content/text — only restructure format
  - Do NOT use `:propName="frontmatterKey"` binding

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 9, 10, 11, 12)
  - **Blocks**: Tasks 13, 14
  - **Blocked By**: Tasks 5, 7

  **References**:
  - `content/fr/pages/services.md` — current frontmatter format
  - `content/en/pages/services.md` — current frontmatter format
  - Task 4 prototype — follow same MDC pattern

  **Acceptance Criteria**:
  - [x] Both FR and EN services.md use MDC body
  - [x] No `sections:` in frontmatter
  - [x] `npm run build` succeeds

  ```
  Scenario: Verify services page renders after migration
    Tool: Playwright
    Steps:
      1. Start dev server
      2. Navigate to `/services` and `/en/services`
      3. Verify hero, features, stats, pricing, cta sections visible
    Expected Result: Both pages render with all 5 sections
    Evidence: .sisyphus/evidence/task-8-services-mdc.png
  ```

  **Commit**: YES (groups with Tasks 9, 10, 11)
  - Message: `feat(content): migrate all pages to MDC format (FR + EN)`

---

- [x] 9. Migrate Booking Pages FR + EN

  **What to do**:
  - Migrate `content/fr/pages/rendez-vous.md` and `content/en/pages/booking.md`
  - Convert: hero → `::section-hero`, booking → `::section-booking`, cta → `::section-cta`
  - Same pattern as Task 8

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: Tasks 13, 14
  - **Blocked By**: Task 7

  **References**:
  - `content/fr/pages/rendez-vous.md` — current format
  - `content/en/pages/booking.md` — current format

  **Acceptance Criteria**:
  - [x] Both pages use MDC body
  - [x] `npm run build` succeeds

  **Commit**: YES (groups with Tasks 8, 10, 11)

---

- [x] 10. Migrate Portfolio Pages FR + EN

  **What to do**:
  - Migrate `content/fr/pages/projets.md` and `content/en/pages/projects.md`
  - Convert: hero → `::section-hero`, projects → `::section-projects`, cta → `::section-cta`
  - Same pattern as Task 8

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: Tasks 13, 14
  - **Blocked By**: Task 7

  **References**:
  - `content/fr/pages/projets.md` — current format
  - `content/en/pages/projects.md` — current format

  **Acceptance Criteria**:
  - [x] Both pages use MDC body
  - [x] `npm run build` succeeds

  **Commit**: YES (groups with Tasks 8, 9, 11)

---

- [x] 11. Migrate About EN + Verify About FR

  **What to do**:
  - Migrate `content/en/pages/about.md` to MDC body (same pattern as FR prototype in Task 4)
  - Verify `content/fr/pages/a-propos.md` (already migrated in Task 4) still works
  - Both should have identical section structure

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: Tasks 13, 14
  - **Blocked By**: Tasks 4, 5, 6

  **References**:
  - `content/en/pages/about.md` — current format
  - `content/fr/pages/a-propos.md` — already migrated (Task 4, verify it)

  **Acceptance Criteria**:
  - [x] EN about.md uses MDC body
  - [x] FR a-propos.md confirmed working
  - [x] `npm run build` succeeds

  **Commit**: YES (groups with Tasks 8, 9, 10)

---

- [x] 12. Schema Cleanup + Studio Config

  **What to do**:
  - Remove `sections` field from pages collection schema in `tempo-core/content.config.ts`
  - Since all pages now use MDC body, the `sections` frontmatter field is no longer needed
  - Update `nuxt.config.ts` Studio config to whitelist section components:
    ```ts
    studio: {
      meta: {
        components: {
          include: ['SectionHero', 'SectionFeatures', 'SectionCta', 'SectionStats',
                    'SectionPricing', 'SectionTestimonials', 'SectionFaq', 'SectionContact',
                    'SectionLogos', 'SectionStripePricing', 'SectionProjects', 'SectionBooking'],
        }
      }
    }
    ```
  - NOTE: The include list filters what appears in Studio's `/` command palette
  - Keep `PageRenderer.vue` for now (might be used by other features later)

  **Must NOT do**:
  - Do NOT remove `PageRenderer.vue` entirely (it's in tempo-core, might be used elsewhere)
  - Do NOT add `.editor()` on component props (doesn't work in MDC — Metis finding)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: Task 15
  - **Blocked By**: Tasks 5, 6, 7

  **References**:
  - `tempo-core/content.config.ts` — pages collection schema (remove sections field)
  - `nuxt.config.ts` — Studio config (add meta.components.include)

  **Acceptance Criteria**:
  - [x] `sections` field removed from pages schema
  - [x] `studio.meta.components.include` configured with 12 section types
  - [x] `npm run build` succeeds

  **Commit**: YES
  - Message: `feat(studio): configure component whitelist and clean schema`
  - Files: `tempo-core/content.config.ts`, `nuxt.config.ts`

---

- [x] 13. Visual Regression — Playwright All Pages × 3 Viewports

  **What to do**:
  - Start dev server
  - Take screenshots of all section pages at 375px, 768px, 1440px
  - Compare against baseline screenshots from Task 1
  - Pages: `/services`, `/rendez-vous`, `/projets`, `/a-propos` (FR) + EN equivalents + `/` (homepage)
  - Save to `.sisyphus/evidence/post-migration/`
  - Write comparison report to `.sisyphus/evidence/post-migration/report.md`

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`playwright`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 14, 15)
  - **Blocks**: F1-F3
  - **Blocked By**: Tasks 8-12

  **Acceptance Criteria**:
  - [x] All pages render with visible content (no empty sections)
  - [x] Visual quality matches or exceeds baseline
  - [x] Report in `.sisyphus/evidence/post-migration/report.md`

  **Commit**: NO

---

- [x] 14. Build + Test + Code Quality Audit

  **What to do**:
  - `npm run build` → exit 0
  - `npx vitest run --reporter=verbose` → ≥31 tests pass
  - Grep for forbidden patterns in changed files:
    - No nested MDC child syntax (`:::`) in content .md files
    - No `.editor()` on component defineProps
    - No `:propName="frontmatterKey"` in .md files
    - No `console.log`, `as any`, `@ts-ignore` in new components
  - Write report to `.sisyphus/evidence/post-migration/f14-audit.md`

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 13, 15)
  - **Blocks**: F1-F3
  - **Blocked By**: Tasks 8-12

  **Acceptance Criteria**:
  - [x] Build exits 0
  - [x] Tests pass
  - [x] No forbidden patterns found

  **Commit**: NO

---

- [x] 15. Studio Editing UX Verification

  **What to do**:
  - Start dev server
  - Navigate to `/_studio` (or use Studio overlay in dev mode)
  - Open a content page (e.g., services.md)
  - Verify:
    1. Section components visible in `/` command palette (search 'section')
    2. Existing sections are rendered in the visual editor
    3. Props panel opens when clicking a section block
    4. Top-level section blocks can be dragged to reorder
  - NOTE: If Studio auth blocks access, document it as a known limitation
  - Save screenshots/evidence

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`playwright`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 13, 14)
  - **Blocks**: None
  - **Blocked By**: Tasks 12, 13

  **Acceptance Criteria**:
  - [x] Section components appear in Studio palette
  - [x] Sections render in visual editor
  - [x] Report with findings

  **Commit**: NO

---

## Final Verification Wave

> 3 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [x] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`
  Run `tsc --noEmit` + linter + `bun test`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check no nested MDC child components (`::: child`). Check no `.editor()` on component props. Check no `:propName="frontmatterKey"` in MDC files.
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Tests [N pass/N fail] | Files [N clean/N issues] | VERDICT`

- [x] F3. **Visual Regression Comparison** — `unspecified-high` + `playwright` skill
  Compare Task 1 baseline screenshots against current screenshots at identical viewports (375px, 768px, 1440px). All pages must render identically or better. Flag any visual regressions. Test Studio editing: open Studio, verify section palette, drag-and-drop, prop editing. Save evidence to `.sisyphus/evidence/final-qa/`.
  Output: `Pages [N/N match] | Regressions [CLEAN/N issues] | Studio [PASS/FAIL] | VERDICT`

---

## Commit Strategy

| Task | Commit Message | Files |
|------|---------------|-------|
| 2 | `feat(content): create MDC wrapper pattern for SectionHero` | `components/content/SectionHero.vue` |
| 3 | `feat(pages): override slug page with ContentRenderer for MDC` | `pages/[...slug].vue` |
| 4 | `feat(content): prototype MDC migration with about page FR` | `content/fr/pages/a-propos.md` |
| 5-7 | `feat(content): create MDC wrappers for all section types` | `components/content/Section*.vue` |
| 8-11 | `feat(content): migrate all pages to MDC format (FR + EN)` | `content/**/*.md` |
| 12 | `feat(studio): configure component whitelist and clean schema` | `nuxt.config.ts`, `content.config.ts` |

---

## Success Criteria

### Verification Commands
```bash
npm run build          # Expected: exit 0
npx vitest run         # Expected: ≥31 tests pass
```

### Final Checklist
- [x] All 12 MDC wrappers created in `components/content/`
- [x] All 8 content pages use MDC body (no frontmatter sections)
- [x] `pages/[...slug].vue` uses ContentRenderer
- [x] `studio.meta.components.include` configured
- [x] `sections` field removed from pages schema
- [x] All pages render at 375px, 768px, 1440px (visual regression passes)
- [x] No nested MDC child components
- [x] No `.editor()` on component props
- [x] No `:propName="frontmatterKey"` bindings
- [x] Build passes
- [x] Tests pass
- [x] Studio section palette shows 12 section types
- [x] Sections can be reordered via drag-and-drop in Studio
