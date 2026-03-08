<template>
  <div class="container-page section-padding">
    <h1 class="text-4xl font-bold mb-8 text-white">{{ $t('blog.title') }}</h1>

    <div v-if="articles?.length" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="article in articles"
        :key="article.path"
        :to="localePath(article.path?.replace(`/${locale}/blog`, '/blog') || '#')"
        class="group"
      >
        <div class="glass-card p-6 h-full transition-all duration-300 hover:border-primary-500/30">
          <img
            v-if="article.image"
            :src="article.image"
            :alt="article.title"
            width="400"
            height="192"
            loading="lazy"
            class="w-full h-48 object-cover rounded-lg mb-4"
          >
          <h2 class="text-xl font-semibold mb-2 text-white group-hover:text-primary-400 transition-colors">
            {{ article.title }}
          </h2>
          <p v-if="article.description" class="text-gray-400 mb-3">
            {{ article.description }}
          </p>
          <time
            v-if="article.date"
            class="text-sm text-gray-500"
          >
            {{ $t('blog.published') }} {{ formatDate(article.date, locale) }}
          </time>
        </div>
      </NuxtLink>
    </div>

    <p v-else class="text-gray-400">
      {{ $t('common.loading') }}
    </p>
  </div>
</template>

<script setup lang="ts">
const { locale, t } = useI18n()
const localePath = useLocalePath()

const { data: articles } = await useAsyncData(`blog-list-${locale.value}`, () =>
  queryCollection('blog')
    .where('path', 'LIKE', `/${locale.value}/blog/%`)
    .order('date', 'DESC')
    .all()
)

useHead({
  title: t('blog.title'),
})

useSeoMeta({
  ogImage: '/og-image.jpg',
})
</script>
