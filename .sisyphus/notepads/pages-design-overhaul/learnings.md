# Learnings — pages-design-overhaul

## [2026-02-25] Session Start

### Architecture
- Hub `components/sections/` overrides `tempo-core/components/sections/` — ALL visual changes go in HUB
- Only legitimate tempo-core change: PageRenderer sectionMap registration
- CSS utilities go in `assets/css/theme.css` (plain CSS, no @apply)

### Design Tokens (from ParallaxHome.vue)
- Glass: `background: rgba(5,8,22,0.65); backdrop-filter: blur(16px); border: 1px solid rgba(212,168,83,0.1);`
- Gold glow: `box-shadow: 0 0 20px rgba(212,168,83,0.4), 0 0 60px rgba(212,168,83,0.12);`
- Text glow: `text-shadow: 0 0 20px rgba(212,168,83,0.4), 0 0 60px rgba(212,168,83,0.12);`
- Gold color: `#d4a853` = primary-500
- Deep space bg: `#050816` = secondary-950
- Dark blue: `#0a0e24` = muted

### Key Files
- `assets/css/theme.css` — 51 lines, add utilities AFTER .prose block
- `components/ui/Card.vue` — 15 lines, currently `bg-white/[0.04]`
- `components/ui/Button.vue` — 55 lines, variantClasses at lines 43-48
- `app.config.ts` — calcom.username at line 28 (currently empty string)
- `tempo-core/components/content/PageRenderer.vue` — sectionMap at lines 68-80

### Constraints
- NO feDisplacementMap
- NO scroll-driven (scrub) GSAP on sections
- NO SVG art in sections
- NO scanlines/vignette as generic utilities
- NO new npm dependencies


## Section Theme Upgrade (Task 3)
- All 6 section components use CSS utility classes from `assets/css/theme.css`
- Classes available: `gradient-section`, `gradient-section-alt`, `text-glow`, `text-glow-subtle`, `glow-gold`, `hover-lift`, `glass-card`, `border-glow`
- UiCard already has glassmorphism — don't add glass styles to cards
- Build fails due to missing SectionProjects/SectionBooking in PageRenderer — expected, not our issue
- Vue LSP not installed in this env — can't run diagnostics on .vue files
- When wrapping elements with v-if, move the v-if to the wrapper div for correctness

## Section component patterns
- All sections use `section-padding gradient-section` wrapper classes
- Container: `container-page`
- Title pattern: `text-hero text-white text-glow` for h2
- Subtitle pattern: `mt-4 text-lg text-gray-300 max-w-2xl mx-auto`
- `IntegrationsCalEmbed` auto-imported from tempo-core, reads calcom config from `useClientConfig()`
- `glass-card` class from theme.css for glassmorphism panels

---

## F2 Audit Findings (2026-02-25)

### Build & Tests
- `npm run build` exits 0 — build is healthy
- 31/31 vitest tests pass — test suite stable
- Pre-existing non-fatal warnings: Zod toJSONSchema, `rand` duplicate import, chunk size warnings

### Navigation Architecture
- Navigation is **content-driven, not i18n-driven** for dynamic pages
- `nav.*` i18n keys only cover static items: `home`, `contact`
- New pages (services, booking/rendez-vous, projects/projets) appear via `showInNav: true` + `navLabel` in frontmatter
- Header queries `pages` collection, orders by `order` field, filters `showInNav !== false`
- This is the correct pattern — do NOT add booking/projects to `nav.*` i18n keys

### Code Quality
- Zero `console.log`, `as any`, `@ts-ignore` in all changed files
- Zero `feDisplacementMap`, `scanlines`, `vignette` in section/ui/layout components
- Zero `<svg>` art tags in `components/sections/`
- All constraints respected

### Locales
- `locales/fr.json` nav keys: `home`, `services`, `about`, `blog`, `contact`
- `locales/en.json` nav keys: `home`, `services`, `about`, `blog`, `contact`
- `services` key exists in both — but it's only used if Header references `nav.services` (it doesn't for dynamic pages)

---

## F1 Visual QA Findings (2026-02-25)

