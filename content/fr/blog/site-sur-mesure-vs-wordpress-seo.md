---
title: "WordPress vs site sur mesure : on a comparé les perfs, c'est violent"
description: "Core Web Vitals, temps de chargement, sécurité, balisage HTML... On a mis un WordPress face à un site codé sur mesure. Les résultats sont sans appel."
date: 2026-02-15
---

On va pas tourner autour du pot : WordPress fait tourner 43% du web. C'est un outil puissant, et y'a une raison pour laquelle il est aussi populaire.

Mais quand on parle référencement naturel et performance pure, l'architecture d'un site codé sur mesure a des avantages structurels qu'aucun plugin WordPress ne peut compenser. Et on va vous le prouver avec des chiffres concrets.

Chez Tempo Hub, on développe des sites statiques avec Nuxt.js. Oui, on a un parti pris. Mais les données qu'on va vous montrer sont objectives. Jugez par vous-même.

## 1. La performance : le critère n°1 de Google

### Ce que Google mesure vraiment

Depuis 2021, Google utilise les **Core Web Vitals** comme facteur de classement direct. Trois métriques comptent :

- **LCP (Largest Contentful Paint)** : combien de temps pour afficher le plus gros élément visible de la page. Seuil : 2.5 secondes max.
- **INP (Interaction to Next Paint)** : la réactivité aux clics et interactions. Seuil : 200ms max.
- **CLS (Cumulative Layout Shift)** : la stabilité visuelle pendant le chargement. Seuil : 0.1 max.

En clair : site lent = Google te pénalise. Point.

### Pourquoi WordPress rame

WordPress fonctionne en **PHP + MySQL**. À chaque visite, le serveur exécute du PHP, interroge la base de données, assemble la page, puis la renvoie au navigateur. Même avec du cache, cette chaîne crée de la latence.

Rajoutez un page builder type Elementor ou Divi, et c'est la cata :

- **Elementor** injecte 300 à 500 Ko de CSS et JavaScript, même sur une page avec juste du texte
- **Divi** génère des dizaines de `<div>` imbriqués qui alourdissent le DOM comme pas possible
- Chaque plugin actif (formulaire, analytics, slider, popup) rajoute ses propres fichiers CSS/JS sur **toutes les pages**, utilisés ou non

Résultat : une page WordPress moyenne fait entre **2 et 5 Mo** et charge en **3 à 6 secondes** sur mobile. Aïe.

![Quand tu découvres que ta page WordPress pèse 4 Mo sur mobile](/images/blog/wordpress-vs-custom/page-weight-meme.webp)

### Un site statique, c'est une autre planète

Avec Nuxt.js en mode SSG (Static Site Generation), chaque page est pré-générée en HTML pur au moment du build. Quand un visiteur arrive, le serveur renvoie directement le fichier HTML tout prêt. Pas d'exécution PHP. Pas de requête en base. Rien.

### Les chiffres de performance (accrochez-vous)

```
📊 Score Lighthouse Performance
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WordPress + Elementor  ████████░░░░░░░░░░░░  40/100  😬
Site sur mesure (Nuxt) ████████████████████  98/100  🔥

📊 Temps de chargement mobile
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WordPress + Elementor  █████████████████░░░  4.2s   🐌
Site sur mesure (Nuxt) ███░░░░░░░░░░░░░░░░░  0.8s   🚀

📊 Poids moyen d'une page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WordPress + Elementor  ████████████████████  3.2 Mo 💀
Site sur mesure (Nuxt) █░░░░░░░░░░░░░░░░░░░  80 Ko  ✨

📊 TTFB (Time To First Byte)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WordPress + Elementor  ████████████████░░░░  1.2s
Site sur mesure (Nuxt) █░░░░░░░░░░░░░░░░░░░  <50ms  ⚡

📊 Requêtes HTTP par page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WordPress + Elementor  ████████████████████  60+
Site sur mesure (Nuxt) ████░░░░░░░░░░░░░░░░  ~10
```

Pour Google, un site qui charge en moins d'une seconde avec un Lighthouse quasi-parfait, c'est un signal de qualité technique énorme.

| Métrique | WordPress + Elementor | Site sur mesure (Nuxt) |
|---|---|---|
| Poids moyen d'une page | 2 à 5 Mo | 30 à 100 Ko |
| Temps de chargement mobile | 3 à 6 secondes | < 1 seconde |
| Score Lighthouse Performance | 30 à 60 | 95 à 100 |
| TTFB (Time To First Byte) | 800 ms à 2 s | < 50 ms |
| Requêtes HTTP par page | 40 à 80 | 5 à 15 |
| Core Web Vitals (pass rate) | ~33 % | ~98 % |

