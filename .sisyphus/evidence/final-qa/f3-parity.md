# F3 — Content Parity FR/EN Check

**Date:** 2026-02-25  
**Status:** PASS ✅ (with minor notes)

---

## Summary

All 4 page pairs have been verified for structural parity. All pages have `showInNav: true`, `navLabel`, and `order` fields. Section counts, types, and animation blocks are identical across all pairs.

---

## Pair 1: services.md (FR vs EN)

| Check | FR | EN | Result |
|---|---|---|---|
| `showInNav` | `true` | `true` | ✅ |
| `navLabel` | `Services` | `Services` | ✅ |
| `order` | `1` | `1` | ✅ |
| Section count | 5 | 5 | ✅ |
| Section types (in order) | hero, features, stats, stripe-pricing, cta | hero, features, stats, stripe-pricing, cta | ✅ |

### Animation Blocks

| Section | FR animation | EN animation | Match |
|---|---|---|---|
| features | `stagger` | `stagger` | ✅ |
| stats | `fadeUp` | `fadeUp` | ✅ |
| stripe-pricing | `scaleIn` | `scaleIn` | ✅ |
| cta | `fadeUp`, delay: 0.2 | `fadeUp`, delay: 0.2 | ✅ |

### Notes
- Both files are 67 lines, structurally identical.
- Stripe pricing table IDs are identical (`prctbl_1Szf80CuCsLyVwsnL07sI8KS`, `prctbl_1Szf5dCuCsLyVwsnfYPVzqKg`).
- Stats values match (50+, 100%, 24/7, 5 ans/5 years) — labels translated correctly.

---

## Pair 2: rendez-vous.md (FR) vs booking.md (EN)

| Check | FR | EN | Result |
|---|---|---|---|
| `showInNav` | `true` | `true` | ✅ |
| `navLabel` | `Rendez-vous` | `Booking` | ✅ |
| `order` | `3` | `3` | ✅ |
| Section count | 3 | 3 | ✅ |
| Section types (in order) | hero, booking, cta | hero, booking, cta | ✅ |

### Animation Blocks

| Section | FR animation | EN animation | Match |
|---|---|---|---|
| booking | `fadeUp` | `fadeUp` | ✅ |
| cta | `fadeUp`, delay: 0.2 | `fadeUp`, delay: 0.2 | ✅ |

### Notes
- Both files are 25 lines, structurally identical.
- `booking` section has `theme: dark` in both.
- Hero section has no animation block in either (consistent).

---

## Pair 3: projets.md (FR) vs projects.md (EN)

| Check | FR | EN | Result |
|---|---|---|---|
| `showInNav` | `true` | `true` | ✅ |
| `navLabel` | `Projets` | `Projects` | ✅ |
| `order` | `2` | `2` | ✅ |
| Section count | 3 | 3 | ✅ |
| Section types (in order) | hero, projects, cta | hero, projects, cta | ✅ |

### Animation Blocks

| Section | FR animation | EN animation | Match |
|---|---|---|---|
| projects | `stagger` | `stagger` | ✅ |
| cta | `fadeUp`, delay: 0.2 | `fadeUp`, delay: 0.2 | ✅ |

### Notes
- Both files are 63 lines, structurally identical.
- Both have 6 project cards with matching tags.
- CTA links differ by design: FR uses `/rendez-vous`, EN uses `/booking` — **correct locale-specific routing**.

---

## Pair 4: a-propos.md (FR) vs about.md (EN)

| Check | FR | EN | Result |
|---|---|---|---|
| `showInNav` | `true` | `true` | ✅ |
| `navLabel` | `À propos` | `About` | ✅ |
| `order` | `2` | `2` | ✅ |
| Section count | 3 | 3 | ✅ |
| Section types (in order) | hero, stats, cta | hero, stats, cta | ✅ |

### Animation Blocks

| Section | FR animation | EN animation | Match |
|---|---|---|---|
| hero | none | none | ✅ |
| stats | none | none | ✅ |
| cta | none | none | ✅ |

### Notes
- Both files are 23 lines, structurally identical.
- **⚠️ OBSERVATION:** The `about` page has NO animation blocks on any section. This is consistent between FR and EN (parity maintained), but differs from other pages which use `fadeUp`/`stagger`. This may be intentional or an oversight — not a parity issue.
- Stats items: 3 items in both (5+, 50+, 100%) — consistent.
- CTA section is missing `subtitle` field in both FR and EN — consistent (not a parity issue).

---

## Overall Results

| Page Pair | Section Count | Section Types | Animations | showInNav | navLabel | order |
|---|---|---|---|---|---|---|
| services FR/EN | ✅ 5/5 | ✅ Match | ✅ Match | ✅ Both true | ✅ Present | ✅ 1/1 |
| rendez-vous/booking | ✅ 3/3 | ✅ Match | ✅ Match | ✅ Both true | ✅ Present | ✅ 3/3 |
| projets/projects | ✅ 3/3 | ✅ Match | ✅ Match | ✅ Both true | ✅ Present | ✅ 2/2 |
| a-propos/about | ✅ 3/3 | ✅ Match | ✅ Match | ✅ Both true | ✅ Present | ✅ 2/2 |

**All checks: PASS ✅**

---

## Observations (Non-blocking)

1. **`about` page lacks animations** — No animation blocks on any section in either locale. Consistent between FR/EN but may want to add `fadeUp` for visual consistency with other pages.
2. **`about` CTA missing `subtitle`** — Both FR and EN `cta` sections lack a `subtitle` field. Other pages include it. Consistent between locales.
3. **`order` conflict** — Both `projets/projects` (order: 2) and `a-propos/about` (order: 2) share the same nav order value. This could cause unpredictable nav ordering. Not a parity issue but worth flagging.
