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

// Query pages from content to build dynamic nav
const { data: pages } = await useAsyncData(`nav-pages-${locale.value}`, () =>
  queryCollection('pages')
    .where('path', 'LIKE', `/${locale.value}/pages/%`)
    .order('order', 'ASC')
    .all()
)

const dynamicNavItems = computed<NavItem[]>(() => {
  const items: NavItem[] = [{ label: 'nav.home', to: '/' }]

  if (pages.value) {
    const prefix = `/${locale.value}/pages`

    // Separate root pages and child pages
    const rootPages: typeof pages.value = []
    const childPages: typeof pages.value = []

    for (const page of pages.value) {
      if (page.showInNav === false) continue
      const relativePath = page.path.replace(prefix, '')
      // Count slashes: /services = 1 slash (root), /services/site-vitrine = 2 slashes (child)
      const depth = relativePath.split('/').length - 1
      if (depth <= 1) {
        rootPages.push(page)
      } else {
        childPages.push(page)
      }
    }

    for (const page of rootPages) {
      const routePath = page.path.replace(prefix, '') || '/'
      const navItem: NavItem = {
        label: page.navLabel || page.title,
        to: routePath,
      }

      // Find children matching this parent path
      const children = childPages
        .filter(child => child.path.startsWith(page.path + '/'))
        .map(child => ({
          label: child.navLabel || child.title,
          to: child.path.replace(prefix, ''),
        }))

      if (children.length > 0) {
        navItem.children = children
      }

      items.push(navItem)
    }
  }

  // Always add contact at the end
  items.push({ label: 'nav.blog', to: '/blog' })

  items.push({ label: 'nav.contact', to: '/contact' })

  return items
})

const route = useRoute()
watch(() => route.path, () => {
  mobileOpen.value = false
})
</script>
