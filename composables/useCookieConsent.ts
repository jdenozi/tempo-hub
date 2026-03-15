interface CookieConsent {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

export function useCookieConsent() {
  const consent = useState<CookieConsent | null>('cookie-consent', () => null)
  const showBanner = useState('cookie-banner-visible', () => false)

  function init() {
    if (import.meta.server) return
    const stored = localStorage.getItem('cookie-consent')
    if (stored) {
      consent.value = JSON.parse(stored)
    } else {
      showBanner.value = true
    }
  }

  function saveConsent(categories: CookieConsent) {
    consent.value = { ...categories, necessary: true }
    if (import.meta.client) {
      localStorage.setItem('cookie-consent', JSON.stringify(consent.value))
    }
    showBanner.value = false
  }

  function acceptAll() {
    saveConsent({ necessary: true, analytics: true, marketing: true })
  }

  function rejectAll() {
    saveConsent({ necessary: true, analytics: false, marketing: false })
  }

  function openSettings() {
    showBanner.value = true
  }

  const hasConsented = computed(() => consent.value !== null)
  const analyticsAllowed = computed(() => consent.value?.analytics === true)
  const marketingAllowed = computed(() => consent.value?.marketing === true)

  return {
    consent,
    showBanner,
    hasConsented,
    analyticsAllowed,
    marketingAllowed,
    init,
    saveConsent,
    acceptAll,
    rejectAll,
    openSettings,
  }
}
