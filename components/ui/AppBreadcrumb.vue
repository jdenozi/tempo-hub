<template>
  <nav v-if="items.length > 1" aria-label="Fil d'Ariane" class="py-3">
    <ol class="flex flex-wrap items-center gap-1.5 text-sm">
      <li v-for="(item, index) in items" :key="index" class="flex items-center gap-1.5">
        <span v-if="index > 0" class="text-white/20" aria-hidden="true">/</span>
        <NuxtLink
          v-if="item.to && index < items.length - 1"
          :to="localePath(item.to)"
          class="text-white/50 hover:text-white/80 transition-colors"
        >
          {{ item.label }}
        </NuxtLink>
        <span v-else class="text-white/70" aria-current="page">
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
export interface BreadcrumbItem {
  label: string
  to?: string
}

const props = defineProps<{
  items: BreadcrumbItem[]
}>()

const localePath = useLocalePath()

// Schema.org BreadcrumbList structured data
useSchemaOrg([
  defineBreadcrumb({
    itemListElement: props.items.map((item, index) => ({
      position: index + 1,
      name: item.label,
      ...(item.to && index < props.items.length - 1 ? { item: item.to } : {}),
    })),
  }),
])
</script>
