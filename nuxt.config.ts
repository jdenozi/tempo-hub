// Client site — extends tempo-core layer (git submodule)
export default defineNuxtConfig({
  extends: ['./tempo-core'],

  modules: ['nuxt-studio'],

  // Treat Stripe custom elements as native
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('stripe-'),
    },
  },

  // Resource hints — preconnect to external runtime domains only
  // NOTE: fonts.googleapis.com NOT included — @nuxt/fonts self-hosts in production
  app: {
    head: {
      title: 'Agence web sur mesure',
      titleTemplate: '%s — Tempo Hub',
      link: [
        { rel: 'preconnect', href: 'https://js.stripe.com' },
        { rel: 'preconnect', href: 'https://app.cal.com' },
        { rel: 'dns-prefetch', href: 'https://js.stripe.com' },
        { rel: 'dns-prefetch', href: 'https://app.cal.com' },
      ],
    },
  },

  // Client-level theme (loaded after core CSS)
  css: ['~/assets/css/theme.css'],

  // Nuxt Studio — full config
  studio: {
    dev: true,
    route: '/_studio',
    repository: {
      provider: 'github',
      owner: 'jdenozi',
      repo: 'tempo-hub',
      branch: 'main',
      rootDir: '',
      private: true,
    },
    auth: {
      github: {
        clientId: process.env.STUDIO_GITHUB_CLIENT_ID,
        clientSecret: process.env.STUDIO_GITHUB_CLIENT_SECRET,
      },
    },
    ai: {
      apiKey: process.env.AI_GATEWAY_API_KEY || '',
      context: {
        title: 'Tempo Hub',
        description: 'Agence web spécialisée dans la création de sites vitrines sur mesure, performants et optimisés SEO.',
        style: 'Professionnel, moderne, orienté conversion. Ton expert mais accessible.',
        tone: 'Confiant et pédagogique, sans jargon excessif.',
        collection: {
          name: 'studio',
          folder: '.studio',
        },
      },
      experimental: {
        collectionContext: true,
      },
    },
    i18n: {
      defaultLocale: 'fr',
    },
    meta: {
      components: {
        include: [
          'SectionPageBanner',
          'SectionFeatures',
          'SectionCta',
          'SectionStats',
          'SectionPricing',
          'SectionTestimonials',
          'SectionFaq',
          'SectionContact',
          'SectionLogos',
          'SectionStripePricing',
          'SectionProjects',
          'SectionBooking',
        ],
        exclude: [],
      },
    },
  },

  // SSG: prerender all routes at build time
  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true,
      failOnError: false,
    },
  },

  // Route rules: Studio stays SSR; static assets get long-lived cache headers
  routeRules: {
    '/_studio/**': { ssr: true },
    '/__nuxt_studio/**': { ssr: true },
    '/_nuxt/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
    '/images/**': { headers: { 'Cache-Control': 'public, max-age=604800' } },
    '/fonts/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
  },

  i18n: {
    baseUrl: 'https://tempo-hub.fr',
    locales: [
      { code: 'fr', iso: 'fr-FR', file: 'fr.json', name: 'Français' },
    ],
    lazy: true,
    langDir: '../locales/',
  },

  // Client-specific SEO metadata
  site: {
    url: 'https://tempo-hub.fr',
    name: 'Tempo Hub',
    description: 'Agence web spécialisée dans la création de sites vitrines sur mesure, performants et optimisés SEO.',
    defaultLocale: 'fr',
  },
})
