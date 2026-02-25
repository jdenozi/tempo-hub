# Architecture Template Sites Web — Tempo Hub

## 1. Vision globale

Un **template client** avec un **Nuxt Layer** (`tempo-core/`) en **git submodule**.

- **`tempo-core/`** — Git submodule (`jdenozi/tempo-core`) : composants, composables, pages, layouts, server API, animations, 3D
- **Racine** — Le template client : identité, contenu, traductions, config
- Un fix dans `tempo-core/` se propage à tous les clients via `git submodule update --remote`
- Configurable via **flags** (pas de duplication de code)
- Du site vitrine basique au site avec animations 3D
- Self-hosted sur ton infrastructure

---

## 2. Stack technique

| Couche | Techno | Rôle |
|--------|--------|------|
| **Framework** | Nuxt 3 | SSR, routing, API routes |
| **UI** | Vue 3 + Tailwind CSS | Composants, styles |
| **Contenu** | Nuxt Content + Nuxt Studio | Markdown éditable par le client |
| **Traduction** | @nuxtjs/i18n | Multi-langue (FR/EN/...) |
| **SEO** | @nuxtjs/seo | Meta, sitemap, schema.org |
| **Animations** | GSAP + ScrollTrigger | Animations 2D au scroll |
| **Scroll** | Lenis | Smooth scroll |
| **3D** | Three.js + TresJS | Scènes WebGL |
| **RDV** | Cal.com (embed) | Réservation + paiement Stripe intégré |
| **Automations** | n8n | Webhooks, emails, SMS rappels |

---

## 3. Système de flags

Tout est contrôlé par des flags dans `app.config.ts`. Les libs lourdes ne se chargent que si activées.

### Flags disponibles

| Flag | Effet | Libs chargées | Poids |
|------|-------|---------------|-------|
| `animations` | Animations au scroll | GSAP, ScrollTrigger | ~60 Ko |
| `smoothScroll` | Défilement fluide | Lenis | ~15 Ko |
| `threejs` | Backgrounds 3D | Three.js, TresJS | ~150 Ko |
| `transitions` | Transitions entre pages | GSAP (inclus) | — |
| `customCursor` | Curseur personnalisé | Custom | ~5 Ko |

### Niveaux de site

| Niveau | Flags activés | JS total | Usage |
|--------|---------------|----------|-------|
| **Basic** | Tous à `false` | ~200 Ko | Client pressé, budget serré |
| **Standard** | `animations`, `transitions` | ~260 Ko | Client normal |
| **Premium** | + `smoothScroll`, `customCursor` | ~280 Ko | Client qui veut du beau |
| **Ultra** | + `threejs` | ~400 Ko | Ton site, clients créatifs |

### Surcharge par page

