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

  // Client-level theme (loaded after core CSS)
  css: ['~/assets/css/theme.css'],

  // Nuxt Studio — full config
  studio: {
    // Enable dev mode overlay (auto in nuxt dev)
    dev: true,

    // Login route for production auth
    route: '/_studio',

    // Git repository
    repository: {
      provider: 'github',
      owner: 'jdenozi',
      repo: 'tempo-hub',
      branch: 'main',
      rootDir: '',
      private: true,
    },

    // Auth providers (credentials via .env)
    auth: {
      github: {
        clientId: process.env.STUDIO_GITHUB_CLIENT_ID,
        clientSecret: process.env.STUDIO_GITHUB_CLIENT_SECRET,
      },
    },

    // AI assistant for content generation
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

    // i18n config for Studio UI
    i18n: {
      defaultLocale: 'fr',
    },

    // Component filtering in the Studio editor
    meta: {
      components: {
        include: [
          'SectionHero',
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

  // Ensure studio routes are server-rendered
  routeRules: {
    '/_studio/**': { ssr: true },
    '/__nuxt_studio/**': { ssr: true },
  },

  i18n: {
    baseUrl: 'https://tempo-hub.fr',
    locales: [
      { code: 'fr', iso: 'fr-FR', file: 'fr.json', name: 'Français' },
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
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
