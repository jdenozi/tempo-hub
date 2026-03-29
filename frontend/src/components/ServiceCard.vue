<template>
  <!-- Service accessible -->
  <a
    v-if="service.is_accessible !== false"
    :href="service.url"
    target="_blank"
    rel="noopener noreferrer"
    class="block bg-white rounded-3xl border-2 border-gray-100 p-8 card-cartoon hover:border-primary-300 transition-all duration-200"
  >
    <div class="flex flex-col items-center text-center gap-4">
      <!-- Custom logo if available -->
      <img
        v-if="getCustomLogo(service.icon)"
        :src="getCustomLogo(service.icon)"
        :alt="service.display_name"
        class="w-24 h-24 rounded-2xl object-cover"
      />
      <!-- Fallback to icon -->
      <div
        v-else
        class="w-24 h-24 rounded-2xl flex items-center justify-center"
        :class="getColorClass(service.icon)"
      >
        <component :is="getIcon(service.icon)" class="w-12 h-12 text-white" />
      </div>
      <div>
        <h3 class="text-xl font-bold text-gray-800">{{ service.display_name }}</h3>
        <p class="text-sm text-gray-500 mt-2">{{ service.description }}</p>
      </div>
    </div>
  </a>

  <!-- Service inaccessible (grisé) -->
  <div
    v-else
    class="block bg-gray-100 rounded-3xl border-2 border-gray-200 p-8 opacity-60 cursor-not-allowed relative"
  >
    <div class="flex flex-col items-center text-center gap-4">
      <!-- Custom logo if available (greyscale) -->
      <img
        v-if="getCustomLogo(service.icon)"
        :src="getCustomLogo(service.icon)"
        :alt="service.display_name"
        class="w-24 h-24 rounded-2xl object-cover grayscale"
      />
      <!-- Fallback to icon (grey) -->
      <div
        v-else
        class="w-24 h-24 rounded-2xl flex items-center justify-center bg-gray-300"
      >
        <component :is="getIcon(service.icon)" class="w-12 h-12 text-gray-500" />
      </div>
      <div>
        <h3 class="text-xl font-bold text-gray-500">{{ service.display_name }}</h3>
        <p class="text-sm text-gray-400 mt-2">{{ service.description }}</p>
      </div>
    </div>
    <!-- Message Yinou -->
    <div class="absolute inset-0 flex items-center justify-center bg-white/90 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-200">
      <div class="text-center p-4">
        <span class="text-4xl">🐱</span>
        <p class="text-gray-600 font-medium mt-2">Détenu par Yinou le chat</p>
        <p class="text-xs text-gray-400 mt-1">Demandez l'accès à un admin</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  GitBranch,
  BarChart2,
  Globe,
  ExternalLink
} from 'lucide-vue-next'

defineProps({
  service: {
    type: Object,
    required: true
  }
})

// Custom logos mapping
const customLogoMap = {
  'cloud': '/icons/cloud_tempo-hub.png',
  'lock': '/icons/password_tempo-hub.png',
  'play-circle': '/icons/movie_tempo-hub.png',
  'calendar': '/icons/calendly_tempo-hub.png',
  'dollar-sign': '/icons/budget_tempo-hub.png'
}

const iconMap = {
  'git-branch': GitBranch,
  'bar-chart-2': BarChart2
}

const colorMap = {
  'git-branch': 'bg-emerald-400',
  'bar-chart-2': 'bg-indigo-400'
}

function getCustomLogo(iconName) {
  return customLogoMap[iconName] || null
}

function getIcon(iconName) {
  return iconMap[iconName] || Globe
}

function getColorClass(iconName) {
  return colorMap[iconName] || 'bg-primary-400'
}
</script>
