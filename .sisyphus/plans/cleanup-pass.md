# Cleanup Pass — Tempo Hub Vitrine Parfaite

## TL;DR

> **Quick Summary**: Passe de nettoyage complète sur tempo-hub pour en faire une vitrine parfaite. Corrige le bug countdown/CTA, améliore le contenu, met en avant la comparaison WordPress vs sur-mesure, et documente le tout.
> 
> **Deliverables**:
> - Bug fix: bouton rdv visible sous le countdown (z-index)
> - CTA Scene 4 i18n + lien corrigé vers /rendez-vous
> - Contenu enrichi: À propos + Portfolio
> - Promotion maximale de l'article WordPress vs Custom (nav + services + homepage)
> - Incohérences mineures corrigées (nav order, placeholder images, code blocks, comments)
> - Documentation mise à jour
> - Un commit final propre
> 
> **Estimated Effort**: Medium (3-4h across 3 waves)
> **Parallel Execution**: YES — 3 waves + verification
> **Critical Path**: Wave 1 (fixes) → Wave 2 (content + promo) → Wave 3 (docs) → FINAL (build + commit)

---

## Context

### Original Request
User: "Refais une passe pour tout nettoyer. N'oublie pas que le but est d'avoir un template réutilisable dans core. Tempo hub est ma vitrine et donc doit être parfaite. Revois aussi le contenu des pages. Il faut mettre en avant la page qui explique pourquoi notre service est mieux qu'un wordpress classique (seo etc). Aussi la page d'accueil a un petit souci le compte à rebours et lift off recouvre le bouton rdv. Bref refais une passe partout. Fais attention à pas changer les margins qui fonctionnent bien maintenant. Pense à commit aussi et documenter partout."

### Interview Summary
**Key Discussions**:
- CTA Scene 4 → doit pointer vers `/rendez-vous` (pas `/contact`)
- WordPress promo → MAXIMUM visibility (nav + homepage + services links)
- Content enrichment → enrichir À propos ET Projets
- Commit → un commit final unique

**Research Findings (4 explore agents)**:
- **Bug**: countdown-overlay `z-40` couvre le CTA container (pas de z-index). Fix = ajouter `z-50`
- **Content**: 14 pages de contenu (7 FR + 7 EN), 2 articles blog. Tout en parité FR/EN
- **Code quality**: propre (pas de console.log, TS clean, i18n complet 90 clés)
- **Template reusability**: tailwind.config + nuxt.config étendent correctement core

### Metis Review
**Critical Blockers Identified**:
- ⛔ `components/sections/` NE DOIT PAS être supprimé : 3 composants n'existent PAS dans core (SectionBooking, SectionProjects, SectionStripePricing) + les 9 autres contiennent le thème dark premium (711 lignes de customisation) qui EST l'identité visuelle du hub
- ⚠️ `NuxtLinkLocale to="/rendez-vous"` : vérifier que la locale EN redirige vers `/booking` (slugs différents FR/EN)
- ⚠️ Blog slugs différents par locale : FR `site-sur-mesure-vs-wordpress-seo` vs EN `custom-sites-vs-wordpress-seo`

**Gaps Addressed**:
- Sections deletion → ANNULÉE (serait une régression visuelle catastrophique)
- NuxtLinkLocale → tâche inclut vérification cross-locale
- Content enrichment → scoped avec sections précises à ajouter

---

## Work Objectives

### Core Objective
Transformer tempo-hub en vitrine parfaite : zéro bug, contenu premium, promotion maximale du différenciateur WordPress vs sur-mesure, documentation complète.

### Concrete Deliverables
- `components/ParallaxHome.vue`: z-index fix + i18n CTA button + lien /rendez-vous
- `content/fr/pages/a-propos.md` + `content/en/pages/about.md`: contenu enrichi
- `content/fr/pages/projets.md` + `content/en/pages/projects.md`: portfolio amélioré + code block nettoyé
- `content/fr/pages/services/site-vitrine.md` + EN: lien vers article WordPress
- `content/fr/pages/services/micro-entrepreneur.md` + EN: lien vers article WordPress
- `locales/fr.json` + `locales/en.json`: nouvelles clés pour CTA button + promo WordPress
- Navigation: lien blog ou "Pourquoi pas WordPress ?" visible
- `utils/parallax-utils.ts`: commentaire corrigé
- Blog frontmatter: placeholder images corrigées
- Nav order: incohérence corrigée (projets ≠ a-propos)
- Documentation: mise à jour README + commentaires inline

