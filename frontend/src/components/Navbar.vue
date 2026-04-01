<template>
  <nav class="bg-white shadow-md border-b-4 border-primary-400">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex items-center gap-2 sm:gap-3">
            <img src="/logo.png" alt="TempoHub" class="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shadow-sm" />
            <span class="font-extrabold text-xl sm:text-2xl text-primary-600">TempoHub</span>
          </router-link>
        </div>

        <!-- Desktop menu -->
        <div class="hidden sm:flex items-center gap-4">
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

        <!-- Mobile menu button -->
        <div class="flex sm:hidden items-center">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="text-gray-500 hover:text-gray-700 p-2"
          >
            <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" class="sm:hidden bg-white border-t border-gray-200">
      <div class="px-4 py-3 space-y-2">
        <router-link
          v-if="authStore.isAdmin"
          to="/admin"
          @click="mobileMenuOpen = false"
          class="block text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
        >
          Admin
        </router-link>

        <router-link
          to="/profile"
          @click="mobileMenuOpen = false"
          class="block text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
        >
          {{ authStore.user?.username }}
        </router-link>

        <button
          @click="logout"
          class="w-full text-left text-gray-500 hover:text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-base flex items-center gap-2"
        >
          <LogOut class="w-5 h-5" />
          Déconnexion
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { LogOut, Menu, X } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()
const mobileMenuOpen = ref(false)

function logout() {
  mobileMenuOpen.value = false
  authStore.logout()
  router.push('/login')
}
</script>
