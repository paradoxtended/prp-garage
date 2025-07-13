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
        },
        '.input-bg': {
          background: 'radial-gradient(#52525bfa, #3f3f46a0)'
        },
        '.bg-vehicle-card': {
          background: 'radial-gradient(#6b7280fa, #4b556350)'
        },
        '.bg-vehicle-card-hover': {
          background: 'radial-gradient(#07deb3a0, #0bd9b040)'
        },
        '.details-card-bg': {
          background: 'radial-gradient(#4b5563c0, #37415150)'
        }
      })
    }
  ],
}