<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Services</h1>
        <p class="text-gray-600">Gérer les services disponibles</p>
      </div>
      <div class="flex gap-4">
        <router-link
          to="/admin"
          class="text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          <ArrowLeft class="w-4 h-4" />
          Retour
        </router-link>
        <button
          @click="openAddModal"
          class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Plus class="w-4 h-4" />
          Ajouter
        </button>
      </div>
    </div>

    <div class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Public</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actif</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="service in services" :key="service.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="font-medium text-gray-900">{{ service.display_name }}</div>
              <div class="text-sm text-gray-500">{{ service.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <a :href="service.url" target="_blank" class="text-primary-600 hover:underline">
                {{ service.url }}
              </a>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                {{ service.type }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button
                @click="togglePublic(service)"
                :class="service.is_public ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ service.is_public ? 'Oui' : 'Non' }}
              </button>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button
                @click="toggleActive(service)"
                :class="service.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ service.is_active ? 'Actif' : 'Inactif' }}
              </button>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <button
                @click="deleteService(service)"
                class="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Add Service -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-semibold">Ajouter un service</h3>
          <button @click="showAddModal = false" class="text-gray-400 hover:text-gray-600">
            <X class="w-5 h-5" />
          </button>
        </div>
        <form @submit.prevent="addService" class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nom (slug)</label>
            <input v-model="newService.name" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="mon-service" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Nom affiché</label>
            <input v-model="newService.display_name" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Mon Service" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">URL</label>
            <input v-model="newService.url" type="url" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="https://..." />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <input v-model="newService.description" type="text" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Icône</label>
            <select v-model="newService.icon" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="cloud">Cloud</option>
              <option value="lock">Lock</option>
              <option value="play-circle">Play</option>
              <option value="git-branch">Git</option>
              <option value="calendar">Calendar</option>
              <option value="dollar-sign">Dollar</option>
              <option value="bar-chart-2">Chart</option>
            </select>
          </div>
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2">
              <input v-model="newService.is_public" type="checkbox" class="rounded" />
              <span class="text-sm text-gray-700">Public</span>
            </label>
          </div>
          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showAddModal = false" class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              Annuler
            </button>
            <button type="submit" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ArrowLeft, Plus, X } from 'lucide-vue-next'
import api from '../api'

const services = ref([])
const showAddModal = ref(false)
const newService = reactive({
  name: '',
  display_name: '',
  url: '',
  description: '',
  icon: 'cloud',
  is_public: false
})

onMounted(async () => {
  await loadServices()
})

async function loadServices() {
  const res = await api.get('/api/services/all')
  services.value = res.data
}

function openAddModal() {
  Object.assign(newService, {
    name: '',
    display_name: '',
    url: '',
    description: '',
    icon: 'cloud',
    is_public: false
  })
  showAddModal.value = true
}

async function addService() {
  await api.post('/api/services', newService)
  showAddModal.value = false
  await loadServices()
}

async function togglePublic(service) {
  await api.patch(`/api/services/${service.id}`, { is_public: !service.is_public })
  service.is_public = !service.is_public
}

async function toggleActive(service) {
  await api.patch(`/api/services/${service.id}`, { is_active: !service.is_active })
  service.is_active = !service.is_active
}

async function deleteService(service) {
  if (confirm(`Supprimer ${service.display_name} ?`)) {
    await api.delete(`/api/services/${service.id}`)
    await loadServices()
  }
}
</script>