Les flags peuvent être surchargés par page (ex: 3D uniquement sur l'accueil) :

```typescript
// app.config.ts
export default {
  features: {
    threejs: false,  // Désactivé globalement
  },
  pages: {
    home: {
      threejs: true,  // Activé uniquement sur l'accueil
    }
  }
}
```

---

## 4. Structure des dossiers

```
tempo-template/                       # Repo client (clone du template)
│
├── nuxt.config.ts                    # extends: ['./tempo-core'] + metadata
├── app.config.ts                     # Identité client, contact, flags
├── tailwind.config.ts                # Couleurs/fonts client (presets: core)
├── content.config.ts                 # Re-export from core
├── package.json                      # deps: { "tempo-core": "file:./tempo-core" }
├── tsconfig.json
├── Dockerfile
├── docker-compose.yml
├── .env.example
│
├── tempo-core/                       # GIT SUBMODULE → jdenozi/tempo-core
│   ├── nuxt.config.ts                # Modules, i18n base, runtimeConfig
│   ├── app.config.ts                 # Valeurs par défaut (flags, etc.)
│   ├── tailwind.config.ts            # Theme de base (couleurs, fonts)
│   ├── content.config.ts             # Schemas Zod des collections
│   ├── app.vue
│   ├── package.json                  # Toutes les deps (nuxt, gsap, three, lenis...)
│   ├── config/                       # animations.ts, scenes.ts
│   ├── composables/                  # useFeatures, useGsap, useAnimations, useClientConfig...
│   ├── directives/                   # vAnimate.ts
│   ├── plugins/                      # gsap, lenis, directives
│   ├── components/                   # ui, layout, sections, integrations, animations, three, content
│   ├── scenes/                       # Scènes Three.js
│   ├── layouts/                      # default, blog, landing
│   ├── pages/                        # index, [...slug], blog/*
│   ├── server/                       # API (contact, analytics) + utils
│   ├── utils/                        # formatDate
│   └── assets/css/main.css           # Tailwind + variables CSS
│
├── content/                          # Contenu Markdown/JSON du client
│   ├── fr/
│   │   ├── pages/
│   │   └── blog/
│   └── en/
├── locales/                          # fr.json, en.json
├── public/                               # Static assets
└── docs/                             # Documentation
```

---

## 5. Fichier de configuration client

### app.config.ts

```typescript
export default defineAppConfig({
  // === IDENTITÉ CLIENT ===
  client: {
    name: 'Tempo Hub',
    profession: 'Agence web',
    logo: '/images/logo.svg',
    favicon: '/favicon.ico',
  },

  // === COORDONNÉES ===
  contact: {
    email: 'contact@tempo-hub.fr',
    phone: '+33 6 00 00 00 00',
    address: '',
  },

  // === RÉSEAUX SOCIAUX ===
  social: {
    instagram: null,
    facebook: null,
    linkedin: null,
    twitter: null,
  },

  // === INTÉGRATIONS ===
  calcom: {
    username: '',
    defaultEvent: 'consultation',
  },

  n8n: {
    webhookContact: '',
  },

  // === FLAGS FEATURES ===
  features: {
    animations: true,
    smoothScroll: true,
    threejs: false,
    transitions: true,
    customCursor: false,
  },

  // === SURCHARGE PAR PAGE ===
  pages: {
    home: {
      threejs: true,  // 3D uniquement sur l'accueil
    },
  },
})
```

### tailwind.config.ts (theming)

```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5f0',
          100: '#f5ebe1',
          200: '#e8d4c0',
          300: '#d9b896',
          400: '#cdb496',  // Couleur principale
          500: '#b8956d',
          600: '#9a7a54',
          700: '#7d6045',
          800: '#5f4836',
          900: '#423127',
        },
        secondary: {
          // ...
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
    },
  },
}
```

---

## 6. Système d'animations

### Principe

Tu codes chaque animation **une seule fois** dans `config/animations.ts`. Ensuite tu l'appliques via :

1. **Directive** : `v-animate="'fadeUp'"`
2. **Composant wrapper** : `<AnimateOnScroll animation="fadeUp">`
3. **JSON page builder** : `"animation": { "name": "fadeUp" }`

### config/animations.ts

```typescript
export const animations = {
  // === FADE ===
  fadeUp: {
    from: { y: 50, opacity: 0 },
    to: { y: 0, opacity: 1 },
    duration: 0.8,
    ease: 'power2.out',
  },
  fadeDown: {
    from: { y: -50, opacity: 0 },
    to: { y: 0, opacity: 1 },
    duration: 0.8,
    ease: 'power2.out',
  },
  fadeLeft: {
    from: { x: -50, opacity: 0 },
    to: { x: 0, opacity: 1 },
    duration: 0.8,
    ease: 'power2.out',
  },
  fadeRight: {
    from: { x: 50, opacity: 0 },
    to: { x: 0, opacity: 1 },
    duration: 0.8,
    ease: 'power2.out',
  },

  // === SCALE ===
  scaleIn: {
    from: { scale: 0.8, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    duration: 0.6,
    ease: 'back.out(1.7)',
  },

  // === STAGGER (pour listes/grilles) ===
  stagger: {
    from: { y: 30, opacity: 0 },
    to: { y: 0, opacity: 1 },
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out',
  },

  // === REVEAL (clip-path) ===
  clipReveal: {
    from: { clipPath: 'inset(100% 0 0 0)' },
    to: { clipPath: 'inset(0% 0 0 0)' },
    duration: 1.2,
    ease: 'power4.out',
  },

  // === TEXT ===
  textReveal: {
    type: 'splitText',
    from: { y: '100%', opacity: 0 },
    to: { y: '0%', opacity: 1 },
    stagger: 0.03,
    duration: 0.8,
    ease: 'power2.out',
  },

  // === PARALLAX ===
  parallax: {
    type: 'parallax',
    yPercent: -20,
    scrub: true,
  },
}

export type AnimationName = keyof typeof animations
```

### Ajouter une nouvelle animation

1. Ouvrir `config/animations.ts`
2. Ajouter la définition
3. Utiliser partout avec `v-animate="'maNouvelle'"`

C'est tout. Pas besoin de toucher aux composants ou directives.

---

## 7. Système 3D (Three.js)

### Principe

Chaque scène est un fichier TypeScript dans `/scenes/` qui exporte une factory. Les scènes sont chargées dynamiquement (lazy import).

### Structure d'une scène

```typescript
// scenes/particles.ts

export interface ParticlesOptions {
  color?: string
  count?: number
  speed?: number
  size?: number
}

export function createParticlesScene(canvas: HTMLCanvasElement, options: ParticlesOptions = {}) {
  const {
    color = '#ffffff',
    count = 1000,
    speed = 1,
    size = 0.02,
  } = options

  // ... init Three.js scene, camera, renderer, objects ...

  return {
    init() {
      // Crée la scène, camera, objets
    },
    animate() {
      // Appelé chaque frame (requestAnimationFrame)
    },
    resize() {
      // Ajuste camera et renderer au resize
    },
    destroy() {
      // Nettoie la mémoire (dispose geometries, materials, etc.)
    },
    // Exposer des propriétés pour animation externe (GSAP)
    objects: {
      particles: /* ... */
    },
  }
}
```

### Registre des scènes

```typescript
// tempo-core/config/scenes.ts

export const scenes = {
  particles: () => import('../scenes/particles').then(m => m.createParticlesScene),
  backgroundBlob: () => import('../scenes/backgroundBlob').then(m => m.createBackgroundBlobScene),
  abstractShapes: () => import('../scenes/abstractShapes').then(m => m.createAbstractShapesScene),
  gradientPlane: () => import('../scenes/gradientPlane').then(m => m.createGradientPlaneScene),
}

export type SceneName = keyof typeof scenes
```

### Utilisation

```vue
<BackgroundScene
  scene="particles"
  :options="{
    color: '#cdb496',
    count: 2000,
    speed: 0.5
  }"
/>
```

### Ajouter une nouvelle scène

1. Créer `scenes/maScene.ts`
2. L'ajouter dans `config/scenes.ts`
3. Utiliser avec `<BackgroundScene scene="maScene" />`

---

## 8. Page builder (JSON)

### Structure d'une page

Les pages peuvent être définies en Markdown (Nuxt Content) avec un frontmatter structuré :

```markdown
---
title: "Accueil"
description: "Mon Site — Description"

features:
  threejs: true

sections:
  - type: hero
    props:
      title: "Mon Entreprise"
      subtitle: "Tagline du site"
      ctaText: "Prendre RDV"
      ctaLink: "/contact"
    animation:
      name: fadeUp
      delay: 0.2
    background:
      type: three
      scene: backgroundBlob
      options:
        color1: "#cdb496"
        color2: "#1a1a2e"

  - type: features
    props:
      title: "Nos services"
      items:
        - icon: heart
          title: "Design"
          description: "Sites web sur-mesure"
        - icon: users
          title: "Accompagnement"
          description: "Suivi personnalisé"
    animation:
      name: stagger
      stagger: 0.15

  - type: testimonials
    props:
      title: "Témoignages"
    animation:
      name: slideIn

  - type: cta
    props:
      title: "Prêt à commencer ?"
      ctaText: "Prendre rendez-vous"
      ctaLink: "/contact"
    animation:
      name: scaleIn
---
```

### Rendu dynamique

Le composant `PageRenderer.vue` :

1. Lit le JSON/frontmatter de la page
2. Pour chaque section :
   - Résout le composant (`hero` → `SectionHero`)
   - Résout l'animation (`fadeUp` → config GSAP)
   - Résout le background (`three` → `BackgroundScene`)
3. Rend le tout

### Mapping type → composant

| Type JSON | Composant Vue |
|-----------|---------------|
| `hero` | `SectionHero` |
| `features` | `SectionFeatures` |
| `pricing` | `SectionPricing` |
| `testimonials` | `SectionTestimonials` |
| `faq` | `SectionFaq` |
| `cta` | `SectionCta` |
| `contact` | `SectionContact` |
| `stats` | `SectionStats` |
| `logos` | `SectionLogos` |

### Gestion des backgrounds

| Type | Rendu | Fallback si flag désactivé |
|------|-------|---------------------------|
| `color` | `background-color` CSS | — |
| `gradient` | `linear-gradient` CSS | — |
| `image` | `<NuxtImg>` | — |
| `video` | `<video>` | Image poster |
| `three` | `<BackgroundScene>` | Gradient ou couleur |

---

## 9. CMS (Nuxt Studio)

### Fonctionnement

Nuxt Studio fonctionne comme un overlay sur le site :

- **Dev** : s'active automatiquement sur toutes les pages (`nuxt dev`)
- **Production** : authentification via GitHub OAuth à `/_studio`
- **Raccourci** : `Ctrl + .` (ou `Cmd + .`) pour ouvrir/fermer

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
  ai: {
    apiKey: process.env.AI_GATEWAY_API_KEY,
    context: { title: 'Tempo Hub', description: '...' },
  },
  i18n: { defaultLocale: 'fr' },
}
```

Les collections sont détectées automatiquement depuis `content.config.ts`.

---

## 10. Traduction (i18n)

### Configuration

```typescript
// tempo-core/nuxt.config.ts — Base i18n
export default defineNuxtConfig({
  i18n: {
    defaultLocale: 'fr',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: { useCookie: true, cookieKey: 'i18n_locale', redirectOn: 'root' },
  },
})