### Definition of Done
- [x] `npm run build` exits 0 sans warnings
- [x] `npx vitest run` — tous les tests passent
- [x] Homepage FR: bouton rdv visible et cliquable sous le countdown
- [x] Homepage EN: bouton booking visible et cliquable
- [x] Page À propos: contenu substantiel (mission, valeurs, processus)
- [x] Page Projets: descriptions améliorées, pas de code block vide
- [x] Article WordPress accessible depuis nav, services et homepage
- [x] Parité FR/EN maintenue sur tout le contenu

### Must Have
- Z-index fix sur Scene 4 CTA container (z-50)
- i18n du texte "Prendre rendez-vous" (pas hardcodé)
- Lien CTA → /rendez-vous (locale-aware)
- Liens vers article WordPress depuis services sub-pages
- Nav order cohérent
- Build + tests passent

### Must NOT Have (Guardrails)
- ⛔ NE PAS modifier tempo-core submodule
- ⛔ NE PAS supprimer components/sections/ (thème dark premium + 3 composants uniques)
- ⛔ NE PAS supprimer components/content/ (MDC wrappers = pipeline de rendu)
- ⛔ NE PAS changer les margins/spacing existants (surtout `margin-top: -14%` ligne 3140)
- ⛔ NE PAS refactorer ParallaxHome.vue au-delà des 3 fixes ciblés (z-index, i18n, link)
- ⛔ NE PAS ajouter de nouvelles dépendances
- ⛔ NE PAS casser la parité FR/EN (chaque changement content = les 2 locales)
- ⛔ NE PAS créer de nouvelles pages (on enrichit l'existant)
- ⛔ NE PAS toucher aux classes CSS du thème dark premium

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES (vitest)
- **Automated tests**: Tests-after (verify non-regression)
- **Framework**: vitest
- **Primary verification**: Build output + vitest run + Playwright visual

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Build**: Use Bash — `npm run build 2>&1`
- **Tests**: Use Bash — `npx vitest run`
- **Visual**: Use Playwright — navigate pages, verify content, screenshot
- **Links**: Use Playwright — click links, verify navigation

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — bug fixes + micro cleanup, ALL parallel):
├── Task 1: Fix countdown z-index + CTA i18n + link [quick]
├── Task 2: Fix nav order + projets.md code block + parallax-utils comment [quick]
├── Task 3: Fix blog placeholder images [quick]
└── Task 4: Add WordPress promo links in services sub-pages (FR + EN) [quick]

Wave 2 (After Wave 1 — content enrichment, parallel):
├── Task 5: Enrich À propos / About page (FR + EN) [writing]
├── Task 6: Improve Projets / Projects page (FR + EN) [writing]
├── Task 7: Add WordPress promo in nav + homepage Scene 4 [quick]
└── Task 8: Add i18n keys for all new content [quick]

Wave 3 (After Wave 2 — documentation):
└── Task 9: Update documentation + inline comments [writing]

Wave FINAL (After ALL — verification + commit):
├── Task F1: Build + test + visual QA [quick, playwright]
├── Task F2: Plan compliance audit [deep]
├── Task F3: Scope fidelity check [deep]
└── Task F4: Git commit [quick, git-master]
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1 | — | F1 | 1 |
| 2 | — | F1 | 1 |
| 3 | — | F1 | 1 |
| 4 | — | 7, F1 | 1 |
| 5 | — | F1 | 2 |
| 6 | — | F1 | 2 |
| 7 | 4 | F1 | 2 |
| 8 | 1, 7 | F1 | 2 |
| 9 | 1-8 | F1 | 3 |
| F1 | 1-9 | F2-F4 | FINAL |
| F2 | F1 | — | FINAL |
| F3 | F1 | — | FINAL |
| F4 | F1-F3 | — | FINAL |

### Agent Dispatch Summary

- **Wave 1**: 4 tasks — T1-T4 all `quick`
- **Wave 2**: 4 tasks — T5-T6 `writing`, T7-T8 `quick`
- **Wave 3**: 1 task — T9 `writing`
- **FINAL**: 4 tasks — F1 `quick` + `playwright`, F2 `deep`, F3 `deep`, F4 `quick` + `git-master`

---

## TODOs

