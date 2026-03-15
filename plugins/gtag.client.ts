declare global {
  interface Window {
    dataLayer: unknown[]
  }
}

export default defineNuxtPlugin(() => {
  const { analyticsAllowed } = useCookieConsent()
  const config = useRuntimeConfig()
  const gaId = config.public.gaId as string

  if (!gaId) return

  watch(analyticsAllowed, (allowed) => {
    if (allowed && !document.getElementById('gtag-script')) {
      const script = document.createElement('script')
      script.id = 'gtag-script'
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
      document.head.appendChild(script)

      window.dataLayer = window.dataLayer || []
      function gtag(...args: unknown[]) {
        window.dataLayer.push(args)
      }
      gtag('js', new Date())
      gtag('config', gaId, { anonymize_ip: true })
    }
  }, { immediate: true })
})