// nuxt.config.ts (client) — Locale files
export default defineNuxtConfig({
  extends: ['./tempo-core'],
  i18n: {
    locales: [
      { code: 'fr', iso: 'fr-FR', file: 'fr.json', name: 'Français' },
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
    ],
    lazy: true,
    langDir: '../locales/',
  },
})
```

### Fichiers de traduction

```json
// locales/fr.json
{
  "nav": {
    "home": "Accueil",
    "about": "À propos",
    "services": "Services",
    "contact": "Contact"
  },
  "cta": {
    "book": "Réserver",
    "contact": "Me contacter",
    "learnMore": "En savoir plus"
  }
}
```

### Utilisation

```vue
<template>
  <NuxtLinkLocale to="/">{{ $t('nav.home') }}</NuxtLinkLocale>
</template>
```

### Contenu traduit

```
/content
  /fr
    /pages/accueil.md
    /pages/services.md
  /en
    /pages/home.md
    /pages/services.md
```

---

## 11. Intégrations

### Cal.com (RDV + paiement)

```vue
<!-- components/integrations/CalEmbed.vue -->
<template>
  <div
    :data-cal-link="calLink"
    :data-cal-config="calConfig"
    class="cal-embed"
  />
</template>

<script setup>
const config = useAppConfig()

