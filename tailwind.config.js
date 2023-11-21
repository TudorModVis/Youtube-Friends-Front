/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'white': '#F1F1F1',
        'accent': '#F74264',
        'black': '#0E0E0E',
        'semi-black': '#1E1E1E'
      }
    },
  },
  plugins: [],
}