- [x] 1. Fix Countdown Z-Index + CTA i18n + Link

  **What to do**:
  - Edit `components/ParallaxHome.vue`:
    - Line 3140: Add `z-50` class to the CTA container div. Current class: `absolute inset-0 flex flex-col items-center justify-center text-center px-4` → Add `z-50`. DO NOT change `style="margin-top: -14%"` or any other classes.
    - Line 3143: Change `NuxtLinkLocale to="/contact"` → `to="/rendez-vous"`. CRITICAL: Verify NuxtLinkLocale with `/rendez-vous` resolves to `/en/booking` in EN. If not, use `localePath('/rendez-vous')` instead.
    - Line 3144: Replace hardcoded `Prendre rendez-vous` with `{{ $t('home.ctaButton') }}`. Key already exists in both locales.
  - Verify cross-locale: dev server → test FR `/` and EN `/en` → CTA must link to correct locale booking page.

  **Must NOT do**:
  - Do NOT change `style="margin-top: -14%"` (line 3140)
  - Do NOT change `z-40` on countdown-overlay (line 3132)
  - Do NOT modify any CSS classes, animations, or styling beyond adding z-50
  - Do NOT refactor any other part of ParallaxHome.vue

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`playwright`]
    - `playwright`: Needed to verify CTA visibility and cross-locale link behavior

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4)
  - **Blocks**: Task 8, F1
  - **Blocked By**: None

  **References**:
  - `components/ParallaxHome.vue:3132` — Countdown overlay with z-40 (DO NOT TOUCH)
  - `components/ParallaxHome.vue:3140` — CTA container: add z-50 here
  - `components/ParallaxHome.vue:3143-3145` — NuxtLinkLocale + hardcoded text
  - `locales/fr.json:82` — home.ctaButton already exists
  - `locales/en.json:82` — home.ctaButton already exists
  - `content/fr/pages/rendez-vous.md` — FR booking page (slug: rendez-vous)
  - `content/en/pages/booking.md` — EN booking page (slug: booking)

  **WHY Each Reference Matters**:
  - Line 3132: The z-40 on countdown is what causes the visual overlap — we don't touch it, we elevate the CTA above it
  - Line 3140: This is the ONLY line to modify for z-index fix — add class, nothing else
  - Lines 3143-3145: Both the link destination and button text need fixing
  - Locale files: Confirm the i18n key exists before using it
  - Content pages: Verify the actual slugs that NuxtLinkLocale must resolve to

  **Acceptance Criteria**:
  - [x] z-50 present on CTA container in ParallaxHome.vue
  - [x] No hardcoded 'Prendre rendez-vous' in ParallaxHome.vue
  - [x] CTA links to /rendez-vous
  - [x] Build passes
  - [x] Playwright: FR CTA visible + navigates to /rendez-vous
  - [x] Playwright: EN CTA visible + navigates to /en/booking

  **QA Scenarios**:

  ```
  Scenario: CTA visible above countdown (FR)
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:3000/ at 1440x900 viewport
      2. Wait 3s for hydration
      3. Scroll to bottom (100% of page height)
      4. Locate element .cta-btn inside Scene 4
      5. Assert element is visible (not obscured)
      6. Assert text contains translated CTA (not 'Prendre rendez-vous' hardcoded)
      7. Click the .cta-btn element
      8. Wait for navigation (2s)
      9. Assert URL path is /rendez-vous
      10. Screenshot
    Expected Result: CTA button visible, clickable, navigates to /rendez-vous
    Failure Indicators: Button invisible/unclickable, URL still on /, or 404 on /rendez-vous
    Evidence: .sisyphus/evidence/task-1-cta-fr.png

  Scenario: CTA locale-aware link (EN)
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:3000/en at 1440x900 viewport
      2. Wait 3s for hydration
      3. Scroll to bottom (100% of page height)
      4. Locate .cta-btn in Scene 4
      5. Assert button text contains English CTA ('Book a meeting' or similar)
      6. Click the .cta-btn
      7. Wait for navigation (2s)
      8. Assert URL path contains /en/booking
      9. Screenshot
    Expected Result: English CTA, navigates to /en/booking (not /en/rendez-vous)
    Failure Indicators: French text displayed, or navigation to wrong URL, or 404
    Evidence: .sisyphus/evidence/task-1-cta-en.png
  ```

  **Commit**: YES (part of final commit)
  - Files: `components/ParallaxHome.vue`

---

