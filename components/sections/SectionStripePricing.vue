<template>
  <section class="section-padding gradient-section-alt">
    <div class="container-page">
      <h2 v-if="title" class="text-3xl md:text-4xl font-heading font-bold text-center text-white mb-4 text-glow">
        {{ title }}
      </h2>
      <p v-if="subtitle" class="text-center text-gray-300 max-w-2xl mx-auto mb-12">
        {{ subtitle }}
      </p>
      <ClientOnly>
        <div class="space-y-16">
          <div v-for="(table, i) in tables" :key="i">
            <h3 v-if="table.label" class="text-xl font-heading font-semibold text-primary-500 text-center mb-6 text-glow-subtle">
              {{ table.label }}
            </h3>
            <div class="glass-card p-4">
              <stripe-pricing-table
                :pricing-table-id="table.pricingTableId"
                :publishable-key="publishableKey"
              />
            </div>
          </div>
        </div>
      </ClientOnly>
    </div>
  </section>
</template>

<script setup lang="ts">
const { publishableKey } = useStripeConfig()

useHead({
  script: [
    { src: 'https://js.stripe.com/v3/pricing-table.js', async: true },
  ],
})

defineProps<{
  title?: string
  subtitle?: string
  tables: Array<{
    pricingTableId: string
    label?: string
  }>
}>()
</script>
