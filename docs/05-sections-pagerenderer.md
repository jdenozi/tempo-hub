# 05 — Sections + PageRenderer

## Ce qui a été fait

Création de 9 composants de section et du PageRenderer qui permet de construire des pages entières à partir d'un tableau de sections (page builder pattern).

## Architecture

```
components/
├── sections/
│   ├── SectionHero.vue          ← Bannière hero avec CTA
│   ├── SectionFeatures.vue      ← Grille de features (icônes + texte)
│   ├── SectionPricing.vue       ← Grille de tarifs (plans)
│   ├── SectionTestimonials.vue  ← Témoignages clients
│   ├── SectionFaq.vue           ← Accordéon FAQ
│   ├── SectionCta.vue           ← Bloc call-to-action plein écran
│   ├── SectionContact.vue       ← Formulaire de contact + infos
│   ├── SectionStats.vue         ← Chiffres clés
│   └── SectionLogos.vue         ← Logos partenaires
└── content/
    └── PageRenderer.vue         ← Résout et rend les sections dynamiquement
```

## PageRenderer

Le composant central qui résout le type de section et rend le composant correspondant.

### Utilisation

```vue
<ContentPageRenderer :sections="sections" />
```

### Structure de données

```typescript
interface PageSection {
  type: string                    // Clé de la section (hero, features, faq...)
  props: Record<string, unknown>  // Props passées au composant
}
```

### Mapping type → composant

| Type (string) | Composant rendu |
|----------------|-----------------|
| `hero` | `SectionsSectionHero` |
| `features` | `SectionsSectionFeatures` |
| `pricing` | `SectionsSectionPricing` |
| `testimonials` | `SectionsSectionTestimonials` |
| `faq` | `SectionsSectionFaq` |
| `cta` | `SectionsSectionCta` |
| `contact` | `SectionsSectionContact` |
| `stats` | `SectionsSectionStats` |
| `logos` | `SectionsSectionLogos` |

## Sections disponibles

### SectionHero
Bannière plein écran avec titre, sous-titre et jusqu'à 2 boutons CTA.

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Titre principal (obligatoire) |
| `subtitle` | `string` | Sous-titre |
| `ctaText` | `string` | Texte du bouton principal |
| `ctaLink` | `string` | Lien du bouton principal |
| `secondaryCtaText` | `string` | Texte du bouton secondaire |
| `secondaryCtaLink` | `string` | Lien du bouton secondaire |

### SectionFeatures
Grille responsive (1/2/3 colonnes) de cards avec icône, titre et description.

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Titre de la section |
| `subtitle` | `string` | Sous-titre |
| `items` | `FeatureItem[]` | `{ icon, title, description }` |

### SectionPricing
Grille de plans tarifaires avec feature lists et CTA. Un plan peut être `highlighted`.

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Titre |
| `plans` | `PricingPlan[]` | `{ name, price, period, description, features[], ctaText, ctaLink, highlighted }` |

### SectionTestimonials
Grille de témoignages avec citation, auteur et rôle.

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Titre |
| `items` | `TestimonialItem[]` | `{ quote, author, role }` |

### SectionFaq
Accordéon interactif (un seul item ouvert à la fois) avec animation de transition.

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Titre |
| `items` | `FaqItem[]` | `{ question, answer }` |

### SectionCta
Bloc d'appel à l'action sur fond sombre, avec titre, sous-titre et boutons.

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Titre |
| `subtitle` | `string` | Sous-titre |
| `ctaText` | `string` | Texte du bouton (obligatoire) |
| `ctaLink` | `string` | Lien |

### SectionContact
Layout 2 colonnes : infos contact (depuis `app.config.ts`) + formulaire. Le formulaire envoie au webhook n8n si configuré.

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Titre |
| `subtitle` | `string` | Sous-titre |
| `showPhone` | `boolean` | Afficher le champ téléphone (défaut: true) |
| `submitLabel` | `string` | Texte du bouton d'envoi |

### SectionStats
Chiffres clés sur fond sombre avec grille adaptative (2/3/4 colonnes selon le nombre d'items).

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Titre optionnel |
| `items` | `StatItem[]` | `{ value, label }` |

### SectionLogos
Logos partenaires/clients en flex wrap, avec effet grayscale → couleur au hover.

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Titre optionnel (texte au-dessus) |
| `items` | `LogoItem[]` | `{ src, alt }` |

## Comment construire une page

```typescript
// Dans un fichier pages/*.vue
const sections: PageSection[] = [
  { type: 'hero', props: { title: 'Mon titre', ctaText: 'Contact' } },
  { type: 'features', props: { title: 'Services', items: [...] } },
  { type: 'cta', props: { title: 'Prêt ?', ctaText: 'Go' } },
]
```

L'objectif final est que ces données viennent du frontmatter Markdown (Nuxt Content), ce qui permettra au client de modifier ses pages via le CMS.
