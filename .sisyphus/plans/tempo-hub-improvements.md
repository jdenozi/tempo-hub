# Tempo Hub & Tempo Core — Full Improvement Plan

## TL;DR

> **Quick Summary**: Comprehensive improvement of tempo-hub (agency website) and tempo-core (reusable Nuxt layer). Setup TDD infrastructure, refactor theming system, implement Stripe backend, extract ParallaxHome into maintainable composables, fix SEO gaps, and analyze performance.
> 
> **Deliverables**:
> - Vitest test infrastructure with characterization tests
> - Theming system using CSS variables instead of hardcoded hex
> - Stripe backend in tempo-core (webhooks, env config, customer portal)
> - ParallaxHome.vue refactored from 3,595 lines to <2,000 lines with extracted composables
> - SEO fixes (schemas, meta, robots.txt)
> - Performance analysis report
> 
> **Estimated Effort**: Large (40-60h across 6 phases)
> **Parallel Execution**: YES — 6 waves with max 7 concurrent tasks
> **Critical Path**: Test Setup → Theming → Stripe → ParallaxHome Data → ParallaxHome Animation → SEO → Performance

---

## Context

### Original Request
User wants comprehensive improvements to both tempo-hub (agency site) and tempo-core (reusable engine). First real site using this core module — needs to be production-ready.

### Interview Summary
**Key Discussions**:
- **Site nature**: User's own agency website (Tempo Hub), not a client test
- **Scope**: Both tempo-core AND tempo-hub improvements
- **ParallaxHome**: Keep spatial artistic direction, refactor for maintainability
- **Stripe**: Implement full backend in tempo-core (configurable per project)
- **Tests**: TDD approach with Vitest

**Research Findings**:
- ParallaxHome is 3,595 lines (not 900+ as initially stated) with 500 hardcoded hex colors
- 540 total hardcoded hex colors across 14 hub component files
- Stripe is frontend-only (pricing table web component), zero backend
- SEO: missing og-image, PWA icons, _robots.txt naming issue, no Organization schema
- Docker build may be missing component directories in COPY commands

### Metis Review
**Identified Gaps** (addressed):
- Submodule commit ordering — tasks tagged [CORE] or [HUB]
- ParallaxHome estimate corrected to 40-60h
- Stripe architecture decision: tempo-core with per-project config
- Visual regression testing required for ParallaxHome
- Webhook local testing via Stripe CLI

---

## Work Objectives

### Core Objective
Make tempo-hub production-ready while strengthening tempo-core as a reusable foundation for future client sites.

### Concrete Deliverables
- `tempo-core/vitest.config.ts` + `tempo-hub/vitest.config.ts` — Test infrastructure
- `tempo-core/assets/css/main.css` — Extended CSS variable system with `--color-primary`, `--color-accent`
- `tempo-core/server/api/stripe/` — Webhook handler, customer portal redirect
- `tempo-hub/composables/useParallaxData.ts` — Extracted data generation
- `tempo-hub/composables/useParallaxAnimations.ts` — Extracted GSAP animations
- `tempo-core/components/integrations/StripeConfig.ts` — Stripe configuration types
- SEO fixes across both repos

### Definition of Done
- [ ] `npm run build` succeeds in both tempo-hub and tempo-core
- [ ] `npx vitest run` passes with >80% coverage on composables
- [ ] Zero hardcoded `#d4a853` in non-ParallaxHome hub components
- [ ] Stripe webhook receives test events successfully
- [ ] ParallaxHome.vue < 2,000 lines
- [ ] Lighthouse SEO score > 90

### Must Have
- TDD approach — tests written before implementation
- All tasks tagged [CORE] or [HUB] for commit clarity
- Submodule commits in correct order (core first, then hub pointer update)
- Build verification between phases
- Playwright visual regression for ParallaxHome

### Must NOT Have (Guardrails)
- ❌ Custom Stripe checkout flow — use existing pricing table, only add webhooks
- ❌ Enable `features.threejs` during refactoring
- ❌ Modify ParallaxHome and theming simultaneously
- ❌ Dynamic Tailwind class composition (breaks purge)
- ❌ Mix core/hub changes in single task commits
- ❌ Skip build verification between phases
- ❌ Acceptance criteria requiring manual user confirmation

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO (will be created in Phase 0)
- **Automated tests**: TDD (RED-GREEN-REFACTOR)
- **Framework**: Vitest (compatible with Nuxt 3, fast)
- **Visual regression**: Playwright for ParallaxHome

### QA Policy
Every task includes agent-executed QA scenarios:
- **Frontend/UI**: Playwright — navigate, scroll, screenshot, assert DOM
- **API/Backend**: curl — send requests, assert status + response
- **Build**: `npm run build` — verify no errors
- **Tests**: `npx vitest run` — verify all pass

Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 0 (Foundation — sequential, must complete first):
└── Task 1: [CORE] Setup Vitest infrastructure + first characterization test

Wave 1 (Theming — MAX PARALLEL after Wave 0):
├── Task 2: [CORE] Extend CSS variable system (--color-primary, --color-accent)
├── Task 3: [HUB] Refactor Button.vue theming
├── Task 4: [HUB] Refactor Input/Textarea/Card theming
├── Task 5: [HUB] Refactor Header/Footer/Navbar theming
└── Task 6: [HUB] Refactor Section components theming (6 files)

Wave 2 (Stripe Backend — after Wave 1):
├── Task 7: [CORE] Add Stripe SDK + types + runtimeConfig
├── Task 8: [CORE] Implement webhook handler
├── Task 9: [CORE] Implement customer portal redirect
└── Task 10: [HUB] Move Stripe keys to env, update content

Wave 3a (ParallaxHome Data — after Wave 2):
├── Task 11: [HUB] Setup Playwright for visual regression
├── Task 12: [HUB] Extract useParallaxData composable
└── Task 13: [HUB] Extract utility functions (rand, grid generation)

Wave 3b (ParallaxHome Animation — after Wave 3a):
├── Task 14: [HUB] Extract useScrollAnimations composable
├── Task 15: [HUB] Extract useSceneTransitions composable
├── Task 16: [HUB] Extract useLaunchSequence composable
└── Task 17: [HUB] Refactor ParallaxHome to use extracted composables

