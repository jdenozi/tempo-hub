<template>
  <Transition name="cookie-slide">
    <div
      v-if="showBanner"
      class="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
    >
      <div
        class="cookie-banner mx-auto max-w-4xl rounded-card border border-primary-500/20 bg-secondary-900/95 p-6 shadow-2xl shadow-primary-500/5 backdrop-blur-xl sm:p-8"
      >
        <!-- Header -->
        <div class="mb-5 flex items-start gap-3">
          <span class="text-2xl leading-none" aria-hidden="true">🍪</span>
          <div>
            <h2 class="font-heading text-lg font-semibold text-white/95">
              {{ $t('cookies.title') }}
            </h2>
            <p class="mt-1 text-sm leading-relaxed text-white/60">
              {{ $t('cookies.description') }}
            </p>
          </div>
        </div>

        <!-- Categories -->
        <div class="mb-6 space-y-3">
          <!-- Necessary -->
          <div class="flex items-center justify-between rounded-lg bg-white/[0.03] px-4 py-3">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-white/90">{{ $t('cookies.necessary') }}</span>
                <span class="rounded-full bg-primary-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-400">
                  {{ $t('cookies.alwaysActive') }}
                </span>
              </div>
              <p class="mt-0.5 text-xs text-white/40">{{ $t('cookies.necessaryDescription') }}</p>
            </div>
            <label class="cookie-toggle">
              <input type="checkbox" checked disabled />
              <span class="cookie-toggle__track cookie-toggle__track--locked" />
            </label>
          </div>

          <!-- Analytics -->
          <div class="flex items-center justify-between rounded-lg bg-white/[0.03] px-4 py-3">
            <div class="min-w-0 flex-1">
              <span class="text-sm font-medium text-white/90">{{ $t('cookies.analytics') }}</span>
              <p class="mt-0.5 text-xs text-white/40">{{ $t('cookies.analyticsDescription') }}</p>
            </div>
            <label class="cookie-toggle">
              <input v-model="localAnalytics" type="checkbox" />
              <span class="cookie-toggle__track" />
            </label>
          </div>

          <!-- Marketing -->
          <div class="flex items-center justify-between rounded-lg bg-white/[0.03] px-4 py-3">
            <div class="min-w-0 flex-1">
              <span class="text-sm font-medium text-white/90">{{ $t('cookies.marketing') }}</span>
              <p class="mt-0.5 text-xs text-white/40">{{ $t('cookies.marketingDescription') }}</p>
            </div>
            <label class="cookie-toggle">
              <input v-model="localMarketing" type="checkbox" />
              <span class="cookie-toggle__track" />
            </label>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <a
            href="/politique-cookies"
            class="text-xs text-white/40 underline decoration-white/20 underline-offset-2 transition-colors hover:text-primary-400 hover:decoration-primary-400/40"
          >
            {{ $t('cookies.learnMore') }}
          </a>
          <div class="flex flex-col gap-2 sm:flex-row">
            <button
              class="cookie-btn cookie-btn--ghost"
              @click="handleRejectAll"
            >
              {{ $t('cookies.rejectAll') }}
            </button>
            <button
              class="cookie-btn cookie-btn--outline"
              @click="handleSave"
            >
              {{ $t('cookies.save') }}
            </button>
            <button
              class="cookie-btn cookie-btn--primary"
              @click="handleAcceptAll"
            >
              {{ $t('cookies.acceptAll') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { showBanner, acceptAll, rejectAll, saveConsent } = useCookieConsent()

const localAnalytics = ref(false)
const localMarketing = ref(false)

function handleAcceptAll() {
  acceptAll()
}

function handleRejectAll() {
  rejectAll()
}

function handleSave() {
  saveConsent({
    necessary: true,
    analytics: localAnalytics.value,
    marketing: localMarketing.value,
  })
}
</script>

<style scoped>
/* Slide-up transition */
.cookie-slide-enter-active {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
}

.cookie-slide-leave-active {
  transition: transform 0.35s cubic-bezier(0.4, 0, 1, 1), opacity 0.25s ease;
}

.cookie-slide-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.cookie-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Banner glow */
.cookie-banner {
  box-shadow:
    0 -1px 0 0 rgba(212, 168, 83, 0.08),
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 80px -20px rgba(212, 168, 83, 0.06);
}

/* Toggle switch */
.cookie-toggle {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  cursor: pointer;
}

.cookie-toggle input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}

.cookie-toggle__track {
  position: relative;
  display: block;
  width: 44px;
  height: 24px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: background 0.25s ease, border-color 0.25s ease;
}

.cookie-toggle__track::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background 0.25s ease;
}

.cookie-toggle input:checked + .cookie-toggle__track {
  background: rgba(212, 168, 83, 0.25);
  border-color: rgba(212, 168, 83, 0.4);
}

.cookie-toggle input:checked + .cookie-toggle__track::after {
  transform: translateX(20px);
  background: #d4a853;
}

.cookie-toggle__track--locked {
  background: rgba(212, 168, 83, 0.15);
  border-color: rgba(212, 168, 83, 0.25);
  cursor: not-allowed;
}

.cookie-toggle__track--locked::after {
  transform: translateX(20px);
  background: rgba(212, 168, 83, 0.6);
}

/* Buttons */
.cookie-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s ease;
  cursor: pointer;
}

.cookie-btn--ghost {
  color: rgba(255, 255, 255, 0.5);
  background: transparent;
  border: 1px solid transparent;
}

.cookie-btn--ghost:hover {
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.05);
}

.cookie-btn--outline {
  color: rgba(255, 255, 255, 0.75);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.cookie-btn--outline:hover {
  border-color: rgba(212, 168, 83, 0.3);
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.03);
}

.cookie-btn--primary {
  color: #0e0616;
  background: #d4a853;
  border: 1px solid transparent;
  font-weight: 600;
}

.cookie-btn--primary:hover {
  background: #dea95a;
  box-shadow: 0 0 20px rgba(212, 168, 83, 0.25);
}
</style>
