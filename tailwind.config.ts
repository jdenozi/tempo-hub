import type { Config } from 'tailwindcss'
import coreConfig from './tempo-core/tailwind.config'

export default {
  presets: [coreConfig],
  theme: {
    extend: {
      // Client-specific color/font overrides go here
      // Example:
      // colors: {
      //   primary: { 500: '#ff6600' },
      // },
      // fontFamily: {
      //   sans: ['Custom Font', 'system-ui', 'sans-serif'],
      // },
    },
  },
} satisfies Config