Wave 4 (SEO — after Wave 3b):
├── Task 18: [HUB] Fix robots.txt and meta description
├── Task 19: [CORE] Add Organization/LocalBusiness schema support
├── Task 20: [HUB] Create English blog translation
└── Task 21: [HUB] Update general.json with real content

Wave 5 (Performance & Cleanup — after Wave 4):
├── Task 22: [HUB] Bundle analysis and report
├── Task 23: [CORE] Fix Dockerfile missing directories
└── Task 24: [HUB] Docker analytics volume mount

Wave FINAL (Verification — after ALL tasks, 4 parallel):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Visual QA with Playwright (unspecified-high + playwright)
└── Task F4: Scope fidelity check (deep)

Critical Path: T1 → T2 → T7 → T11 → T14 → T17 → T18 → T22 → F1-F4
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 6 (Wave 1)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|------------|--------|------|
| 1 | — | 2-24 | 0 |
| 2 | 1 | 3-6 | 1 |
| 3-6 | 2 | 7 | 1 |
| 7 | 6 | 8-10 | 2 |
| 8-10 | 7 | 11 | 2 |
| 11 | 10 | 12-13 | 3a |
| 12-13 | 11 | 14-17 | 3a |
| 14-17 | 13 | 18 | 3b |
| 18-21 | 17 | 22 | 4 |
| 22-24 | 21 | F1-F4 | 5 |
| F1-F4 | 24 | — | FINAL |

### Agent Dispatch Summary

| Wave | Tasks | Categories |
|------|-------|------------|
| 0 | 1 | `deep` (TDD setup) |
| 1 | 5 | `quick` (theming refactors) |
| 2 | 4 | `deep` (Stripe), `quick` (env) |
| 3a | 3 | `unspecified-high` (Playwright), `quick` (extraction) |
| 3b | 4 | `deep` (animation extraction) |
| 4 | 4 | `quick` (SEO fixes), `writing` (blog) |
| 5 | 3 | `unspecified-high` (analysis), `quick` (Docker) |
| FINAL | 4 | `oracle`, `unspecified-high`, `deep` |

---

## TODOs


