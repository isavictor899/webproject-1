/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      colors: {
        primary: '#2C3E50',
        accent: '#27ae60',
        offwhite: '#f9f9f9',
      },
    },
  },
  plugins: [],
}
