<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 inline-block">
      <h1 class="text-3xl font-extrabold text-gray-800">
        Woof ! Bonjour {{ authStore.user?.username }} 🐕
      </h1>
      <p class="text-gray-500 mt-2 text-lg">Accédez à vos services</p>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="services.length === 0 && wordpressSites.length === 0" class="text-center py-12">
      <p class="text-gray-500">Aucun service disponible</p>
    </div>

    <div v-else>
      <!-- Services classiques -->
      <div v-if="services.length > 0" class="mb-10">
        <h2 class="text-xl font-bold text-gray-800 mb-5 flex items-center gap-3">
          <Server class="w-6 h-6" />
          Mes Services
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ServiceCard
            v-for="service in services"
            :key="service.id"
            :service="service"
          />
        </div>
      </div>

      <!-- Sites WordPress -->
      <div v-if="wordpressSites.length > 0">
        <h2 class="text-xl font-bold text-gray-800 mb-5 flex items-center gap-3">
          <Globe class="w-6 h-6" />
          Mes Sites WordPress
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ServiceCard
            v-for="service in wordpressSites"
            :key="service.id"
            :service="service"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { Server, Globe } from 'lucide-vue-next'
import api from '../api'
import ServiceCard from '../components/ServiceCard.vue'

const authStore = useAuthStore()
const allServices = ref([])
const loading = ref(true)

// Séparer les services classiques des WordPress
const services = computed(() =>
  allServices.value.filter(s => s.type !== 'wordpress' && s.is_accessible)
)

const wordpressSites = computed(() =>
  allServices.value.filter(s => s.type === 'wordpress' && s.is_accessible)
)

onMounted(async () => {
  try {
    const response = await api.get('/api/services')
    allServices.value = response.data
  } catch (error) {
    console.error('Error loading services:', error)
  } finally {
    loading.value = false
  }
})
</script>
