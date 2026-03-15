# Content Migration Scripts

Migrate existing Markdown/JSON content into Strapi via REST API.

## Prerequisites

1. Strapi must be running: `docker compose up strapi postgres`
2. Create an API token in Strapi admin: **Settings → API Tokens → Create** (Full access)
3. Set environment variables:

```bash
export STRAPI_URL=http://localhost:1337
export STRAPI_TOKEN=your_api_token_here
```

## Usage

### Migrate everything

```bash
npx tsx scripts/migrate-all.ts
```

### Migrate individually

```bash
npx tsx scripts/migrate-settings.ts   # general.json → site-setting singleton
npx tsx scripts/migrate-pages.ts      # MDC pages → pages + dynamic zone sections
npx tsx scripts/migrate-blog.ts       # blog markdown → blog-articles (richtext)
```

## What each script does

| Script | Source | Target | Strategy |
|--------|--------|--------|----------|
| `migrate-settings.ts` | `content/settings/general.json` | `site-setting` singleton | Flattens nested JSON; creates or updates |
| `migrate-pages.ts` | `content/fr/pages/*.md` | `pages` collection + dynamic zone | Parses MDC `::section-*` blocks → Strapi components |
| `migrate-blog.ts` | `content/fr/blog/*.md` | `blog-articles` collection | Frontmatter → fields, body markdown → richtext |
| `migrate-all.ts` | — | — | Orchestrator: settings → pages → blog |

## Idempotency

Scripts are **idempotent** — running them multiple times won't create duplicates:

- **Pages & Blog**: Check by `slug` before creating; skip if already exists
- **Settings**: Singleton — updates existing entry if present, creates if not

## Section mapping (pages)

MDC sections are converted to Strapi Dynamic Zone components:

| MDC block | Strapi component | Nested components |
|-----------|-----------------|-------------------|
| `::section-page-banner` | `sections.page-banner` | — |
| `::section-features` | `sections.features` | `shared.feature-item` |
| `::section-pricing` | `sections.pricing` | `shared.pricing-plan` |
| `::section-cta` | `sections.cta` | — |
| `::section-faq` | `sections.faq` | `shared.faq-item` |
| `::section-stats` | `sections.stats` | `shared.stat-item` |
| `::section-contact` | `sections.contact` | — |
| `::section-booking` | `sections.booking` | — |
| `::section-projects` | `sections.projects` | — (title/subtitle/showAll only) |

> Non-schema props like `animation` are automatically stripped.

## Notes

- Image/media migration is **not** handled by these scripts (requires Strapi media library upload)
- Blog content is stored as raw markdown in Strapi's richtext field
- The `section-projects` component only stores display config (title, subtitle, showAll) — project data comes from a separate collection
