# Tempo Hub — Template Nuxt 3

Template Nuxt 3 réutilisable pour créer des sites web clients. Le moteur (`tempo-core`) est un **git submodule** (Nuxt Layer) : un fix dans le core se propage à tous les sites clients.

## Architecture

```
tempo-template/              ← Ce repo (template client)
├── tempo-core/              ← Git submodule → jdenozi/tempo-core
│   ├── components/          # 30+ composants (ui, sections, layout, integrations)
│   ├── composables/         # useFeatures, useGsap, useAnimations, useClientConfig...
│   ├── pages/               # index, [...slug], blog/*
│   ├── layouts/             # default, blog, landing
│   ├── server/              # API (contact, analytics)
│   ├── error.vue            # Page d'erreur brandée
│   └── nuxt.config.ts       # Modules, i18n base, runtimeConfig
│
├── nuxt.config.ts           ← extends: ['./tempo-core'] + site metadata
├── app.config.ts            ← Identité, contact, feature flags
├── tailwind.config.ts       ← Couleurs/fonts du client
├── content/                 ← Contenu Markdown/JSON
├── locales/                 ← Traductions (fr.json, en.json)
├── public/                  ← Favicon, og-image, manifest
└── docs/                    ← Documentation
```

## Features

- **Feature flags** — Active/désactive animations, smooth scroll, 3D, curseur custom
- **Page builder** — Sections configurables via Markdown (hero, features, pricing, testimonials, FAQ, CTA, contact, stats, logos)
- **GSAP + ScrollTrigger** — Animations au scroll (fade, scale, parallax, clip-reveal, text-reveal)
- **Lenis** — Smooth scroll
- **Three.js** — Scènes 3D en background (particles, blob, shapes, gradient)
- **i18n** — Multi-langue FR/EN avec `@nuxtjs/i18n`
- **SEO complet** — `@nuxtjs/seo` (sitemap, robots, schema.org), og:image, hreflang, structured data (BlogPosting, FAQPage)
- **Fonts optimisées** — `@nuxt/fonts` (font-display: swap, preload automatique)
- **Nuxt Content v3** — Contenu Markdown avec 6 collections (blog, pages, testimonials, FAQ, projects, settings)
- **Nuxt Studio** — Interface d'édition visuelle en overlay (dev: auto, prod: `/_studio`)
- **Analytics** — Tracking léger intégré
- **Intégrations** — Cal.com (réservation), n8n (webhooks contact)
- **Docker** — Dockerfile multi-stage + docker-compose avec Traefik
- **Accessibilité** — Skip-to-content, HTML sémantique, aria-labels

---

## Quick Start

### Depuis GitHub Template

```bash
# 1. Utiliser "Use this template" sur GitHub, puis :
git clone --recurse-submodules git@github.com:jdenozi/<nouveau-repo>.git
cd <nouveau-repo>

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de dev
npm run dev
```

### Depuis un clone classique

```bash
git clone --recurse-submodules git@github.com:jdenozi/tempo-template.git mon-site
cd mon-site
git remote set-url origin git@github.com:jdenozi/mon-site.git
npm install && npm run dev
```

> **Important** : Le flag `--recurse-submodules` est obligatoire pour cloner `tempo-core/`.
> Si oublié : `git submodule update --init --recursive`

---

## Configuration nouveau client

### 1. Identité et features (`app.config.ts`)

```ts
export default defineAppConfig({
  client: {
    name: 'Mon Client',
    profession: 'Boulangerie artisanale',
    logo: '/images/logo.svg',
    favicon: '/favicon.ico',
  },
  contact: {
    email: 'contact@mon-client.fr',
    phone: '+33 6 12 34 56 78',
    address: '12 rue du Pain, 75001 Paris',
  },
  social: {
    instagram: 'https://instagram.com/mon-client',
    facebook: null,
    linkedin: null,
    twitter: null,
  },
  calcom: {
    username: 'mon-client',
    defaultEvent: 'consultation',
  },
  n8n: {
    webhookContact: 'https://n8n.tempo-hub.fr/webhook/mon-client-contact',
  },
  features: {
    animations: true,      // GSAP animations
    smoothScroll: false,    // Lenis smooth scroll
    threejs: false,         // Three.js 3D backgrounds
    transitions: true,      // Page transitions
    customCursor: false,    // Custom cursor
  },
  pages: {},
})
```

### 2. Couleurs et typographie (`tailwind.config.ts`)

