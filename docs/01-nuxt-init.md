# 01 — Initialisation Nuxt 3

## Ce qui a été fait

Mise en place du socle Nuxt 3 qui sert de fondation à tout le template.

## Stack installée

| Package | Version | Rôle |
|---------|---------|------|
| `nuxt` | ^3.21.1 | Framework SSR/SSG |
| `vue` | ^3.5.28 | Moteur de rendu |
| `vue-router` | ^4.6.4 | Routing |
| `typescript` | ^5.7.0 | Typage (devDep) |

## Structure des fichiers

```
├── app.vue              # Point d'entrée de l'app Vue
├── nuxt.config.ts       # Configuration Nuxt (modules, options)
├── tsconfig.json        # Étend le tsconfig généré par Nuxt
├── package.json         # Dépendances et scripts
├── public/
│   ├── favicon.ico      # Favicon par défaut
│   └── robots.txt       # Directives crawlers
└── server/
    └── tsconfig.json    # Config TS pour le serveur Nitro
```

## Scripts disponibles

| Commande | Action |
|----------|--------|
| `npm run dev` | Lance le serveur de dev (http://localhost:3000) |
| `npm run build` | Build de production (SSR) |
| `npm run generate` | Génération statique (SSG) |
| `npm run preview` | Prévisualise le build de production |

## Comment ça marche

### app.vue

Point d'entrée unique de l'application. Actuellement affiche la page de bienvenue Nuxt. Sera remplacé par le système de layouts + `<NuxtPage />` quand on ajoutera les pages.

### nuxt.config.ts

Configuration centrale de Nuxt. C'est ici qu'on déclarera les modules (Tailwind, i18n, SEO, Content...) et les options du framework. Pour l'instant, seul le devtools est activé.

### Nitro (server/)

Le serveur Nitro est le moteur SSR de Nuxt 3. Il gère le rendu côté serveur et les API routes. Le dossier `server/` accueillera plus tard les routes API (ex: `server/api/contact.post.ts`).

## Vérification

```bash
npm run dev
# → Nuxt 3.21.1 démarre sur http://localhost:3000
```
