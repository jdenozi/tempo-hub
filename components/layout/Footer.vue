<template>
  <footer class="relative overflow-hidden border-t border-primary-500/20">
    <div class="absolute inset-0 footer-bg" />
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-primary-500/40 to-transparent" />

    <div class="relative z-10 container-page py-6">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-xs text-gray-600">
          &copy; {{ currentYear }} {{ client.name }} &mdash; {{ $t('footer.rights') }}
        </p>
        <div class="flex items-center gap-4 text-xs text-gray-600">
          <a v-if="contact.email" :href="`mailto:${contact.email}`" class="hover:text-primary-500 transition-colors">
            {{ contact.email }}
          </a>
          <a
            v-for="(url, platform) in activeSocials"
            :key="platform"
            :href="url"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-primary-500 transition-colors capitalize"
          >
            {{ platform }}
          </a>
        </div>
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

<style scoped>
.footer-bg {
  background: linear-gradient(180deg, #150a20 0%, #0e0616 40%, #0a0410 100%);
}
</style>