const props = defineProps<{
  event?: string
}>()

const calLink = computed(() =>
  `${config.calcom.username}/${props.event || config.calcom.defaultEvent}`
)

const calConfig = JSON.stringify({
  theme: 'light',
})

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://app.cal.com/embed/embed.js'
  script.async = true
  document.body.appendChild(script)
})
</script>
```

### Formulaire contact → n8n

```vue
<!-- components/integrations/ContactForm.vue -->
<script setup>
const config = useAppConfig()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  message: '',
})

const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')

async function submit() {
  status.value = 'loading'
  try {
    await $fetch(config.n8n.webhookContact, {
      method: 'POST',
      body: form,
    })
    status.value = 'success'
  } catch {
    status.value = 'error'
  }
}
</script>
```

---

## 12. SEO

### Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/seo'],
  site: {
    url: 'https://tempo-hub.fr',
    name: 'Tempo Hub',
  },
})
```

### Par page

```vue
<script setup>
useSeoMeta({
  title: 'Accueil - Mon Site',
  description: 'Description de mon site...',
  ogImage: '/images/og-home.jpg',
})

// Schema.org pour SEO local
useSchemaOrg([
  defineLocalBusiness({
    name: 'Mon Entreprise',
    address: {
      streetAddress: '123 rue Example',
      addressLocality: 'Paris',
      postalCode: '75001',
      addressCountry: 'FR',
    },
    telephone: '+33 6 00 00 00 00',
  }),
])
</script>
```