- [x] 2. Fix Nav Order + Clean Minor Issues

  **What to do**:
  - Fix nav order conflict (both FR + EN):
    - `content/fr/pages/projets.md` + `content/en/pages/projects.md`: order: 2 → order: 3
    - `content/fr/pages/rendez-vous.md` + `content/en/pages/booking.md`: order: 3 → order: 4
    - a-propos/about keep order: 2, services keeps order: 1
    - Final nav: Services(1), À propos(2), Projets(3), Rendez-vous(4)
  - Remove empty code block at end of `content/fr/pages/projets.md` (lines 77-78)
  - Update `utils/parallax-utils.ts` line 3: change comment from "Re-exports rand() from useParallaxData and adds additional helpers." to "Pure utility functions for the parallax system (lerp, clamp)."

  **Must NOT do**:
  - Do NOT change page titles, descriptions, or content body
  - Do NOT change showInNav or page slugs

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3, 4)
  - **Blocks**: F1
  - **Blocked By**: None

  **References**:
  - `content/fr/pages/projets.md:5` — order: 2 (conflict with a-propos)
  - `content/en/pages/projects.md:5` — order: 2 (same conflict)
  - `content/fr/pages/rendez-vous.md:5` — order: 3 (needs to become 4)
  - `content/en/pages/booking.md:5` — order: 3 (needs to become 4)
  - `content/fr/pages/projets.md:77-78` — Empty code block
  - `utils/parallax-utils.ts:3` — Outdated comment mentioning rand()

  **Acceptance Criteria**:
  - [x] projets.md order: 3 (FR + EN)
  - [x] rendez-vous.md order: 4 (FR + EN)
  - [x] No code fence at end of projets.md
  - [x] No 'rand' in parallax-utils.ts

  **QA Scenarios**:

  ```
  Scenario: Nav renders in correct order
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000/ at 1440x900
      2. Read all nav items in order from the header
      3. Verify order: Accueil, Services, A propos, Projets, Rendez-vous, Contact
    Expected Result: Nav items in logical order without duplicates
    Evidence: .sisyphus/evidence/task-2-nav-order.png

  Scenario: No empty code block in projets page
    Tool: Bash
    Steps:
      1. Run tail -5 content/fr/pages/projets.md
      2. Verify no code fence at the end
    Expected Result: File ends with clean MDC syntax
    Evidence: .sisyphus/evidence/task-2-projets-clean.md
  ```

  **Commit**: YES (part of final commit)
  - Files: 4 content pages, parallax-utils.ts

---

- [x] 3. Fix Blog Placeholder Images

  **What to do**:
  - Edit `content/fr/blog/site-sur-mesure-vs-wordpress-seo.md`: remove `image: "/images/blog-placeholder.jpg"` from frontmatter entirely (no image is better than a broken reference)
  - Edit `content/en/blog/custom-sites-vs-wordpress-seo.md`: same removal

  **Must NOT do**:
  - Do NOT invent fake image paths
  - Do NOT modify blog article content/body

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: F1
  - **Blocked By**: None

  **References**:
  - `content/fr/blog/site-sur-mesure-vs-wordpress-seo.md:5` — image field with placeholder
  - `content/en/blog/custom-sites-vs-wordpress-seo.md:5` — image field with placeholder

  **Acceptance Criteria**:
  - [x] No 'blog-placeholder' in any content file
  - [x] Build passes

  **QA Scenarios**:

  ```
  Scenario: No broken image refs
    Tool: Bash
    Steps:
      1. Run grep -r 'blog-placeholder' content/
      2. Verify output is empty
    Expected Result: Zero references to placeholder images
    Evidence: .sisyphus/evidence/task-3-no-placeholder.md
  ```

  **Commit**: YES (part of final commit)
  - Files: 2 blog .md files

---

