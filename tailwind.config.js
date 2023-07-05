/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0E0E12',
        secondary: '#16161D',
        tertiary: '#24242D',
        'button-primary': '#DE5C5F',
        'button-primary-hover': '#E06669',
        'button-primary-disabled': '#DE5C5F',
        'button-secondary': '#16161D',
        'button-secondary-hover': '#1B1B24',
        'button-secondary-disabled': '#efadaf',
        'toast-positive': '#387C44',
        'toast-error': '#F30C0C',
        'text-primary': '#FFFFFF',
        'text-secondary': '#97999c',
        'text-placeholder': '#b1b3b5',
        'text-button': '#65AAD0',
        'text-button-hovered': '#65AAD0',
        'text-button-disabled': '#b2d5e7',
        'text-error': '#F30C0C',
        'stroke-color': '#303241',
        'stroke-highlight-blue': '#4B97F7',
        'stroke-highlight-red': '#DE5C5F',
        'response-light': '#f1f2f4',
        'banner-positive': '#008E41'
      }
    },
    screens: {
      xs: '300px',
      // => @media (min-width: 500px) { ... }
      sm: '858px',
      md: '1180px',
      lg: '1440px',
      xl: '1600px'
    }
  },
  plugins: []
};
