// Client-specific identity, contact info, and feature flags.
export default defineAppConfig({
  // === CLIENT IDENTITY ===
  client: {
    name: 'Tempo Hub',
    profession: 'Agence web',
    logo: '', // TODO: Set logo path (e.g., '/images/logo.svg')
    favicon: '/favicon.ico',
  },

  // === CONTACT INFO ===
  contact: {
    email: 'contact@tempo-hub.fr',
    phone: '', // TODO: Set business phone number (e.g., '+33 1 23 45 67 89')
    address: '', // TODO: Set business address (e.g., '12 rue du Temple, 75004 Paris')
  },

  // === SOCIAL LINKS ===
  // TODO: Set social media URLs (string) or leave null to hide
  social: {
    instagram: null,
    facebook: null,
    linkedin: null,
    twitter: null,
  },

  // === INTEGRATIONS ===
  calcom: {
    baseUrl: 'https://calcom.tempo-finance.com',
    username: 'tempohub',
    defaultEvent: '',
  },

  n8n: {
    webhookContact: '', // TODO: Set n8n webhook URL for contact form
  },

  // === FEATURE FLAGS ===
  features: {
    animations: true,
    smoothScroll: true,
    threejs: false,
    transitions: true,
    customCursor: false,
  },

  // === PER-PAGE OVERRIDES ===
  pages: {}, // Per-page feature overrides (e.g., { home: { threejs: true } } enables 3D on home only)
})
