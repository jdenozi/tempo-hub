# Final QA v2 — Sub-pages Content Verification

**Date:** 2026-02-25  
**Dev server:** http://localhost:3002 (port 3002, port 3000 was occupied)  
**Fix verified:** `content.config.ts` sections schema `.passthrough()` fix

## Summary: ALL PAGES PASS ✅

The `content.config.ts` schema fix successfully resolved the empty content issue. All three FR sub-pages now render their full section content.

---

## Page Results

### `/services` (FR) — ✅ PASS
**URL:** http://localhost:3002/services  
**Screenshot:** `services-fr.png`

Sections visible:
- ✅ **Hero**: "Nos services" h1 + "Des solutions digitales sur-mesure pour propulser votre activité" + "Prendre rendez-vous" CTA button
- ✅ **Features**: "Ce que nous proposons" h2 + 6 service cards (Sites vitrine, Sites e-commerce, Applications web, Landing pages, Identité visuelle, Hébergement & maintenance)
- ✅ **Stats**: 50+ Projets livrés, 100% Clients satisfaits, 24/7 Support technique, 5 ans D'expérience
- ✅ **Pricing**: "Nos offres" h2 (Stripe pricing table iframes show "Something went wrong" — expected, no Stripe key configured)
- ✅ **CTA**: "Un projet en tête ?" h2 + "Prendre rendez-vous" + "Nous contacter" links

---

### `/rendez-vous` (FR) — ✅ PASS
**URL:** http://localhost:3002/rendez-vous  
**Screenshot:** `rendez-vous-fr.png`

Sections visible:
- ✅ **Hero**: "Prenez rendez-vous" h1 + "Réservez un créneau gratuit de 30 minutes pour discuter de votre projet"
- ✅ **Booking**: "Choisissez un créneau" h2 + "Tous les créneaux sont en heure de Paris (CET)" (Cal.com widget not rendered — expected, no Cal.com username configured)
- ✅ **CTA**: "Vous préférez nous écrire ?" h2 + "Formulaire de contact" link

Note: Cal.com embed throws `Cal is not defined` error — this is a configuration issue (no Cal.com username set in app.config.ts), not a content schema issue.

---

### `/projets` (FR) — ✅ PASS
**URL:** http://localhost:3002/projets  
**Screenshot:** `projets-fr.png`

Sections visible:
- ✅ **Hero**: "Nos réalisations" h1 + "Découvrez une sélection de projets qui illustrent notre expertise"
- ✅ **Projects grid**: "Portfolio" h2 + 6 project cards:
  - E-commerce Mode (E-commerce, Stripe, Nuxt 3)
  - Dashboard Analytics (Dashboard, Vue.js, API REST)
  - Site Vitrine Restaurant (Vitrine, Réservation, Design)
  - Application SaaS B2B (SaaS, B2B, Node.js)
  - Landing Page Startup (Landing, Conversion, Fintech)
  - Blog Tech (Blog, CMS, SEO)
- ✅ **CTA**: "Votre projet est le prochain ?" h2 + "Démarrer un projet" + "Voir nos services" links

---

## Notes

### i18n Routing Behavior
- FR is the default locale (`prefix_except_default` strategy)
- FR pages are at `/services`, `/rendez-vous`, `/projets` (no prefix)
- EN pages are at `/en/services`, `/en/booking`, `/en/projects`
- Browser with `Accept-Language: en-US` gets redirected to `/en/` — this is correct behavior
- To access FR pages in a browser with EN locale, use the language switcher (sets `i18n_redirected` cookie)

### Known Non-Content Issues (not related to schema fix)
- Stripe pricing table: `null_publishable_key` error — no Stripe key configured
- Cal.com booking: `Cal is not defined` — no Cal.com username configured
- These are expected in a template/demo environment

### Conclusion
The `.passthrough()` fix to `content.config.ts` sections schema is confirmed working. All inline frontmatter properties (`title`, `subtitle`, `items`, `stats`, `projects`, etc.) are now preserved and rendered correctly.