---

## 13. Docker

### Dockerfile

```dockerfile
# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY tempo-core/package.json ./tempo-core/
RUN npm install

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY tempo-core/ ./tempo-core/
COPY nuxt.config.ts app.config.ts tailwind.config.ts content.config.ts tsconfig.json package.json ./
COPY content/ ./content/
COPY locales/ ./locales/
COPY public/ ./public/
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NITRO_PORT=3000 NITRO_HOST=0.0.0.0
RUN addgroup --system --gid 1001 nuxt && adduser --system --uid 1001 nuxt
COPY --from=builder --chown=nuxt:nuxt /app/.output ./.output
USER nuxt
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

### docker-compose.yml

```yaml
services:
  app:
    build: .
    container_name: ${APP_NAME:-tempo-hub}
    restart: unless-stopped
    environment:
      - NITRO_PORT=3000
      - NITRO_HOST=0.0.0.0
    volumes:
      - uploads:/app/.output/public/images/uploads
    networks:
      - web
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.${APP_NAME:-tempo-hub}.rule=Host(`${DOMAIN:-localhost}`)"
      - "traefik.http.routers.${APP_NAME:-tempo-hub}.entrypoints=websecure"
      - "traefik.http.routers.${APP_NAME:-tempo-hub}.tls.certresolver=letsencrypt"
      - "traefik.http.services.${APP_NAME:-tempo-hub}.loadbalancer.server.port=3000"
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: "0.5"

volumes:
  uploads:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: ${UPLOADS_PATH:-./data/uploads}

networks:
  web:
    external: true
```

### Limiter le stockage par client

Créer un volume avec quota via fichier image :

```bash
# Créer le fichier image (1 Go)
fallocate -l 1G /data/volumes/client-project.img

# Formater
mkfs.ext4 /data/volumes/client-project.img

# Monter
mount -o loop /data/volumes/client-project.img /mnt/clients/myproject

# Utiliser comme volume Docker
```

---

## 14. Workflow nouveau client

```bash
# 1. Cloner le template (avec submodule)
git clone --recurse-submodules git@github.com:jdenozi/tempo-template.git client-nom
cd client-nom

# 2. Changer le remote
git remote set-url origin git@github.com:jdenozi/client-nom.git

# 3. Personnaliser
# - app.config.ts (identité, contact, flags)
# - tailwind.config.ts (couleurs)
# - nuxt.config.ts (site metadata)
# - content/ (contenu)
# - locales/ (traductions)
# - .env (Studio GitHub OAuth)

# 4. Lancer
npm install && npm run dev

