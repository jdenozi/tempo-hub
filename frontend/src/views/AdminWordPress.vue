<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Sites WordPress</h1>
        <p class="text-gray-600">Gestion des instances WordPress détectées</p>
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
          @click="scanWordPress"
          :disabled="scanning"
          class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': scanning }" />
          {{ scanning ? 'Scan en cours...' : 'Re-scanner' }}
        </button>
      </div>
    </div>

    <!-- Résultat du scan -->
    <div v-if="scanResult" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <div class="flex items-center gap-2 text-green-800">
        <CheckCircle class="w-5 h-5" />
        <span class="font-medium">Scan terminé:</span>
        {{ scanResult.scanned }} site(s) scanné(s),
        {{ scanResult.created }} créé(s),
        {{ scanResult.updated }} mis à jour
      </div>
    </div>

    <!-- Liste des WordPress -->
    <div v-if="sites.length > 0" class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Site</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateurs</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="site in sites" :key="site.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Globe class="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div class="font-medium text-gray-900">{{ site.display_name }}</div>
                  <div class="text-sm text-gray-500">{{ site.name }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <a :href="site.url" target="_blank" class="text-primary-600 hover:underline flex items-center gap-1">
                {{ site.url }}
                <ExternalLink class="w-3 h-3" />
              </a>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <Users class="w-3 h-3 mr-1" />
                {{ site.user_count }} utilisateur(s)
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <a
                :href="site.url + '/wp-admin/options-general.php?page=openid-connect-generic-settings'"
                target="_blank"
                class="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center gap-1 justify-end"
              >
                <Settings class="w-4 h-4" />
                Config SSO
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- État vide -->
    <div v-else class="bg-white shadow-sm rounded-xl border border-gray-200 p-12 text-center">
      <Globe class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun site WordPress détecté</h3>
      <p class="text-gray-500 mb-6">
        Les sites WordPress sont détectés automatiquement depuis ~/web/sites/
      </p>
      <button
        @click="scanWordPress"
        :disabled="scanning"
        class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2"
      >
        <RefreshCw class="w-4 h-4" />
        Lancer un scan
      </button>
    </div>

    <!-- Info SSO -->
    <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-blue-900 mb-3">Configuration SSO WordPress</h3>
      <p class="text-blue-800 mb-4">
        Pour activer le SSO sur un site WordPress, installez le plugin
        <strong>OpenID Connect Generic</strong> et configurez-le avec Authentik.
      </p>
      <div class="text-sm text-blue-700 space-y-2">
        <p><strong>Client ID:</strong> Créer une application dans Authentik pour chaque WordPress</p>
        <p><strong>Redirect URI:</strong> https://[wordpress-url]/wp-admin/admin-ajax.php?action=openid-connect-authorize</p>
        <p><strong>Endpoints:</strong> Utiliser les URLs d'Authentik (voir README pour détails)</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ArrowLeft, RefreshCw, Globe, ExternalLink, Users, Settings, CheckCircle } from 'lucide-vue-next'
import api from '../api'

const sites = ref([])
const scanning = ref(false)
const scanResult = ref(null)

onMounted(async () => {
  await loadSites()
})

async function loadSites() {
  try {
    const res = await api.get('/api/wordpress/sites')
    sites.value = res.data
  } catch (error) {
    console.error('Erreur chargement WordPress:', error)
  }
}

async function scanWordPress() {
  scanning.value = true
  scanResult.value = null
  try {
    const res = await api.post('/api/wordpress/scan')
    scanResult.value = res.data
    await loadSites()
  } catch (error) {
    console.error('Erreur scan WordPress:', error)
  } finally {
    scanning.value = false
  }
}
</script>
