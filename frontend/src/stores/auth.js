import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const initialized = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function init() {
    if (token.value) {
      try {
        const response = await api.get('/api/auth/me')
        user.value = response.data
      } catch (error) {
        // Clear local state only, don't redirect to Authentik
        clearLocalAuth()
      }
    }
    initialized.value = true
  }

  async function login(email, password) {
    const params = new URLSearchParams()
    params.append('username', email)
    params.append('password', password)

    const response = await api.post('/api/auth/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    token.value = response.data.access_token
    localStorage.setItem('token', token.value)

    // Fetch user info with explicit token
    const userResponse = await api.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    user.value = userResponse.data
  }

  async function register(email, username, password) {
    await api.post('/api/auth/register', { email, username, password })
    await login(email, password)
  }

  function clearLocalAuth() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  function logout() {
    clearLocalAuth()
    // Redirect to Authentik logout
    window.location.href = '/auth/logout'
  }

  function setToken(newToken) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  async function fetchUser() {
    try {
      const response = await api.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token.value}` }
      })
      user.value = response.data
    } catch (error) {
      // Clear local state only, don't redirect to Authentik
      clearLocalAuth()
    }
  }

  function loginWithOIDC() {
    window.location.href = '/auth/login'
  }

  async function updateProfile(data) {
    const response = await api.patch('/api/users/me', data)
    user.value = response.data
  }

  return {
    user,
    token,
    initialized,
    isAuthenticated,
    isAdmin,
    init,
    login,
    loginWithOIDC,
    register,
    logout,
    setToken,
    fetchUser,
    updateProfile
  }
})
