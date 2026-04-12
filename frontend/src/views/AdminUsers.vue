<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Utilisateurs</h1>
        <p class="text-gray-600">Gérer les utilisateurs et leurs permissions</p>
      </div>
      <div class="flex items-center gap-4">
        <a
          href="https://auth.tempo-hub.fr/if/admin/#/identity/users"
          target="_blank"
          class="bg-primary-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 flex items-center gap-2"
        >
          <UserPlus class="w-4 h-4" />
          Créer sur Authentik
        </a>
        <router-link
          to="/admin"
          class="text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          <ArrowLeft class="w-4 h-4" />
          Retour
        </router-link>
      </div>
    </div>

    <div class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inscrit le</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div>
                <div class="font-medium text-gray-900">{{ user.username }}</div>
                <div class="text-sm text-gray-500">{{ user.email }}</div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <select
                :value="user.role"
                @change="updateRole(user, $event.target.value)"
                class="text-sm border-gray-300 rounded-md"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button
                @click="toggleActive(user)"
                :class="user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ user.is_active ? 'Actif' : 'Inactif' }}
              </button>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(user.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <button
                @click="openResetPassword(user)"
                class="text-orange-600 hover:text-orange-800 text-sm font-medium mr-4"
              >
                Reset MDP
              </button>
              <button
                @click="openPermissions(user)"
                class="text-primary-600 hover:text-primary-800 text-sm font-medium"
              >
                Permissions
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Permissions -->
    <div v-if="selectedUser" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-semibold">Permissions de {{ selectedUser.username }}</h3>
          <button @click="selectedUser = null" class="text-gray-400 hover:text-gray-600">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="px-6 py-4 max-h-96 overflow-y-auto">
          <div v-for="service in services" :key="service.id" class="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div>
              <div class="font-medium text-gray-900">{{ service.display_name }}</div>
              <div class="text-sm text-gray-500">{{ service.url }}</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                :checked="hasPermission(service.id)"
                @change="togglePermission(service.id, $event.target.checked)"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Reset Password -->
    <div v-if="resetPasswordUser" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-semibold">Reset mot de passe</h3>
          <button @click="closeResetPassword" class="text-gray-400 hover:text-gray-600">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="px-6 py-4">
          <p class="text-sm text-gray-600 mb-4">
            Réinitialiser le mot de passe SSO de <strong>{{ resetPasswordUser.username }}</strong> ({{ resetPasswordUser.email }})
          </p>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
            <input
              v-model="newPassword"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Mot de passe temporaire"
            />
          </div>
          <div class="flex justify-end gap-3">
            <button
              @click="closeResetPassword"
              class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Annuler
            </button>
            <button
              @click="resetPassword"
              :disabled="!newPassword || resetting"
              class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Key class="w-4 h-4" />
              {{ resetting ? 'En cours...' : 'Réinitialiser' }}
            </button>
          </div>
          <p v-if="resetMessage" :class="resetSuccess ? 'text-green-600' : 'text-red-600'" class="mt-3 text-sm">
            {{ resetMessage }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ArrowLeft, X, UserPlus, Key } from 'lucide-vue-next'
import api from '../api'

const users = ref([])
const services = ref([])
const selectedUser = ref(null)
const userPermissions = ref([])

// Reset password
const resetPasswordUser = ref(null)
const newPassword = ref('')
const resetting = ref(false)
const resetMessage = ref('')
const resetSuccess = ref(false)

onMounted(async () => {
  const [usersRes, servicesRes] = await Promise.all([
    api.get('/api/users'),
    api.get('/api/services/all')
  ])
  users.value = usersRes.data
  services.value = servicesRes.data
})

async function updateRole(user, role) {
  await api.patch(`/api/users/${user.id}`, { role })
  user.role = role
}

async function toggleActive(user) {
  const newStatus = !user.is_active
  await api.patch(`/api/users/${user.id}`, { is_active: newStatus })
  user.is_active = newStatus
}

async function openPermissions(user) {
  selectedUser.value = user
  const res = await api.get(`/api/permissions/user/${user.id}`)
  userPermissions.value = res.data
}

function hasPermission(serviceId) {
  return userPermissions.value.some(p => p.service_id === serviceId && p.can_access)
}

async function togglePermission(serviceId, canAccess) {
  await api.put(`/api/permissions/user/${selectedUser.value.id}/service/${serviceId}?can_access=${canAccess}`)
  // Refresh permissions
  const res = await api.get(`/api/permissions/user/${selectedUser.value.id}`)
  userPermissions.value = res.data
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR')
}

function openResetPassword(user) {
  resetPasswordUser.value = user
  newPassword.value = ''
  resetMessage.value = ''
  resetSuccess.value = false
}

function closeResetPassword() {
  resetPasswordUser.value = null
  newPassword.value = ''
  resetMessage.value = ''
}

async function resetPassword() {
  if (!newPassword.value || !resetPasswordUser.value) return

  resetting.value = true
  resetMessage.value = ''

  try {
    const res = await api.post(`/api/users/${resetPasswordUser.value.id}/reset-password`, {
      new_password: newPassword.value
    })
    resetSuccess.value = true
    resetMessage.value = res.data.message
    newPassword.value = ''
  } catch (error) {
    resetSuccess.value = false
    resetMessage.value = error.response?.data?.detail || 'Erreur lors de la réinitialisation'
  } finally {
    resetting.value = false
  }
}
</script>
