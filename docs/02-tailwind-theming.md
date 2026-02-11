# 02 — Tailwind CSS + Système de theming

## Ce qui a été fait

Installation de Tailwind CSS via le module officiel `@nuxtjs/tailwindcss` et mise en place d'un système de theming complet avec 3 palettes de couleurs, des typographies et des utilitaires custom.

## Fichiers concernés

| Fichier | Rôle |
|---------|------|
| `nuxt.config.ts` | Déclaration du module Tailwind |
| `tailwind.config.ts` | Définition du thème (couleurs, typos, spacing) |
| `assets/css/main.css` | CSS de base, variables CSS, classes utilitaires |
| `app.vue` | Page de test utilisant le thème |

## Comment ça marche

### Palettes de couleurs

3 palettes complètes (50 → 950) sont définies dans `tailwind.config.ts` :

| Palette | Usage | Exemple de classe |
|---------|-------|-------------------|
| `primary` | Couleur principale du site (tons chauds par défaut) | `bg-primary-400`, `text-primary-900` |
| `secondary` | Couleur complémentaire (tons bleus par défaut) | `bg-secondary-500` |
| `accent` | Couleur d'accentuation pour les CTA (tons orangés) | `bg-accent-500` |

**Pour personnaliser un site client**, il suffit de changer les valeurs hex dans `tailwind.config.ts`. Chaque palette a 11 nuances (50, 100...900, 950) pour un contrôle fin.

### Typographies

| Classe | Font | Usage |
|--------|------|-------|
| `font-sans` | Inter | Texte courant (body, paragraphes) |
| `font-heading` | Poppins | Titres (h1-h6) |

Les headings utilisent automatiquement `font-heading` grâce au reset dans `main.css`.

> **Note** : Les fonts ne sont pas encore importées (Google Fonts ou locales). Elles utilisent le fallback `system-ui` en attendant.

### Tailles de texte custom

| Classe | Taille | Usage |
|--------|--------|-------|
| `text-display` | 4.5rem | Titre principal hero (desktop) |
| `text-hero` | 3.5rem | Sous-titre hero |

### Spacing custom

| Token | Valeur | Usage |
|-------|--------|-------|
| `section` | 6rem | Padding vertical entre sections |
| `section-sm` | 3rem | Version réduite (mobile) |

### Variables CSS

Des variables CSS sémantiques sont définies dans `:root` pour un theming encore plus rapide :

```css
--color-background     /* Fond de page */
--color-foreground     /* Texte principal */
--color-muted          /* Fond atténué */
--color-muted-foreground /* Texte atténué */
--color-border         /* Bordures */
--section-padding-y    /* Espacement vertical sections */
--transition-default   /* Durée transition par défaut */
```

### Classes utilitaires custom

| Classe | Effet |
|--------|-------|
| `.container-page` | Container responsive centré, max-w-7xl, padding horizontal adaptatif |
| `.section-padding` | Padding vertical standard pour une section |

## Personnalisation par client

Pour adapter le thème à un nouveau client :

1. **Couleurs** : Modifier les palettes dans `tailwind.config.ts`
2. **Typos** : Changer `fontFamily.sans` et `fontFamily.heading`
3. **Variables CSS** : Ajuster dans `assets/css/main.css` si besoin

### Exemple : changer la couleur primaire

```typescript
// tailwind.config.ts
colors: {
  primary: {
    // Utiliser un outil comme https://uicolors.app pour générer
    // une palette à partir d'une couleur de base
    400: '#4a90d9', // Nouvelle couleur principale
    // ...
  },
}
```

## Vérification

```bash
npm run dev
# La page affiche "Tempo Hub" avec les couleurs primary, secondary, accent
# sous forme de 3 cercles colorés
```
