/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#2f2925', cream: '#fbf8f3', blush: '#ead6ce', sage: '#879782', clay: '#a96248', sand: '#d8c2aa'
      },
      fontFamily: { sans: ['Inter', 'sans-serif'], display: ['Georgia', 'serif'] },
      boxShadow: { soft: '0 12px 40px rgba(67, 49, 40, .08)' }
    }
  },
  plugins: []
};
