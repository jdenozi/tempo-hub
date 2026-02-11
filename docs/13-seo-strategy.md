# 13 — Stratégie SEO

## Vue d'ensemble

Le template Tempo intègre une stratégie SEO complète via `@nuxtjs/seo` (méta-pack qui inclut sitemap, robots, schema.org, link-checker) et `@nuxtjs/i18n` pour le multilingue. Ce document décrit toutes les optimisations en place et les bonnes pratiques à suivre pour chaque site client.

---

## 1. Meta Tags (Open Graph + Twitter)

### Ce qui est automatique
`@nuxtjs/seo` génère automatiquement à partir de `useHead()` et `site` config :
- `og:title`, `og:description`, `og:url`, `og:locale`, `og:site_name`
- `twitter:card` (summary_large_image)
- `meta description`
- `canonical` URL

### Ce qui est configuré manuellement

| Page | `og:image` | `og:type` | `article:published_time` |
|------|-----------|-----------|--------------------------|
| `index.vue` | `/og-image.jpg` | website (auto) | — |
| `blog/index.vue` | `/og-image.jpg` | website (auto) | — |
| `blog/[slug].vue` | Image de l'article ou fallback | `article` | Date de l'article |
| `[...slug].vue` | `/og-image.jpg` | website (auto) | — |

### Pour chaque client
1. Placer une image `public/og-image.jpg` (1200x630px, < 300Ko)
2. Configurer `site.url` et `site.name` dans `nuxt.config.ts`

```ts
// nuxt.config.ts
site: {
  url: 'https://mon-client.fr',
  name: 'Mon Client',
  description: 'Description pour les moteurs de recherche',
  defaultLocale: 'fr',
},
```

---

## 2. Structured Data (Schema.org / JSON-LD)

### Schémas automatiques (`@nuxtjs/seo`)
- **WebSite** — généré sur toutes les pages
- **WebPage** — généré sur toutes les pages

### Schémas manuels

| Schéma | Page/Composant | Détail |
|--------|----------------|--------|
| **BlogPosting** | `blog/[slug].vue` | headline, description, datePublished, image |
| **FAQPage + Question** | `SectionFaq.vue` | Chaque question/réponse = rich snippet |

### Ajouter un schéma

```vue
<script setup>
// BlogPosting (dans une page article)
useSchemaOrg([
  defineArticle({
    '@type': 'BlogPosting',
    headline: article.value.title,
    description: article.value.description,
    datePublished: article.value.date,
    image: article.value.image,
  }),
])

// FAQ (dans un composant)
useSchemaOrg([
  defineWebPage({ '@type': 'FAQPage' }),
  ...items.map(item =>
    defineQuestion({
      name: item.question,
      acceptedAnswer: item.answer,
    }),
  ),
])
</script>
```

### Schémas recommandés pour les clients
- **LocalBusiness** — si le client a un lieu physique (adresse, horaires)
- **Service** — pour les pages services
- **Organization** — pour le branding (logo, social links)

---

## 3. Sitemap

### Configuration
Géré automatiquement par `@nuxtjs/sitemap` (inclus dans `@nuxtjs/seo`).

- **Index multi-locale** : `/sitemap_index.xml` pointe vers `/fr-FR.xml` et `/en-US.xml`
- **Hreflang dans le sitemap** : chaque URL inclut les alternates `hreflang="fr-FR"`, `hreflang="en-US"`, `hreflang="x-default"`
- **Fréquence de crawl** : auto-détectée

### Vérification
```bash
curl https://mon-client.fr/sitemap_index.xml
curl https://mon-client.fr/__sitemap__/fr-FR.xml
```

---

## 4. Robots.txt

### Configuration
Géré par `nuxt-robots` (inclus dans `@nuxtjs/seo`).

