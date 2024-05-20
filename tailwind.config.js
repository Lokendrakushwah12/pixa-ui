/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  theme: {
    backgroundImage: {
      "primary-gradient": "linear-gradient(to bottom, #121212, #d9d9d9 98%, #121212 68%, #d9d9d9 00%)",
      frost: "repeating-linear-gradient(to right, rgba(0,0,0,.04) 0%, rgba(255,255,255,.39) 49%, rgba(0,0,0,.27) 100%)"
    },
    extend: {},
    screens: {
      '2xl': { min: '1535px' }, // 1536px
      'xl': { min: '1279px' }, // 1280px
      'lg': { min: '1023px' }, // 1024px
      'base': { min: '953px' }, // 954px
      'md': { min: '767px' }, // 768px
      'sm': { min: '639px' }, // 640px
      'x-sm': { max: '480px' }, // 481px
    },
  },
  plugins: [],
}

