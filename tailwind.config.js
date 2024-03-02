// tailwind.config.js
import typography from '@tailwindcss/typography'
import forms from '@tailwindcss/forms'
import aspectRatio from '@tailwindcss/aspect-ratio'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      tDarkPurple: '#27004D',
      tPurple: '#5603A8',
      tBeige: '#FFF8EA',
      tYellow: '#FFC665'
    },
    extend: {}
  },
  plugins: [typography, forms, aspectRatio]
}
