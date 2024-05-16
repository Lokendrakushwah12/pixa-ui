/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  theme: {
    extend: {},
    screens: {
      '2xl': { min: '1535px' }, // 1536px
      'xl': { min: '1279px' }, // 1280px
      'lg': { min: '1023px' }, // 1024px
      'md': { min: '767px' }, // 768px
      'sm': { min: '639px' }, // 640px
      'x-sm': { max: '480px' }, // 481px
    },
  },
  plugins: [],
}

