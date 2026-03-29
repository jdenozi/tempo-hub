<template>
  <nav class="bg-white shadow-md border-b-4 border-primary-400">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex items-center gap-3">
            <img src="/logo.png" alt="TempoHub" class="w-10 h-10 rounded-full object-cover shadow-sm" />
            <span class="font-extrabold text-2xl text-primary-600">TempoHub</span>
          </router-link>
        </div>

        <div class="flex items-center gap-4">
          <router-link
            v-if="authStore.isAdmin"
            to="/admin"
            class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
          >
            Admin
          </router-link>

          <router-link
            to="/profile"
            class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
          >
            {{ authStore.user?.username }}
          </router-link>

          <button
            @click="logout"
            class="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm"
          >
            <LogOut class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { LogOut } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>