## 2. Le balisage HTML : propre vs soupe de `<div>`

### Pourquoi c'est important

Les moteurs de recherche ne voient pas votre site comme vous. Ils lisent le code HTML brut et interprètent sa structure pour comprendre le contenu. Un balisage propre et sémantique, c'est la base pour que Google sache de quoi parle votre page.

### Le problème WordPress

Sur WordPress, le HTML dépend entièrement du thème et des plugins. Et la plupart des thèmes populaires génèrent du code qui ressemble à ça :

```html
<div class="et_pb_module et_pb_text et_pb_text_0 et_pb_bg_layout_light et_pb_text_align_left">
  <div class="et_pb_text_inner">
    <div class="et_pb_module_inner">
      <h2 class="et_pb_module_header">Mon titre</h2>
    </div>
  </div>
</div>
```

Six niveaux de `<div>` pour afficher un titre. **Un titre.** 🤡

![Expectation vs Reality du HTML WordPress](/images/blog/wordpress-vs-custom/div-soup-meme.webp)

```
📊 Nœuds DOM par page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WordPress (Elementor)  ████████████████████  ~2500 nœuds
Site sur mesure        ████░░░░░░░░░░░░░░░░  ~350 nœuds

📊 Ratio contenu utile / balisage total
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WordPress (Elementor)  ███░░░░░░░░░░░░░░░░░  ~15%
Site sur mesure        ██████████████░░░░░░  ~70%

📊 Profondeur DOM moyenne
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WordPress (Elementor)  ████████████████████  15 à 25 niveaux
Site sur mesure        ██████░░░░░░░░░░░░░░  5 à 8 niveaux
```

### Le même titre, codé sur mesure

```html
<article>
  <header>
    <h1>Mon titre</h1>
    <time datetime="2025-01-15">15 janvier 2025</time>
  </header>
  <section>
    <h2>Ma sous-section</h2>
    <p>Mon contenu optimisé.</p>
  </section>
</article>
```

Propre. Sémantique. Léger. Google comprend immédiatement la structure. Le rapport signal/bruit est maximal.

## 3. Les données structurées : rich snippets sans galère

### L'enjeu

Les données structurées (Schema.org) permettent d'obtenir des résultats enrichis dans Google : étoiles d'avis, FAQ déroulantes, prix de produits, horaires d'ouverture, fil d'Ariane. Ces résultats enrichis peuvent booster le taux de clic de 20 à 30%.

### Sur WordPress

Les données structurées passent par des plugins (Yoast SEO, Rank Math). Ça marche pour les cas simples, mais ça atteint vite ses limites :

- Les schémas personnalisés (LocalBusiness avec des attributs spécifiques)
- Les schémas imbriqués complexes (Product + AggregateRating + Offer + FAQ)
- La cohérence entre le contenu visible et les données structurées
- Les conflits entre plugins qui génèrent des schémas en double

### Sur un site sur mesure

