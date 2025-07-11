/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.box-bg': {
          background: 'radial-gradient(#111827fa, #1f2937fa)'
        },
        '.glowing-text': {
          color: '#0bd9b0',
          filter: 'drop-shadow(0 0 20px #0bd9b0)'
        }
      })
    }
  ],
}