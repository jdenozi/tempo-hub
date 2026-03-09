<template>
  <NuxtLayout name="blog">
    <article v-if="article">
      <NuxtLink
        :to="localePath('/blog')"
        class="inline-flex items-center gap-1 text-primary-500 hover:text-primary-400 mb-6"
      >
        &larr; {{ $t('blog.backToList') }}
      </NuxtLink>

      <AppBreadcrumb :items="[
        { label: 'Accueil', to: '/' },
        { label: 'Blog', to: '/blog' },
        { label: article.title },
      ]" />

      <img
        v-if="article.image"
        :src="article.image"
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
        <ContentRenderer :value="article" />
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

const contentPath = `/${locale.value}/blog/${route.params.slug}`

const { data: article } = await useAsyncData(`blog-${contentPath}`, () =>
  queryCollection('blog').path(contentPath).first()
)

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found' })
}

useHead({
  title: article.value.title,
  meta: [
    { name: 'description', content: article.value.description },
  ],
})

useSeoMeta({
  ogType: 'article',
  ogImage: article.value.image || '/og-image.jpg',
  articlePublishedTime: article.value.date,
})

defineOgImage({
  component: 'NuxtSeo',
  props: {
    title: article.value.title,
    description: article.value.description,
    image: article.value.image || '/og-image.jpg',
  },
})

useSchemaOrg([
  defineArticle({
    '@type': 'BlogPosting',
    headline: article.value.title,
    description: article.value.description,
    datePublished: article.value.date,
    image: article.value.image || '/og-image.jpg',
    author: {
      '@type': 'Person',
      name: 'Jonathan Denozi',
      url: 'https://tempo-hub.fr/a-propos',
    },
    publisher: { '@id': 'https://tempo-hub.fr/#identity' },
  }),
])
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
