<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-8">Mon profil</h1>

    <div class="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
      <form @submit.prevent="handleUpdate" class="space-y-6">
        <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          Profil mis à jour
        </div>
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {{ error }}
        </div>

        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            Nouveau mot de passe
            <span class="text-gray-400 font-normal">(laisser vide pour ne pas changer)</span>
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
            placeholder="••••••••"
          />
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </form>
    </div>

    <div class="mt-8 bg-white shadow-sm rounded-xl border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Informations du compte</h2>
      <dl class="space-y-3">
        <div class="flex justify-between">
          <dt class="text-gray-500">Rôle</dt>
          <dd class="text-gray-900 font-medium">
            <span
              :class="authStore.isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'"
              class="px-2 py-1 rounded-full text-xs"
            >
              {{ authStore.user?.role }}
            </span>
          </dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-gray-500">Membre depuis</dt>
          <dd class="text-gray-900">{{ formatDate(authStore.user?.created_at) }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const form = reactive({
  username: authStore.user?.username || '',
  email: authStore.user?.email || '',
  password: ''
})

const loading = ref(false)
const error = ref('')
const success = ref(false)

async function handleUpdate() {
  error.value = ''
  success.value = false
  loading.value = true

  try {
    const data = {}
    if (form.username !== authStore.user?.username) data.username = form.username
    if (form.email !== authStore.user?.email) data.email = form.email
    if (form.password) data.password = form.password

    if (Object.keys(data).length > 0) {
      await authStore.updateProfile(data)
      form.password = ''
      success.value = true
    }
  } catch (err) {
    error.value = err.response?.data?.detail || 'Erreur lors de la mise à jour'
  } finally {
    loading.value = false
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
