---
title: "Core Web Vitals en 2026 : le guide complet pour exploser votre score Google"
description: "LCP, INP, CLS — on décortique les Core Web Vitals avec des optimisations concrètes. Guide technique avec chiffres réels et comparatifs Lighthouse."
date: 2026-03-09
author: "Jonathan Denozi"
---

Votre score Lighthouse, c'est votre CV technique auprès de Google. Un 38/100, ça dit "ce site est lent, mal optimisé, et l'expérience utilisateur est médiocre". Un 98/100, ça dit "ce site est sérieux, les visiteurs sont respectés, et le développeur sait ce qu'il fait".

Depuis 2021, Google intègre les Core Web Vitals directement dans son algorithme de classement. Pas comme un signal mineur qu'on peut ignorer : comme un facteur qui peut faire la différence entre la première et la deuxième page de résultats. Et en 2026, avec la concurrence qui s'intensifie sur tous les secteurs, chaque point de Lighthouse compte.

Ce guide va au fond du sujet. On explique chaque métrique, on donne les seuils exacts, on identifie les causes réelles des mauvais scores, et on liste les optimisations qui changent vraiment la donne. Pas de théorie vague. Des chiffres, des techniques, des comparaisons concrètes.

Accrochez-vous.

!["Les apps natives n'ont pas d'avenir, le web c'est mieux" — dit avec la confiance de quelqu'un qui n'a jamais testé son site sur un téléphone à 200€](/images/blog/core-web-vitals/performance-meme.jpg)

---

## C'est quoi les Core Web Vitals ?

Les Core Web Vitals sont trois métriques définies par Google pour mesurer l'expérience utilisateur réelle sur une page web. Pas la vitesse perçue par un développeur sur sa machine ultra-rapide en fibre optique, mais l'expérience vécue par un vrai utilisateur, sur un vrai téléphone, avec une vraie connexion mobile.

Google les a choisis parce qu'ils mesurent trois dimensions fondamentales de l'expérience :

- **LCP (Largest Contentful Paint)** : la vitesse de chargement. Combien de temps avant que le contenu principal soit visible ?
- **INP (Interaction to Next Paint)** : la réactivité. Quand l'utilisateur clique, combien de temps avant que quelque chose se passe ?
- **CLS (Cumulative Layout Shift)** : la stabilité visuelle. Est-ce que la page bouge pendant le chargement et fait cliquer les gens au mauvais endroit ?

Ces trois métriques existent depuis 2020, mais Google les a officiellement intégrées dans son algorithme de classement en juin 2021. INP a remplacé FID (First Input Delay) en mars 2024, car il mesure la réactivité de façon plus complète sur toute la durée de la session.

Pourquoi Google s'y intéresse ? Parce que leur business model repose sur la satisfaction des utilisateurs. Un site lent qui frustre les visiteurs, c'est mauvais pour Google autant que pour vous. En récompensant les sites rapides et stables, ils poussent l'ensemble du web vers une meilleure qualité.

L'impact sur le classement est réel mais nuancé. Les Core Web Vitals ne vont pas propulser un site avec du contenu médiocre en première position. Mais à contenu équivalent, le site techniquement supérieur prend l'avantage. Et dans des secteurs compétitifs, c'est souvent là que se joue la différence.

---

## LCP — Largest Contentful Paint

### Ce que ça mesure

Le LCP mesure le temps nécessaire pour afficher le plus grand élément visible dans la fenêtre du navigateur. En pratique, c'est souvent l'image hero, la photo principale d'un article, ou un gros bloc de texte. C'est le moment où l'utilisateur perçoit que la page "est là".

**Les seuils :**
- Moins de 2.5s : bon
- Entre 2.5s et 4s : à améliorer
- Plus de 4s : mauvais

### Les causes courantes d'un LCP lent

