# Draft: Section Spacing Fix + Studio Page Builder

## Requirements (confirmed)
- **Spacing**: Ajouter plus de margin entre les sections (pas de séparateur visuel, juste de l'espace)
- **Studio**: Full page builder — pour toi (dev) ET à terme pour clients non-tech. **Exploration d'abord** — comprendre ce qui est faisable avant de planifier l'implémentation.

## Technical Decisions
- Section spacing: ajouter gap dans PageRenderer via `space-y-*` ou margin CSS — QUICK FIX
- Studio page builder: exploration en cours, résultats ci-dessous

## Research Findings

### Spacing
- Current section-padding: `clamp(3rem, 6vw, 6rem)` = padding interne uniquement
- Aucune margin entre sections — elles sont flush dans le PageRenderer div
- Fix: ajouter `space-y-*` au wrapper div dans PageRenderer OU augmenter `--section-padding-y`

### Studio — Explore Agent Findings
- Nuxt Studio est configuré (module nuxt-studio ^1.3.2, auth GitHub, AI, i18n)
- **.studio/ directory is EMPTY** — aucun schema, preview, ou config Studio custom
- `meta.components` dans Studio config est vide (include/exclude)
- Pas de `.studio/settings.json` — Studio utilise les schemas Zod auto-détectés
- Pas d'annotations `studio:` dans les schemas Zod
- Pas de previews de composants pour Studio
- **13 section types** dans sectionMap, tous typés avec defineProps
- **Fondation à 90%** — Studio configuré, sections typées, PageRenderer fonctionne
- **Ce qui manque**: couche UI Studio (annotations schema, previews, drag/drop sections)

## Open Questions
- Librarian: quelles sont les vraies capacités de Nuxt Studio pour array editing / page building ?
- Spacing: `space-y-8` (2rem) ou `space-y-16` (4rem) entre sections ?

## Scope Boundaries
- INCLUDE Part 1 (quick): section spacing fix
- INCLUDE Part 2 (exploration): Studio page builder investigation → rapport de faisabilité
- EXCLUDE: ne pas toucher au ParallaxHome, ne pas changer le design des sections
- EXCLUDE: ne pas implémenter le page builder tant que l'exploration n'est pas terminée