- [x] 4. Add WordPress Promo Links in Services Sub-Pages

  **What to do**:
  - Edit `content/fr/pages/services/site-vitrine.md`: Add a new CTA section BEFORE the existing final CTA (type: cta) that promotes the blog article:
    - type: cta
    - title: "WordPress vs site sur mesure : le comparatif technique"
    - subtitle: "Découvrez pourquoi un site codé sur mesure surpasse WordPress en SEO, performance et sécurité."
    - ctaText: "Lire l'analyse complète"
    - ctaLink: "/blog/site-sur-mesure-vs-wordpress-seo"
  - Edit `content/en/pages/services/site-vitrine.md`: Same pattern in English:
    - title: "WordPress vs custom website: the technical comparison"
    - subtitle: "Discover why a custom-coded website outperforms WordPress in SEO, performance and security."
    - ctaText: "Read the full analysis"
    - ctaLink: "/blog/custom-sites-vs-wordpress-seo"
  - Edit `content/fr/pages/services/micro-entrepreneur.md`: Same WordPress promo CTA before final CTA
  - Edit `content/en/pages/services/micro-entrepreneur.md`: Same in English
  - IMPORTANT: These sub-service pages use `sections:` YAML array format in frontmatter, NOT MDC syntax. Add the CTA as a YAML item in the sections array, before the last `type: cta` item.

  **Must NOT do**:
  - Do NOT change existing content or sections
  - Do NOT use MDC syntax in these files (they use YAML sections format)
  - Do NOT modify the final CTA (keep it for booking/contact)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 7, F1
  - **Blocked By**: None

  **References**:
  - `content/fr/pages/services/site-vitrine.md:72-77` — Existing final CTA section (add new CTA before this)
  - `content/en/pages/services/site-vitrine.md` — EN equivalent
  - `content/fr/pages/services/micro-entrepreneur.md:62-67` — Existing final CTA
  - `content/en/pages/services/micro-entrepreneur.md` — EN equivalent
  - `content/fr/blog/site-sur-mesure-vs-wordpress-seo.md` — Blog article slug for FR link
  - `content/en/blog/custom-sites-vs-wordpress-seo.md` — EN blog article (different slug!)

  **Acceptance Criteria**:
  - [x] Each of 4 sub-service pages has a WordPress comparison CTA
  - [x] FR links to FR blog slug, EN links to EN blog slug
  - [x] Build passes

  **QA Scenarios**:

  ```
  Scenario: WordPress CTA visible on site-vitrine FR
    Tool: Playwright
    Steps:
      1. Navigate to /services/site-vitrine
      2. Scroll down to find CTA with 'comparatif' or 'WordPress' text
      3. Click the CTA link
      4. Verify navigates to /blog/site-sur-mesure-vs-wordpress-seo
    Expected Result: WordPress promo CTA renders and links to blog article
    Evidence: .sisyphus/evidence/task-4-wp-promo-fr.png

  Scenario: WordPress CTA on micro-entrepreneur EN
    Tool: Playwright
    Steps:
      1. Navigate to /en/services/micro-entrepreneur
      2. Verify English WordPress comparison CTA exists
      3. Click and verify it navigates to EN blog article
    Expected Result: EN WordPress promo works
    Evidence: .sisyphus/evidence/task-4-wp-promo-en.png
  ```

  **Commit**: YES (part of final commit)
  - Files: 4 service sub-page .md files

---

- [x] 5. Enrich À Propos / About Page

  **What to do**:
  - Rewrite `content/fr/pages/a-propos.md` to add substantial content. Keep existing hero, add between hero and stats:
    - A `section-features` describing the team approach/values with 4 items:
      - icon: code, title: "Expertise technique", description about Nuxt/Vue mastery
      - icon: users, title: "Approche humaine", description about personalized follow-up
      - icon: eye, title: "Transparence totale", description about clear pricing and process
      - icon: target, title: "Résultats mesurables", description about SEO/performance metrics
    - animation: name: stagger
  - Keep the existing stats section
  - Update CTA: change ctaLink from /contact to /rendez-vous
  - Rewrite `content/en/pages/about.md` with equivalent English content (exact mirror structure)
  - These pages use MDC syntax (::section-*). Follow the exact same pattern as existing pages.
  - Tone: professionnel, confiant, technique mais accessible. Pas de buzzwords vides.

  **Must NOT do**:
  - Do NOT change the page slug or URL
  - Do NOT add more than 4-5 sections total
  - Do NOT invent fake team members or unverifiable claims
  - Do NOT use AI-slop patterns (overly generic buzzword content)

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6, 7, 8)
  - **Blocks**: F1
  - **Blocked By**: None

  **References**:
  - `content/fr/pages/a-propos.md` — Current thin content (23 lines: hero + stats + CTA)
  - `content/en/pages/about.md` — EN equivalent (34 lines)
  - `content/fr/pages/services.md` — Example of MDC section-features syntax with items
  - `app.config.ts:5-6` — Client name "Tempo Hub" and profession "Agence web"

  **WHY Each Reference Matters**:
  - Current about page: understand what exists to preserve hero/stats
  - Services page: copy the exact MDC syntax pattern for section-features
  - app.config: use consistent branding in content

  **Acceptance Criteria**:
  - [x] FR about page has 4+ sections (hero, features/values, stats, CTA)
  - [x] EN about page mirrors FR structure exactly
  - [x] No placeholder text or Lorem ipsum
  - [x] CTA points to /rendez-vous (not /contact)
  - [x] Build passes

  **QA Scenarios**:

  ```
  Scenario: About page renders enriched content (FR)
    Tool: Playwright
    Steps:
      1. Navigate to /a-propos
      2. Verify hero section renders
      3. Verify features/values section with 4 items
      4. Verify stats section
      5. Verify CTA with /rendez-vous link
      6. Screenshot full page
    Expected Result: Rich about page with mission, values, stats, and booking CTA
    Evidence: .sisyphus/evidence/task-5-about-fr.png

  Scenario: About page EN parity
    Tool: Playwright
    Steps:
      1. Navigate to /en/about
      2. Verify same section structure as FR
      3. Verify English content (not French)
    Expected Result: English about page mirrors FR structure
    Evidence: .sisyphus/evidence/task-5-about-en.png
  ```

  **Commit**: YES (part of final commit)
  - Files: `content/fr/pages/a-propos.md`, `content/en/pages/about.md`