**Images non optimisées.** C'est la cause numéro un. Une image JPEG de 2 Mo servie en 2000px de large sur un écran mobile de 390px, c'est du gaspillage pur. Le navigateur télécharge 5 fois plus de données que nécessaire.

**Fonts bloquantes.** Les polices web chargées sans `font-display: swap` bloquent l'affichage du texte jusqu'à leur téléchargement complet. Sur une connexion lente, ça peut ajouter 1 à 2 secondes au LCP.

**Serveur lent.** Un TTFB (Time To First Byte) élevé retarde tout le reste. Si le serveur met 1.5s à répondre, le LCP ne peut pas être inférieur à 1.5s, peu importe les autres optimisations.

**Ressources bloquantes.** Du CSS ou du JavaScript chargé en `<head>` sans `async` ou `defer` bloque le rendu de la page entière pendant son téléchargement et son exécution.

### Les optimisations qui font la différence

**Lazy loading et preload.** Les images hors écran doivent avoir `loading="lazy"`. L'image LCP, elle, doit avoir `fetchpriority="high"` et un `<link rel="preload">` dans le `<head>` pour que le navigateur la télécharge en priorité absolue.

```html
<!-- Image LCP : priorité maximale -->
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high">
<img src="/hero.webp" fetchpriority="high" alt="...">

<!-- Images hors écran : chargement différé -->
<img src="/photo.webp" loading="lazy" alt="...">
```

**font-display: swap.** Cette propriété CSS dit au navigateur d'afficher le texte avec une police système en attendant que la police web soit chargée. L'utilisateur voit du contenu immédiatement, même si la police change légèrement après.

**CDN et SSG.** Un CDN (Content Delivery Network) sert les fichiers depuis un serveur géographiquement proche de l'utilisateur. Combiné à la génération statique (SSG), où les pages HTML sont pré-générées au moment du build, le TTFB tombe sous les 50ms.

**Formats modernes.** WebP réduit le poids des images de 25 à 35% par rapport au JPEG. AVIF va encore plus loin avec 40 à 50% de réduction. Sur un site avec beaucoup d'images, c'est massif.

### WordPress vs Nuxt SSG : les chiffres

```
📊 Core Web Vitals — WordPress vs Site sur mesure
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LCP (Largest Contentful Paint)
WordPress + Elementor  ████████████████░░░░  3.5s  ❌
Site Nuxt.js (SSG)     ████░░░░░░░░░░░░░░░░  0.6s  ✅

INP (Interaction to Next Paint)
WordPress + Elementor  █████████████░░░░░░░  350ms ❌
Site Nuxt.js           ███░░░░░░░░░░░░░░░░░  45ms  ✅

CLS (Cumulative Layout Shift)
WordPress + Elementor  ████████░░░░░░░░░░░░  0.25  ❌
Site Nuxt.js           █░░░░░░░░░░░░░░░░░░░  0.01  ✅
```

La différence est brutale. Un LCP de 3.5s sur WordPress + Elementor contre 0.6s sur Nuxt SSG. Ce n'est pas une question de configuration ou d'optimisation poussée : c'est une différence architecturale fondamentale. WordPress génère la page à chaque requête via PHP + MySQL. Nuxt SSG sert un fichier HTML statique pré-généré. Le serveur n'a rien à calculer.

Pour aller plus loin sur cette comparaison, on a un [article complet WordPress vs site sur mesure](/blog/site-sur-mesure-vs-wordpress-seo) qui couvre tous les aspects SEO.

---

## INP — Interaction to Next Paint

### Ce que ça mesure (et pourquoi ça a remplacé FID)

L'INP mesure la réactivité d'une page aux interactions utilisateur : clics, touches, saisies clavier. Plus précisément, il mesure le délai entre l'interaction et le moment où le navigateur affiche visuellement la réponse.

FID (First Input Delay) ne mesurait que la première interaction. INP mesure toutes les interactions pendant toute la session et retient le pire cas (ou le 98e percentile). C'est beaucoup plus représentatif de l'expérience réelle.

