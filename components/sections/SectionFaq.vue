<template>
  <section class="section-padding gradient-section">
    <div class="container-page max-w-3xl mx-auto">
      <div class="text-center mb-12 md:mb-16">
        <h2 class="text-hero text-white text-glow">{{ title }}</h2>
        <p v-if="subtitle" class="mt-4 text-lg text-gray-300">
          {{ subtitle }}
        </p>
      </div>
      <div class="space-y-4">
        <div
          v-for="(item, i) in items"
          :key="i"
          class="border border-primary-500/10 bg-white/[0.02] rounded-card overflow-hidden transition-colors"
          :class="openIndex === i && 'bg-white/[0.04] border-primary-500/20'"
        >
          <button
            class="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
            @click="toggle(i)"
          >
            <span class="font-medium text-white pr-4">{{ item.question }}</span>
            <UiIcon
              name="chevron-down"
              size="sm"
              class="shrink-0 text-primary-500/60 transition-transform duration-200"
              :class="openIndex === i && 'rotate-180'"
            />
          </button>
          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="max-h-0 opacity-0"
            enter-to-class="max-h-96 opacity-100"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="max-h-96 opacity-100"
            leave-to-class="max-h-0 opacity-0"
          >
            <div v-if="openIndex === i" class="overflow-hidden">
              <p class="px-5 pb-5 text-sm text-gray-400 leading-relaxed">
                {{ item.answer }}
              </p>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
export interface FaqItem {
  question: string
  answer: string
}

const props = withDefaults(defineProps<{
  title: string
  subtitle?: string
  items?: FaqItem[]
}>(), {
  subtitle: '',
  items: () => [],
})

const openIndex = ref<number | null>(null)

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}

// FAQPage structured data for rich snippets
useSchemaOrg([
  defineWebPage({ '@type': 'FAQPage' }),
  ...(props.items ?? []).map(item =>
    defineQuestion({
      name: item.question,
      acceptedAnswer: item.answer,
    }),
  ),
])
</script>
