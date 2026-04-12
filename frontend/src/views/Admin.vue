<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-8">Administration</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link
        to="/admin/users"
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-primary-300 transition-all"
      >
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">Utilisateurs</h3>
            <p class="text-sm text-gray-500">{{ stats.users }} utilisateurs</p>
          </div>
        </div>
      </router-link>

      <router-link
        to="/admin/services"
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-primary-300 transition-all"
      >
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Server class="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">Services</h3>
            <p class="text-sm text-gray-500">{{ stats.services }} services</p>
          </div>
        </div>
      </router-link>

      <router-link
        to="/admin/wordpress"
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-primary-300 transition-all"
      >
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Globe class="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">WordPress</h3>
            <p class="text-sm text-gray-500">{{ stats.wordpress }} site(s)</p>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Users, Server, Globe } from 'lucide-vue-next'
import api from '../api'

const stats = ref({
  users: 0,
  services: 0,
  wordpress: 0
})

onMounted(async () => {
  try {
    const [usersRes, servicesRes, wordpressRes] = await Promise.all([
      api.get('/api/users'),
      api.get('/api/services/all'),
      api.get('/api/wordpress/sites')
    ])
    stats.value.users = usersRes.data.length
    stats.value.services = servicesRes.data.length
    stats.value.wordpress = wordpressRes.data.length
  } catch (error) {
    console.error('Error loading stats:', error)
  }
})
</script>