**Le seuil :** moins de 200ms. Au-delà, l'utilisateur perçoit un délai. Au-delà de 500ms, c'est franchement pénible.

### Les causes d'un INP élevé

**JavaScript lourd.** Le navigateur a un seul thread principal pour exécuter le JavaScript et mettre à jour l'interface. Si ce thread est occupé à exécuter du code pendant 300ms, les interactions utilisateur sont mises en file d'attente et ne sont traitées qu'après. L'utilisateur clique, rien ne se passe, puis tout se passe d'un coup.

**Main thread bloqué.** Les tâches longues (Long Tasks) sont des blocs de JavaScript qui s'exécutent pendant plus de 50ms sans interruption. Pendant ce temps, le navigateur ne peut pas répondre aux interactions. Un site avec beaucoup de Long Tasks aura un INP élevé même si le LCP est correct.

**Hydration lente.** Les frameworks JavaScript comme Vue, React ou Angular doivent "hydrater" le HTML statique au chargement : attacher les event listeners, initialiser l'état, rendre les composants interactifs. Si cette hydration prend 2 secondes, les interactions sont bloquées pendant 2 secondes après le chargement visuel de la page.

**Plugins WordPress.** Chaque plugin WordPress qui ajoute du JavaScript contribue à alourdir le thread principal. Un site avec 15 plugins actifs peut charger 400 à 800 Ko de JavaScript, dont une bonne partie s'exécute au chargement de chaque page.

### Les optimisations

**Code splitting.** Au lieu de charger tout le JavaScript de l'application en un seul bundle, on découpe le code par route. La page d'accueil ne charge que son propre JavaScript. La page contact charge le sien. Nuxt.js fait ça automatiquement.

**Defer le JavaScript non critique.** Tout ce qui n'est pas nécessaire au rendu initial peut être chargé après : analytics, chatbots, widgets tiers. L'attribut `defer` sur les balises `<script>` et le chargement conditionnel via `IntersectionObserver` permettent de repousser ces chargements.

**Web Workers.** Les calculs lourds (traitement de données, parsing, compression) peuvent être déplacés dans un Web Worker qui s'exécute dans un thread séparé. Le thread principal reste libre pour répondre aux interactions.

**Éviter les frameworks trop lourds.** Un site codé sur mesure avec Nuxt.js et du code optimisé peut avoir un INP de 30 à 50ms. Le même site sur WordPress avec Elementor et 10 plugins tourne souvent entre 300 et 500ms. La différence, c'est le poids du JavaScript chargé et exécuté.

```
📊 JavaScript exécuté au chargement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WordPress + Elementor + 10 plugins
████████████████████  ~650 Ko (parsé + exécuté)

Site Nuxt.js (SSG, code splitting)
████░░░░░░░░░░░░░░░░  ~85 Ko (page d'accueil)
```

La vraie solution, c'est de ne pas créer le problème. Un site qui charge 85 Ko de JavaScript n'aura jamais d'INP à 350ms. Un site qui en charge 650 Ko devra faire des miracles pour descendre sous 200ms.

---

## CLS — Cumulative Layout Shift

### Ce que ça mesure

Le CLS mesure la stabilité visuelle d'une page pendant son chargement. Chaque fois qu'un élément se déplace de façon inattendue (parce qu'une image s'est chargée, qu'une police a changé, qu'une pub est apparue), ça génère un score de layout shift. Le CLS est la somme de tous ces décalages.

**Le seuil :** moins de 0.1. Entre 0.1 et 0.25, c'est à améliorer. Au-delà de 0.25, c'est mauvais.

Un CLS élevé, c'est l'expérience frustrante où vous allez cliquer sur un lien et au dernier moment une pub apparaît, le contenu descend, et vous cliquez sur la pub. Tout le monde a vécu ça. C'est exactement ce que Google veut éliminer.

