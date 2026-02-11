# 03 — Système de feature flags

## Ce qui a été fait

Mise en place du système de configuration client centralisé (`app.config.ts`) et du composable `useFeatures` qui gère le chargement conditionnel des fonctionnalités via des flags booléens.

## Fichiers concernés

| Fichier | Rôle |
|---------|------|
| `app.config.ts` | Configuration complète du site client (identité, contact, flags...) |
| `composables/useFeatures.ts` | Lecture des flags + merge avec surcharges par page |
| `composables/useClientConfig.ts` | Accès typé à la config client (identité, contact, social) |

## Comment ça marche

### app.config.ts

Fichier central de configuration. C'est le **seul fichier à modifier** pour personnaliser un site client (avec `tailwind.config.ts` pour les couleurs).

Il contient 6 sections :

```
client      → Nom, profession, logo, favicon
contact     → Email, téléphone, adresse
social      → Liens réseaux sociaux (null = masqué)
calcom      → Config embed Cal.com
n8n         → URL webhook contact
features    → Flags on/off des fonctionnalités
pages       → Surcharges de flags par page
```

### Feature flags

Chaque flag contrôle le chargement conditionnel d'une lib/fonctionnalité :

| Flag | Ce qu'il active | Libs chargées si `true` |
|------|-----------------|------------------------|
| `animations` | Animations au scroll (GSAP) | GSAP + ScrollTrigger (~60 Ko) |
| `smoothScroll` | Défilement fluide | Lenis (~15 Ko) |
| `threejs` | Backgrounds 3D | Three.js + TresJS (~150 Ko) |
| `transitions` | Transitions entre pages | GSAP (inclus si animations actif) |
| `customCursor` | Curseur personnalisé | Custom (~5 Ko) |

### Niveaux de site

| Niveau | Flags activés | JS estimé |
|--------|---------------|-----------|
| **Basic** | Tous à `false` | ~200 Ko |
| **Standard** | `animations`, `transitions` | ~260 Ko |
| **Premium** | + `smoothScroll`, `customCursor` | ~280 Ko |
| **Ultra** | + `threejs` | ~400 Ko |

### Surcharge par page

Les flags peuvent être surchargés pour une page spécifique. Le nom de la clé correspond au nom de route Nuxt :

```typescript
// app.config.ts
pages: {
  index: {
    threejs: true,  // 3D uniquement sur l'accueil
  },
  'blog-slug': {
    animations: false,  // Pas d'animations sur les articles
  },
}
```

Le composable `useFeatures` merge automatiquement : `flags globaux + surcharges page courante`.

### useFeatures()

```typescript
const { features, hasAnimations, hasThreejs } = useFeatures()

// features = computed avec tous les flags (mergés avec la page courante)
// hasAnimations = computed<boolean> raccourci

// Utilisation dans un template :
// <AnimateOnScroll v-if="hasAnimations">

// Utilisation dans un plugin :
// if (features.value.smoothScroll) { initLenis() }
```

### useClientConfig()

```typescript
const { client, contact, social, calcom, n8n } = useClientConfig()

// client.value.name → 'Tempo Hub'
// contact.value.email → 'contact@tempo-hub.fr'
// social.value.instagram → null (pas affiché)
```

## Workflow nouveau client

1. Ouvrir `app.config.ts`
2. Remplir `client` (nom, profession, logo)
3. Remplir `contact` et `social`
4. Choisir le niveau en activant les flags
5. Ajouter des surcharges par page si besoin

## Vérification

```bash
npm run dev
# La page affiche le nom du client depuis app.config.ts
# et liste tous les feature flags avec leur état (● activé / ○ désactivé)
```
