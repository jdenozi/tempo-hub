<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Aide & FAQ</h1>
      <p class="text-gray-600 mt-2">Guides et questions fréquentes</p>
    </div>

    <div class="space-y-4">
      <!-- Question Cal.com -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <button
          @click="toggle('calcom')"
          class="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar class="w-5 h-5 text-blue-600" />
            </div>
            <span class="font-semibold text-gray-900">Comment intégrer Cal.com dans WordPress ?</span>
          </div>
          <ChevronDown class="w-5 h-5 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': open === 'calcom' }" />
        </button>

        <div v-show="open === 'calcom'" class="px-6 pb-6 border-t border-gray-100">
          <div class="pt-6 space-y-6">

            <!-- Plugin requis -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-center gap-2 text-blue-800 font-medium">
                <Info class="w-5 h-5" />
                Plugin requis : <span class="font-bold">Simple Custom CSS and JS</span> (gratuit)
              </div>
            </div>

            <!-- Étape 1 -->
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <span class="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
                <h4 class="font-semibold text-gray-900">Installer le plugin</h4>
              </div>
              <div class="ml-11 space-y-2 text-gray-600">
                <p>Dans WordPress, aller dans <span class="bg-gray-100 px-2 py-0.5 rounded font-medium">Extensions</span> → <span class="bg-gray-100 px-2 py-0.5 rounded font-medium">Ajouter</span></p>
                <p>Rechercher <span class="font-semibold">"Simple Custom CSS and JS"</span></p>
                <p>Cliquer sur <span class="bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">Installer</span> puis <span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">Activer</span></p>
              </div>
            </div>

            <!-- Étape 2 -->
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <span class="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
                <h4 class="font-semibold text-gray-900">Ajouter le code JavaScript</h4>
              </div>
              <div class="ml-11 space-y-2 text-gray-600">
                <p>Aller dans <span class="bg-gray-100 px-2 py-0.5 rounded font-medium">Custom CSS & JS</span> → <span class="bg-gray-100 px-2 py-0.5 rounded font-medium">Add Custom JS</span></p>
                <p>Donner un titre (ex: "Popup Cal.com")</p>
                <p>Coller le code ci-dessous :</p>
              </div>
            </div>

            <!-- Code block -->
            <div class="ml-11">
              <div class="bg-gray-900 rounded-lg overflow-hidden">
                <div class="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                  <span class="text-gray-400 text-sm font-medium">JavaScript</span>
                  <button
                    @click="copyCode"
                    class="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded flex items-center gap-2 transition-colors"
                  >
                    <Copy class="w-4 h-4" />
                    {{ copied ? 'Copié !' : 'Copier' }}
                  </button>
                </div>
                <pre class="p-4 text-sm text-green-400 overflow-x-auto max-h-64"><code>{{ calcomCode }}</code></pre>
              </div>
            </div>

            <!-- Options -->
            <div class="ml-11">
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p class="text-yellow-800 font-medium mb-2">Options à configurer :</p>
                <div class="flex gap-4 text-sm">
                  <span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Where on page: <strong>Footer</strong></span>
                  <span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Where in site: <strong>In Frontend</strong></span>
                </div>
              </div>
            </div>

            <!-- Étape 3 -->
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <span class="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
                <h4 class="font-semibold text-gray-900">Personnaliser l'URL</h4>
              </div>
              <div class="ml-11 text-gray-600">
                <p>Dans le code, remplacer <code class="bg-red-100 text-red-700 px-1.5 py-0.5 rounded">VOTRE-USERNAME</code> par votre identifiant Cal.com</p>
                <p class="mt-2 text-sm">Exemple : <code class="bg-gray-100 px-1.5 py-0.5 rounded">https://calcom.tempo-hub.fr/julie-boulangier?embed=true</code></p>
              </div>
            </div>

            <!-- Étape 4 -->
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <span class="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</span>
                <h4 class="font-semibold text-gray-900">Utiliser dans vos pages</h4>
              </div>
              <div class="ml-11 text-gray-600">
                <p class="mb-3">Ajoutez un bouton WordPress avec l'un de ces textes :</p>
                <div class="flex flex-wrap gap-2">
                  <span class="bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full font-medium">"Prendre un rendez-vous"</span>
                  <span class="bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full font-medium">"Commencez"</span>
                  <span class="bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full font-medium">"Réserver"</span>
                </div>
                <p class="mt-3 text-sm text-gray-500">Au clic sur le bouton, le popup Cal.com s'ouvrira automatiquement.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Question SSO -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <button
          @click="toggle('sso')"
          class="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Lock class="w-5 h-5 text-green-600" />
            </div>
            <span class="font-semibold text-gray-900">Comment fonctionne la connexion SSO ?</span>
          </div>
          <ChevronDown class="w-5 h-5 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': open === 'sso' }" />
        </button>

        <div v-show="open === 'sso'" class="px-6 pb-6 border-t border-gray-100">
          <div class="pt-6 space-y-6">

            <p class="text-gray-600">
              TempoHub utilise <strong class="text-gray-900">Authentik</strong> pour l'authentification centralisée (SSO - Single Sign-On).
            </p>

            <div class="grid md:grid-cols-2 gap-4">
              <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 class="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <CheckCircle class="w-5 h-5" />
                  Avantages
                </h4>
                <ul class="space-y-2 text-green-700 text-sm">
                  <li class="flex items-start gap-2">
                    <span class="text-green-500 mt-0.5">•</span>
                    Un seul compte pour tous les services
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-green-500 mt-0.5">•</span>
                    Connexion sécurisée et centralisée
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-green-500 mt-0.5">•</span>
                    Pas besoin de retenir plusieurs mots de passe
                  </li>
                </ul>
              </div>

              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 class="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <Globe class="w-5 h-5" />
                  Services compatibles
                </h4>
                <ul class="space-y-2 text-blue-700 text-sm">
                  <li class="flex items-start gap-2">
                    <span class="text-blue-500 mt-0.5">•</span>
                    TempoHub
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-blue-500 mt-0.5">•</span>
                    Nextcloud
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-blue-500 mt-0.5">•</span>
                    Cal.com
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-blue-500 mt-0.5">•</span>
                    WordPress (avec plugin)
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Question Contact -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <button
          @click="toggle('contact')"
          class="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <HelpCircle class="w-5 h-5 text-purple-600" />
            </div>
            <span class="font-semibold text-gray-900">Besoin d'aide ?</span>
          </div>
          <ChevronDown class="w-5 h-5 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': open === 'contact' }" />
        </button>

        <div v-show="open === 'contact'" class="px-6 pb-6 border-t border-gray-100">
          <div class="pt-6">
            <p class="text-gray-600">
              Pour toute question ou problème technique, contactez l'administrateur.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Calendar, Lock, HelpCircle, ChevronDown, Copy, Info, CheckCircle, Globe } from 'lucide-vue-next'

