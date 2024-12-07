/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 確保這些顏色可用
        gray: {
          400: '#9ca3af',
          600: '#4b5563',
          700: '#374151',
          900: '#111827',
        },
        blue: {
          500: '#3b82f6',
        },
        red: {
          500: '#ef4444',
        },
      },
    },
  },
  plugins: [],
}