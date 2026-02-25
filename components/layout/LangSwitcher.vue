<template>
  <div class="relative">
    <button
      class="flex items-center gap-1.5 text-sm font-medium text-gray-300 transition-colors hover:text-primary-500"
      @click="open = !open"
    >
      {{ currentLocale?.code?.toUpperCase() }}
      <UiIcon name="chevron-down" size="sm" :class="open && 'rotate-180'" class="transition-transform" />
    </button>
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="open"
        class="absolute right-0 top-full mt-2 bg-secondary-900 border border-white/10 rounded-card shadow-lg overflow-hidden min-w-[120px] z-50"
      >
        <button
          v-for="loc in availableLocales"
          :key="loc.code"
          class="w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-white/5 transition-colors"
          :class="loc.code === locale && 'text-primary-500 font-medium'"
          @click="switchTo(loc.code)"
        >
          {{ loc.name }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const open = ref(false)

const currentLocale = computed(() =>
  locales.value.find(l => (typeof l === 'string' ? l : l.code) === locale.value),
)

const availableLocales = computed(() =>
  locales.value.filter(l => typeof l !== 'string') as { code: string; name: string }[],
)

function switchTo(code: string) {
  setLocale(code)
  open.value = false
}

// Close on click outside
if (import.meta.client) {
  const handleClick = (e: Event) => {
    if (!(e.target as HTMLElement).closest('.relative')) {
      open.value = false
    }
  }
  onMounted(() => document.addEventListener('click', handleClick))
  onBeforeUnmount(() => document.removeEventListener('click', handleClick))
}
</script>