- **Dev** : `Disallow: /` (bloque l'indexation)
- **Prod** : `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`

Pas de configuration supplémentaire nécessaire.

---

## 5. SEO Multilingue (i18n)

### Configuration

```ts
// nuxt.config.ts (client)
i18n: {
  baseUrl: 'https://mon-client.fr',  // IMPORTANT pour les hreflang
  locales: [
    { code: 'fr', iso: 'fr-FR', file: 'fr.json', name: 'Français' },
    { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
  ],
  lazy: true,
  langDir: '../locales/',
},
```

### Ce qui est généré
- `<html lang="fr-FR">` — attribut lang dynamique
- `<link rel="canonical">` — URL canonique par locale
- `<meta property="og:locale">` — locale Open Graph
- Hreflang dans le sitemap (pas dans le `<head>` en dev)

### Stratégie d'URL
- **FR (défaut)** : `/`, `/blog`, `/contact`
- **EN** : `/en/`, `/en/blog`, `/en/contact`

---

## 6. Images

### Bonnes pratiques appliquées
- **`alt`** : toujours présent sur toutes les images
- **`width` + `height`** : définis pour éviter le CLS (Cumulative Layout Shift)
- **`loading="lazy"`** : sur les images hors viewport (blog cards, logos)
- **Pas de lazy** sur le logo header (above-the-fold)

### Checklist pour chaque client
- [ ] Images optimisées (WebP/AVIF si possible, < 200Ko)
- [ ] `og-image.jpg` dans `/public/` (1200x630px)
- [ ] Images de blog avec ratio cohérent (16:9 recommandé)

---

## 7. Performance & Core Web Vitals

### Fonts
- **Module** : `@nuxt/fonts` — chargement optimisé automatique
- **Fonts** : Inter (texte) + Poppins (titres)
- **font-display: swap** — géré par le module (évite le FOIT)
- **Preload** : automatique pour les fonts utilisées above-the-fold

### CSS
- Tailwind avec PurgeCSS — seuls les styles utilisés sont inclus
- CSS variables pour le theming (pas de duplication)
- `clamp()` pour le responsive spacing

### Lazy Loading
- Images below-the-fold : `loading="lazy"`
- Feature flags : désactiver animations/Three.js si non utilisés

---

## 8. Accessibilité (impact SEO indirect)

### En place
- **Skip-to-content** : lien caché visible au focus clavier (`#main-content`)
- **HTML sémantique** : `<header>`, `<main>`, `<nav>`, `<footer>`, `<article>`, `<section>`
- **Hiérarchie de titres** : un seul `<h1>` par page, `<h2>` dans les sections
- **`aria-hidden`** : sur les icônes décoratives
- **`aria-label`** : sur le bouton menu mobile

### Checklist pour chaque client
- [ ] Contraste des couleurs suffisant (ratio 4.5:1 minimum)
- [ ] Textes alternatifs pertinents sur les images
- [ ] Formulaires avec labels explicites

---

## 9. Page d'erreur 404

- **`error.vue`** dans `tempo-core/` — page d'erreur brandée
- **`robots: noindex, nofollow`** — pas d'indexation des erreurs
- **Lien de retour** vers l'accueil avec `NuxtLinkLocale`
- **Traductions** : FR ("Cette page n'existe pas") / EN ("This page does not exist")

---

## 10. Favicon & Web Manifest

### Fichiers nécessaires dans `/public/`
| Fichier | Taille | Usage |
|---------|--------|-------|
| `favicon.ico` | 48x48 | Navigateurs desktop |
| `apple-touch-icon.png` | 180x180 | iOS home screen |
| `icon-192.png` | 192x192 | Android / PWA |
| `icon-512.png` | 512x512 | Splash screen PWA |
| `og-image.jpg` | 1200x630 | Partage social |
| `site.webmanifest` | — | Manifest PWA |

### Head links (auto dans `nuxt.config.ts`)
```html
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#b8956d">
```

---

## 11. Checklist SEO pour un nouveau client

### Configuration
- [ ] `site.url` + `site.name` + `site.description` dans `nuxt.config.ts`
- [ ] `i18n.baseUrl` = même URL que `site.url`
- [ ] `theme-color` dans `nuxt.config.ts` (couleur primaire du client)
- [ ] Mettre à jour `site.webmanifest` (name, theme_color)

### Assets
- [ ] `public/og-image.jpg` — image de partage social (1200x630)
- [ ] `public/favicon.ico` — favicon 48x48
- [ ] `public/apple-touch-icon.png` — icône iOS 180x180
- [ ] `public/icon-192.png` + `public/icon-512.png` — icônes PWA

### Contenu
- [ ] Traductions complètes dans `locales/fr.json` et `locales/en.json`
- [ ] Blog articles avec frontmatter complet (title, description, date, image)
- [ ] Pages avec title + description dans le frontmatter

### Vérification post-déploiement
- [ ] Google Search Console — soumettre le sitemap
- [ ] Lighthouse — score SEO > 95
- [ ] Test Rich Results — vérifier FAQPage, BlogPosting
- [ ] Meta tags debugger (Facebook, Twitter, LinkedIn)
- [ ] robots.txt accessible (`/robots.txt`)
- [ ] Sitemap accessible (`/sitemap_index.xml`)

---

## Modules SEO utilisés

| Module | Rôle |
|--------|------|
| `@nuxtjs/seo` | Meta-pack SEO (sitemap, robots, schema.org, link-checker) |
| `@nuxtjs/i18n` | Multilingue, hreflang, locale routing |
| `@nuxt/fonts` | Chargement optimisé des fonts (font-display: swap, preload) |
| `@nuxt/content` | Blog avec frontmatter SEO-friendly |
