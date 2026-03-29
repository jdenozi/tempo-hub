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

    <div v-else-if="services.length === 0" class="text-center py-12">
      <p class="text-gray-500">Aucun service disponible</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <ServiceCard
        v-for="service in services"
        :key="service.id"
        :service="service"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../api'
import ServiceCard from '../components/ServiceCard.vue'

const authStore = useAuthStore()
const services = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await api.get('/api/services')
    services.value = response.data
  } catch (error) {
    console.error('Error loading services:', error)
  } finally {
    loading.value = false
  }
})
</script>
