<template>
  <div>
    <!-- MDC body: page has markdown body content (new MDC format) -->
    <ContentRenderer
      v-if="hasMdcBody"
      :value="page"
    />
    <!-- Frontmatter sections: legacy format (backward compat during migration) -->
    <PageRenderer
      v-else-if="page?.sections"
      :sections="page.sections"
    />
    <!-- Prose fallback -->
    <div v-else-if="page" class="container-page section-padding">
      <ContentRenderer :value="page" />
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

// Detect if page has MDC body content (array of AST nodes)
// In Nuxt Content v3, body is an AST object with type 'root' and children array
const hasMdcBody = computed(() => {
  const body = page.value?.body
  if (!body) return false
  // body.children exists and has at least one non-empty node
  return Array.isArray(body.children) && body.children.length > 0
})

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
</script>
