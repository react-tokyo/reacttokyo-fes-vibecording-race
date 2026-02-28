import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'accent-blue': '#1D9BF0',
        'accent-blue-light': '#E8F5FD',
        'accent-red': '#F4212E',
        'bg-card': '#FFFFFF',
        'bg-hover': '#F7F7F7',
        'bg-page': '#F5F4F1',
        'bg-sidebar': '#FFFFFF',
        'border-strong': '#D1D0CD',
        'border-subtle': '#E5E4E1',
        'text-primary': '#1A1918',
        'text-secondary': '#6D6C6A',
        'text-tertiary': '#9C9B99',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