const open = ref(null)
const copied = ref(false)

const calcomCode = `jQuery(document).ready(function($) {
    // URL Cal.com à personnaliser
    var calcomURL = "https://calcom.tempo-hub.fr/VOTRE-USERNAME?embed=true&theme=light";

    // Crée le popup avec iframe Cal.com
    var popupHTML = \`
        <div id="calcom-popup" style="display:none;">
            <div class="popup-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:9999;"></div>
            <div class="popup-content" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10000;background:white;border-radius:8px;padding:30px;max-width:800px;width:90%;max-height:90vh;overflow-y:auto;box-shadow:0 10px 40px rgba(0,0,0,0.3);">
                <button class="popup-close" style="position:absolute;top:10px;right:10px;background:transparent;border:none;font-size:30px;cursor:pointer;line-height:1;color:#333;">×</button>
                <h2 style="margin-top:0;text-align:center;">Prenez un rendez-vous</h2>
                <iframe src="\${calcomURL}" width="100%" height="700" frameborder="0" style="border:none;"></iframe>
            </div>
        </div>
    \`;

    $('body').append(popupHTML);

    $('.wp-block-button__link').on('click', function(e) {
        var buttonText = $(this).text().trim();
        if (buttonText.includes('Prendre un rendez-vous') ||
            buttonText.includes('Commencez') ||
            buttonText.includes('Réserver')) {
            e.preventDefault();
            $('#calcom-popup').show();
            $('body').css('overflow', 'hidden');
        }
    });

    $(document).on('click', '.popup-close, .popup-overlay', function() {
        $('#calcom-popup').hide();
        $('body').css('overflow', '');
    });

    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            $('#calcom-popup').hide();
            $('body').css('overflow', '');
        }
    });
});`

function toggle(section) {
  open.value = open.value === section ? null : section
}

function copyCode() {
  navigator.clipboard.writeText(calcomCode)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>
