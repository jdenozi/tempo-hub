import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    // Blog articles (FR + EN)
    blog: defineCollection({
      type: 'page',
      source: '**/blog/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.date(),
        image: z.string().optional(),
      }),
    }),

    // Section-based pages (FR + EN)
    pages: defineCollection({
      type: 'page',
      source: '**/pages/**',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        order: z.number().default(0),
        navLabel: z.string().optional(),
        showInNav: z.boolean().default(true),
        createdAt: z.date().optional(),
        updatedAt: z.date().optional(),
        heroPreset: z.enum(['starfield', 'nebula', 'planet-horizon', 'grid-station', 'orbital', 'retro-scan', 'none']).default('none'),
        heroImage: z.string().optional(),
        heroOverlay: z.enum(['particles', 'scanlines', 'grid', 'none']).default('none'),
      }),
    }),

    // Testimonials (FR + EN)
    testimonials: defineCollection({
      type: 'data',
      source: '**/testimonials/*.md',
      schema: z.object({
        name: z.string(),
        role: z.string(),
        photo: z.string().optional(),
        quote: z.string(),
        rating: z.number().min(1).max(5).default(5),
        order: z.number().default(0),
      }),
    }),

    // FAQ entries (FR + EN)
    faq: defineCollection({
      type: 'data',
      source: '**/faq/*.md',
      schema: z.object({
        question: z.string(),
        answer: z.string(),
        category: z.string().optional(),
        order: z.number().default(0),
      }),
    }),

    // Projects / Portfolio (FR + EN)
    projects: defineCollection({
      type: 'page',
      source: '**/projects/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        image: z.string(),
        url: z.string().optional(),
        date: z.date(),
        tags: z.array(z.string()).optional(),
        featured: z.boolean().default(false),
      }),
    }),

    // Site settings (JSON)
    settings: defineCollection({
      type: 'data',
      source: 'settings/*.json',
      schema: z.object({
        identity: z.object({
          siteName: z.string(),
          profession: z.string(),
          logo: z.string().optional(),
          favicon: z.string().optional(),
        }),
        contact: z.object({
          email: z.string(),
          phone: z.string().optional(),
          address: z.string().optional(),
          city: z.string().optional(),
          zipCode: z.string().optional(),
          country: z.string().optional(),
          mapUrl: z.string().optional(),
        }),
        social: z.object({
          instagram: z.string().optional(),
          facebook: z.string().optional(),
          linkedin: z.string().optional(),
          twitter: z.string().optional(),
          youtube: z.string().optional(),
          tiktok: z.string().optional(),
          github: z.string().optional(),
        }),
        seo: z.object({
          defaultTitle: z.string().optional(),
          defaultDescription: z.string().optional(),
          ogImage: z.string().optional(),
          googleAnalytics: z.string().optional(),
          gtmId: z.string().optional(),
        }).optional(),
        appearance: z.object({
          primaryColor: z.string().optional(),
          secondaryColor: z.string().optional(),
          headingFont: z.string().optional(),
          bodyFont: z.string().optional(),
          headerStyle: z.string().optional(),
        }).optional(),
        features: z.object({
          scrollAnimations: z.boolean().optional(),
          customCursor: z.boolean().optional(),
          backToTop: z.boolean().optional(),
          cookieBanner: z.boolean().optional(),
          maintenanceMode: z.boolean().optional(),
          maintenanceMessage: z.string().optional(),
        }).optional(),
      }),
    }),
  },
})
