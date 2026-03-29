<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <img src="/logo.png" alt="TempoHub" class="w-24 h-24 rounded-full object-cover mx-auto shadow-lg border-4 border-white" />
        <h2 class="mt-6 text-3xl font-extrabold text-primary-600">TempoHub</h2>
        <p class="mt-2 text-sm text-gray-500">Connectez-vous à votre compte</p>
      </div>

      <div class="mt-8 space-y-6">
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {{ error }}
        </div>

        <button
          @click="loginWithAuthentik"
          class="w-full flex justify-center items-center gap-3 py-4 px-4 border-b-4 border-primary-700 rounded-xl shadow-sm text-lg font-bold text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 btn-bounce"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
          Se connecter avec Authentik
        </button>

        <p class="text-center text-sm text-gray-500">
          Pas encore de compte ? Contactez un administrateur.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const error = ref('')

onMounted(() => {
  if (route.query.error) {
    error.value = "Erreur d'authentification. Veuillez réessayer."
  }
})

function loginWithAuthentik() {
  authStore.loginWithOIDC()
}
</script>
