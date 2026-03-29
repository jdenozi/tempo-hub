<template>
  <div class="tempobot-container">
    <!-- Toggle Button -->
    <button
      @click="isOpen = !isOpen"
      class="tempobot-toggle"
      :class="{ 'is-open': isOpen }"
    >
      <MessageCircle v-if="!isOpen" class="w-6 h-6" />
      <X v-else class="w-6 h-6" />
    </button>

    <!-- Chat Window -->
    <Transition name="slide-up">
      <div v-if="isOpen" class="tempobot-window">
        <div class="tempobot-header">
          <div class="flex items-center gap-2">
            <Bot class="w-5 h-5" />
            <span class="font-bold">TempoBot</span>
          </div>
          <span class="text-xs opacity-75">Assistant virtuel</span>
        </div>

        <div class="tempobot-messages" ref="messagesContainer">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            class="tempobot-message"
            :class="msg.type"
          >
            <div class="message-content">{{ msg.text }}</div>
          </div>
        </div>

        <div class="tempobot-suggestions">
          <button
            v-for="suggestion in suggestions"
            :key="suggestion.id"
            @click="askQuestion(suggestion)"
            class="suggestion-btn"
          >
            {{ suggestion.label }}
          </button>
        </div>

        <div class="tempobot-input">
          <input
            v-model="userInput"
            @keyup.enter="sendMessage"
            placeholder="Posez votre question..."
            class="tempobot-text-input"
          />
          <button @click="sendMessage" class="send-btn">
            <Send class="w-4 h-4" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { MessageCircle, X, Bot, Send } from 'lucide-vue-next'

const isOpen = ref(false)
const userInput = ref('')
const messagesContainer = ref(null)

const messages = ref([
  { type: 'bot', text: 'Bonjour ! Je suis TempoBot, votre assistant virtuel. Comment puis-je vous aider ?' }
])

const suggestions = ref([
  { id: 'services', label: 'Quels sont les services ?' },
  { id: 'aide', label: 'Comment obtenir de l\'aide ?' },
  { id: 'compte', label: 'Gérer mon compte' },
  { id: 'contact', label: 'Contacter un admin' }
])

const faq = {
  'services': {
    keywords: ['service', 'services', 'quels', 'disponible', 'liste'],
    answer: `Voici les services disponibles sur TempoHub :

• **Nextcloud** - Stockage cloud et synchronisation de fichiers
• **Vaultwarden** - Gestionnaire de mots de passe sécurisé
• **Jellyfin** - Streaming média personnel
• **TempoBudget** - Gestion de budget personnel
• **Cal.com** - Planification de rendez-vous
• **n8n** - Automatisation de workflows
• **Grafana** - Monitoring et dashboards

Vous ne voyez que les services auxquels vous avez accès.`
  },
  'aide': {
    keywords: ['aide', 'help', 'problème', 'bug', 'erreur', 'marche pas', 'fonctionne'],
    answer: `Pour obtenir de l'aide :

1. **Consultez la FAQ** - Posez-moi vos questions !
2. **Contactez un administrateur** - Envoyez un email à admin@tempo-hub.fr
3. **Vérifiez vos accès** - Allez dans votre profil pour voir vos permissions

Si un service ne fonctionne pas, essayez de vous déconnecter et reconnecter.`
  },
  'compte': {
    keywords: ['compte', 'profil', 'mot de passe', 'password', 'email', 'modifier'],
    answer: `Pour gérer votre compte :

• **Modifier votre profil** - Cliquez sur votre avatar en haut à droite
• **Changer de mot de passe** - Rendez-vous sur Authentik (auth.tempo-hub.fr)
• **Voir vos permissions** - Dans votre profil, section "Mes accès"

Votre compte est géré via Authentik, le système d'authentification centralisé.`
  },
  'contact': {
    keywords: ['contact', 'admin', 'administrateur', 'joindre', 'email'],
    answer: `Pour contacter un administrateur :

📧 **Email** : admin@tempo-hub.fr

Les administrateurs peuvent :
• Vous donner accès à de nouveaux services
• Résoudre les problèmes techniques
• Créer de nouveaux comptes utilisateurs`
  },
  'authentik': {
    keywords: ['authentik', 'sso', 'connexion', 'login', 'connecter'],
    answer: `**Authentik** est notre système d'authentification unique (SSO).

✅ **Un seul compte** pour tous les services
✅ **Connexion automatique** entre les applications
✅ **Sécurité renforcée** avec gestion centralisée

Connectez-vous une fois sur Authentik et accédez à tous vos services !`
  },
  'default': {
    answer: `Je ne suis pas sûr de comprendre votre question. 🤔

Voici ce que je peux vous aider à faire :
• Expliquer les services disponibles
• Vous guider pour obtenir de l'aide
• Gérer votre compte
• Contacter un administrateur

Cliquez sur une suggestion ou reformulez votre question !`
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

function askQuestion(suggestion) {
  messages.value.push({ type: 'user', text: suggestion.label })

  setTimeout(() => {
    const response = faq[suggestion.id]?.answer || faq.default.answer
    messages.value.push({ type: 'bot', text: response })
    scrollToBottom()
  }, 500)

  scrollToBottom()
}

function findAnswer(input) {
  const lowerInput = input.toLowerCase()

  for (const [key, data] of Object.entries(faq)) {
    if (key === 'default') continue
    if (data.keywords?.some(kw => lowerInput.includes(kw))) {
      return data.answer
    }
  }

  return faq.default.answer
}

function sendMessage() {
  if (!userInput.value.trim()) return

  const text = userInput.value.trim()
  messages.value.push({ type: 'user', text })
  userInput.value = ''

  setTimeout(() => {
    const answer = findAnswer(text)
    messages.value.push({ type: 'bot', text: answer })
    scrollToBottom()
  }, 500)

  scrollToBottom()
}
</script>

<style scoped>
.tempobot-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}

.tempobot-toggle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
  transition: all 0.3s ease;
}

.tempobot-toggle:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(249, 115, 22, 0.5);
}

.tempobot-toggle.is-open {
  background: #374151;
}

.tempobot-window {
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 350px;
  max-height: 500px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tempobot-header {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: white;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tempobot-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 250px;
  min-height: 150px;
}

.tempobot-message {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.4;
  white-space: pre-line;
}

.tempobot-message.bot {
  background: #f3f4f6;
  color: #374151;
  align-self: flex-start;
  border-bottom-left-radius: 4px;
}

.tempobot-message.user {
  background: #f97316;
  color: white;
  align-self: flex-end;
  border-bottom-right-radius: 4px;
}

.tempobot-suggestions {
  padding: 8px 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  border-top: 1px solid #e5e7eb;
}

.suggestion-btn {
  padding: 6px 12px;
  background: #fff7ed;
  color: #ea580c;
  border: 1px solid #fed7aa;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.suggestion-btn:hover {
  background: #ffedd5;
  border-color: #f97316;
}

.tempobot-input {
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 8px;
}

.tempobot-text-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.tempobot-text-input:focus {
  border-color: #f97316;
}

.send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f97316;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.send-btn:hover {
  background: #ea580c;
}

/* Animation */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Mobile */
@media (max-width: 640px) {
  .tempobot-container {
    bottom: 16px;
    right: 16px;
  }

  .tempobot-window {
    width: calc(100vw - 32px);
    max-width: 350px;
    right: 0;
  }
}
</style>