---

- [x] 6. Improve Projets / Projects Page

  **What to do**:
  - Edit `content/fr/pages/projets.md`:
    - Keep hero section as-is
    - Improve portfolio item descriptions to be more compelling and realistic (keep same 6 items and names)
    - Add more detail: mention specific technologies used, quantifiable results, design approach
    - Keep the CTA section (already links to /rendez-vous)
  - Edit `content/en/pages/projects.md`: Mirror improvements in English
  - Tone: showcase premium quality, emphasize results and technology choices

  **Must NOT do**:
  - Do NOT change project names or tags
  - Do NOT add new portfolio items (keep 6)
  - Do NOT change the page structure (hero + projects + CTA)

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: F1
  - **Blocked By**: None

  **References**:
  - `content/fr/pages/projets.md` — Current portfolio (78 lines, 6 items with short descriptions)
  - `content/en/pages/projects.md` — EN equivalent (74 lines)

  **Acceptance Criteria**:
  - [x] 6 portfolio items with improved descriptions (2-3 sentences each)
  - [x] FR/EN parity maintained
  - [x] Build passes

  **QA Scenarios**:

  ```
  Scenario: Portfolio renders improved descriptions (FR)
    Tool: Playwright
    Steps:
      1. Navigate to /projets
      2. Verify 6 project cards render
      3. Verify descriptions are more detailed (longer than original)
      4. Screenshot
    Expected Result: Improved portfolio with richer descriptions
    Evidence: .sisyphus/evidence/task-6-projets-fr.png
  ```

  **Commit**: YES (part of final commit)
  - Files: `content/fr/pages/projets.md`, `content/en/pages/projects.md`

---

- [x] 7. Add WordPress Promo in Nav + Homepage Scene 4

  **What to do**:
  - **Nav link**: Add blog link to navigation.
    - Check `components/layout/Header.vue` to understand how nav items are generated (likely queries content pages with showInNav)
    - Add a "Blog" nav item. The simplest approach: check if Header.vue already has a static Blog link from core. If not, add one manually in the hub's Header.vue
    - The blog link should point to /blog (listing) or directly to the WordPress article
  - **Homepage mention**: In `components/ParallaxHome.vue` Scene 4, add a SMALL secondary link below the main CTA button (after line 3145):
    - Add: `<NuxtLinkLocale to="/blog/site-sur-mesure-vs-wordpress-seo" class="mt-6 inline-block text-sm text-[#d4a853]/60 hover:text-[#d4a853] transition-colors">{{ $t('home.wordpressPromo') }}</NuxtLinkLocale>`
    - Add i18n keys to both locale files:
      - FR: `home.wordpressPromo: "Découvrez pourquoi nos sites surpassent WordPress →"`
      - EN: `home.wordpressPromo: "Discover why our sites outperform WordPress →"`
    - IMPORTANT: Use the locale-specific blog slug. FR links to FR article, EN to EN article. Use a computed property or conditional based on locale.

  **Must NOT do**:
  - Do NOT restructure the nav architecture
  - Do NOT add more than 1 small link in Scene 4
  - Do NOT change any existing margins/styling
  - Do NOT create new content pages just for nav

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`playwright`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 8, F1
  - **Blocked By**: Task 4

  **References**:
  - `components/layout/Header.vue` — Hub nav component (understand how nav items are built)
  - `components/ParallaxHome.vue:3145` — After CTA button, insert secondary WordPress link
  - Blog slugs: FR = `/blog/site-sur-mesure-vs-wordpress-seo`, EN = `/blog/custom-sites-vs-wordpress-seo`

  **Acceptance Criteria**:
  - [x] Blog link visible in navigation
  - [x] Secondary WordPress link visible in Scene 4 under CTA
  - [x] Both links navigate to correct blog article (locale-aware)
  - [x] Build passes

  **QA Scenarios**:

  ```
  Scenario: WordPress link in nav
    Tool: Playwright
    Steps:
      1. Navigate to / at 1440x900
      2. Check nav for blog/WordPress link
      3. Click it, verify blog article loads
    Expected Result: Blog accessible from navigation
    Evidence: .sisyphus/evidence/task-7-nav-link.png

  Scenario: Homepage WordPress mention
    Tool: Playwright
    Steps:
      1. Navigate to / at 1440x900
      2. Scroll to Scene 4
      3. Verify secondary text link below CTA button
      4. Screenshot
    Expected Result: Subtle WordPress comparison link under CTA
    Evidence: .sisyphus/evidence/task-7-homepage-wp.png
  ```

  **Commit**: YES (part of final commit)
  - Files: `components/layout/Header.vue`, `components/ParallaxHome.vue`

