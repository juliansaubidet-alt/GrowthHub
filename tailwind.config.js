/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Roboto', 'system-ui', 'sans-serif'] },
      colors: {
        h: {
          50:  '#f1f4fd',
          100: '#dee5fb',
          200: '#c5d4f8',
          300: '#9db8f3',
          400: '#6f93eb',
          500: '#496be3',
          600: '#3851d8',
          700: '#2f3fc6',
          800: '#2c35a1',
          900: '#29317f',
          950: '#1d204e',
        },
        n: {
          50:  '#f5f6f8',
          100: '#eeeef1',
          150: '#e9e9ed',
          200: '#dfe0e6',
          300: '#cbcdd6',
          400: '#b5b6c4',
          500: '#aaaaba',
          600: '#8d8c9f',
          700: '#79788a',
          800: '#636271',
          900: '#53525d',
          950: '#303036',
        },
        g:  { 50: '#f5fdf6', 100: '#e6fbe9', 200: '#cff6d5', 400: '#7bdd8b', 600: '#28c040', 800: '#227831', 900: '#1f622c' },
        y:  { 50: '#fdfaec', 100: '#fcf7ce', 200: '#fbeb9d', 400: '#f4c83f', 600: '#de920c', 700: '#b1690e' },
        r:  { 50: '#fef2f2', 100: '#fde3e3', 400: '#f27777', 600: '#d42e2e' },
        p:  { 50: '#f4f2ff', 100: '#e9e8ff', 500: '#886bff', 800: '#4718bf' },
        t:  { 50: '#f2fbf8', 100: '#d5f2e9', 500: '#35a48e', 800: '#1f5049' },
        s:  { 50: '#f8fdfe', 100: '#ecfafc', 400: '#a1dfeb', 600: '#46badd', 800: '#3485a4' },
      },
      boxShadow: {
        '4dp': '-1px 4px 8px 0px rgba(233,233,244,1)',
        '8dp': '-1px 8px 16px 0px rgba(170,170,186,0.45)',
      },
      animation: {
        'fade-in':  'fadeIn 0.25s ease-out',
        'slide-in': 'slideIn 0.25s ease-out',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 },                              to: { opacity: 1 } },
        slideIn: { from: { opacity: 0, transform: 'translateY(6px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
