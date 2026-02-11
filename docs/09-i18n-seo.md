# 09 — i18n + SEO

## Ce qui a été fait

Installation et configuration de `@nuxtjs/i18n` pour le multi-langue (FR/EN) et `@nuxtjs/seo` pour le SEO automatique (sitemap, robots, schema.org, OG tags).

## Fichiers concernés

| Fichier | Rôle |
|---------|------|
| `nuxt.config.ts` | Configuration i18n et SEO |
| `locales/fr.json` | Traductions françaises |
| `locales/en.json` | Traductions anglaises |
| `components/layout/LangSwitcher.vue` | Sélecteur de langue |
| `components/layout/Header.vue` | Intégration LangSwitcher + nav traduite |
| `components/layout/Navbar.vue` | Labels traduits via `$t()` |
| `components/layout/Footer.vue` | Textes traduits |

## i18n — Multi-langue

### Configuration

- **Stratégie** : `prefix_except_default` — le français (défaut) n'a pas de préfixe, l'anglais est sous `/en/`
- **Lazy loading** : les fichiers de traduction sont chargés à la demande
- **Détection navigateur** : redirige vers la langue du navigateur au premier accès, stockée en cookie

| URL | Langue |
|-----|--------|
| `/` | Français (défaut) |
| `/en` | Anglais |
| `/services` | Français |
| `/en/services` | Anglais |

### Fichiers de traduction

```
locales/
├── fr.json    ← nav, cta, contact, footer, blog, common
└── en.json    ← same structure in English
```

### Utilisation dans les templates

```vue
<!-- Simple -->
<p>{{ $t('nav.home') }}</p>

<!-- Avec fallback (si la clé n'existe pas, affiche la valeur brute) -->
{{ $te(item.label) ? $t(item.label) : item.label }}
```

### Utilisation dans le script

```typescript
const { t, locale, setLocale } = useI18n()

// Traduire
const label = t('cta.contact')

// Changer de langue
setLocale('en')
```

### LangSwitcher

Dropdown de sélection de langue, intégré dans le Header (desktop + mobile).

```vue
<LayoutLangSwitcher />
```

### Ajouter une langue

1. Créer `locales/es.json` avec la même structure
2. Ajouter dans `nuxt.config.ts` :
```typescript
locales: [
  // ...existantes...
  { code: 'es', iso: 'es-ES', file: 'es.json', name: 'Español' },
],
```

## SEO

### Configuration automatique

`@nuxtjs/seo` fournit automatiquement :

| Feature | Détail |
|---------|--------|
| **Sitemap** | Généré automatiquement à `/sitemap.xml` |
| **Robots.txt** | Généré à `/robots.txt` |
| **OG tags** | Meta Open Graph automatiques |
| **Twitter cards** | Meta Twitter automatiques |
| **Canonical URLs** | URLs canoniques par page |

### Configuration site

```typescript
// nuxt.config.ts
site: {
  url: 'https://tempo-hub.fr',      // URL du site
  name: 'Tempo Hub',                 // Nom du site
  description: 'Template Nuxt 3...', // Description par défaut
  defaultLocale: 'fr',
}
```

### SEO par page

```vue
<script setup>
useSeoMeta({
  title: 'Accueil - Tempo Hub',
  description: 'Description de la page...',
  ogImage: '/images/og-home.jpg',
})

// Schema.org pour SEO local
useSchemaOrg([
  defineLocalBusiness({
    name: 'Tempo Hub',
    address: {
      streetAddress: '123 rue Example',
      addressLocality: 'Paris',
      postalCode: '75001',
      addressCountry: 'FR',
    },
  }),
])
</script>
```

## Renommage composable

`useSiteConfig()` a été renommé en `useClientConfig()` pour éviter le conflit avec le composable du même nom exporté par `nuxt-site-config` (dépendance de `@nuxtjs/seo`).
