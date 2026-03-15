<template>
  <div>
    <AppBreadcrumb v-if="!isHome" :items="breadcrumbItems" />

    <!-- Strapi-powered rendering -->
    <StrapiSectionRenderer
      v-if="sections.length"
      :sections="sections"
    />

    <!-- Fallback: legacy Nuxt Content rendering (during migration) -->
    <template v-else-if="legacyPage">
      <PageRenderer v-if="legacyPage?.sections" :sections="legacyPage.sections" />
      <ContentRenderer v-else :value="legacyPage" />
    </template>

    <!-- 404 -->
    <div v-else-if="!pending" class="min-h-screen flex items-center justify-center">
      <p class="text-gray-400">Page not found</p>
    </div>
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

// Build slug
const slug = Array.isArray(route.params.slug)
  ? route.params.slug.join('/')
  : route.params.slug || 'index'

// Try Strapi first
const { page, sections, pending } = useStrapiPage(slug === 'index' ? 'accueil' : slug)

// Fallback to Nuxt Content (during migration)
const contentPath = `/${locale.value}/pages/${slug}`
const { data: legacyPage } = await useAsyncData(`legacy-page-${contentPath}`, () =>
  queryCollection('pages').path(contentPath).first(),
)

// 404 if neither source has the page
if (!page.value && !legacyPage.value && !pending.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

// SEO from Strapi (or legacy)
if (page.value) {
  useStrapiSeo({
    title: computed(() => page.value?.title),
    description: computed(() => page.value?.description),
  })
} else if (legacyPage.value) {
  usePageSeo(legacyPage)
}

// Breadcrumb
const isHome = computed(() => slug === 'index' || slug === '' || slug === 'accueil')
const breadcrumbItems = computed(() => {
  if (isHome.value) return []
  const title = page.value?.title || legacyPage.value?.title || slug
  return [
    { label: 'Accueil', to: '/' },
    { label: title, to: route.path },
  ]
})

// Site-specific: Service schema for /services page
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
