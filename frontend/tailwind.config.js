/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        bone: {
          50: '#fefdfb',
          100: '#fdf8f0',
          200: '#f5e6d3',
        },
        cartoon: {
          blue: '#4FC3F7',
          orange: '#FFB74D',
          green: '#81C784',
          pink: '#F48FB1',
          purple: '#B39DDB',
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      fontFamily: {
        'fun': ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
