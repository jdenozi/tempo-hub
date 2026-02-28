# Fix Small Errors — Codebase Cleanup Pass

## TL;DR

> **Quick Summary**: Fix all build warnings, i18n gaps, accessibility issues, and code quality problems found by comprehensive audit. All fixes are in tempo-hub repo only (not tempo-core submodule).
> 
> **Deliverables**:
> - Zero build warnings (duplicated `rand` import eliminated)
> - ParallaxHome.vue fully i18n-compliant (EN homepage shows English text)
> - Accessibility fix (missing alt attribute)
> - Clean app.config.ts (no placeholder values)
> 
> **Estimated Effort**: Quick (1-2h across 1 wave)
> **Parallel Execution**: YES — 1 wave, 4 parallel tasks
> **Critical Path**: All tasks independent → run build → commit

---

## Context

### Original Request
User asked: "Fais une passe pour corriger toutes les petites erreurs" — Fix all small errors in the codebase.

### Audit Summary
3 explore agents ran a comprehensive audit covering build warnings, runtime errors, TypeScript, code quality, i18n, SEO, accessibility, config, and dead code. Findings:

**Issues found in tempo-hub** (actionable):
- 1 build warning (duplicated `rand` import)
- 5 hardcoded French strings in ParallaxHome.vue
- 5 missing i18n keys for locale files
- 1 missing alt attribute on img tag
- Placeholder values in app.config.ts

**Issues in tempo-core** (out of scope — submodule):
- 9+ console.log/error in server code
- Mixed import strategy for useFeatures
- Large chunk sizes
- PageRenderer console.warn

**NOT issues** (intentionally kept):
- 4 unused MDC wrappers (SectionContact, SectionFaq, SectionTestimonials, SectionLogos) → Kept for Nuxt Studio `/` command palette
- Stripe pricing IDs in content → Actual data, not config
- og-image.jpg missing → Requires design work, separate task

---

## Work Objectives

### Core Objective
Eliminate all build warnings and fix i18n/a11y/config issues in tempo-hub files.

### Concrete Deliverables
- `utils/parallax-utils.ts` — Remove `rand` re-export, keep only `lerp` and `clamp`
- `utils/__tests__/parallax-utils.test.ts` — Update test imports (no longer import `rand` from here)
- `locales/fr.json` — Add 5 scene keys for ParallaxHome
- `locales/en.json` — Add 5 scene keys for ParallaxHome
- `components/ParallaxHome.vue` — Replace 5 hardcoded French strings with `$t()` calls
- `components/sections/SectionProjects.vue` — Add `:alt` attribute to img tag
- `app.config.ts` — Remove fake placeholder values, set sensible defaults or empty strings with comments

### Definition of Done
- [x] `npm run build` exits 0 with NO "Duplicated imports" warning
- [x] `npx vitest run` — all 31 tests pass
- [x] EN homepage (`/en`) shows English scene text (not French)
- [x] FR homepage (`/`) shows French scene text (unchanged)

### Must Have
- Zero duplicated import warnings in build output
- All ParallaxHome scene text uses `$t()` i18n
- Both locale files have matching keys (currently 84, should become 89)
- Alt attribute on SectionProjects img

