import type { Config } from 'tailwindcss'
import coreConfig from './tempo-core/tailwind.config'

export default {
  presets: [coreConfig],
  theme: {
    extend: {
      colors: {
        // Primary: Gold — brand accent, buttons, highlights
        primary: {
          50: '#fdf8f0',
          100: '#f9eedd',
          200: '#f2dab5',
          300: '#e8c082',
          400: '#dea95a',
          500: '#d4a853',
          600: '#b88a3d',
          700: '#966d2e',
          800: '#745322',
          900: '#553c18',
          950: '#2e200c',
        },
        // Secondary: Deep plum — backgrounds, text, structure (charte graphique)
        secondary: {
          50: '#f0e8f2',
          100: '#d8bce0',
          200: '#bf96cc',
          300: '#a878b8',
          400: '#8a5ea0',
          500: '#6e4685',
          600: '#56366a',
          700: '#3e2850',
          800: '#2a1540',
          900: '#180a28',
          950: '#0e0616',
        },
        // Accent: Fire/orange — warm highlights, engine glow
        accent: {
          50: '#fdf4ee',
          100: '#f9e4d2',
          200: '#f2c5a2',
          300: '#e8a06a',
          400: '#dc8840',
          500: '#d08030',
          600: '#b06825',
          700: '#8e521d',
          800: '#6e3e17',
          900: '#502c10',
          950: '#2c1808',
        },
      },
    },
  },
} satisfies Config
