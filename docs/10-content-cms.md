# 10 — Nuxt Content + Nuxt Studio

## Overview

This feature adds Markdown-based content management using **@nuxt/content v3** with collection-based schemas, and **Nuxt Studio** for visual editing by non-technical users.

## Architecture

```
content/
├── fr/
│   ├── pages/          # Section-based pages (services, about)
│   ├── blog/           # Blog articles
│   ├── testimonials/   # Client testimonials
│   ├── faq/            # FAQ entries
│   └── projects/       # Portfolio / case studies
├── en/
│   ├── pages/
│   ├── blog/
│   ├── testimonials/
│   ├── faq/
│   └── projects/
├── settings/
│   └── general.json    # Site identity, contact, social links

content.config.ts       # Collection definitions (Zod schemas)
```

## Content Configuration

`content.config.ts` defines **6 collections** with Zod schemas:

| Collection | Type | Source | Description |
|-----------|------|--------|-------------|
| `blog` | `page` | `**/blog/*.md` | Articles avec titre, description, date, image |
| `pages` | `page` | `**/pages/*.md` | Pages section-based (hero, features...) rendues par `PageRenderer` |
| `testimonials` | `data` | `**/testimonials/*.md` | Témoignages clients (nom, rôle, quote, rating, order) |
| `faq` | `data` | `**/faq/*.md` | Questions fréquentes (question, answer, category, order) |
| `projects` | `page` | `**/projects/*.md` | Portfolio (titre, description, image, url, tags, featured) |
| `settings` | `data` | `settings/*.json` | Identité du site, contact, réseaux sociaux |

Les collections `blog`, `pages`, `testimonials`, `faq` et `projects` utilisent des globs `**/` pour matcher les fichiers dans les sous-répertoires de locale.

La collection `settings` est de type `data` sans i18n (un seul fichier JSON partagé).

## Dynamic Pages

### Catch-all page (`pages/[...slug].vue`)

Resolves content from the `pages` collection based on the current locale and URL slug. If the content has a `sections` array in frontmatter, it uses `PageRenderer` to render section components. Otherwise falls back to `ContentRenderer` for raw Markdown.

### Blog listing (`pages/blog/index.vue`)

Queries the `blog` collection filtered by locale path. Displays articles in a responsive grid (1/2/3 columns) with image, title, description, and formatted date.

### Blog article (`pages/blog/[slug].vue`)

Renders a single article using the `blog` layout (centered, max-width). Includes back-to-list navigation, hero image, title, date, and Markdown body via `ContentRenderer`.

## Querying Content (v3 API)

Nuxt Content v3 uses `queryCollection()` instead of `queryContent()`:

```typescript
// Get a single page by path
const { data } = await useAsyncData('key', () =>
  queryCollection('pages').path('/fr/pages/services').first()
)

// Get all blog articles for a locale, sorted by date
const { data } = await useAsyncData('key', () =>
  queryCollection('blog')
    .where('path', 'LIKE', '/fr/blog/%')
    .order('date', 'DESC')
    .all()
)

// Get all testimonials for a locale, sorted by order
const { data } = await useAsyncData('key', () =>
  queryCollection('testimonials')
    .where('path', 'LIKE', '/fr/testimonials/%')
    .order('order', 'ASC')
    .all()
)
```

## Nuxt Studio

Nuxt Studio est un CMS visuel intégré qui fonctionne comme un overlay sur le site.

### Mode dev

En développement (`nuxt dev`), Studio se charge automatiquement en overlay sur toutes les pages. Aucune authentification nécessaire.

### Mode production

En production, l'accès se fait via `/_studio` qui redirige vers l'authentification GitHub OAuth. Nécessite les variables d'environnement `STUDIO_GITHUB_CLIENT_ID` et `STUDIO_GITHUB_CLIENT_SECRET`.

### Configuration

```typescript
// nuxt.config.ts
studio: {
  dev: true,
  route: '/_studio',
  repository: {
    provider: 'github',
    owner: 'jdenozi',
    repo: 'tempo-hub',
    branch: 'main',
  },
  auth: {
    github: {
      clientId: process.env.STUDIO_GITHUB_CLIENT_ID,
      clientSecret: process.env.STUDIO_GITHUB_CLIENT_SECRET,
    },
  },
  i18n: { defaultLocale: 'fr' },
}
```

### Collections

Studio détecte automatiquement les collections définies dans `content.config.ts` et génère l'interface d'édition à partir des schémas Zod.

## Content Format

### Section-based page (frontmatter)

```yaml
---
title: "Services"
description: "Web design services"
sections:
  - type: hero
    props:
      title: "Our services"
      subtitle: "Tailored solutions"
  - type: features
    props:
      title: "What we offer"
      items:
        - icon: heart
          title: "Showcase websites"
          description: "Professional website..."
---
```

### Blog article

```yaml
---
title: "Welcome to our blog"
description: "First blog post"
date: 2025-01-15
image: "/images/blog-placeholder.jpg"
---

# Markdown body here...
```

## Dependencies

- `@nuxt/content` ^3.11 — Content management with collections
- `better-sqlite3` — Required database driver for Content v3
- `nuxt-studio` ^1.3 — Visual CMS overlay
