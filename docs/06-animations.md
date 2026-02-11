# 06 — Animations GSAP

## Ce qui a été fait

Mise en place du système d'animations complet : GSAP + ScrollTrigger en chargement conditionnel, config déclarative, directive `v-animate`, composants wrappers et intégration dans le PageRenderer.

## Fichiers concernés

| Fichier | Rôle |
|---------|------|
| `config/animations.ts` | Définitions de toutes les animations |
| `composables/useGsap.ts` | Chargement lazy de GSAP + ScrollTrigger |
| `composables/useAnimations.ts` | Factory pour appliquer les animations |
| `plugins/gsap.client.ts` | Plugin client : init GSAP si flag activé |
| `plugins/directives.client.ts` | Enregistre les directives custom |
| `directives/vAnimate.ts` | Directive `v-animate` |
| `components/animations/AnimateOnScroll.vue` | Wrapper scroll-triggered |
| `components/animations/TextReveal.vue` | Révélation mot par mot |
| `components/animations/Parallax.vue` | Effet parallax au scroll |
| `components/animations/MagneticButton.vue` | Bouton magnétique (suit la souris) |
| `components/animations/CustomCursor.vue` | Curseur personnalisé |

## Comment ça marche

### Chargement conditionnel

GSAP (~60 Ko) n'est chargé **que si** `features.animations` est `true` dans `app.config.ts`. Le plugin `gsap.client.ts` vérifie le flag au démarrage. Tous les composables et composants vérifient également le flag avant d'importer quoi que ce soit.

### 3 façons d'animer

#### 1. Directive `v-animate`

La plus simple — directement dans le template :

```vue
<!-- Simple -->
<div v-animate="'fadeUp'">Contenu</div>

<!-- Avec options -->
<div v-animate="{ name: 'fadeUp', delay: 0.2 }">Contenu</div>
<div v-animate="{ name: 'stagger', stagger: 0.15 }">Contenu</div>
```

#### 2. Composant `<AnimateOnScroll>`

Pour wrapper un bloc :

```vue
<AnimationsAnimateOnScroll animation="fadeUp" :delay="0.2">
  <div>Ce contenu s'anime au scroll</div>
</AnimationsAnimateOnScroll>
```

#### 3. Via le PageRenderer (JSON)

Pour les pages construites avec le page builder :

```typescript
{
  type: 'features',
  props: { ... },
  animation: { name: 'fadeUp', delay: 0.1 }
}
```

### Animations disponibles

| Nom | Effet | Usage typique |
|-----|-------|---------------|
| `fadeUp` | Apparition du bas vers le haut | Sections, textes |
| `fadeDown` | Apparition du haut vers le bas | Headers |
| `fadeLeft` | Apparition de la gauche | Contenus alternés |
| `fadeRight` | Apparition de la droite | Contenus alternés |
| `scaleIn` | Zoom de 0.8 à 1 + fade | Cards, images |
| `stagger` | Fade up en cascade (enfants) | Grilles, listes |
| `clipReveal` | Révélation par clip-path | Blocs visuels, CTA |
| `textReveal` | Mot par mot | Titres |
| `parallax` | Mouvement au scroll | Images de fond |

### Ajouter une nouvelle animation

1. Ouvrir `config/animations.ts`
2. Ajouter la définition (from/to/duration/ease)
3. Utiliser partout avec `v-animate="'monNom'"`

## Composants spéciaux

### TextReveal

Révèle un texte mot par mot au scroll :

```vue
<AnimationsTextReveal text="Bienvenue sur notre site" tag="h1" :delay="0.2" />
```

### Parallax

Effet parallax au scroll sur n'importe quel contenu :

```vue
<AnimationsParallax :speed="-20">
  <img src="/image.jpg" alt="..." />
</AnimationsParallax>
```

`speed` négatif = l'élément monte plus lentement que le scroll.

### MagneticButton

Bouton qui suit le curseur avec un effet magnétique :

```vue
<AnimationsMagneticButton :strength="0.3">
  <UiButton>Hover moi</UiButton>
</AnimationsMagneticButton>
```

### CustomCursor

Curseur personnalisé qui scale sur les éléments interactifs. Activé par le flag `customCursor`. Inclus automatiquement dans le layout default.

## Flags associés

| Flag | Ce qu'il contrôle |
|------|-------------------|
| `animations` | GSAP, ScrollTrigger, v-animate, AnimateOnScroll, TextReveal, Parallax, MagneticButton |
| `customCursor` | CustomCursor uniquement |

Si `animations: false`, tous les wrappers rendent leur contenu sans animation (graceful degradation).
