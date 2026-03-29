<template>
  <div class="min-h-screen relative">
    <Navbar v-if="authStore.isAuthenticated" />
    <main>
      <router-view />
    </main>
    <TempoBot v-if="authStore.isAuthenticated" />

    <!-- Version footer -->
    <div class="fixed bottom-4 right-4 text-xs text-gray-400 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm z-40">
      v{{ version }} · par <span class="font-medium text-primary-500">gratonbaveur</span>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth'
import Navbar from './components/Navbar.vue'
import TempoBot from './components/TempoBot.vue'

const authStore = useAuthStore()
const version = '2.1.0'
</script>
