/**
 * Seed initial content for a new client site.
 * Creates the minimum required pages and settings.
 * Usage: STRAPI_URL=http://localhost:1337 STRAPI_TOKEN=xxx npx tsx scripts/seed-content.ts
 */
import { strapiCreate, strapiFind } from './strapi-client.js'

async function seedContent() {
  console.log('🌱 Seeding initial content...\n')

  // 1. Site Settings
  console.log('⚙️  Settings...')
  const existingSettings = await strapiFind('site-setting')
  if (!existingSettings.data) {
    await strapiCreate('site-setting', {
      siteName: 'Mon Site',
      profession: 'Votre métier',
      email: 'contact@example.com',
      primaryColor: '#d4a853',
      secondaryColor: '#1a1a2e',
      headingFont: 'Space Grotesk',
      bodyFont: 'Inter',
      cookieBanner: true,
    })
    console.log('  ✅ Settings created')
  } else {
    console.log('  ⏭️  Settings already exist')
  }

  // 2. Home page
  await seedPage('accueil', {
    title: 'Accueil',
    description: 'Bienvenue sur notre site web professionnel.',
    order: 0,
    showInNav: false,
    sections: [],
  })

  // 3. Services page
  await seedPage('services', {
    title: 'Nos services',
    description: 'Découvrez nos services et tarifs.',
    navLabel: 'Services',
    order: 1,
    sections: [
      {
        __component: 'sections.page-banner',
        title: 'Nos services',
        subtitle: 'Des solutions adaptées à votre activité',
        ctaText: 'Nous contacter',
        ctaLink: '/contact',
        size: 'compact',
      },
      {
        __component: 'sections.cta',
        title: 'Un projet en tête ?',
        subtitle: 'Contactez-nous pour en discuter.',
        ctaText: 'Prendre contact',
        ctaLink: '/contact',
      },
    ],
  })

  // 4. About page
  await seedPage('a-propos', {
    title: 'À propos',
    description: 'En savoir plus sur notre entreprise.',
    navLabel: 'À propos',
    order: 2,
    sections: [
      {
        __component: 'sections.page-banner',
        title: 'À propos',
        subtitle: 'Notre histoire et nos valeurs.',
        size: 'full',
      },
    ],
  })

  // 5. Contact page
  await seedPage('contact', {
    title: 'Contact',
    description: 'Contactez-nous pour votre projet.',
    navLabel: 'Contact',
    order: 5,
    sections: [
      {
        __component: 'sections.page-banner',
        title: 'Contactez-nous',
        subtitle: 'Envoyez-nous un message.',
        size: 'minimal',
      },
      {
        __component: 'sections.contact',
        title: 'Formulaire de contact',
      },
    ],
  })

  console.log('\n✨ Seed complete! Open /admin to customize content.')
}

async function seedPage(slug: string, data: any) {
  const existing = await strapiFind('pages', { slug })
  if (existing.data?.length > 0) {
    console.log(`  ⏭️  Page "${slug}" already exists`)
    return
  }
  await strapiCreate('pages', { slug, ...data })
  console.log(`  ✅ Page "${slug}" created`)
}

seedContent().catch((err) => {
  console.error('\n💥 Seed failed:', err)
  process.exit(1)
})