# 5. Mettre à jour le core plus tard
git submodule update --remote
git add tempo-core && git commit -m "update: tempo-core to latest"
```

| Étape | Action | Temps |
|-------|--------|-------|
| 1 | Cloner le template | 2 min |
| 2 | Configurer `app.config.ts` (nom, contacts, flags) | 15 min |
| 3 | Configurer `tailwind.config.ts` (couleurs, typo) | 10 min |
| 4 | Créer le contenu Markdown | 1-2h |
| 5 | Ajouter les images | 30 min |
| 6 | Configurer Cal.com | 15 min |
| 7 | Créer le workflow n8n (contact, rappels) | 30 min |
| 8 | Créer le volume Docker | 5 min |
| 9 | Déployer | 10 min |
| **Total** | | **~3-4h** |

Un fix dans `tempo-core/` se propage à tous les clients via `git submodule update --remote`.

---

## 15. Ressources estimées

| Composant | RAM | Stockage |
|-----------|-----|----------|
| Site Nuxt (SSR) | 200-300 Mo | 100 Mo (build) |
| Uploads client | — | 500 Mo - 2 Go |
| Logs | — | 30 Mo (rotation) |
| **Total par client** | **~300 Mo** | **~1-2 Go** |

Pour 10 clients : ~3 Go RAM, ~15 Go stockage.

---

## 16. Fichiers à coder une seule fois

| Fichier | Rôle | Modifié après ? |
|---------|------|-----------------|
| `useFeatures.ts` | Lit et merge les flags | Non |
| `gsap.client.ts` | Init GSAP conditionnelle | Non |
| `lenis.client.ts` | Init Lenis conditionnelle | Non |
| `three.client.ts` | Init Three.js conditionnelle | Non |
| `vAnimate.ts` | Directive animation | Non |
| `AnimateOnScroll.vue` | Wrapper scroll | Non |
| `Canvas.vue` | Wrapper Three.js | Non |
| `BackgroundScene.vue` | Charge une scène | Non |
| `PageRenderer.vue` | Rend une page depuis JSON | Non |
| Composants `Section*.vue` | Blocs de page | Rarement |
| Composants `ui/*` | Briques de base | Rarement |
| **`animations.ts`** | **Définitions animations** | **Oui, pour ajouter** |
| **`scenes.ts`** | **Registre scènes 3D** | **Oui, pour ajouter** |
| **`scenes/*.ts`** | **Scènes 3D** | **Oui, pour ajouter** |

---

## 17. Architecture infra globale

```
┌─────────────────────────────────────────────────────────────┐
│                         Traefik                              │
│                (reverse proxy + SSL auto)                    │
└─────────────────────────────────────────────────────────────┘
        │           │           │           │           │
        ▼           ▼           ▼           ▼           ▼
   ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
   │ Site A │  │ Site B │  │ Site C │  │ Cal.com│  │  n8n   │
   │ (Nuxt) │  │ (Nuxt) │  │ (Nuxt) │  │        │  │        │
   └────────┘  └────────┘  └────────┘  └────────┘  └────────┘
        │           │           │
        └───────────┼───────────┘
                    ▼
            Volumes limités
           (1-2 Go par client)
```

### Services partagés

| Service | Rôle |
|---------|------|
| Traefik | Reverse proxy, SSL automatique |
| Cal.com | RDV + paiement Stripe |
| n8n | Automations (webhooks, emails, SMS) |
| PostgreSQL | BDD pour Cal.com, n8n |
| Redis | Cache (optionnel) |

### Monitoring

| Outil | Rôle |
|-------|------|
| Grafana | Dashboards |
| Prometheus | Métriques système |
| Loki | Logs centralisés |
| Uptime Kuma | Monitoring des sites |

---

## 18. Certifications / arguments commerciaux

| Argument | Justification |
|----------|---------------|
| 🇫🇷 Hébergé en France | VPS OVH datacenter français |
| 🔒 RGPD compliant | Données en France, mentions légales |
| 🌱 Éco-responsable | Datacenters OVH optimisés énergie |
| ⚡ Sites performants | Score Lighthouse > 90 |
| ♿ Accessible | Standards WCAG respectés |

---

## 19. Pour aller plus loin

- **Template standard** : flags animations + transitions uniquement
- **Template premium** : tous les flags, 3D, curseur custom
- **Ton site Tempo Hub** : full premium, vitrine de ce que tu sais faire
