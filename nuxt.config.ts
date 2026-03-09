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
      title: 'Agence web sur mesure à Bordeaux — Sites performants',
      titleTemplate: '%s — Tempo Hub',
      meta: [
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:locale', content: 'fr_FR' },
      ],
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
        description: 'Tempo Hub, agence web française spécialisée dans la création de sites vitrines sur mesure. Design premium, performances Lighthouse 90+, SEO optimisé et hébergement inclus. Devis gratuit.',
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

  // Vendor chunk isolation — separate long-lived cached chunks for heavy lazy-loaded deps
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules/gsap')) return 'vendor-gsap'
            if (id.includes('node_modules/lenis')) return 'vendor-lenis'
          },
        },
      },
    },
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
    description: 'Tempo Hub, agence web française spécialisée dans la création de sites vitrines sur mesure. Design premium, performances Lighthouse 90+, SEO optimisé et hébergement inclus. Devis gratuit.',
    defaultLocale: 'fr',
  },

  // Schema.org structured data — Organization identity
  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'Tempo Hub',
      description: 'Agence web française spécialisée en création de sites vitrines sur mesure avec Nuxt.js et Vue.js',
      url: 'https://tempo-hub.fr',
      email: 'contact@tempo-hub.fr',
      sameAs: [
        'https://github.com/jdenozi',
      ],
    },
  },
})

