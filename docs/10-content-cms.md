# 10 — Nuxt Content + Decap CMS

## Overview

This feature adds Markdown-based content management using **@nuxt/content v3** with collection-based schemas, and **Decap CMS** for visual editing by non-technical users.

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

public/admin/
├── index.html          # Decap CMS entry point
└── config.yml          # Collections, fields, i18n config
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

## Decap CMS

Accessible at `/admin/`. Configuration dans `public/admin/config.yml`.

### Backend

- **git-gateway** backend (works with Netlify Identity, GitLab, etc.)
- **local_backend** for development (`npx decap-server`)

### Collections CMS

Le CMS expose **6 collections** correspondant aux collections Nuxt Content :

| Collection CMS | Label | Type | i18n |
|---------------|-------|------|------|
| `settings` | ⚙️ Settings | `files` (single file) | Non |
| `blog` | 📝 Blog | `folder` | `multiple_folders` (fr/en) |
| `pages` | 📄 Pages | `folder` | `multiple_folders` (fr/en) |
| `testimonials` | 💬 Testimonials | `folder` | `multiple_folders` (fr/en) |
| `faq` | ❓ FAQ | `folder` | `multiple_folders` (fr/en) |
| `projects` | 🎨 Projects | `folder` | `multiple_folders` (fr/en) |

La collection `settings` utilise un widget `files` (fichier unique `content/settings/general.json`) contenant l'identité du site, les coordonnées et les liens sociaux.

Les collections i18n utilisent la structure `multiple_folders` : le contenu est stocké dans `content/{locale}/collection/`.

### Accès admin

Le client accède à `monsite.fr/admin/` pour éditer son contenu. En dev, lancer `npx decap-server` pour le backend local.

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
- Decap CMS loaded via CDN (`unpkg.com/decap-cms@^3`)
