# 07 — Smooth Scroll (Lenis)

## Ce qui a été fait

Intégration de Lenis pour le smooth scroll avec chargement conditionnel via feature flag et synchronisation automatique avec GSAP ScrollTrigger.

## Fichiers concernés

| Fichier | Rôle |
|---------|------|
| `plugins/lenis.client.ts` | Init Lenis si flag activé + sync GSAP |
| `composables/useLenis.ts` | Accès à l'instance Lenis (scrollTo, stop, start) |
| `assets/css/main.css` | Suppression du `scroll-behavior: smooth` natif |

## Comment ça marche

### Chargement conditionnel

Lenis (~15 Ko) n'est chargé **que si** `features.smoothScroll` est `true`. Le plugin vérifie le flag au démarrage.

### Synchronisation GSAP

Si `animations` et `smoothScroll` sont tous les deux actifs, le plugin synchronise automatiquement Lenis avec GSAP ScrollTrigger :

- Lenis notifie ScrollTrigger à chaque frame (`lenis.on('scroll', ScrollTrigger.update)`)
- Le RAF de Lenis est piloté par le ticker GSAP (meilleure perf, un seul loop)

Si seul `smoothScroll` est actif (sans animations), Lenis utilise son propre `requestAnimationFrame`.

### Composable useLenis()

```typescript
const { scrollTo, stop, start, getInstance } = useLenis()

// Scroll vers un élément
scrollTo('#section-contact')
scrollTo(document.getElementById('hero')!)

// Scroll vers une position
scrollTo(0) // retour en haut

// Avec options
scrollTo('#contact', { offset: -80, duration: 1.5 })

// Pause/reprise (utile pour les modals)
stop()   // désactive le smooth scroll
start()  // le réactive
```

### Configuration Lenis

Les paramètres par défaut dans le plugin :

| Param | Valeur | Effet |
|-------|--------|-------|
| `duration` | 1.2 | Durée de l'interpolation du scroll |
| `easing` | expo decay | Courbe d'easing naturelle |
| `smoothWheel` | true | Active le smooth sur la molette |

Pour modifier ces valeurs, éditer `plugins/lenis.client.ts`.

## Interactions avec les autres features

| Combinaison | Comportement |
|-------------|-------------|
| `smoothScroll: true` + `animations: true` | Lenis piloté par GSAP ticker, ScrollTrigger sync |
| `smoothScroll: true` + `animations: false` | Lenis standalone avec RAF |
| `smoothScroll: false` | Scroll natif du navigateur |
