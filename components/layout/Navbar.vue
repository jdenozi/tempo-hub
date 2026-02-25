<template>
  <nav class="hidden md:flex items-center gap-8">
    <template v-for="item in items" :key="item.to">
      <!-- Item with dropdown -->
      <div
        v-if="item.children?.length"
        class="relative"
        @mouseenter="openDropdown = item.to"
        @mouseleave="openDropdown = null"
      >
        <NuxtLinkLocale
          :to="item.to"
          class="text-sm font-medium text-gray-300 transition-colors duration-default hover:text-primary-500 inline-flex items-center gap-1"
          active-class="text-primary-500"
        >
          {{ $te(item.label) ? $t(item.label) : item.label }}
          <svg class="w-3.5 h-3.5 transition-transform" :class="{ 'rotate-180': openDropdown === item.to }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </NuxtLinkLocale>

        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <div
            v-if="openDropdown === item.to"
            class="absolute top-full left-0 mt-1 min-w-[220px] bg-secondary-900/95 backdrop-blur-md border border-white/10 rounded-card shadow-lg py-2"
          >
            <NuxtLinkLocale
              v-for="child in item.children"
              :key="child.to"
              :to="child.to"
              class="block px-4 py-2.5 text-sm text-gray-300 transition-colors hover:text-primary-500 hover:bg-white/5"
              active-class="text-primary-500"
            >
              {{ $te(child.label) ? $t(child.label) : child.label }}
            </NuxtLinkLocale>
          </div>
        </Transition>
      </div>

      <!-- Simple item -->
      <NuxtLinkLocale
        v-else
        :to="item.to"
        class="text-sm font-medium text-gray-300 transition-colors duration-default hover:text-primary-500"
        active-class="text-primary-500"
      >
        {{ $te(item.label) ? $t(item.label) : item.label }}
      </NuxtLinkLocale>
    </template>
  </nav>

  <!-- Mobile menu button -->
  <button
    class="md:hidden p-2 -mr-2 text-gray-300"
    aria-label="Toggle menu"
    @click="$emit('toggle-menu')"
  >
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>
</template>

<script setup lang="ts">
export interface NavItem {
  label: string
  to: string
  children?: NavItem[]
}

withDefaults(defineProps<{
  items?: NavItem[]
}>(), {
  items: () => [
    { label: 'nav.home', to: '/' },
    { label: 'nav.services', to: '/services' },
    { label: 'nav.contact', to: '/contact' },
  ],
})

defineEmits<{
  'toggle-menu': []
}>()

const openDropdown = ref<string | null>(null)
</script>