### Route Structure
- `prefix_except_default` with `defaultLocale: 'fr'` means FR pages have NO prefix
- FR routes: `/services`, `/rendez-vous`, `/projets`, `/a-propos` (NOT `/fr/pages/...`)
- EN routes: `/en/services`, `/en/booking`, `/en/projects`, `/en/about`
- Browser language detection overrides: English browsers redirected to `/en` on unprefixed URLs
- Must set `i18n_locale=fr` cookie for Playwright to access FR locale properly

### CRITICAL: Sub-page sections not rendering
- All sub-pages (services, booking, projects, about) return HTTP 200 but show **empty white content area**
- Only homepage renders correctly (it uses hardcoded sections in `index.vue`, not Nuxt Content)
- `[...slug].vue` fetches page via `queryCollection('pages').path(contentPath).first()` but `page.sections` is undefined
- Likely cause: Nuxt Content v3 frontmatter schema mismatch — content files use inline props in sections, but schema expects `props: z.record(z.any())` wrapper
- Vue warning confirms: `Property "services" was accessed during render but is not defined on instance`

### Homepage Design (verified working)
- Dark gradient background: PASS (deep navy/black with gold radial gradients)
- Gold glow on headings: PASS ("TEMPO HUB" has visible gold text-shadow)
- Parallax effects: PASS (layered orbital design elements)
- Responsive: PASS (375px, 768px, 1440px all render well)
- Glassmorphism: PARTIAL (backdrop-blur present, gold borders not prominent)

### Console Warnings (non-blocking)
- Hydration attribute mismatches — SSR vs client GSAP differences
- GSAP target warnings — animation targets not found during SSR
- intlify missing key: `studio.tooltips.toggle` — Studio UI, not user-facing

---

## F3 Content Parity Check — 2026-02-25

### Findings
- All 4 FR/EN page pairs have **identical section structures** (count, types, order).
- All pages have `showInNav: true`, `navLabel`, and `order` frontmatter fields.
- Animation blocks are perfectly mirrored across all pairs.
- CTA internal links correctly use locale-specific paths (`/rendez-vous` vs `/booking`, `/projets` vs `/projects`).

### Non-blocking Observations
1. **`about`/`a-propos` pages have no animation blocks** — consistent between locales but differs from other pages. May want to add `fadeUp` for visual consistency.
2. **`about`/`a-propos` CTA missing `subtitle`** — consistent between locales, but other pages include it.
3. **Nav order conflict** — `projets/projects` and `a-propos/about` both have `order: 2`. Could cause unpredictable nav ordering.

### Patterns Confirmed
- Services: 5 sections (hero, features, stats, stripe-pricing, cta)
- Booking/Rendez-vous: 3 sections (hero, booking, cta)
- Projects/Projets: 3 sections (hero, projects, cta) with 6 project cards
- About/À-propos: 3 sections (hero, stats, cta) — no animations

---

## Final QA v2 — Content Schema Fix Verified (2026-02-25)

### Confirmed: `.passthrough()` fix works
All three FR sub-pages now render full content after the `content.config.ts` sections schema fix:
- `/services` → hero + 6 feature cards + stats + pricing section + CTA ✅
- `/rendez-vous` → hero + booking section + CTA ✅
- `/projets` → hero + 6 project cards grid + CTA ✅

### i18n Routing Pattern (important)
- Strategy: `prefix_except_default` with `defaultLocale: 'fr'`
- FR pages: no prefix (`/services`, `/rendez-vous`, `/projets`)
- EN pages: `/en/` prefix (`/en/services`, `/en/booking`, `/en/projects`)
- Browser `Accept-Language: en-US` triggers redirect to `/en/` — correct behavior
- To test FR in EN browser: use language switcher (sets `i18n_redirected` cookie)
- Direct navigation to `/fr/services` returns 404 — FR has no `/fr/` prefix

### Dev Server Port
- Port 3000 was occupied; Nuxt auto-selected port 3002
- Always check logs for actual port when `npm run dev` starts

### Known Template Gaps (not content schema related)
- Stripe pricing table: needs `STRIPE_PUBLISHABLE_KEY` env var
- Cal.com booking widget: needs `calcom.username` in `app.config.ts`
- These are expected in demo/template mode

### Evidence
Screenshots saved to `.sisyphus/evidence/final-qa/v2/`
Full report at `.sisyphus/evidence/final-qa/v2/report.md`