---

- [x] 8. Add i18n Keys for New Content

  **What to do**:
  - Add new i18n keys to `locales/fr.json` and `locales/en.json`:
    - `home.wordpressPromo`: FR "Découvrez pourquoi nos sites surpassent WordPress →" / EN "Discover why our sites outperform WordPress →"
    - Any nav label needed for blog link (e.g. `nav.blog` if not already present — check first, it may already exist)
  - Verify both files stay in sync (identical key structure)
  - IMPORTANT: Only add keys actually USED by Tasks 1 and 7.

  **Must NOT do**:
  - Do NOT rename existing keys
  - Do NOT change existing translations

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: F1
  - **Blocked By**: Tasks 1, 7 (to know which keys are needed)

  **References**:
  - `locales/fr.json` — Current 90 keys (nav.blog already exists at line 6)
  - `locales/en.json` — Current 90 keys (nav.blog already exists)

  **Acceptance Criteria**:
  - [x] Both locale files have identical key structure
  - [x] New keys are actually used in components
  - [x] Build passes

  **QA Scenarios**:

  ```
  Scenario: i18n parity check
    Tool: Bash
    Steps:
      1. Count keys in fr.json and en.json
      2. Verify counts match
    Expected Result: Same number of keys in both files
    Evidence: .sisyphus/evidence/task-8-i18n-parity.md
  ```

  **Commit**: YES (part of final commit)
  - Files: `locales/fr.json`, `locales/en.json`

---

- [x] 9. Update Documentation

  **What to do**:
  - Update `README.md`:
    - Verify the feature list reflects current state
    - Add note about premium dark theme as hub showcase customization
    - Update any checklist items that changed
  - Add inline comments in key files:
    - `components/ParallaxHome.vue`: Add comment near z-50 explaining the z-index fix for CTA visibility
    - `app.config.ts`: Verify TODO comments are clear and helpful for new clients
  - Verify `ARCHITECTURE-TEMPLATE.md` is accurate with current structure

  **Must NOT do**:
  - Do NOT create new documentation files
  - Do NOT write excessive JSDoc
  - Do NOT document tempo-core internals

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (after all implementation changes)
  - **Blocks**: F1
  - **Blocked By**: Tasks 1-8

  **References**:
  - `README.md` — Current project documentation
  - `ARCHITECTURE-TEMPLATE.md` — Architecture overview document
  - `app.config.ts` — Config file with TODO comments

  **Acceptance Criteria**:
  - [x] README reflects current feature set accurately
  - [x] Key changes documented with inline comments
  - [x] No inaccurate or outdated information

  **QA Scenarios**:

  ```
  Scenario: README accuracy check
    Tool: Bash
    Steps:
      1. Read README.md
      2. Verify no references to wrong paths or deleted features
    Expected Result: Documentation is up to date
    Evidence: .sisyphus/evidence/task-9-readme.md
  ```

  **Commit**: YES (part of final commit)
  - Files: `README.md`, `ARCHITECTURE-TEMPLATE.md`, `app.config.ts`

---


TASKS_FILE: .sisyphus/plans/cleanup-pass-tasks.md

## Final Verification Wave

