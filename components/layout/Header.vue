<template>
  <header class="sticky top-0 z-50 bg-secondary-950/80 backdrop-blur-xl border-b border-primary-500/10">
    <div class="container-page flex items-center justify-between h-16 md:h-20">
      <!-- Logo / Site name -->
      <NuxtLinkLocale to="/" class="flex items-center gap-3">
        <img
          v-if="client.logo"
          :src="client.logo"
          :alt="client.name"
          width="40"
          height="40"
          class="h-8 md:h-10 w-auto"
        >
        <span class="font-heading text-lg font-semibold text-primary-500 text-glow-subtle">
          {{ client.name }}
        </span>
      </NuxtLinkLocale>

      <!-- Desktop nav + lang + CTA -->
      <div class="flex items-center gap-6">
        <LayoutNavbar :items="dynamicNavItems" @toggle-menu="mobileOpen = !mobileOpen" />
        <LayoutLangSwitcher class="hidden md:block" />
        <UiButton v-if="ctaLabel" :to="ctaTo" size="sm">
          {{ ctaLabel }}
        </UiButton>
      </div>
    </div>

    <!-- Mobile menu overlay -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="mobileOpen" class="md:hidden border-b border-primary-500/10 bg-secondary-950/98 backdrop-blur-xl">
        <nav class="container-page py-4 flex flex-col gap-1">
          <template v-for="item in dynamicNavItems" :key="item.to">
            <NuxtLinkLocale
              :to="item.to"
              class="text-sm font-medium py-2 text-gray-300 transition-colors hover:text-primary-500"
              active-class="text-primary-500"
              @click="mobileOpen = false"
            >
              {{ $te(item.label) ? $t(item.label) : item.label }}
            </NuxtLinkLocale>
            <!-- Mobile sub-items indented -->
            <NuxtLinkLocale
              v-for="child in item.children"
              :key="child.to"
              :to="child.to"
              class="text-sm font-medium py-2 pl-4 text-gray-400 transition-colors hover:text-primary-500"
              active-class="text-primary-500"
              @click="mobileOpen = false"
            >
              {{ $te(child.label) ? $t(child.label) : child.label }}
            </NuxtLinkLocale>
          </template>
          <div class="pt-2 border-t border-white/10">
            <LayoutLangSwitcher />
          </div>
          <UiButton v-if="ctaLabel" :to="ctaTo" size="sm" class="mt-2 w-full">
            {{ ctaLabel }}
          </UiButton>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import type { NavItem } from '../../tempo-core/components/layout/Navbar.vue'

withDefaults(defineProps<{
  ctaLabel?: string
  ctaTo?: string
}>(), {
  ctaLabel: '',
  ctaTo: '/contact',
})

const { locale } = useI18n()
const { client } = useClientConfig()
const mobileOpen = ref(false)

// Fetch nav pages from Strapi
const { find } = useStrapi()
const { data: strapiPages } = await useAsyncData(`nav-pages-strapi-${locale.value}`, async () => {
  try {
    // @ts-expect-error — @nuxtjs/strapi v5 type limitations
    const res = await find('pages', {
      filters: { showInNav: { $eq: true } },
      sort: 'order:asc',
      fields: ['slug', 'navLabel', 'title', 'order', 'showInNav'],
      pagination: { pageSize: 50 },
    })
    return res?.data ?? []
  } catch {
    return []
  }
})

const dynamicNavItems = computed<NavItem[]>(() => {
  const items: NavItem[] = [{ label: 'nav.home', to: '/' }]

  if (strapiPages.value) {
    // Separate root pages and child pages based on slug depth
    const rootPages: typeof strapiPages.value = []
    const childPages: typeof strapiPages.value = []

    for (const page of strapiPages.value) {
      if (!page.showInNav) continue
      // Slug depth: "services" = 0 slashes (root), "services/site-vitrine" = 1 slash (child)
      const slashCount = (page.slug?.split('/').length ?? 1) - 1
      if (slashCount === 0) {
        rootPages.push(page)
      } else {
        childPages.push(page)
      }
    }

    for (const page of rootPages) {
      const navItem: NavItem = {
        label: page.navLabel || page.title,
        to: `/${page.slug}`,
      }

      // Find children whose slug starts with this parent's slug
      const children = childPages
        .filter(child => child.slug?.startsWith(page.slug + '/'))
        .map(child => ({
          label: child.navLabel || child.title,
          to: `/${child.slug}`,
        }))

      if (children.length > 0) {
        navItem.children = children
      }

      items.push(navItem)
    }
  }

  items.push({ label: 'nav.blog', to: '/blog' })

  return items
})

const route = useRoute()
watch(() => route.path, () => {
  mobileOpen.value = false
})
</script>