Les données structurées sont intégrées directement dans le code source, en JSON-LD, avec un contrôle total :

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Boulangerie Dupont",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "12 rue de la Paix",
    "addressLocality": "Lyon",
    "postalCode": "69001"
  },
  "openingHoursSpecification": [],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127"
  }
}
```

Chaque donnée est exacte, validée, et alignée avec le contenu affiché. Pas de plugin intermédiaire, pas de conflit, pas d'approximation.

## 4. La gestion des ressources : chargement chirurgical vs bazar global

### Le problème WordPress

Un des défauts les plus coûteux de WordPress en termes de performance : le **chargement global des ressources**. Un plugin de formulaire installé ? Son CSS et son JS se chargent sur **chaque page du site**. Même celles sans aucun formulaire.

Un WordPress typique avec 10 plugins charge entre 15 et 30 fichiers CSS/JS distincts sur chaque page. Chaque fichier = une requête HTTP, du temps de parsing, du poids en plus.

![Moi en train d'installer le 15ème plugin d'optimisation WordPress](/images/blog/wordpress-vs-custom/plugins-meme.webp)

Les plugins d'optimisation (WP Rocket, Autoptimize) ne font que limiter les dégâts : ils concatènent et minifient, mais le code inutile est toujours téléchargé et exécuté par le navigateur.

### Un framework moderne, c'est chirurgical

Nuxt.js intègre nativement :

- **Tree-shaking** : seul le JavaScript réellement utilisé est inclus dans le bundle final. Tu importes une fonction d'une lib ? Seule cette fonction est embarquée.
- **Code-splitting** : chaque page ne charge que son propre JavaScript. La page d'accueil ne télécharge pas le code de la page contact.
- **Lazy-loading intelligent** : images, composants lourds et ressources non critiques se chargent uniquement quand l'utilisateur en a besoin.

Résultat : chaque page ne contient que le strict nécessaire. Pas un octet de plus.

## 5. Les URLs et le crawl budget

### C'est quoi le crawl budget

Google alloue à chaque site un nombre limité de pages que Googlebot va explorer par visite. Pour un petit site c'est pas hyper critique, mais l'efficacité du crawl reste un signal de qualité technique.

### WordPress et ses pages fantômes

Par défaut, WordPress génère plein de pages que personne n'a demandées :

- **Archives par auteur** (`/author/admin/`) : souvent du contenu dupliqué
- **Archives par date** (`/2025/01/`) : zéro valeur SEO
- **Tags et catégories** vides ou quasi-vides
- **Pages de recherche interne** indexées par erreur
- **Pages de pièces jointes** (chaque image uploadée crée sa propre page 🤦)
- **URLs avec paramètres** (`?replytocom=`, `?p=`) qui génèrent du contenu dupliqué
- **Pages de flux RSS** parfois indexées

Chacune de ces pages dilue le crawl budget et crée du contenu dupliqué. Yoast essaie de bloquer ça avec `noindex`... mais c'est du pansement sur une jambe de bois.

### Un site sur mesure

Chaque URL existe parce qu'on l'a décidé. Zéro page parasite, zéro contenu dupliqué accidentel. Le `sitemap.xml` est généré automatiquement et ne contient que les pages pertinentes. Le `robots.txt` est configuré une fois, proprement.

Googlebot explore 100% de pages utiles au lieu de gaspiller ses visites sur des archives vides.

## 6. La sécurité : le facteur SEO que tout le monde oublie

### L'impact concret

Un site piraté ou infecté par un malware, c'est :

- **Déclassé** par Google dans les résultats
- **Affiché** avec un avertissement "Ce site peut endommager votre ordinateur" (RIP votre taux de clic)
- **Désindexé** dans les cas graves

La récupération peut prendre des semaines. Voire des mois en termes de positionnement.

### WordPress : la cible n°1

WordPress représente environ 90% des CMS piratés. Les raisons sont multiples :

- **Plugins vulnérables** : chaque plugin est un point d'entrée potentiel. En 2024, plus de 7 000 vulnérabilités WordPress ont été signalées.
- **Thèmes obsolètes** : les thèmes non mis à jour contiennent des failles connues et documentées.
- **Attaques par force brute** : `/wp-admin` est une cible universellement connue.
- **Injections SQL** : l'archi PHP/MySQL expose une large surface d'attaque.

![This is fine - comme votre WordPress avec 3 plugins pas mis à jour](/images/blog/wordpress-vs-custom/this-is-fine.webp)

Maintenir un WordPress sécurisé demande une vigilance constante : mises à jour hebdomadaires, monitoring des plugins, sauvegardes fréquentes, pare-feu applicatif.

### Un site statique ? Quasi inattaquable.

Pas de base de données à pirater. Pas de panel admin exposé. Pas de code serveur à exploiter. C'est du HTML, du CSS et du JavaScript. Des fichiers inertes servis tels quels.

La surface d'attaque est réduite au strict minimum : le serveur web lui-même. Le site reste en ligne, disponible, et intact.

## 7. Le mobile-first

### Pourquoi c'est crucial

Depuis 2021, Google utilise **exclusivement** la version mobile d'un site pour l'indexation et le classement. Site pas optimisé mobile = référencement pénalisé. Fin de l'histoire.

### WordPress et le responsive

Les thèmes WordPress sont "responsive" sur le papier. Dans la vraie vie :

- Les page builders (Elementor, Divi, WPBakery) génèrent des layouts qui s'adaptent mal aux petits écrans
- Les éléments cachés en mobile avec `display: none` sont quand même téléchargés (le navigateur charge tout, puis masque... super logique 🙃)
- Les images ne sont pas toujours servies en taille adaptée (le smartphone télécharge l'image desktop de 2000px)
- Les polices web multipliées par les thèmes rajoutent des centaines de Ko

### L'approche mobile-first native

Un site codé sur mesure est pensé mobile-first dès la première ligne de code :

- Images servies en taille adaptée via `<picture>` et `srcset`, avec formats modernes (WebP, AVIF)
- CSS écrit mobile-first : la version mobile est la base, les adaptations desktop viennent via `@media`
- Aucun élément caché n'est téléchargé inutilement
- Polices chargées en `font-display: swap` avec subset optimisé

## 8. Les mises à jour de contenu

### Pourquoi la fraîcheur compte

Google valorise le contenu frais et régulièrement mis à jour. Un site dont le contenu évolue est considéré plus pertinent qu'un site figé.

### Le workflow WordPress

Mettre à jour une page sur WordPress : se connecter au back-office, naviguer dans l'éditeur (souvent lent avec les page builders), modifier le contenu, sauvegarder, puis vider le cache. C'est fastidieux, et résultat, les mises à jour sont repoussées.

En plus, chaque mise à jour de WordPress, de thème ou de plugin peut casser le site. Les propriétaires repoussent les mises à jour par peur de régression. Cercle vicieux : site obsolète, moins sécurisé, moins performant.

### Un CMS headless pour la simplicité

Avec un CMS headless comme Nuxt Studio, les mises à jour de contenu sont séparées du code. Le client modifie son texte ou ses images dans une interface visuelle, le site se régénère automatiquement. Aucun risque de casser quoi que ce soit, aucune mise à jour technique à gérer.

Contenu frais, site stable.

## 9. Les optim avancées impossibles sur WordPress

Certaines techniques SEO sont natives dans un framework moderne mais impossibles (ou tellement complexes que personne le fait) sur WordPress :

### Prefetching intelligent

Nuxt.js détecte les liens visibles à l'écran et pré-charge les pages correspondantes en arrière-plan. Quand l'utilisateur clique, la page est déjà en mémoire : la navigation semble instantanée. Essayez de faire ça nativement sur WordPress.

### Sitemap optimisé automatique

Le sitemap est généré au moment du build avec les métadonnées exactes de chaque page (dernière modification, priorité, fréquence). Sur WordPress, on dépend d'un plugin qui doit interroger la base de données à chaque génération.

### Contrôle des en-têtes HTTP

`Cache-Control`, `ETag`, `Content-Security-Policy`, `X-Content-Type-Options` sont configurés directement au niveau serveur, sans couche d'abstraction. Chaque en-tête est optimisé pour la performance et la sécurité.

### Rendu conditionnel par device

Les composants peuvent être rendus différemment selon le device au moment du build, évitant le téléchargement de code inutile. WordPress charge tout et masque visuellement ce qui ne sert pas.

## Le verdict

Soyons honnêtes : on peut tout à fait bien référencer un site WordPress. Des millions de sites WordPress sont en première page de Google. Mais ils y arrivent **malgré** leur architecture, pas **grâce** à elle.

### Le comparatif final

```
📊 Score Lighthouse
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WordPress            ████████░░░░░░░░░░░░  30-60
Site sur mesure      ████████████████████  95-100

