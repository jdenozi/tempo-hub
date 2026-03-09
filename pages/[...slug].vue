<template>
  <div>
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
</script>
