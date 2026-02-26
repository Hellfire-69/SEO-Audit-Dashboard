/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        warm: {
          50: '#FDFBF7',
          100: '#FAF9F6',
          200: '#F5F3EF',
          300: '#EFEBE4',
          400: '#E5DFD4',
          500: '#D9Cfb8',
          600: '#C9BC9A',
          700: '#A89472',
          800: '#5C5347',
          900: '#3D362E',
        },
      },
    },
  },
  plugins: [],
}