```ts
export default {
  presets: [coreConfig],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7f0', 100: '#fdebd4', 200: '#f9d3a8',
          300: '#f5b571', 400: '#ef8d38', 500: '#ec7412',
          600: '#dd5a08', 700: '#b74209', 800: '#92350e',
          900: '#772e0f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

### 3. SEO et metadata (`nuxt.config.ts`)

```ts
export default defineNuxtConfig({
  extends: ['./tempo-core'],

  i18n: {
    baseUrl: 'https://mon-client.fr',    // IMPORTANT : pour les hreflang
    locales: [
      { code: 'fr', iso: 'fr-FR', file: 'fr.json', name: 'Français' },
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
    ],
    lazy: true,
    langDir: '../locales/',
  },

  site: {
    url: 'https://mon-client.fr',
    name: 'Mon Client',
    description: 'Boulangerie artisanale à Paris — pains au levain et viennoiseries',
    defaultLocale: 'fr',
  },
})
```

### 4. Assets (`public/`)

| Fichier | Taille | Usage |
|---------|--------|-------|
| `og-image.jpg` | 1200x630px | Partage social (Facebook, LinkedIn, Twitter) |
| `favicon.ico` | 48x48 | Navigateurs desktop |
| `apple-touch-icon.png` | 180x180 | iOS home screen |
| `icon-192.png` | 192x192 | Android / PWA |
| `icon-512.png` | 512x512 | Splash screen PWA |

Mettre aussi à jour `public/site.webmanifest` :

```json
{
  "name": "Mon Client",
  "short_name": "Mon Client",
  "theme_color": "#ec7412",
  "background_color": "#ffffff",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### 5. Contenu (`content/`)

```
content/
├── fr/
│   ├── pages/
│   │   ├── accueil.md        # Page d'accueil (sections: hero, features, etc.)
│   │   ├── services.md       # Page services
│   │   └── a-propos.md       # Page à propos
│   └── blog/
│       └── mon-article.md    # Article de blog
└── en/
    ├── pages/
    │   ├── home.md
    │   ├── services.md
    │   └── about.md
    └── blog/
        └── my-article.md
```

### 6. Traductions (`locales/`)

Modifier `locales/fr.json` et `locales/en.json` pour adapter les textes de l'interface (navigation, boutons, footer, etc.).

### 7. Variables d'environnement

Copier `.env.example` vers `.env` :

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `APP_NAME` | Nom de l'app (pour Docker) |
| `DOMAIN` | Domaine du site |
| `ACME_EMAIL` | Email pour certificat SSL (Let's Encrypt) |
| `UPLOADS_PATH` | Chemin stockage uploads |
| `STORAGE_QUOTA_MB` | Quota stockage par client |

---

## Deployment

```bash
# Build Docker image
docker compose build

# Start in production
docker compose up -d
```

Le `docker-compose.yml` inclut les labels Traefik pour le reverse proxy et le SSL automatique.

---

## Mettre à jour le core

```bash
git submodule update --remote
git add tempo-core
git commit -m "update: tempo-core to latest"
```

Un fix dans `tempo-core/` se propage à tous les sites clients via cette commande.

---

## Checklist nouveau site

- [ ] `app.config.ts` — identité, contact, réseaux sociaux, flags
- [ ] `tailwind.config.ts` — palette de couleurs, typographie
- [ ] `nuxt.config.ts` — `site.url`, `site.name`, `site.description`, `i18n.baseUrl`
- [ ] `public/og-image.jpg` — image de partage social (1200x630)
- [ ] `public/favicon.ico` + `apple-touch-icon.png` + icônes PWA
- [ ] `public/site.webmanifest` — nom et couleurs du client
- [ ] `content/` — pages et articles de blog
- [ ] `locales/` — traductions FR/EN
- [ ] `.env` — variables d'environnement (Studio GitHub OAuth)
- [ ] Tester : `npm run dev` puis `npm run build`
- [ ] Déployer : `docker compose up -d`
- [ ] Post-deploy : soumettre sitemap à Google Search Console

---

## Documentation

Voir le dossier `docs/` pour la documentation détaillée :

| Doc | Sujet |
|-----|-------|
| `01-nuxt-init.md` | Init Nuxt 3 |
| `02-tailwind-theming.md` | Tailwind + theming |
| `03-feature-flags.md` | Feature flags |
| `04-layouts-ui.md` | Layouts + UI |
| `05-sections-pagerenderer.md` | Sections + PageRenderer |
| `06-animations.md` | Animations GSAP |
| `07-smooth-scroll.md` | Smooth scroll (Lenis) |
| `08-threejs.md` | Three.js scenes |
| `09-i18n-seo.md` | i18n + SEO |
| `10-content-cms.md` | Nuxt Content + Nuxt Studio |
| `11-integrations.md` | Cal.com + n8n |
| `12-docker-deployment.md` | Docker + deployment |
| `13-seo-strategy.md` | Stratégie SEO complète |

Pour l'architecture détaillée, voir `ARCHITECTURE-TEMPLATE.md`.
