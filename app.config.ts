// Client-specific identity, contact info, and feature flags
export default defineAppConfig({
  // === CLIENT IDENTITY ===
  client: {
    name: 'Tempo Hub',
    profession: 'Agence web',
    logo: '',
    favicon: '/favicon.ico',
  },

  // === CONTACT INFO ===
  contact: {
    email: 'contact@tempo-hub.fr',
    phone: '+33 6 00 00 00 00',
    address: '',
  },

  // === SOCIAL LINKS ===
  social: {
    instagram: null,
    facebook: null,
    linkedin: null,
    twitter: null,
  },

  // === INTEGRATIONS ===
  calcom: {
    username: '',
    defaultEvent: 'consultation',
  },

  n8n: {
    webhookContact: '',
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
  pages: {},
})