- [x] F1. **Build + Test + Visual QA**
  
  **What to do**:
  - Run `npm run build 2>&1` — verify zero warnings, exit 0
  - Run `npx vitest run --reporter=verbose` — verify all tests pass
  - Start dev server, use Playwright to:
    - Visit `/` (FR) — verify Scene 4 CTA visible, clickable, correct text
    - Visit `/en` (EN) — verify Scene 4 CTA visible, English text
    - Click CTA → verify navigation to /rendez-vous (FR) ou /en/booking (EN)
    - Visit `/a-propos` — verify enriched content renders
    - Visit `/projets` — verify improved portfolio, no code block
    - Visit `/services/site-vitrine` — verify WordPress comparison link
    - Visit `/blog/site-sur-mesure-vs-wordpress-seo` — verify accessible
    - Check nav for WordPress/blog link
  
  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`playwright`]
  
  **Acceptance Criteria**:
  - [x] `npm run build` exits 0
  - [x] All tests pass
  - [x] CTA visible and functional on both locales
  - [x] Content pages render correctly
  - [x] WordPress article accessible from multiple paths

  ```
  Scenario: Homepage CTA visible and clickable (FR)
    Tool: Playwright
    Steps:
      1. Navigate to `/` at 1440x900 viewport
      2. Wait for hydration (3s)
      3. Scroll to bottom of page (Scene 4)
      4. Verify element with class `cta-btn` is visible
      5. Verify button text contains translated CTA text
      6. Click the CTA button
      7. Verify URL changed to /rendez-vous
      8. Screenshot before and after click
    Expected Result: CTA button visible above countdown overlay, click navigates to /rendez-vous
    Evidence: .sisyphus/evidence/task-f1-homepage-cta-visible-fr.png

  Scenario: Homepage CTA visible and clickable (EN)
    Tool: Playwright
    Steps:
      1. Navigate to `/en` at 1440x900 viewport
      2. Wait for hydration (3s)
      3. Scroll to bottom of page (Scene 4)
      4. Verify element with class `cta-btn` is visible and has English text
      5. Click the CTA button
      6. Verify URL changed to /en/booking
      7. Screenshot
    Expected Result: CTA button visible, English text, navigates to /en/booking
    Evidence: .sisyphus/evidence/task-f1-homepage-cta-visible-en.png

  Scenario: Build and tests pass
    Tool: Bash
    Steps:
      1. Run `npm run build 2>&1`
      2. Verify exit code 0, no "error" or "warning" in output
      3. Run `npx vitest run --reporter=verbose`
      4. Verify all tests pass
    Expected Result: Clean build, all tests green
    Evidence: .sisyphus/evidence/task-f1-build-tests.md
  ```

  **Commit**: NO (verification only)

- [x] F2. **Plan Compliance Audit** — `deep`
  Read the plan end-to-end. For each "Must Have": verify implementation exists. For each "Must NOT Have": search codebase for forbidden patterns. Check all evidence files exist.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F3. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", compare to actual changes (`git diff`). Verify nothing extra was changed (especially margins, dark theme classes, core submodule). Flag any unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | VERDICT`

- [x] F4. **Git Commit** — `quick` + `git-master`
  
  **What to do**:
  - Stage all changed files
  - Create single commit: `chore: comprehensive cleanup pass — fix CTA overlap, enrich content, promote WordPress comparison, update docs`
  - Verify commit includes all expected files
  - DO NOT push (user will push manually)
  
  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`git-master`]

---

## Commit Strategy

| Tasks | Commit Message | Key Files |
|-------|---------------|-----------|
| ALL (1-9) | `chore: comprehensive cleanup pass — fix CTA overlap, enrich content, promote WordPress comparison, update docs` | ParallaxHome.vue, locales/*.json, content/**/*.md, utils/parallax-utils.ts, docs/ |

---

## Success Criteria

### Verification Commands
```bash
npm run build 2>&1                    # Expected: exit 0, no warnings
npx vitest run                        # Expected: all tests pass
grep "z-50" components/ParallaxHome.vue  # Expected: found in CTA container
grep -c "Prendre rendez-vous" components/ParallaxHome.vue  # Expected: 0
```

### Final Checklist
- [x] CTA Scene 4 visible above countdown (z-50)
- [x] CTA text i18n'd (pas hardcodé)
- [x] CTA navigue vers /rendez-vous (FR) et /en/booking (EN)
- [x] À propos enrichi (mission, valeurs, processus)
- [x] Projets amélioré (descriptions réalistes, pas de code block vide)
- [x] Article WordPress accessible depuis nav + services + homepage
- [x] Nav order cohérent (plus de doublon order: 2)
- [x] Blog images frontmatter corrigées
- [x] parallax-utils.ts commentaire à jour
- [x] Parité FR/EN maintenue
- [x] Build + tests passent
- [x] Documentation mise à jour
- [x] Un commit propre
