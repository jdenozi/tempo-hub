<template>
  <section class="section-padding gradient-section">
    <div class="container-page">
      <div class="text-center mb-12 md:mb-16">
        <h2 class="text-hero text-white text-glow">{{ title }}</h2>
        <p v-if="subtitle" class="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
          {{ subtitle }}
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
        <UiCard
          v-for="(plan, i) in plans"
          :key="i"
          :class="[plan.highlighted ? 'glow-gold scale-[1.02]' : 'hover-lift']"
        >
          <div class="space-y-4">
            <h3 class="font-heading text-xl font-semibold text-white">
              {{ plan.name }}
            </h3>
            <div class="flex items-baseline gap-1">
              <span class="text-4xl font-bold text-primary-500 text-glow-subtle">{{ plan.price }}</span>
              <span v-if="plan.period" class="text-sm text-primary-500/70">/ {{ plan.period }}</span>
            </div>
            <p v-if="plan.description" class="text-sm text-gray-300">
              {{ plan.description }}
            </p>
            <ul class="space-y-2 pt-2">
              <li v-for="(feature, j) in plan.features" :key="j" class="flex items-start gap-2 text-sm">
                <UiIcon name="check" size="sm" class="text-primary-500 mt-0.5 shrink-0 drop-shadow-[0_0_4px_rgba(212,168,83,0.3)]" />
                <span class="text-gray-300">{{ feature }}</span>
              </li>
            </ul>
            <UiButton
              :to="plan.ctaLink"
              :variant="plan.highlighted ? 'primary' : 'outline'"
              class="w-full mt-4"
            >
              {{ plan.ctaText || 'Choisir' }}
            </UiButton>
          </div>
        </UiCard>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
export interface PricingPlan {
  name: string
  price: string
  period?: string
  description?: string
  features: string[]
  ctaText?: string
  ctaLink?: string
  highlighted?: boolean
}

withDefaults(defineProps<{
  title: string
  subtitle?: string
  plans?: PricingPlan[]
}>(), {
  subtitle: '',
  plans: () => [],
})
</script>
