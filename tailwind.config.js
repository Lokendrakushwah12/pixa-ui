/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  theme: {
    backgroundImage: {
      "primary-gradient": "linear-gradient(to bottom, #515151, #919191 48%, #515151 68%, #919191 100%)",
      frost: "repeating-linear-gradient(to right, rgba(0,0,0,.04) 0%, rgba(255,255,255,.39) 49%, rgba(0,0,0,.27) 100%)"
    },
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