### Must NOT Have (Guardrails)
- Do NOT modify tempo-core submodule files
- Do NOT delete any MDC wrapper components (they're for Studio palette)
- Do NOT refactor ParallaxHome architecture (only i18n strings)
- Do NOT change visual appearance of any page
- Do NOT add new dependencies
- Do NOT touch content .md files
- Do NOT modify section component props or behavior

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES (vitest)
- **Automated tests**: Tests-after (verify non-regression)
- **Framework**: vitest
- **Primary verification**: Build output grep for warnings + vitest run

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Build**: Use Bash — `npm run build 2>&1 | grep -i "duplicated\|warn"` 
- **Tests**: Use Bash — `npx vitest run`
- **i18n**: Use Playwright — Navigate to `/en` and `/`, verify text content

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (All tasks parallel — fully independent):
├── Task 1: Fix duplicated rand import + update tests [quick]
├── Task 2: Add i18n keys + translate ParallaxHome strings [quick]
├── Task 3: Fix SectionProjects alt attribute [quick]
└── Task 4: Clean app.config.ts placeholder values [quick]

Wave FINAL (After ALL — verification):
├── Task 5: Build + test + visual verification [quick, playwright]
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1 | — | 5 | 1 |
| 2 | — | 5 | 1 |
| 3 | — | 5 | 1 |
| 4 | — | 5 | 1 |
| 5 | 1, 2, 3, 4 | — | FINAL |

### Agent Dispatch Summary

- **Wave 1**: 4 tasks — T1-T4 all `quick`
- **FINAL**: 1 task — T5 `quick` + `playwright` skill

---

## TODOs

- [x] 1. Fix Duplicated `rand` Import Warning

  **What to do**:
  - Edit `utils/parallax-utils.ts`:
    - Remove line 6: `import { rand } from '../composables/useParallaxData'`
    - Remove `rand` from the export (line ~44, the `export { rand }` statement)
    - Keep `lerp` and `clamp` functions (they're tested and may be used later)
  - Edit `utils/__tests__/parallax-utils.test.ts`:
    - Change `rand` import to come from `../../composables/useParallaxData` instead of `../parallax-utils`
    - The `rand` tests should still pass since the function itself is unchanged

  **Must NOT do**:
  - Do NOT delete `utils/parallax-utils.ts` entirely (keep lerp/clamp)
  - Do NOT modify `composables/useParallaxData.ts` (it's the canonical source)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4)
  - **Blocks**: Task 5
  - **Blocked By**: None

  **References**:
  - `utils/parallax-utils.ts:6` — The re-export line causing the warning
  - `utils/parallax-utils.ts:44` — The `export { rand }` line
  - `utils/__tests__/parallax-utils.test.ts` — Test file that imports `rand` from parallax-utils
  - `composables/useParallaxData.ts:10-13` — Canonical `rand()` definition (DO NOT TOUCH)
  - Build output warning: `Duplicated imports "rand", the one from "composables/useParallaxData.ts" has been ignored and "utils/parallax-utils.ts" is used`

  **Acceptance Criteria**:
  - [x] `npm run build 2>&1 | grep -i "duplicated"` returns empty (no duplicated imports warning)
  - [x] `npx vitest run` — all tests pass (31/31)
  - [x] `utils/parallax-utils.ts` still exports `lerp` and `clamp`

  ```
  Scenario: Build has no duplicated imports warning
    Tool: Bash
    Steps:
      1. Run `npm run build 2>&1 | grep -i "duplicated"`
      2. Verify output is empty (no matches)
    Expected Result: No "Duplicated imports" warning in build output
    Evidence: .sisyphus/evidence/task-1-no-duplicated-imports.md

  Scenario: All tests still pass after import change
    Tool: Bash
    Steps:
      1. Run `npx vitest run --reporter=verbose`
      2. Verify all 31 tests pass
    Expected Result: 31 passed, 0 failed
    Evidence: .sisyphus/evidence/task-1-tests-pass.md
  ```

  **Commit**: YES (groups with Tasks 2, 3, 4)
  - Message: `fix: resolve duplicated rand import build warning`
  - Files: `utils/parallax-utils.ts`, `utils/__tests__/parallax-utils.test.ts`

---

- [x] 2. Add i18n Keys + Translate ParallaxHome Scene Strings

  **What to do**:
  - Add 5 new keys to `locales/fr.json` under the `home` object:
    ```json
    "scene1Subtitle": "Concentrez-vous sur votre activité",
    "scene2Label": "Notre mission",
    "scene2Title": "Dans l'immensité du numérique,<br>nous traçons votre route",
    "scene3Label": "Nos expertises",
    "scene4Title": "Prêt à décoller ?",
    "scene4Subtitle": "Prenez rendez-vous pour en discuter,<br>c'est gratuit et sans engagement."
    ```
  - Add matching 5 keys to `locales/en.json` under the `home` object:
    ```json
    "scene1Subtitle": "Focus on your business",
    "scene2Label": "Our mission",
    "scene2Title": "In the vastness of the digital world,<br>we chart your course",
    "scene3Label": "Our expertise",
    "scene4Title": "Ready to launch?",
    "scene4Subtitle": "Book a meeting to discuss it,<br>it's free and no commitment."
    ```
  - Edit `components/ParallaxHome.vue` — Replace hardcoded French strings:
    - Line ~289: `Concentrez-vous sur votre activité` → `{{ $t('home.scene1Subtitle') }}`
    - Line ~356: `Notre mission` → `{{ $t('home.scene2Label') }}`
    - Line ~358: `Dans l'immensité du numérique,<br>nous traçons votre route` → use `v-html="$t('home.scene2Title')"` (contains `<br>`)
    - Line ~2515: `Nos expertises` → `{{ $t('home.scene3Label') }}`
    - Line ~3142: `Prêt à décoller ?` → `{{ $t('home.scene4Title') }}`
    - Line ~3143: `Prenez rendez-vous pour en discuter,<br>c'est gratuit et sans engagement.` → use `v-html="$t('home.scene4Subtitle')"` (contains `<br>`)
  - IMPORTANT: Lines with `<br>` in the translated value MUST use `v-html` directive, not `{{ }}` interpolation

  **Must NOT do**:
  - Do NOT translate sci-fi UI labels (SYS.ONLINE, STELLAR RELAY, NETWORK MAP, etc.) — they're intentional design
  - Do NOT modify the "Scroll" indicator text — it's universal
  - Do NOT change any styling or layout in ParallaxHome
  - Do NOT rename existing i18n keys

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3, 4)
  - **Blocks**: Task 5
  - **Blocked By**: None

  **References**:
  - `locales/fr.json` — Current French translations (84 keys in `home` section)
  - `locales/en.json` — Current English translations (84 keys in `home` section)
  - `components/ParallaxHome.vue:289` — "Concentrez-vous sur votre activité"
  - `components/ParallaxHome.vue:356` — "Notre mission"
  - `components/ParallaxHome.vue:358` — "Dans l'immensité du numérique,<br>nous traçons votre route"
  - `components/ParallaxHome.vue:2515` — "Nos expertises"
  - `components/ParallaxHome.vue:3142` — "Prêt à décoller ?"
  - `components/ParallaxHome.vue:3143` — "Prenez rendez-vous pour en discuter,<br>c'est gratuit et sans engagement."

  **WHY Each Reference Matters**:
  - Locale files: Must add keys in the exact same `home` namespace as existing keys
  - ParallaxHome lines: These are the exact lines to edit — search for the French text to find them

  **Acceptance Criteria**:
  - [x] `locales/fr.json` has 89+ keys (was 84)
  - [x] `locales/en.json` has 89+ keys (was 84)
  - [x] ParallaxHome.vue has no hardcoded French scene text
  - [x] `npm run build` exits 0

  ```
  Scenario: EN homepage shows English scene text
    Tool: Playwright
    Steps:
      1. Start dev server on available port
      2. Navigate to `/en` at 1440px viewport
      3. Wait 3s for hydration
      4. Check page contains "Focus on your business" OR "Our mission" OR "Ready to launch?"
      5. Check page does NOT contain "Concentrez-vous sur votre activité" (except in sci-fi labels)
      6. Screenshot
    Expected Result: EN homepage displays English scene text
    Evidence: .sisyphus/evidence/task-2-en-homepage-i18n.png

  Scenario: FR homepage still shows French scene text
    Tool: Playwright
    Steps:
      1. Navigate to `/` at 1440px viewport
      2. Wait 3s for hydration
      3. Check page contains "Concentrez-vous sur votre activité" OR "Notre mission"
      4. Screenshot
    Expected Result: FR homepage displays French scene text (unchanged)
    Evidence: .sisyphus/evidence/task-2-fr-homepage-i18n.png
  ```

  **Commit**: YES (groups with Tasks 1, 3, 4)
  - Message: `fix(i18n): translate hardcoded ParallaxHome scene text to support EN locale`
  - Files: `locales/fr.json`, `locales/en.json`, `components/ParallaxHome.vue`

---

- [x] 3. ~~Fix Missing Alt Attribute on SectionProjects Image~~ — **ALREADY FIXED (Momus verified)**

  **Momus Review**: `SectionProjects.vue` line 20 already has `:alt="item.title"`. No action needed. Task skipped.


- [x] 4. Clean app.config.ts Placeholder Values

  **What to do**:
  - Edit `app.config.ts`:
    - Replace fake phone `'+33 6 00 00 00 00'` with empty string `''` and add comment `// TODO: Set real phone number`
    - Ensure `logo: ''` has comment `// TODO: Set logo path (e.g., '/images/logo.svg')`
    - Ensure `address: ''` has comment `// TODO: Set business address`
    - Social links that are `null` are fine — add comment `// Set to URL string when available`
    - `n8n.webhookContact: ''` — add comment `// TODO: Set n8n webhook URL for contact form`

  **Must NOT do**:
  - Do NOT invent fake values (that's worse than placeholders)
  - Do NOT remove any config keys
  - Do NOT change the config structure

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3)
  - **Blocks**: Task 5
  - **Blocked By**: None

  **References**:
  - `app.config.ts:7` — `logo: ''`
  - `app.config.ts:14` — `phone: '+33 6 00 00 00 00'`
  - `app.config.ts:15` — `address: ''`
  - `app.config.ts:20-23` — `social: { instagram: null, ... }`
  - `app.config.ts:33` — `n8n.webhookContact: ''`

  **Acceptance Criteria**:
  - [x] No fake phone number in app.config.ts
  - [x] All placeholder values have TODO comments
  - [x] `npm run build` exits 0

  ```
  Scenario: No fake placeholder values
    Tool: Bash
    Steps:
      1. Read app.config.ts
      2. Verify no '+33 6 00 00 00 00' fake phone
      3. Verify TODO comments on empty values
    Expected Result: Clean config with documented TODOs
    Evidence: .sisyphus/evidence/task-4-clean-config.md
  ```

  **Commit**: YES (groups with Tasks 1, 2, 3)
  - Message: `chore: clean placeholder values in app.config.ts`
  - Files: `app.config.ts`

---

- [x] 5. Final Verification — Build + Tests + Visual Check

  **What to do**:
  - Run `npm run build 2>&1` — capture full output
  - Verify NO "Duplicated imports" warning
  - Run `npx vitest run --reporter=verbose` — verify 31/31 pass
  - Start dev server, use Playwright to:
    - Visit `/` (FR) — verify French scene text renders
    - Visit `/en` (EN) — verify English scene text renders
    - Visit `/projets` — verify project images have alt text
  - Save all evidence

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`playwright`]

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (after Wave 1)
  - **Blocks**: None
  - **Blocked By**: Tasks 1, 2, 3, 4

  **References**:
  - Previous build output for comparison
  - `.sisyphus/evidence/verification/` — Previous verification screenshots

  **Acceptance Criteria**:
  - [x] `npm run build` exits 0
  - [x] No "Duplicated imports" in build output
  - [x] `npx vitest run` — 31/31 tests pass
  - [x] EN homepage shows English text
  - [x] FR homepage shows French text
  - [x] Project images have alt attributes

  ```
  Scenario: Clean build with no duplicated import warnings
    Tool: Bash
    Steps:
      1. Run `npm run build 2>&1 | grep -ci "duplicated"`
      2. Verify output is "0"
    Expected Result: Zero duplicated import warnings
    Evidence: .sisyphus/evidence/task-5-clean-build.md

  Scenario: EN homepage i18n verification
    Tool: Playwright
    Steps:
      1. Start dev server
      2. Navigate to `/en` at 1440px
      3. Wait 3s for hydration + parallax load
      4. Scroll to 50% of page
      5. Screenshot full page
      6. Verify presence of English text
    Expected Result: English scene labels visible
    Evidence: .sisyphus/evidence/task-5-en-i18n.png

  Scenario: FR homepage unchanged
    Tool: Playwright
    Steps:
      1. Navigate to `/` at 1440px
      2. Wait 3s for hydration
      3. Scroll to 50% of page
      4. Screenshot full page
    Expected Result: French scene labels visible (unchanged from before)
    Evidence: .sisyphus/evidence/task-5-fr-unchanged.png
  ```

  **Commit**: YES
  - Message: `fix: resolve all small errors (build warnings, i18n, a11y, config)`
  - Files: All files from Tasks 1-4
  - Pre-commit: `npm run build && npx vitest run`

---

## Commit Strategy

| Task | Commit Message | Files |
|------|---------------|-------|
| 1-4 (grouped) | `fix: resolve all small errors (build warnings, i18n, a11y, config)` | `utils/parallax-utils.ts`, `utils/__tests__/parallax-utils.test.ts`, `locales/fr.json`, `locales/en.json`, `components/ParallaxHome.vue`, `components/sections/SectionProjects.vue`, `app.config.ts` |

---

## Success Criteria

### Verification Commands
```bash
npm run build 2>&1 | grep -ci "duplicated"  # Expected: 0
npx vitest run                                # Expected: 31/31 pass
```

### Final Checklist
- [x] Zero "Duplicated imports" warnings in build
- [x] All 31 tests pass
- [x] EN homepage shows English scene text
- [x] FR homepage shows French scene text (unchanged)
- [x] SectionProjects img has alt attribute
- [x] No fake phone number in app.config.ts
- [x] All placeholder config values have TODO comments
- [x] Both locale files have 89+ keys (was 84)
