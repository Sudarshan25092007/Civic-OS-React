/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F172A',
        surface: 'rgba(30, 41, 59, 0.7)',
        primary: '#10B981', // Emerald Green 
        accent: '#F59E0B',  // Amber
        cardBorder: 'rgba(255, 255, 255, 0.1)',
      },
      backdropBlur: {
        md: '12px',
        lg: '24px',
      }
    },
  },
  plugins: [],
}
