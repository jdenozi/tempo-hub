<template>
  <footer class="gradient-section-alt text-gray-400 border-t border-primary-500/10">
    <div class="container-page py-12 md:py-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <!-- Brand -->
        <div class="space-y-4">
          <span class="font-heading text-lg font-semibold text-primary-500 text-glow-subtle">
            {{ client.name }}
          </span>
          <p class="text-sm leading-relaxed text-gray-400">
            {{ client.profession }}
          </p>
        </div>

        <!-- Contact -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-white uppercase tracking-wider">
            {{ $t('contact.title') }}
          </h3>
          <ul class="space-y-2 text-sm">
            <li v-if="contact.email">
              <a :href="`mailto:${contact.email}`" class="text-gray-400 hover:text-primary-500 transition-colors">
                {{ contact.email }}
              </a>
            </li>
            <li v-if="contact.phone">
              <a :href="`tel:${contact.phone}`" class="text-gray-400 hover:text-primary-500 transition-colors">
                {{ contact.phone }}
              </a>
            </li>
            <li v-if="contact.address" class="text-gray-500">
              {{ contact.address }}
            </li>
          </ul>
        </div>

        <!-- Social -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-white uppercase tracking-wider">
            {{ $t('footer.social') }}
          </h3>
          <div class="flex gap-4">
            <a
              v-for="(url, platform) in activeSocials"
              :key="platform"
              :href="url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 hover:text-primary-500 transition-colors capitalize text-sm"
            >
              {{ platform }}
            </a>
          </div>
          <p v-if="Object.keys(activeSocials).length === 0" class="text-sm text-gray-600">
            —
          </p>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="mt-12 pt-8 border-t border-primary-500/10 text-center text-xs text-gray-600">
        &copy; {{ currentYear }} {{ client.name }} — {{ $t('footer.rights') }}
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { client, contact, social } = useClientConfig()
const currentYear = new Date().getFullYear()

const activeSocials = computed(() => {
  const entries = Object.entries(social.value).filter(([, url]) => url != null)
  return Object.fromEntries(entries)
})
</script>
