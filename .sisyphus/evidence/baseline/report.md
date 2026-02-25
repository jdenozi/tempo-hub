# Baseline Screenshots Report

**Date:** 2026-02-25  
**Purpose:** Pre-MDC migration visual regression baseline  
**Viewport:** 1440×900px  
**Dev server:** http://localhost:3001 (port 3001 — 3000 was occupied)

## Screenshots Captured

| File | URL | HTTP | Title | Size |
|------|-----|------|-------|------|
| `fr-home-baseline.png` | `/` | 200 | Tempo Hub | 1.2 MB |
| `fr-services-baseline.png` | `/services` | 200 | Services \| Tempo Hub | 344 KB |
| `fr-rendez-vous-baseline.png` | `/rendez-vous` | 200 | Rendez-vous \| Tempo Hub | 300 KB |
| `fr-projets-baseline.png` | `/projets` | 200 | Projets \| Tempo Hub | 328 KB |
| `fr-a-propos-baseline.png` | `/a-propos` | 200 | À propos \| Tempo Hub | 356 KB |
| `en-services-baseline.png` | `/en/services` | 200 | Services \| Tempo Hub | 316 KB |
| `en-booking-baseline.png` | `/en/booking` | 200 | Booking \| Tempo Hub | 284 KB |
| `en-projects-baseline.png` | `/en/projects` | 200 | Projects \| Tempo Hub | 308 KB |
| `en-about-baseline.png` | `/en/about` | 200 | About \| Tempo Hub | 348 KB |

**Total: 9 screenshots**

## Page Content Verified

All pages rendered with visible content:

- **FR pages**: Navigation in French (Accueil, Services, À propos, Projets, Rendez-vous, Contact), FR locale button
- **EN pages**: Navigation in English (Home, Services, About, Projects, Booking, Contact), EN locale button
- **Homepage**: Full hero section with glassmorphism design, parallax images, sections rendered
- **Services**: 6 service cards (Sites vitrine, E-commerce, Applications web, Landing pages, Identité visuelle, Hébergement)
- **Rendez-vous / Booking**: Cal.com embed section (Cal.com JS error is pre-existing, not migration-related)
- **Projets / Projects**: 6 portfolio cards with tags
- **À propos / About**: Stats section (5+ years, 50+ projects, 100% clients)

## Console Notes (Pre-existing, not migration-related)

- **Hydration mismatches**: ~90 warnings on homepage — pre-existing SSR/client mismatch
- **Stripe null_publishable_key**: 4 errors on services pages — Stripe pricing table missing env key (expected in dev)
- **Cal.com not defined**: 1 error on booking pages — Cal.com embed JS race condition (expected in dev)
- **GSAP target not found**: Several warnings on homepage — animation targets not yet in DOM at init

## Locale Routing Confirmed

- FR = default locale, NO prefix (`/services`, `/projets`, etc.)
- EN = `/en/` prefix (`/en/services`, `/en/projects`, etc.)
- Strategy: `prefix_except_default` ✓
