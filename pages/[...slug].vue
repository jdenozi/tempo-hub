<template>
  <div>
    <AppBreadcrumb
      v-if="!isHome"
      :items="[{ label: 'Accueil', to: '/' }, { label: page?.navLabel || page?.title }]"
    />
    <!-- Frontmatter sections: legacy format (backward compat during migration) -->
    <PageRenderer
      v-if="page?.sections"
      :sections="page.sections"
    />
    <!-- MDC / prose content rendered by ContentRenderer (sections handle their own layout) -->
    <ContentRenderer
      v-else-if="page"
      :value="page"
    />
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const route = useRoute()

// Let Nuxt Studio handle its own routes
const fullPath = route.path
if (fullPath.startsWith('/_studio') || fullPath.startsWith('/__nuxt_studio')) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

// Build content path from locale and slug
const slug = Array.isArray(route.params.slug)
  ? route.params.slug.join('/')
  : route.params.slug || 'index'

const isHome = slug === 'index'

const contentPath = `/${locale.value}/pages/${slug}`

const { data: page } = await useAsyncData(`page-${contentPath}`, () =>
  queryCollection('pages').path(contentPath).first()
)

// 404 if page not found
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

// SEO meta from frontmatter
useHead({
  title: page.value.title,
  meta: [
    { name: 'description', content: page.value.description },
  ],
})

useSeoMeta({
  ogImage: '/og-image.jpg',
})

defineOgImage({ component: 'NuxtSeo' })

// Service schema for /services page
if (slug === 'services') {
  useSchemaOrg([
    {
      '@type': 'Service',
      name: 'Création Site Vitrine',
      description: 'Site vitrine responsive jusqu\'à 5 pages, optimisé SEO, hébergement et maintenance inclus.',
      provider: { '@id': 'https://tempo-hub.fr/#identity' },
      areaServed: { '@type': 'Country', name: 'France' },
      offers: {
        '@type': 'Offer',
        price: '499',
        priceCurrency: 'EUR',
        description: 'À partir de 499€ + 15,99€/mois',
      },
    },
    {
      '@type': 'Service',
      name: 'Site E-commerce & Outils de Conversion',
      description: 'Site avec réservation en ligne, paiement Stripe, tableau de bord et support prioritaire.',
      provider: { '@id': 'https://tempo-hub.fr/#identity' },
      areaServed: { '@type': 'Country', name: 'France' },
      offers: {
        '@type': 'Offer',
        price: '999',
        priceCurrency: 'EUR',
        description: 'À partir de 999€ + 29,99€/mois',
      },
    },
    {
      '@type': 'Service',
      name: 'Application Web Sur Mesure',
      description: 'Design et développement personnalisés, animations premium, intégrations spécifiques et architecture technique adaptée.',
      provider: { '@id': 'https://tempo-hub.fr/#identity' },
      areaServed: { '@type': 'Country', name: 'France' },
      offers: {
        '@type': 'Offer',
        price: '2999',
        priceCurrency: 'EUR',
        description: 'À partir de 2 999€, tarif mensuel sur devis',
      },
    },
  ])
}
</script>
