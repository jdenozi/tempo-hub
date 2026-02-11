# 04 — Layouts + UI Components

## Ce qui a été fait

Mise en place du système de layouts Nuxt, des composants de structure (Header, Footer, Navbar) et des composants UI de base réutilisables (Button, Card, Input, Textarea, Select, Modal, Icon).

## Architecture

```
app.vue                        ← NuxtLayout + NuxtPage
├── layouts/
│   ├── default.vue            ← Header + contenu + Footer
│   ├── landing.vue            ← Contenu + Footer (pas de header)
│   └── blog.vue               ← Header + contenu centré (max-w-3xl) + Footer
├── components/layout/
│   ├── Header.vue             ← Sticky, responsive, menu mobile
│   ├── Navbar.vue             ← Nav desktop + burger mobile
│   └── Footer.vue             ← 3 colonnes, infos depuis config
├── components/ui/
│   ├── Button.vue             ← 4 variantes, 3 tailles, loading state
│   ├── Card.vue               ← Container avec bordure optionnelle
│   ├── Input.vue              ← Input texte avec label, v-model
│   ├── Textarea.vue           ← Textarea avec label, v-model
│   ├── Select.vue             ← Select avec options, v-model
│   ├── Modal.vue              ← Overlay + panel, Teleport to body
│   └── Icon.vue               ← Icons SVG inline (13 icônes incluses)
└── pages/
    └── index.vue              ← Page d'accueil (anciennement dans app.vue)
```

## Layouts

### `default` — Layout principal
Header sticky + contenu + Footer. Utilisé par défaut sur toutes les pages.

### `landing` — Landing page
Pas de header, juste le contenu + Footer. Pour les pages de vente ou landing.

```vue
<script setup>
definePageMeta({ layout: 'landing' })
</script>
```

### `blog` — Articles
Header + contenu centré dans un max-w-3xl + Footer. Pour les pages de lecture.

```vue
<script setup>
definePageMeta({ layout: 'blog' })
</script>
```

## Composants Layout

### Header
- **Sticky** avec backdrop-blur
- **Responsive** : nav horizontale en desktop, menu burger en mobile
- **Configurable** : `navItems`, `ctaLabel`, `ctaTo`
- Logo et nom du client lus depuis `app.config.ts`
- Menu mobile avec animation de transition (slide down)
- Se ferme automatiquement au changement de route

### Footer
- 3 colonnes : Brand, Contact, Social
- Données lues depuis `useClientConfig()` (contact, social)
- Réseaux sociaux filtrés automatiquement (null = masqué)
- Copyright avec année dynamique

### Navbar
- Navigation desktop en flexbox horizontal
- Bouton burger pour mobile
- Active class sur la route courante

## Composants UI

### Button
```vue
<!-- 4 variantes -->
<UiButton variant="primary">Primary</UiButton>
<UiButton variant="secondary">Secondary</UiButton>
<UiButton variant="outline">Outline</UiButton>
<UiButton variant="ghost">Ghost</UiButton>

<!-- 3 tailles -->
<UiButton size="sm">Small</UiButton>
<UiButton size="md">Medium</UiButton>
<UiButton size="lg">Large</UiButton>

<!-- Lien ou bouton -->
<UiButton to="/contact">Lien interne (NuxtLink)</UiButton>
<UiButton @click="submit">Bouton action</UiButton>

<!-- Loading state -->
<UiButton :loading="isSubmitting">Envoyer</UiButton>
```

### Card
```vue
<UiCard>Contenu avec bordure et padding</UiCard>
<UiCard :bordered="false" :padded="false">Sans bordure ni padding</UiCard>
```

### Input / Textarea / Select
Tous supportent `v-model`, `label`, `placeholder`, `required`, `disabled`.

```vue
<UiInput v-model="name" label="Nom" placeholder="Votre nom" />
<UiTextarea v-model="message" label="Message" :rows="6" />
<UiSelect v-model="subject" label="Sujet" :options="[
  { label: 'Devis', value: 'quote' },
  { label: 'Question', value: 'question' },
]" />
```

### Modal
```vue
<UiModal :open="showModal" @close="showModal = false">
  <h2>Titre</h2>
  <p>Contenu du modal</p>
</UiModal>
```

### Icon
13 icônes SVG inline disponibles, extensibles dans le composant.

```vue
<UiIcon name="heart" size="md" />
<UiIcon name="mail" size="lg" />
```

Icônes disponibles : `arrow-right`, `arrow-left`, `chevron-down`, `chevron-right`, `x`, `menu`, `mail`, `phone`, `map-pin`, `heart`, `star`, `users`, `check`, `external-link`.

## Convention de nommage

Nuxt auto-importe les composants avec le préfixe du dossier :
- `components/ui/Button.vue` → `<UiButton />`
- `components/layout/Header.vue` → `<LayoutHeader />`

Pas besoin d'import explicite.