### Les causes courantes

**Images sans dimensions.** Si une image n'a pas d'attributs `width` et `height`, le navigateur ne sait pas combien d'espace lui réserver avant qu'elle soit chargée. Quand l'image arrive, elle pousse tout le contenu vers le bas.

**Fonts FOIT/FOUT.** FOIT (Flash of Invisible Text) et FOUT (Flash of Unstyled Text) se produisent quand la police web se charge et remplace la police système. Si les deux polices ont des métriques différentes (hauteur de ligne, espacement), le texte change de taille et pousse le contenu.

**Contenu injecté dynamiquement.** Les bannières de cookies, les popups, les notifications qui apparaissent après le chargement initial poussent le contenu existant. Si elles apparaissent en haut de page, tout le contenu descend.

**Publicités.** Les espaces publicitaires dont la taille n'est pas réservée à l'avance sont une source majeure de CLS. La pub se charge, prend de la place, et tout bouge.

### Les optimisations

**Toujours spécifier width et height.** Sur toutes les images, sans exception. Le navigateur peut alors calculer le ratio et réserver l'espace exact avant le chargement.

```html
<!-- Bien : le navigateur réserve l'espace -->
<img src="/photo.webp" width="800" height="600" alt="...">

<!-- Mal : le navigateur ne sait pas quelle taille réserver -->
<img src="/photo.webp" alt="...">
```

**font-display: swap avec des polices similaires.** Choisir une police système de fallback aux métriques proches de la police web réduit le décalage lors du remplacement. Les propriétés CSS `size-adjust`, `ascent-override` et `descent-override` permettent d'ajuster précisément les métriques du fallback.

**Skeleton screens.** Plutôt que d'injecter du contenu dynamique qui pousse la page, on affiche des placeholders (rectangles gris) à la taille exacte du contenu attendu. Quand le contenu arrive, il remplace le placeholder sans déplacer quoi que ce soit.

**Réserver l'espace pour les pubs.** Si vous avez des espaces publicitaires, définissez leur taille minimale en CSS. La pub peut être plus petite, mais l'espace est déjà réservé.

---

## Comment mesurer vos Core Web Vitals

### Données de laboratoire vs données terrain

C'est une distinction importante. Les données de laboratoire (Lighthouse, PageSpeed Insights en mode lab) simulent un chargement dans des conditions contrôlées : appareil défini, connexion simulée, cache vide. Elles sont reproductibles et utiles pour le développement.

Les données terrain (Chrome UX Report, Search Console) reflètent l'expérience réelle des vrais utilisateurs sur leurs vrais appareils avec leurs vraies connexions. Ce sont ces données que Google utilise pour le classement.

Un site peut avoir un excellent score Lighthouse en lab et des Core Web Vitals médiocres en terrain si les vrais utilisateurs ont des appareils lents ou des connexions instables.

### Les outils

**Lighthouse (DevTools).** Ouvrez Chrome DevTools (F12), onglet "Lighthouse", lancez un audit. Vous obtenez un score global et le détail de chaque métrique avec les opportunités d'amélioration. Idéal pour le développement quotidien.

