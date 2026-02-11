# 08 — Three.js — Système 3D

## Ce qui a été fait

Mise en place d'un système 3D modulaire avec Three.js : scènes en lazy import, registre central, composants Vue pour l'intégration, et fallback CSS quand le flag est désactivé.

## Architecture

```
config/
└── scenes.ts                    ← Registre des scènes (lazy import)

scenes/                          ← Logique pure Three.js
├── particles.ts                 ← Champ de particules
├── backgroundBlob.ts            ← Blob animé (shader custom + noise)
├── abstractShapes.ts            ← Formes géométriques flottantes
└── gradientPlane.ts             ← Plan gradient animé (shader)

composables/
└── useThree.ts                  ← Factory : charge et gère une scène

components/three/
├── Canvas.vue                   ← Canvas WebGL avec resize auto
└── BackgroundScene.vue          ← Background 3D avec fallback CSS
```

## Chargement conditionnel

Three.js (~150 Ko) n'est chargé **que si** `features.threejs` est `true`. Toute la chaîne (composable, composants, scènes) vérifie le flag. Quand désactivé :
- `BackgroundScene` affiche le fallback CSS (couleur ou gradient)
- Aucun JS de Three.js n'est téléchargé

## Scènes disponibles

| Nom | Effet | Options |
|-----|-------|---------|
| `particles` | Champ de particules en rotation | `color`, `count`, `speed`, `size` |
| `backgroundBlob` | Blob organique animé (vertex shader noise) | `color1`, `color2`, `speed`, `distortion` |
| `abstractShapes` | Formes géo flottantes avec éclairage | `color`, `count`, `speed` |
| `gradientPlane` | Gradient animé en plein écran (fragment shader) | `color1`, `color2`, `speed` |

## Utilisation

### BackgroundScene (recommandé)

Le composant le plus courant — affiche une scène 3D en arrière-plan d'un contenu :

```vue
<ThreeBackgroundScene
  scene="backgroundBlob"
  :options="{ color1: '#cdb496', color2: '#1a1a2e', speed: 0.8 }"
  fallback-gradient="linear-gradient(135deg, #cdb496, #1a1a2e)"
  container-class="min-h-[70vh]"
>
  <div class="relative z-10 text-white text-center p-8">
    <h1>Contenu au-dessus de la 3D</h1>
  </div>
</ThreeBackgroundScene>
```

Si `threejs: false`, le gradient CSS s'affiche à la place.

### Canvas (bas niveau)

Pour un canvas 3D seul, sans wrapper :

```vue
<ThreeCanvas scene="particles" :options="{ color: '#ffffff', count: 2000 }" />
```

### Composable useThree()

Pour un contrôle programmatique :

```typescript
const { loadScene, destroyScene } = useThree()

onMounted(async () => {
  await loadScene(canvasElement, 'particles', { count: 1000 })
})

onBeforeUnmount(() => {
  destroyScene()
})
```

## Ajouter une nouvelle scène

1. Créer `scenes/maScene.ts` avec la factory :

```typescript
export function createMaSceneScene(canvas: HTMLCanvasElement, options = {}) {
  // Setup Three.js : renderer, scene, camera, objets...
  return {
    init() { },
    animate() { },   // boucle RAF
    resize() { },     // ajuste camera + renderer
    destroy() { },    // dispose geometries, materials, renderer
  }
}
```

2. L'ajouter dans `config/scenes.ts` :

```typescript
export const scenes = {
  // ...
  maScene: () => import('~/scenes/maScene').then(m => m.createMaSceneScene),
}
```

3. Utiliser : `<ThreeBackgroundScene scene="maScene" />`

## Structure d'une scène

Chaque scène exporte une factory qui reçoit un `canvas` et des `options`, et retourne 4 méthodes :

| Méthode | Rôle |
|---------|------|
| `init()` | Initialisation (déjà appelée dans le constructeur) |
| `animate()` | Démarre la boucle requestAnimationFrame |
| `resize()` | Ajuste camera/renderer au redimensionnement |
| `destroy()` | Nettoie mémoire (dispose geo, materials, renderer) |

Le `Canvas.vue` gère automatiquement `resize` (via ResizeObserver) et `destroy` (via onBeforeUnmount).

## Performance

- Chaque scène utilise `Math.min(window.devicePixelRatio, 2)` pour limiter le pixel ratio
- Les scènes sont lazy-loaded (code splitting automatique)
- Le flag per-page permet d'activer la 3D uniquement sur l'accueil :

```typescript
// app.config.ts
pages: {
  index: { threejs: true },  // 3D uniquement sur l'accueil
}
```
