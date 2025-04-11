// filepath: tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {
      extend: {
        fontFamily: {
          manrope: ["Manrope", "serif"],
        },
        animation: {
          'spin-slow': 'spin 3s linear infinite',
          'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }
      },
    },
    plugins: [],
  }