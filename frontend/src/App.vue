<template>
  <div class="min-h-screen">
    <Navbar v-if="authStore.isAuthenticated" />
    <main>
      <router-view />
    </main>
    <TempoBot v-if="authStore.isAuthenticated" />
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth'
import Navbar from './components/Navbar.vue'
import TempoBot from './components/TempoBot.vue'

const authStore = useAuthStore()
</script>
