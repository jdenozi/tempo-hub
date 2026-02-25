import { defineEventHandler, getRequestURL } from 'h3'

// Prevent i18n from redirecting Nuxt Studio routes
export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  if (url.pathname.startsWith('/_studio') || url.pathname.startsWith('/__nuxt_studio')) {
    // Skip i18n processing by marking the event
    event.context._skipI18n = true
  }
})
