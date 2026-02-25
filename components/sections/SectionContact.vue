<template>
  <section class="section-padding gradient-section">
    <div class="container-page">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
        <!-- Info side -->
        <div class="space-y-6">
          <h2 class="text-hero text-white text-glow">{{ title }}</h2>
          <p v-if="subtitle" class="text-lg text-gray-300">
            {{ subtitle }}
          </p>
          <div class="space-y-4 pt-4">
            <div v-if="contactInfo.email" class="flex items-center gap-3">
              <UiIcon name="mail" size="md" class="text-primary-500 drop-shadow-[0_0_6px_rgba(212,168,83,0.3)]" />
              <a :href="`mailto:${contactInfo.email}`" class="text-gray-300 hover:text-primary-500 transition-colors">
                {{ contactInfo.email }}
              </a>
            </div>
            <div v-if="contactInfo.phone" class="flex items-center gap-3">
              <UiIcon name="phone" size="md" class="text-primary-500 drop-shadow-[0_0_6px_rgba(212,168,83,0.3)]" />
              <a :href="`tel:${contactInfo.phone}`" class="text-gray-300 hover:text-primary-500 transition-colors">
                {{ contactInfo.phone }}
              </a>
            </div>
            <div v-if="contactInfo.address" class="flex items-start gap-3">
              <UiIcon name="map-pin" size="md" class="text-primary-500 mt-0.5 drop-shadow-[0_0_6px_rgba(212,168,83,0.3)]" />
              <span class="text-gray-300">{{ contactInfo.address }}</span>
            </div>
          </div>

          <!-- Cal.com embed if configured -->
          <IntegrationsCalEmbed v-if="calcom.username" class="mt-8" />
        </div>

        <!-- Form side -->
        <div class="glass-card p-6">
          <IntegrationsContactForm :show-phone="showPhone" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  subtitle?: string
  showPhone?: boolean
}>(), {
  subtitle: '',
  showPhone: true,
})

const { contact: contactInfo, calcom } = useClientConfig()
</script>