**PageSpeed Insights.** [pagespeed.web.dev](https://pagespeed.web.dev) combine les données de laboratoire Lighthouse avec les données terrain du Chrome UX Report. C'est l'outil de référence pour avoir une vue complète.

**Web Vitals Extension.** L'extension Chrome "Web Vitals" affiche les métriques en temps réel pendant que vous naviguez sur n'importe quel site. Pratique pour surveiller vos propres pages et espionner la concurrence.

**Search Console.** Dans Google Search Console, le rapport "Core Web Vitals" montre l'état de toutes vos pages selon les données terrain réelles. C'est là que vous voyez si Google considère vos pages comme "bonnes", "à améliorer" ou "mauvaises". C'est aussi là que vous verrez l'impact sur votre classement.

```
📊 Sources de données Core Web Vitals
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Lighthouse DevTools     → Données lab, développement quotidien
PageSpeed Insights      → Lab + terrain, vue complète
Web Vitals Extension    → Terrain, monitoring en temps réel
Search Console          → Terrain, impact SEO réel
Chrome UX Report (CrUX) → Terrain, données agrégées par URL
```

Un conseil pratique : commencez par PageSpeed Insights sur vos pages les plus importantes (accueil, pages de services, articles populaires). Identifiez les problèmes les plus critiques. Corrigez-les. Vérifiez dans Search Console que les données terrain s'améliorent dans les 28 jours suivants.

---

![L'état mental du développeur moyen quand il debug des problèmes de performance à 4h du mat'](/images/blog/core-web-vitals/debugging-meme.jpg)

## Les optimisations qui font vraiment la différence

### SSR et SSG : le rendu serveur change tout

Le rendu côté serveur (SSR) et la génération statique (SSG) sont les optimisations les plus impactantes pour le LCP. Au lieu de charger une page vide et d'attendre que JavaScript construise le contenu, le serveur envoie directement du HTML complet.

Avec SSG, c'est encore mieux : les pages sont générées une fois au moment du build et servies comme des fichiers statiques. Le TTFB tombe sous les 50ms. Le LCP peut atteindre 0.5 à 0.8s même sur mobile.

### Image optimization : WebP, AVIF, responsive sizes

Les images représentent en moyenne 50 à 70% du poids d'une page web. C'est là que les gains sont les plus faciles.

**Formats modernes :** WebP pour la compatibilité large, AVIF pour les navigateurs récents. Utilisez `<picture>` pour servir le format optimal selon le navigateur.

**Responsive sizes :** servez des images à la taille réellement affichée. Un mobile de 390px n'a pas besoin d'une image de 1920px. L'attribut `srcset` permet de définir plusieurs versions et de laisser le navigateur choisir.

```html
<picture>
  <source srcset="/hero.avif" type="image/avif">
  <source srcset="/hero.webp" type="image/webp">
  <img src="/hero.jpg" srcset="/hero-400.jpg 400w, /hero-800.jpg 800w, /hero-1200.jpg 1200w"
       sizes="(max-width: 768px) 100vw, 50vw"
       width="1200" height="630" alt="..." fetchpriority="high">
</picture>
```

### Critical CSS inlining

Le CSS critique (les styles nécessaires pour afficher le contenu visible sans scroll) peut être inliné directement dans le `<head>` de la page. Le reste du CSS est chargé de façon asynchrone. Résultat : le navigateur peut afficher le contenu immédiatement sans attendre le téléchargement d'un fichier CSS externe.

### Tree shaking et code splitting

Le tree shaking élimine le code JavaScript non utilisé du bundle final. Si vous importez une seule fonction d'une bibliothèque de 200 Ko, seule cette fonction est incluse. Le code splitting découpe le bundle par route pour que chaque page ne charge que son propre code.

Ces deux techniques combinées peuvent réduire le JavaScript d'une page de 60 à 80%.

### Preconnect, preload, prefetch

Trois directives HTML pour optimiser le chargement des ressources :

- `<link rel="preconnect">` : établit la connexion TCP/TLS avec un domaine tiers avant que la ressource soit demandée (CDN, fonts Google, APIs)
- `<link rel="preload">` : télécharge une ressource critique en priorité (image LCP, font principale)
- `<link rel="prefetch">` : télécharge en arrière-plan des ressources qui seront probablement nécessaires pour la prochaine navigation

```html
<head>
  <!-- Connexion anticipée au CDN de fonts -->
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <!-- Préchargement de l'image LCP -->
  <link rel="preload" as="image" href="/hero.webp" fetchpriority="high">

  <!-- Préchargement de la font principale -->
  <link rel="preload" as="font" href="/fonts/inter.woff2" crossorigin>
</head>
```

### HTTP/2 et HTTP/3

HTTP/2 permet le multiplexage : plusieurs ressources sont téléchargées en parallèle sur une seule connexion. HTTP/3 va plus loin avec QUIC, un protocole de transport plus rapide qui réduit la latence, surtout sur les connexions mobiles instables.

La plupart des hébergeurs modernes supportent HTTP/2. HTTP/3 est disponible sur Cloudflare, Vercel, et les CDN récents. Vérifiez dans les DevTools (onglet Network, colonne Protocol) que votre site utilise au minimum HTTP/2.

---

## Nos résultats chez Tempo Hub

### Les chiffres concrets

Tous les sites qu'on développe chez [Tempo Hub](/services) atteignent un score Lighthouse entre 95 et 100 en performance. Ce n'est pas un objectif qu'on vise : c'est le résultat naturel de l'architecture qu'on utilise.

Nuxt.js en mode SSG génère du HTML statique optimisé. Les images sont automatiquement converties en WebP et servies en taille adaptée. Le CSS critique est inliné. Le JavaScript est découpé par route. Les fonts sont préchargées avec `font-display: swap`. Tout ça est configuré une fois dans le framework et s'applique à tous les sites.

### Avant/après migration WordPress vers Nuxt

On a accompagné plusieurs clients dans la migration de leur site WordPress vers une architecture Nuxt SSG. Les résultats sont systématiquement dans le même ordre de grandeur :

```
📊 Migration WordPress → Nuxt SSG (résultats typiques)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Score Lighthouse Performance
Avant (WordPress)   ████████░░░░░░░░░░░░  38/100
Après (Nuxt SSG)    ████████████████████  97/100

LCP (Largest Contentful Paint)
Avant               ████████████████░░░░  4.1s   ❌
Après               ████░░░░░░░░░░░░░░░░  0.7s   ✅

Poids total de la page
Avant               ████████████████████  3.8 Mo
Après               █░░░░░░░░░░░░░░░░░░░  95 Ko

Requêtes HTTP
Avant               ████████████████░░░░  58 requêtes
Après               ███░░░░░░░░░░░░░░░░░  9 requêtes
```

Ce qu'on observe systématiquement dans Search Console après migration : les pages passent de "mauvaises" ou "à améliorer" à "bonnes" dans les 4 à 6 semaines suivant la mise en ligne. Le trafic organique suit dans les 2 à 3 mois.

### Ce que ça change concrètement

Un score Lighthouse de 97 vs 38, ça se traduit par :

- Un taux de rebond plus faible (les utilisateurs restent parce que la page charge vite)
- Un meilleur classement Google sur les requêtes compétitives
- Une meilleure expérience sur mobile, où la majorité du trafic arrive
- Des conversions plus élevées (chaque seconde de chargement en moins augmente les conversions de 7 à 12% selon les études)

Vous pouvez voir des exemples concrets dans [notre portfolio](/projets).

---

## Votre site mérite mieux qu'un score de 38

Les Core Web Vitals ne sont pas une case à cocher pour satisfaire Google. Ce sont des indicateurs de qualité réelle : un site rapide, stable et réactif, c'est un site qui respecte ses visiteurs.

La bonne nouvelle : si votre site est actuellement sur WordPress avec un score Lighthouse médiocre, les gains potentiels sont énormes. La mauvaise nouvelle : les optimisations WordPress ont des limites structurelles. On peut passer de 38 à 60 avec beaucoup d'efforts. Passer de 38 à 97 demande une architecture différente.

Chez Tempo Hub, on fait des audits Core Web Vitals gratuits. On analyse votre site, on identifie les problèmes, et on vous dit honnêtement ce qui est faisable avec votre stack actuel et ce qui nécessiterait une migration.

[Prenez rendez-vous](/rendez-vous) pour un audit gratuit. On regarde ça ensemble.
