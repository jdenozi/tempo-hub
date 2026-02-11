// Client site — extends tempo-core layer (git submodule)
export default defineNuxtConfig({
  extends: ['./tempo-core'],

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
    description: 'Template Nuxt 3 pour sites clients',
    defaultLocale: 'fr',
  },
})
