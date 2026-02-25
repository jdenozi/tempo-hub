# Issues — pages-design-overhaul

## [2026-02-25] Session Start

### Known Issues to Fix
- EN `services.md` missing `stripe-pricing` section (parity issue) — fixed in Task 17
- `app.config.ts` calcom.username is empty string — fixed in Task 4

### Phantom Issues (DO NOT FIX)
- Zod schema error in content.config.ts — multiple agents confirmed it's phantom, skip unless build fails


## Pre-existing: SectionStripePricing.vue missing closing tag
- `components/sections/SectionStripePricing.vue` line 11: `<div class="space-y-16">` has no matching `</div>` before `</ClientOnly>` on line 23
- This causes `npm run build` to fail with: `Element is missing end tag`
- Unrelated to SectionProjects/SectionBooking — needs separate fix
