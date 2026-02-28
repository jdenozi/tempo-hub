# Section Visual Enhancement + Studio Configurability

## TL;DR

> **Quick Summary**: Ajouter des props visuels configurables depuis Nuxt Studio à toutes les sections: variante de fond, espacement, bordure lumineuse, style de titre, layout colonnes, séparateurs, et fonds animés. Studio auto-génère les UI (dropdowns, toggles) à partir des types TypeScript union.
>
> **Deliverables**:
> - 6 nouvelles props visuelles sur toutes les sections (sectionBg, sectionSpacing, sectionBorder, titleStyle, dividerAfter, columns)
> - Fonds animés (hero presets) utilisables sur n'importe quelle section
> - Séparateurs visuels entre sections
> - Tout configurable depuis Studio via dropdowns
>
> **Estimated Effort**: Medium (3-4h across 3 waves)
> **Critical Path**: T1 (shared types + wrapper update) → T2-T3 (section implementations) → T4 (content + build)

---

## Context

### Research Findings
- **Studio TipTap editor** lit les types TypeScript de chaque composant MDC via `nuxt-component-meta`
- **TypeScript union types** → dropdown automatique dans Studio (ex: `'compact' | 'normal' | 'spacious'` → select)
- **Boolean** → toggle switch
- **Number** → stepper input
- **Pas de color picker natif** → utiliser enum avec noms de couleurs
- Les 12 sections sont déjà enregistrées dans `studio.meta.components.include`

### Current State
- 12 sections hub, toutes avec: title, subtitle, items, animation
- ZERO props visuels (fond, espacement, bordure, layout)
- Tout est hardcodé: `gradient-section`, `gradient-section-alt`, `section-padding`, `grid-cols-3`
- Seul SectionHero a des props background (heroPreset)

### Guardrails
- ⛔ NE PAS modifier tempo-core
- ⛔ NE PAS casser le rendu existant (backward compat: default values = état actuel)
- ⛔ NE PAS toucher ParallaxHome.vue
- ⛔ Pas de dépendances externes

---

## New Props Design

### Shared Section Props (ajoutées à TOUTES les sections)

```typescript
// Props visuels partagés — TypeScript unions → Studio dropdowns
sectionBg?: 'default' | 'alt' | 'transparent' | 'starfield' | 'nebula' | 'planet-horizon' | 'grid-station' | 'orbital' | 'retro-scan'
sectionSpacing?: 'compact' | 'normal' | 'spacious'
sectionBorder?: 'none' | 'glow' | 'subtle'
titleStyle?: 'standard' | 'large' | 'hero'
dividerAfter?: 'none' | 'line' | 'gradient' | 'stars'
```

### Grid-specific Prop (sections avec grille: features, pricing, projects, testimonials, stats)
```typescript
columns?: '2' | '3' | '4' | 'auto'
```

### Mapping
- `sectionBg: 'default'` → `gradient-section` (pas de changement)
- `sectionBg: 'alt'` → `gradient-section-alt`
- `sectionBg: 'transparent'` → fond transparent
- `sectionBg: 'starfield'|'nebula'|...` → même composants que hero presets, en fond de section
- `sectionSpacing: 'compact'` → `py-12 md:py-16`
- `sectionSpacing: 'normal'` → `section-padding` (défaut actuel)
- `sectionSpacing: 'spacious'` → `py-24 md:py-32`
- `sectionBorder: 'glow'` → `border-glow`
- `sectionBorder: 'subtle'` → `border border-white/10`
- `titleStyle: 'large'` → `text-hero` (plus grand)
- `titleStyle: 'hero'` → `text-display` (encore plus grand)
- `dividerAfter: 'line'` → trait horizontal fin
- `dividerAfter: 'gradient'` → gradient gold
- `dividerAfter: 'stars'` → petits points lumineux

---

## Execution Strategy

### Wave 1 — Foundation (2 tasks parallel)

- [x] T1: Create shared section props utility + update ALL MDC wrappers (12 files)
  - Create `composables/useSectionStyle.ts` with shared logic
  - Update every `components/content/Section*.vue` to add the 6 new props
  - These props pass through via `...rest` spread (already in place)

- [x] T2: Create SectionDivider.vue component
  - New component: `components/ui/SectionDivider.vue`
  - 4 variants: line, gradient, stars, none
  - Rendered after each section based on `dividerAfter` prop

### Wave 2 — Section implementations (2 tasks parallel)

- [x] T3: Update ALL section components to use new props (12 files)
  - Accept new props in `defineProps`
  - Apply sectionBg class mapping
  - Apply sectionSpacing class mapping
  - Apply sectionBorder class mapping
  - Apply titleStyle class mapping
  - Apply columns prop for grid sections
  - Render animated background when sectionBg is a preset name
  - Render divider after section when dividerAfter is set

- [x] T4: Update a few content files with examples + build verification
  - Add `sectionBg`, `sectionSpacing`, etc. to a few sections as demo
  - Verify build passes

### Wave Final

- [x] F1: Build verification
- [x] F2: Git commit

---

## Commit Strategy

Single commit: `feat: add Studio-configurable visual props to all sections (bg, spacing, border, title, layout, dividers)`