📊 Vulnérabilités / an
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WordPress            ████████████████████  7 000+
Site sur mesure      ░░░░░░░░░░░░░░░░░░░░  ~0

📊 Coût maintenance mensuel
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WordPress            ████████████████░░░░  50-200€
Site sur mesure      ███░░░░░░░░░░░░░░░░░  ~15€
```

| Critère | WordPress | Site sur mesure |
|---|---|---|
| Performance Lighthouse | 30-60 | 95-100 |
| Temps de chargement mobile | 3-6s | < 1s |
| Sécurité (vulnérabilités/an) | 7 000+ | ~0 |
| Coût maintenance mensuel | 50-200€/mois | ~15€/mois |
| Contenu dupliqué généré | Pages archives, tags, auteurs, pièces jointes | Aucun |
| Données structurées | Via plugins (conflits fréquents) | Natif, validé, sans conflit |
| Mobile-first | Adaptatif (masque les éléments) | Natif (charge uniquement le nécessaire) |
| Mises à jour contenu | Back-office lent, risque de casse | CMS headless, zéro risque |

Pour qu'un WordPress atteigne des perfs SEO comparables à un site sur mesure, il faut :

- Un thème léger et bien codé (pas Elementor/Divi)
- 5 à 10 plugins d'optimisation (cache, minification, lazy-load, WebP, CDN)
- Une config technique pointue (htaccess, base de données, PHP)
- Une maintenance constante (mises à jour, monitoring, sauvegardes)
- Un budget mensuel pour l'hébergement performant et les plugins premium

Tout ça est **natif** sur un site codé sur mesure. C'est la différence entre essayer de faire voler un camion en lui collant des ailes, et concevoir un avion dès le départ.

## On en discute ?

Chez Tempo Hub, on conçoit des sites qui intègrent toutes ces optimisations dès le jour 1. Chaque site est généré statiquement, balisé sémantiquement, optimisé mobile, et pensé pour offrir la meilleure expérience aux visiteurs et aux moteurs de recherche.

Vous êtes artisan, commerçant, ou dirigez une PME ? **Votre visibilité en ligne mérite mieux qu'un thème WordPress ralenti par vingt plugins.** Contactez-nous pour voir ce qu'un site sur mesure peut faire pour votre référencement.