- [ ] 1. [CORE] Setup Vitest Infrastructure + Characterization Tests

  **What to do**:
  - Install vitest, @vue/test-utils, happy-dom in tempo-core
  - Create `tempo-core/vitest.config.ts` with Nuxt preset
  - Create `tempo-hub/vitest.config.ts` extending core config
  - Write characterization test for `useClientConfig` composable
  - Write characterization test for `useFeatures` composable
  - Add `test` script to both package.json files
  - Verify tests pass with `npx vitest run`

  **Must NOT do**:
  - Don't test UI components yet (no Vue Test Utils component tests)
  - Don't setup Playwright yet (that's Task 11)
  - Don't modify any existing code (characterization tests only)

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: TDD setup requires understanding Nuxt 3 testing patterns, async composables
  - **Skills**: []
    - No special skills needed — standard Vitest setup

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 0 (foundation)
  - **Blocks**: All other tasks (2-24)
  - **Blocked By**: None (starts immediately)

  **References**:
  - `tempo-core/composables/useClientConfig.ts` — Target for first test
  - `tempo-core/composables/useFeatures.ts` — Target for second test
  - `tempo-core/package.json` — Add vitest dependency here
  - `tempo-hub/package.json` — Add test script here
  - Official docs: https://vitest.dev/guide/
  - Nuxt testing: https://nuxt.com/docs/getting-started/testing

  **Acceptance Criteria**:
  - [ ] `npx vitest run` executes without errors
  - [ ] At least 2 test files exist (useClientConfig.test.ts, useFeatures.test.ts)
  - [ ] All tests pass

  **QA Scenarios:**
  ```
  Scenario: Vitest runs successfully
    Tool: Bash
    Preconditions: Dependencies installed
    Steps:
      1. Run `npx vitest run --reporter=verbose`
      2. Capture output
    Expected Result: Output contains "Tests" and "passed", exit code 0
    Failure Indicators: "FAIL", non-zero exit code, "Cannot find module"
    Evidence: .sisyphus/evidence/task-1-vitest-run.txt

  Scenario: Test files exist and cover composables
    Tool: Bash
    Preconditions: Test setup complete
    Steps:
      1. Run `find . -name "*.test.ts" -o -name "*.spec.ts" | head -10`
      2. Run `grep -l "useClientConfig\|useFeatures" **/*.test.ts 2>/dev/null || echo 'none'`
    Expected Result: At least 2 test files found, both composables covered
    Evidence: .sisyphus/evidence/task-1-test-files.txt
  ```

  **Commit**: YES
  - Message: `test(core): setup vitest infrastructure with composable tests`
  - Files: `tempo-core/vitest.config.ts`, `tempo-core/package.json`, `tempo-hub/vitest.config.ts`, `tempo-hub/package.json`, `tempo-core/composables/__tests__/*.test.ts`
  - Pre-commit: `npx vitest run`

- [ ] 2. [CORE] Extend CSS Variable System

  **What to do**:
  - Add `--color-primary` (maps to primary-500) to `tempo-core/assets/css/main.css`
  - Add `--color-accent` (maps to accent-500) to `tempo-core/assets/css/main.css`
  - Add `--color-primary-hover`, `--color-primary-active` variants
  - Override these in `tempo-hub/assets/css/theme.css` with gold palette values
  - Write test verifying CSS variables are defined

  **Must NOT do**:
  - Don't modify any Vue components yet
  - Don't touch ParallaxHome.vue

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple CSS variable additions
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (blocks other theming tasks)
  - **Parallel Group**: Wave 1 (first in wave)
  - **Blocks**: Tasks 3-6
  - **Blocked By**: Task 1

  **References**:
  - `tempo-core/assets/css/main.css:1-20` — Existing CSS variables
  - `tempo-hub/assets/css/theme.css` — Client override file
  - `tempo-hub/tailwind.config.ts:10-22` — Primary color palette (#d4a853 = primary-500)

  **Acceptance Criteria**:
  - [ ] `--color-primary` defined in main.css and theme.css
  - [ ] `--color-accent` defined in main.css and theme.css
  - [ ] `npm run build` succeeds

  **QA Scenarios:**
  ```
  Scenario: CSS variables are defined
    Tool: Bash
    Steps:
      1. Run `grep "--color-primary" tempo-core/assets/css/main.css`
      2. Run `grep "--color-primary" assets/css/theme.css`
    Expected Result: Both files contain --color-primary definition
    Evidence: .sisyphus/evidence/task-2-css-vars.txt
  ```

  **Commit**: YES
  - Message: `feat(core): add primary and accent CSS variables`
  - Files: `tempo-core/assets/css/main.css`, `assets/css/theme.css`
  - Pre-commit: `npm run build`

- [ ] 3. [HUB] Refactor Button.vue Theming

  **What to do**:
  - Replace `bg-[#d4a853]` with `bg-primary-500`
  - Replace `hover:bg-[#dea95a]` with `hover:bg-primary-400`
  - Replace `active:bg-[#b88a3d]` with `active:bg-primary-600`
  - Replace `text-[#050816]` with `text-secondary-950`
  - Write test for Button component rendering

  **Must NOT do**:
  - Don't change component API/props
  - Don't modify animations

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 4, 5, 6)
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 7
  - **Blocked By**: Task 2

  **References**:
  - `components/ui/Button.vue` — Target file (hub override)
  - `tempo-core/components/ui/Button.vue` — Core version for comparison
  - `tailwind.config.ts` — Verify primary-500 = #d4a853

  **Acceptance Criteria**:
  - [ ] Zero `#d4a853` or `#dea95a` or `#b88a3d` in Button.vue
  - [ ] `npm run build` succeeds
  - [ ] Visual appearance unchanged (same gold color)

  **QA Scenarios:**
  ```
  Scenario: No hardcoded hex in Button
    Tool: Bash
    Steps:
      1. Run `grep -E "#[0-9a-fA-F]{6}" components/ui/Button.vue || echo 'CLEAN'`
    Expected Result: Output is "CLEAN"
    Evidence: .sisyphus/evidence/task-3-button-clean.txt

  Scenario: Button renders correctly
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000
      2. Find first button element
      3. Get computed background-color
      4. Assert color is rgb(212, 168, 83) or equivalent
    Expected Result: Button has correct gold background
    Evidence: .sisyphus/evidence/task-3-button-render.png
  ```

  **Commit**: YES (groups with Tasks 4, 5, 6)
  - Message: `refactor(hub): migrate UI components to Tailwind color classes`
  - Files: `components/ui/Button.vue`
  - Pre-commit: `npm run build`

- [ ] 4. [HUB] Refactor Input/Textarea/Card Theming

  **What to do**:
  - Replace hardcoded hex colors in `Input.vue`, `Textarea.vue`, `Card.vue`
  - Use `border-primary-500/20` instead of `border-[#d4a853]/20`
  - Use `focus:ring-primary-500` instead of `focus:ring-[#d4a853]`
  - Use `bg-secondary-950/50` instead of `bg-[#050816]/50`

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 3, 5, 6)
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 7
  - **Blocked By**: Task 2

  **References**:
  - `components/ui/Input.vue`, `components/ui/Textarea.vue`, `components/ui/Card.vue`

  **Acceptance Criteria**:
  - [ ] Zero `#d4a853` in all three files
  - [ ] `npm run build` succeeds

  **QA Scenarios:**
  ```
  Scenario: No hardcoded hex in form components
    Tool: Bash
    Steps:
      1. Run `grep -E "#[0-9a-fA-F]{6}" components/ui/Input.vue components/ui/Textarea.vue components/ui/Card.vue || echo 'CLEAN'`
    Expected Result: "CLEAN"
    Evidence: .sisyphus/evidence/task-4-form-clean.txt
  ```

  **Commit**: YES (groups with Task 3)
  - Files: `components/ui/Input.vue`, `components/ui/Textarea.vue`, `components/ui/Card.vue`

- [ ] 5. [HUB] Refactor Header/Footer/Navbar Theming

  **What to do**:
  - Replace hardcoded hex in `Header.vue`: `bg-[#050816]` → `bg-secondary-950`
  - Replace hardcoded hex in `Footer.vue`: links `text-[#d4a853]` → `text-primary-500`
  - Replace hardcoded hex in `Navbar.vue`: hover states
  - Replace `white/10`, `white/5` with `bg-white/10` (already valid Tailwind)
  - Replace `LangSwitcher.vue` hardcoded colors

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 3, 4, 6)
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 7
  - **Blocked By**: Task 2

  **References**:
  - `components/layout/Header.vue`, `components/layout/Footer.vue`, `components/layout/Navbar.vue`, `components/layout/LangSwitcher.vue`

  **Acceptance Criteria**:
  - [ ] Zero `#d4a853` or `#050816` in layout components
  - [ ] `npm run build` succeeds

  **QA Scenarios:**
  ```
  Scenario: No hardcoded hex in layout components
    Tool: Bash
    Steps:
      1. Run `grep -rE "#[0-9a-fA-F]{6}" components/layout/ || echo 'CLEAN'`
    Expected Result: "CLEAN"
    Evidence: .sisyphus/evidence/task-5-layout-clean.txt
  ```

  **Commit**: YES (groups with Tasks 3, 4)
  - Files: `components/layout/Header.vue`, `components/layout/Footer.vue`, `components/layout/Navbar.vue`, `components/layout/LangSwitcher.vue`

- [ ] 6. [HUB] Refactor Section Components Theming

  **What to do**:
  - Refactor 6 section component overrides:
    - `SectionContact.vue`: icons `text-[#d4a853]` → `text-primary-500`
    - `SectionStats.vue`: numbers `text-[#d4a853]` → `text-primary-500`
    - `SectionFeatures.vue`: icons and highlights
    - `SectionPricing.vue`: prices, badges
    - `SectionTestimonials.vue`: stars, quotes
    - `SectionCta.vue`: button backgrounds
  - Use `text-gray-300` → `text-secondary-200` or keep gray if intentional

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 3, 4, 5)
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 7
  - **Blocked By**: Task 2

  **References**:
  - `components/sections/SectionContact.vue`, `components/sections/SectionStats.vue`
  - `components/sections/SectionFeatures.vue`, `components/sections/SectionPricing.vue`
  - `components/sections/SectionTestimonials.vue`, `components/sections/SectionCta.vue`

  **Acceptance Criteria**:
  - [ ] Zero `#d4a853` in all 6 section components
  - [ ] `npm run build` succeeds

  **QA Scenarios:**
  ```
  Scenario: No hardcoded hex in section components
    Tool: Bash
    Steps:
      1. Run `grep -rE "#[0-9a-fA-F]{6}" components/sections/ | grep -v Stripe | grep -v Parallax || echo 'CLEAN'`
    Expected Result: "CLEAN" or only SectionStripePricing/ParallaxHome matches
    Evidence: .sisyphus/evidence/task-6-sections-clean.txt
  ```

  **Commit**: YES (groups with Tasks 3, 4, 5)
  - Message: `refactor(hub): migrate all components to Tailwind color classes`
  - Files: `components/sections/*.vue`
  - Pre-commit: `npm run build`

- [ ] 7. [CORE] Add Stripe SDK + Types + RuntimeConfig

  **What to do**:
  - Install `stripe` package in tempo-core
  - Create `tempo-core/server/utils/stripe.ts` with Stripe client initialization
  - Add Stripe types: `tempo-core/types/stripe.ts`
  - Add `runtimeConfig.stripe.secretKey` and `runtimeConfig.public.stripe.publishableKey` to nuxt.config.ts
  - Create `tempo-core/composables/useStripeConfig.ts` for client-side key access
  - Write tests for Stripe config composable

  **Must NOT do**:
  - Don't implement checkout flow (pricing tables handle this)
  - Don't create customer portal yet (Task 9)

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Server-side Stripe setup with proper typing
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (first in Wave 2)
  - **Parallel Group**: Wave 2
  - **Blocks**: Tasks 8, 9, 10
  - **Blocked By**: Task 6

  **References**:
  - `tempo-core/nuxt.config.ts` — Add runtimeConfig
  - `tempo-core/server/api/contact.post.ts` — Pattern for server-side code
  - Stripe Node.js docs: https://stripe.com/docs/api?lang=node

  **Acceptance Criteria**:
  - [ ] `stripe` in tempo-core/package.json dependencies
  - [ ] `tempo-core/server/utils/stripe.ts` exports configured Stripe client
  - [ ] runtimeConfig includes `stripe.secretKey`
  - [ ] Test for useStripeConfig passes

  **QA Scenarios:**
  ```
  Scenario: Stripe package installed
    Tool: Bash
    Steps:
      1. Run `grep '"stripe"' tempo-core/package.json`
    Expected Result: stripe in dependencies
    Evidence: .sisyphus/evidence/task-7-stripe-dep.txt

  Scenario: Stripe client initializes
    Tool: Bash
    Steps:
      1. Run `npx vitest run --filter stripe`
    Expected Result: Tests pass
    Evidence: .sisyphus/evidence/task-7-stripe-test.txt
  ```

  **Commit**: YES
  - Message: `feat(core): add stripe SDK and runtime configuration`
  - Files: `tempo-core/package.json`, `tempo-core/server/utils/stripe.ts`, `tempo-core/nuxt.config.ts`, `tempo-core/types/stripe.ts`, `tempo-core/composables/useStripeConfig.ts`
  - Pre-commit: `npm run build && npx vitest run`

- [ ] 8. [CORE] Implement Stripe Webhook Handler

  **What to do**:
  - Create `tempo-core/server/api/stripe/webhook.post.ts`
  - Verify webhook signature using `STRIPE_WEBHOOK_SECRET`
  - Handle `checkout.session.completed` event
  - Handle `customer.subscription.updated` event
  - Handle `customer.subscription.deleted` event
  - Log events to console (actual fulfillment is project-specific)
  - Add `STRIPE_WEBHOOK_SECRET` to .env.example
  - Write integration test with mocked Stripe events

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Webhook signature verification is security-critical
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 9, 10)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 11
  - **Blocked By**: Task 7

  **References**:
  - `tempo-core/server/api/contact.post.ts` — Existing API pattern
  - Stripe webhooks: https://stripe.com/docs/webhooks
  - Signature verification: https://stripe.com/docs/webhooks/signatures

  **Acceptance Criteria**:
  - [ ] Webhook endpoint exists at `/api/stripe/webhook`
  - [ ] Invalid signatures return 400
  - [ ] Valid checkout.session.completed events return 200

  **QA Scenarios:**
  ```
  Scenario: Webhook rejects invalid signature
    Tool: Bash (curl)
    Steps:
      1. Start dev server
      2. Run `curl -X POST http://localhost:3000/api/stripe/webhook -H 'stripe-signature: invalid' -d '{}'`
    Expected Result: HTTP 400 response
    Evidence: .sisyphus/evidence/task-8-webhook-invalid.txt

  Scenario: Webhook accepts valid Stripe CLI event
    Tool: Bash
    Steps:
      1. Run `stripe listen --forward-to localhost:3000/api/stripe/webhook`
      2. Run `stripe trigger checkout.session.completed`
    Expected Result: 200 response, event logged
    Evidence: .sisyphus/evidence/task-8-webhook-valid.txt
  ```

  **Commit**: YES
  - Message: `feat(core): implement stripe webhook handler with signature verification`
  - Files: `tempo-core/server/api/stripe/webhook.post.ts`, `.env.example`
  - Pre-commit: `npm run build`

- [ ] 9. [CORE] Implement Customer Portal Redirect

  **What to do**:
  - Create `tempo-core/server/api/stripe/portal.post.ts`
  - Accept customer_id or email, create portal session
  - Return portal URL for client redirect
  - Add to app.config type definitions for portal enablement

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 8, 10)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 11
  - **Blocked By**: Task 7

  **References**:
  - Stripe Customer Portal: https://stripe.com/docs/billing/subscriptions/customer-portal

  **Acceptance Criteria**:
  - [ ] `/api/stripe/portal` endpoint exists
  - [ ] Returns redirect URL on success

  **QA Scenarios:**
  ```
  Scenario: Portal returns redirect URL
    Tool: Bash (curl)
    Steps:
      1. Run `curl -X POST http://localhost:3000/api/stripe/portal -H 'Content-Type: application/json' -d '{"email":"test@example.com"}'`
    Expected Result: JSON with url field (or error if no customer)
    Evidence: .sisyphus/evidence/task-9-portal.txt
  ```

  **Commit**: YES
  - Message: `feat(core): add stripe customer portal redirect endpoint`
  - Files: `tempo-core/server/api/stripe/portal.post.ts`

- [ ] 10. [HUB] Move Stripe Keys to Env + Update Content

  **What to do**:
  - Add `STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY` to `.env`
  - Add `STRIPE_WEBHOOK_SECRET` to `.env`
  - Update `.env.example` with all Stripe vars
  - Remove hardcoded `publishableKey` from `content/fr/pages/services.md`
  - Update SectionStripePricing to read key from runtimeConfig via useStripeConfig
  - Keep pricing table IDs in content (they're not secrets)

  **Must NOT do**:
  - Don't commit actual secret keys
  - Don't remove pricing table IDs from content

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 8, 9)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 11
  - **Blocked By**: Task 7

  **References**:
  - `content/fr/pages/services.md:47-58` — Current hardcoded keys
  - `components/sections/SectionStripePricing.vue` — Update to use composable

  **Acceptance Criteria**:
  - [ ] Zero `pk_live_` strings in content/ directory
  - [ ] STRIPE_* vars in .env.example
  - [ ] Pricing tables still work (using env keys)

  **QA Scenarios:**
  ```
  Scenario: No publishable key in content
    Tool: Bash
    Steps:
      1. Run `grep -r "pk_live_" content/ || echo 'CLEAN'`
    Expected Result: "CLEAN"
    Evidence: .sisyphus/evidence/task-10-no-key-content.txt

  Scenario: Pricing tables render
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000/services
      2. Wait for stripe-pricing-table element
      3. Assert element exists and has content
    Expected Result: Stripe pricing table visible
    Evidence: .sisyphus/evidence/task-10-pricing-render.png
  ```

  **Commit**: YES
  - Message: `security(hub): move stripe keys to environment variables`
  - Files: `.env.example`, `content/fr/pages/services.md`, `components/sections/SectionStripePricing.vue`
  - Pre-commit: `npm run build`

- [ ] 11. [HUB] Setup Playwright for Visual Regression

  **What to do**:
  - Install `@playwright/test` in tempo-hub
  - Create `playwright.config.ts` with Nuxt dev server setup
  - Create baseline test: `tests/parallax-home.spec.ts`
  - Capture baseline screenshots at 4 scroll positions (0%, 33%, 66%, 100%)
  - Save baseline images to `tests/screenshots/baseline/`

  **Must NOT do**:
  - Don't modify ParallaxHome.vue yet
  - Don't run visual comparisons yet (no changes to compare)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Playwright setup with Nuxt integration
  - **Skills**: [`playwright`]

  **Parallelization**:
  - **Can Run In Parallel**: NO (first in Wave 3a)
  - **Parallel Group**: Wave 3a
  - **Blocks**: Tasks 12, 13
  - **Blocked By**: Task 10

  **References**:
  - Playwright Nuxt: https://playwright.dev/docs/test-components
  - `components/ParallaxHome.vue` — Target for visual testing

  **Acceptance Criteria**:
  - [ ] `npx playwright test` runs successfully
  - [ ] 4 baseline screenshots captured
  - [ ] Screenshots show all 4 scenes

  **QA Scenarios:**
  ```
  Scenario: Playwright captures all scenes
    Tool: Bash
    Steps:
      1. Run `npx playwright test tests/parallax-home.spec.ts`
      2. Check `tests/screenshots/baseline/` for images
    Expected Result: 4 PNG files (scene-1.png, scene-2.png, scene-3.png, scene-4.png)
    Evidence: .sisyphus/evidence/task-11-screenshots/
  ```

  **Commit**: YES
  - Message: `test(hub): setup playwright visual regression for ParallaxHome`
  - Files: `playwright.config.ts`, `tests/parallax-home.spec.ts`, `tests/screenshots/baseline/*.png`

- [ ] 12. [HUB] Extract useParallaxData Composable

  **What to do**:
  - Create `composables/useParallaxData.ts`
  - Move data generation from ParallaxHome.vue:
    - `stars` (450 items)
    - `brightStars` (24 items)
    - `dustParticles` (60 items)
    - `ringDustParticles` (27 items with orbit definitions)
    - `asteroids` (14 items)
    - `constNodes` (28 items)
    - `constEdges` (50 items)
    - `tendrils` (12 items)
    - `orbitalParticles` (8 items)
    - `gridH`, `gridV` (grid line arrays)
    - `services` (3 items)
  - Move `rand()` utility to same file
  - Update ParallaxHome.vue to import from composable
  - Write unit tests for data generation

  **Must NOT do**:
  - Don't touch GSAP animations yet
  - Don't modify template structure

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Pure data extraction, no complex logic
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 13)
  - **Parallel Group**: Wave 3a
  - **Blocks**: Tasks 14-17
  - **Blocked By**: Task 11

  **References**:
  - `components/ParallaxHome.vue:2883-3050` — Script section with data generation
  - Metis analysis: "Data generation is safely extractable. No dependencies on GSAP/refs."

  **Acceptance Criteria**:
  - [ ] `composables/useParallaxData.ts` exists
  - [ ] ParallaxHome imports `useParallaxData()`
  - [ ] Unit tests pass for data generation
  - [ ] Visual regression: no changes in screenshots

  **QA Scenarios:**
  ```
  Scenario: Data composable is tested
    Tool: Bash
    Steps:
      1. Run `npx vitest run --filter useParallaxData`
    Expected Result: Tests pass, data arrays have correct lengths
    Evidence: .sisyphus/evidence/task-12-data-test.txt

  Scenario: Visual regression passes
    Tool: Bash
    Steps:
      1. Run `npx playwright test tests/parallax-home.spec.ts`
    Expected Result: No visual differences
    Evidence: .sisyphus/evidence/task-12-visual.txt
  ```

  **Commit**: YES
  - Message: `refactor(hub): extract useParallaxData from ParallaxHome`
  - Files: `composables/useParallaxData.ts`, `components/ParallaxHome.vue`
  - Pre-commit: `npx vitest run && npx playwright test`

- [ ] 13. [HUB] Extract Utility Functions

  **What to do**:
  - Create `utils/parallax-utils.ts`
  - Move `rand(seed)` function (deterministic pseudo-random)
  - Move grid generation logic
  - Move any other pure functions
  - Write unit tests

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 12)
  - **Blocks**: Tasks 14-17
  - **Blocked By**: Task 11

  **References**:
  - `components/ParallaxHome.vue` — Look for `function rand`

  **Acceptance Criteria**:
  - [ ] `utils/parallax-utils.ts` exists
  - [ ] Unit tests for rand() pass

  **QA Scenarios:**
  ```
  Scenario: rand() is deterministic
    Tool: Bash
    Steps:
      1. Run `npx vitest run --filter parallax-utils`
    Expected Result: Same seed produces same sequence
    Evidence: .sisyphus/evidence/task-13-rand-test.txt
  ```

  **Commit**: YES (groups with Task 12)
  - Files: `utils/parallax-utils.ts`

- [ ] 14. [HUB] Extract useScrollAnimations Composable

  **What to do**:
  - Create `composables/useScrollAnimations.ts`
  - Move scroll-driven animations from ParallaxHome:
    - Progress bar scaleX
    - Stars parallax (yPercent)
    - Dust parallax
    - Saturn planet y-movement
    - Warm background opacity
    - Scroll indicator fade
    - Light rays pulse
  - Accept refs and driverRef as parameters
  - Write integration test

  **Must NOT do**:
  - Don't extract scene transitions (Task 15)
  - Don't extract launch sequence (Task 16)

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: GSAP ScrollTrigger with refs requires careful handling
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (sequential with 15, 16)
  - **Parallel Group**: Wave 3b
  - **Blocks**: Task 15
  - **Blocked By**: Tasks 12, 13

  **References**:
  - `components/ParallaxHome.vue` — onMounted GSAP timeline
  - `tempo-core/composables/useGsap.ts` — GSAP initialization pattern
  - Metis analysis: "Pass refs as params. Animation extraction is medium risk."

  **Acceptance Criteria**:
  - [ ] `composables/useScrollAnimations.ts` exists
  - [ ] Progress bar animates on scroll
  - [ ] Visual regression: no differences

  **QA Scenarios:**
  ```
  Scenario: Scroll animations work
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000
      2. Scroll to 50%
      3. Get progress bar transform
    Expected Result: scaleX > 0.4
    Evidence: .sisyphus/evidence/task-14-scroll.png
  ```

  **Commit**: YES
  - Message: `refactor(hub): extract useScrollAnimations from ParallaxHome`
  - Files: `composables/useScrollAnimations.ts`, `components/ParallaxHome.vue`
  - Pre-commit: `npx vitest run && npx playwright test`

- [ ] 15. [HUB] Extract useSceneTransitions Composable

  **What to do**:
  - Create `composables/useSceneTransitions.ts`
  - Move 4-scene fade/slide transitions:
    - Scene 1 out (18%-30%)
    - Scene 2 in (24%-34%) + constellation nodes/edges/tendrils
    - Scene 2 out (48%-58%)
    - Scene 3 in (52%-62%) + buildings/ship/cards
    - Scene 3 out (72%-82%)
    - Scene 4 in (76%-86%)
  - Accept scene refs and config object as parameters
  - Parameterize scroll percentages via config

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Complex timeline orchestration, 20+ refs
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3b
  - **Blocks**: Task 16
  - **Blocked By**: Task 14

  **References**:
  - Metis analysis: "Scene transition choreography is high risk. Test thoroughly."

  **Acceptance Criteria**:
  - [ ] `composables/useSceneTransitions.ts` exists
  - [ ] All 4 scenes transition correctly
  - [ ] Visual regression: no differences

  **QA Scenarios:**
  ```
  Scenario: All scenes visible at correct scroll positions
    Tool: Playwright
    Steps:
      1. Navigate and scroll to 25%, capture scene 2
      2. Scroll to 55%, capture scene 3
      3. Scroll to 80%, capture scene 4
    Expected Result: Each scene visible at its position
    Evidence: .sisyphus/evidence/task-15-scenes/
  ```

  **Commit**: YES
  - Message: `refactor(hub): extract useSceneTransitions from ParallaxHome`
  - Files: `composables/useSceneTransitions.ts`, `components/ParallaxHome.vue`

- [ ] 16. [HUB] Extract useLaunchSequence Composable

  **What to do**:
  - Create `composables/useLaunchSequence.ts`
  - Move 5 orchestrated timelines:
    - Ignition flash (81%-87%)
    - Launch blast (82%-97%)
    - Spacecraft phases (80%-98%)
    - Exhaust plume (81%-96%)
    - Contrail (84%-98%)
  - Accept refs and config as parameters

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Highest risk — 5 interdependent timelines
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3b
  - **Blocks**: Task 17
  - **Blocked By**: Task 15

  **Acceptance Criteria**:
  - [ ] `composables/useLaunchSequence.ts` exists
  - [ ] Launch animation plays at 80-98% scroll
  - [ ] Visual regression: no differences

  **QA Scenarios:**
  ```
  Scenario: Launch sequence plays
    Tool: Playwright
    Steps:
      1. Navigate and scroll to 90%
      2. Capture screenshot
    Expected Result: Spacecraft visible mid-launch
    Evidence: .sisyphus/evidence/task-16-launch.png
  ```

  **Commit**: YES
  - Message: `refactor(hub): extract useLaunchSequence from ParallaxHome`
  - Files: `composables/useLaunchSequence.ts`, `components/ParallaxHome.vue`

- [ ] 17. [HUB] Final ParallaxHome Cleanup

  **What to do**:
  - Review ParallaxHome.vue line count (target: <2000)
  - Remove dead code, unused imports
  - Add TypeScript types for all refs
  - Document remaining inline code with comments
  - Run final visual regression
  - Update line count in plan documentation

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3b (last)
  - **Blocks**: Task 18
  - **Blocked By**: Task 16

  **Acceptance Criteria**:
  - [ ] ParallaxHome.vue < 2000 lines
  - [ ] No TypeScript errors
  - [ ] Visual regression passes

  **QA Scenarios:**
  ```
  Scenario: Line count reduced
    Tool: Bash
    Steps:
      1. Run `wc -l components/ParallaxHome.vue`
    Expected Result: Number < 2000
    Evidence: .sisyphus/evidence/task-17-linecount.txt

  Scenario: Full visual regression
    Tool: Playwright
    Steps:
      1. Run full Playwright suite
      2. Compare all screenshots with baselines
    Expected Result: No visual differences
    Evidence: .sisyphus/evidence/task-17-final-visual/
  ```

  **Commit**: YES
  - Message: `refactor(hub): complete ParallaxHome extraction (3595 -> <2000 lines)`
  - Files: `components/ParallaxHome.vue`

- [ ] 18. [HUB] Fix robots.txt and Meta Description

  **What to do**:
  - Delete `public/_robots.txt` (module generates dynamically)
  - Update `nuxt.config.ts` site.description from template text to real description:
    "Agence web spécialisée dans la création de sites vitrines sur mesure, performants et optimisés SEO."
  - Verify robots.txt accessible at `/robots.txt`
  - Verify sitemap accessible at `/sitemap.xml`

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 19, 20, 21)
  - **Parallel Group**: Wave 4
  - **Blocks**: Task 22
  - **Blocked By**: Task 17

  **References**:
  - `nuxt.config.ts:92-97` — site.description
  - `public/_robots.txt` — Delete this file

  **Acceptance Criteria**:
  - [ ] No `_robots.txt` file in public/
  - [ ] site.description updated
  - [ ] `/robots.txt` returns valid content

  **QA Scenarios:**
  ```
  Scenario: robots.txt accessible
    Tool: Bash (curl)
    Steps:
      1. Run `curl http://localhost:3000/robots.txt`
    Expected Result: Valid robots.txt content (User-agent, etc.)
    Evidence: .sisyphus/evidence/task-18-robots.txt

  Scenario: sitemap accessible
    Tool: Bash (curl)
    Steps:
      1. Run `curl http://localhost:3000/sitemap.xml | head -20`
    Expected Result: XML sitemap with URLs
    Evidence: .sisyphus/evidence/task-18-sitemap.txt
  ```

  **Commit**: YES
  - Message: `fix(hub): correct robots.txt and meta description`
  - Files: `nuxt.config.ts`, delete `public/_robots.txt`

- [ ] 19. [CORE] Add Organization/LocalBusiness Schema Support

  **What to do**:
  - Create `tempo-core/composables/useSchemaOrg.ts`
  - Add Organization schema injection via `useSchemaOrg`
  - Add LocalBusiness schema option for contact pages
  - Read from `useClientConfig()` for business info
  - Write test for schema generation

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 18, 20, 21)
  - **Parallel Group**: Wave 4
  - **Blocks**: Task 22
  - **Blocked By**: Task 17

  **References**:
  - `@nuxtjs/seo` schema.org support
  - `tempo-core/composables/useClientConfig.ts` — Business info source
  - schema.org docs: https://schema.org/Organization

  **Acceptance Criteria**:
  - [ ] `useSchemaOrg()` composable exists
  - [ ] Organization JSON-LD appears in page source

  **QA Scenarios:**
  ```
  Scenario: Organization schema in page
    Tool: Bash (curl + grep)
    Steps:
      1. Run `curl http://localhost:3000 | grep -o 'application/ld+json' | head -1`
    Expected Result: "application/ld+json" found
    Evidence: .sisyphus/evidence/task-19-schema.txt
  ```

  **Commit**: YES
  - Message: `feat(core): add organization and local business schema support`
  - Files: `tempo-core/composables/useSchemaOrg.ts`

- [ ] 20. [HUB] Create English Blog Translation

  **What to do**:
  - Create `content/en/blog/` directory
  - Translate `site-sur-mesure-vs-wordpress-seo.md` to English
  - Title: "Custom Sites vs WordPress: Why a Tailor-Made Website is Better for SEO"
  - Maintain same structure and frontmatter format
  - Update any French-specific references

  **Recommended Agent Profile**:
  - **Category**: `writing`
    - Reason: Content translation task
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 18, 19, 21)
  - **Parallel Group**: Wave 4
  - **Blocks**: Task 22
  - **Blocked By**: Task 17

  **References**:
  - `content/fr/blog/site-sur-mesure-vs-wordpress-seo.md` — Source (294 lines)

  **Acceptance Criteria**:
  - [ ] `content/en/blog/custom-sites-vs-wordpress-seo.md` exists
  - [ ] All frontmatter fields present (title, description, date, image)
  - [ ] Build succeeds with new content

  **QA Scenarios:**
  ```
  Scenario: English blog page renders
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000/en/blog/custom-sites-vs-wordpress-seo
      2. Assert page title contains "Custom Sites"
    Expected Result: English blog article loads
    Evidence: .sisyphus/evidence/task-20-en-blog.png
  ```

  **Commit**: YES
  - Message: `content(hub): add english translation of SEO blog article`
  - Files: `content/en/blog/custom-sites-vs-wordpress-seo.md`

- [ ] 21. [HUB] Update general.json with Real Content

  **What to do**:
  - Update `content/settings/general.json`:
    - `defaultTitle`: "Tempo Hub | Agence Web"
    - `defaultDescription`: (same as nuxt.config)
    - `ogImage`: "/og-image.jpg" (user must provide file)
    - Fill in social links if available
  - Note: og-image.jpg and PWA icons must be provided by user (design assets)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 18, 19, 20)
  - **Parallel Group**: Wave 4
  - **Blocks**: Task 22
  - **Blocked By**: Task 17

  **References**:
  - `content/settings/general.json` — Target file

  **Acceptance Criteria**:
  - [ ] defaultTitle is not empty
  - [ ] defaultDescription matches nuxt.config
  - [ ] Build succeeds

  **QA Scenarios:**
  ```
  Scenario: general.json has content
    Tool: Bash
    Steps:
      1. Run `jq '.seo.defaultTitle' content/settings/general.json`
    Expected Result: Non-empty string
    Evidence: .sisyphus/evidence/task-21-general.txt
  ```

  **Commit**: YES
  - Message: `content(hub): update general.json with real site metadata`
  - Files: `content/settings/general.json`

- [ ] 22. [HUB] Bundle Analysis and Report

  **What to do**:
  - Run `npx nuxi analyze`
  - Document bundle size breakdown
  - Identify largest dependencies
  - Check Three.js is NOT in critical path (feature flag = false)
  - Create `.sisyphus/reports/bundle-analysis.md` with findings

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 23, 24)
  - **Parallel Group**: Wave 5
  - **Blocks**: F1-F4
  - **Blocked By**: Task 21

  **Acceptance Criteria**:
  - [ ] Bundle analysis report exists
  - [ ] Three.js not in main bundle (feature disabled)

  **QA Scenarios:**
  ```
  Scenario: Bundle analyzed
    Tool: Bash
    Steps:
      1. Run `npx nuxi analyze --no-serve`
      2. Check .nuxt/analyze output
    Expected Result: Analysis completes, report generated
    Evidence: .sisyphus/evidence/task-22-analyze.txt
  ```

  **Commit**: YES
  - Message: `docs(hub): add bundle analysis report`
  - Files: `.sisyphus/reports/bundle-analysis.md`

- [ ] 23. [CORE] Fix Dockerfile Missing Directories

  **What to do**:
  - Update tempo-core Dockerfile to include:
    - `COPY components/ ./components/`
    - `COPY assets/ ./assets/`
    - `COPY pages/ ./pages/`
    - `COPY server/ ./server/`
  - Test Docker build: `docker build -t tempo-core-test .`

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 22, 24)
  - **Parallel Group**: Wave 5
  - **Blocks**: F1-F4
  - **Blocked By**: Task 21

  **References**:
  - `Dockerfile` — Builder stage COPY commands
  - Metis finding: "Dockerfile doesn't COPY components/, assets/, pages/, server/"

  **Acceptance Criteria**:
  - [ ] Dockerfile includes all necessary directories
  - [ ] `docker build` succeeds

  **QA Scenarios:**
  ```
  Scenario: Docker build succeeds
    Tool: Bash
    Steps:
      1. Run `docker build -t tempo-hub-test . 2>&1 | tail -5`
    Expected Result: Build successful message
    Evidence: .sisyphus/evidence/task-23-docker.txt
  ```

  **Commit**: YES
  - Message: `fix(core): add missing directories to Dockerfile`
  - Files: `Dockerfile`

- [ ] 24. [HUB] Docker Analytics Volume Mount

  **What to do**:
  - Update `docker-compose.yml` to add volume for analytics SQLite:
    - `- ./data:/app/data`
  - Ensure analytics persists across container restarts

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 22, 23)
  - **Parallel Group**: Wave 5
  - **Blocks**: F1-F4
  - **Blocked By**: Task 21

  **References**:
  - `docker-compose.yml` — Target file
  - `data/analytics.db` — SQLite database

  **Acceptance Criteria**:
  - [ ] Volume mount in docker-compose.yml
  - [ ] data/ directory persists

  **QA Scenarios:**
  ```
  Scenario: Analytics volume configured
    Tool: Bash
    Steps:
      1. Run `grep -A 5 'volumes:' docker-compose.yml | grep data`
    Expected Result: ./data mount found
    Evidence: .sisyphus/evidence/task-24-volume.txt
  ```

  **Commit**: YES
  - Message: `fix(hub): add analytics volume mount to docker-compose`
  - Files: `docker-compose.yml`
---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists. For each "Must NOT Have": search codebase for forbidden patterns. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `npm run build` in both repos. Run `npx vitest run`. Check for TypeScript errors, unused imports, console.log in prod. Verify no hardcoded `#d4a853` outside ParallaxHome.
  Output: `Build [PASS/FAIL] | Tests [N pass/N fail] | Theming [CLEAN/N issues] | VERDICT`

- [ ] F3. **Visual QA with Playwright** — `unspecified-high` + `playwright` skill
  Run all Playwright tests. Verify ParallaxHome scrolls through 4 scenes. Capture screenshots at each scene transition. Compare with baseline (if exists).
  Output: `Scenarios [N/N pass] | Screenshots [N captured] | Regressions [N/NONE] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", verify actual implementation matches. Check [CORE] tasks modified only tempo-core, [HUB] tasks modified only tempo-hub. Verify submodule pointer updated correctly.
  Output: `Tasks [N/N compliant] | Repo Boundary [CLEAN/N violations] | VERDICT`

---

## Commit Strategy

| Phase | Commit Message Pattern | Pre-commit Check |
|-------|------------------------|------------------|
| 0 | `test(core): setup vitest infrastructure` | `npx vitest run` |
| 1 | `refactor(hub): migrate {component} to CSS variables` | `npm run build` |
| 2 | `feat(core): add stripe webhook handler` | `npm run build && npx vitest run` |
| 3 | `refactor(hub): extract {composable} from ParallaxHome` | `npm run build && npx playwright test` |
| 4 | `fix(hub): {seo-fix-description}` | `npm run build` |
| 5 | `chore({repo}): {cleanup-description}` | `npm run build` |

**Submodule Commit Order**:
1. Commit in tempo-core first
2. `cd tempo-hub && git add tempo-core`
3. Commit in tempo-hub with updated submodule pointer

---

## Success Criteria

### Verification Commands
```bash
# Build both projects
cd tempo-core && npm run build  # Expected: "Nitro built"
cd .. && npm run build          # Expected: "Nitro built"

# Run tests
npx vitest run --reporter=verbose  # Expected: "Tests X passed"

# Check theming
grep -r "#d4a853" components/ --include="*.vue" -l | grep -v ParallaxHome | wc -l
# Expected: 0

# Check ParallaxHome size
wc -l components/ParallaxHome.vue | awk '{print $1}'
# Expected: < 2000

# Stripe webhook test
stripe trigger checkout.session.completed --api-key $STRIPE_SECRET_KEY
# Expected: 200 response from webhook

# Lighthouse SEO
npx lighthouse https://localhost:3000 --only-categories=seo --output=json | jq '.categories.seo.score'
# Expected: > 0.9
```

### Final Checklist
- [ ] All "Must Have" items present and verified
- [ ] All "Must NOT Have" items absent (grep verification)
- [ ] All tests pass (`npx vitest run`)
- [ ] Build succeeds in both repos
- [ ] ParallaxHome visual regression passes
- [ ] Stripe webhook responds to test events
- [ ] SEO score > 90
