/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'weyeah-blue': '#1a365d',
        'weyeah-blue-700': '#2c5282',
        'weyeah-blue-500': '#4299e1',
        'weyeah-orange': '#ed8936',
        'weyeah-orange-600': '#dd6b20',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
