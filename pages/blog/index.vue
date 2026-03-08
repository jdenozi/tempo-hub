<template>
  <div class="blog-index">
    <!-- Hero banner -->
    <section class="relative overflow-hidden py-20 sm:py-28">
      <!-- Background glow -->
      <div class="absolute inset-0 pointer-events-none" style="background: radial-gradient(ellipse at 50% 0%, rgba(212,168,83,0.08) 0%, transparent 60%)" />
      <div class="container-page relative z-10 text-center">
        <p class="text-[0.65rem] sm:text-xs uppercase tracking-[0.5em] text-[#d4a853]/70 mb-4 font-light">Tempo Hub</p>
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-white mb-4">{{ $t('blog.title') }}</h1>
        <div class="w-20 h-px bg-gradient-to-r from-transparent via-[#d4a853] to-transparent mx-auto mb-6" />
        <p class="text-gray-400 text-base sm:text-lg max-w-xl mx-auto font-light">
          Insights, comparatifs et conseils pour propulser votre présence en ligne.
        </p>
      </div>
    </section>

    <!-- Articles grid -->
    <section class="container-page pb-20 sm:pb-28">
      <div v-if="articles?.length" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="(article, i) in articles"
          :key="article.path"
          :to="localePath(article.path?.replace(`/${locale}/blog`, '/blog') || '#')"
          class="group"
        >
          <article class="blog-card h-full flex flex-col" :class="i === 0 && articles.length > 2 ? 'md:col-span-2 lg:col-span-1' : ''">
            <!-- Image -->
            <div v-if="article.image" class="relative overflow-hidden rounded-t-lg">
              <img
                :src="article.image"
                :alt="article.title"
                width="600"
                height="280"
                loading="lazy"
                class="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
              >
              <div class="absolute inset-0 bg-gradient-to-t from-[#0e0616]/80 via-transparent to-transparent" />
            </div>

            <!-- Content -->
            <div class="flex-1 p-6 flex flex-col">
              <!-- Date badge -->
              <time
                v-if="article.date"
                class="inline-flex items-center gap-1.5 text-[0.7rem] uppercase tracking-widest text-[#d4a853]/60 font-light mb-3"
              >
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                {{ formatDate(article.date, locale) }}
              </time>

              <!-- Title -->
              <h2 class="text-lg sm:text-xl font-heading font-semibold text-white mb-3 leading-snug group-hover:text-[#d4a853] transition-colors duration-300">
                {{ article.title }}
              </h2>

              <!-- Description -->
              <p v-if="article.description" class="text-gray-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                {{ article.description }}
              </p>

              <!-- Read more -->
              <span class="inline-flex items-center gap-1.5 text-[#d4a853] text-sm font-medium group-hover:gap-2.5 transition-all duration-300">
                Lire l'article
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </div>
          </article>
        </NuxtLink>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-20">
        <p class="text-gray-500 text-lg">{{ $t('common.loading') }}</p>
      </div>
    </section>
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

<style scoped>
.blog-card {
  background: rgba(14, 6, 22, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(212, 168, 83, 0.08);
  border-radius: 0.75rem;
  overflow: hidden;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}

.blog-card:hover {
  border-color: rgba(212, 168, 83, 0.25);
  box-shadow: 0 0 30px rgba(212, 168, 83, 0.08), 0 8px 32px rgba(0, 0, 0, 0.3);
  transform: translateY(-4px);
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
