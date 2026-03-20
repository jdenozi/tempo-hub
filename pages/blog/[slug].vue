<template>
  <NuxtLayout name="blog">
    <article v-if="article">
      <NuxtLink
        :to="localePath('/blog')"
        class="inline-flex items-center gap-1 text-primary-500 hover:text-primary-400 mb-6"
      >
        &larr; {{ $t('blog.backToList') }}
      </NuxtLink>

      <AppBreadcrumb :items="breadcrumbItems" />

      <img
        v-if="articleImage"
        :src="articleImage"
        :alt="article.title"
        width="960"
        height="256"
        class="w-full h-64 object-cover rounded-xl mb-8"
      >

      <h1 class="text-4xl font-bold mb-4 text-white">{{ article.title }}</h1>

      <time
        v-if="article.date"
        class="block text-gray-400 mb-8"
      >
        {{ $t('blog.published') }} {{ formatDate(article.date, locale) }}
      </time>

      <div class="blog-content max-w-none">
        <!-- Strapi article: render markdown content -->
        <StrapiMarkdown v-if="article.content" :content="article.content" />
      </div>
    </article>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const { locale } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const slug = route.params.slug as string

// --- Data sources ---

// Strapi CMS
const { article, pending } = useStrapiBlogArticle(slug)

// Resolve image URL (Strapi media object vs Content string)
const articleImage = computed(() => {
  const img = article.value?.image
  if (!img) return null
  if (typeof img === 'object' && img.url) return img.url
  if (typeof img === 'string') return img
  return null
})

// --- 404 ---
if (!article.value && !pending.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found' })
}

// --- SEO ---
const { breadcrumbItems } = useBlogArticleSeo(article)
</script>

<style scoped>
.blog-content {
  color: #f0ecf5;
  font-size: 1.125rem;
  line-height: 1.8;
}

.blog-content :deep(h2) {
  color: #ffffff;
  font-size: 1.75rem;
  font-weight: 700;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
}

.blog-content :deep(h3) {
  color: #ffffff;
  font-size: 1.35rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.blog-content :deep(p) {
  margin-bottom: 1.25rem;
}

.blog-content :deep(a) {
  color: #e8c06a;
  text-decoration: underline;
}

.blog-content :deep(a:hover) {
  color: #d4a853;
}

.blog-content :deep(strong) {
  color: #ffffff;
}

.blog-content :deep(ul),
.blog-content :deep(ol) {
  margin-bottom: 1.25rem;
  padding-left: 1.5rem;
}

.blog-content :deep(li) {
  margin-bottom: 0.5rem;
  color: #e0dae8;
}

.blog-content :deep(li::marker) {
  color: #c8b8d8;
}

.blog-content :deep(blockquote) {
  border-left: 3px solid #d4a853;
  padding-left: 1rem;
  color: #e0dae8;
  font-style: italic;
}

.blog-content :deep(code) {
  color: #e8c06a;
  background: #1a0e2a;
  padding: 0.15rem 0.4rem;
  border-radius: 3px;
  font-size: 0.9em;
}

.blog-content :deep(pre) {
  background: #1a0e2a;
  border: 1px solid #3a2558;
  border-radius: 6px;
  padding: 1.25rem;
  overflow-x: auto;
  margin-bottom: 1.5rem;
}

.blog-content :deep(pre code) {
  background: none;
  padding: 0;
  color: #f0ecf5;
}

.blog-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}

.blog-content :deep(th) {
  color: #ffffff;
  background: #1a0e2a;
  font-weight: 600;
  text-align: left;
  padding: 0.75rem 1rem;
  border-bottom: 2px solid #d4a853;
}

.blog-content :deep(td) {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #3a2558;
  color: #e0dae8;
}

.blog-content :deep(tr:hover td) {
  background: rgba(212, 168, 83, 0.05);
}

.blog-content :deep(hr) {
  border-color: #3a2558;
  margin: 2rem 0;
}
</style>
