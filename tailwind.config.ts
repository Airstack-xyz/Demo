import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'concert-one': ['Concert One', 'sans-serif']
      },
      colors: {
        primary: '#061523',
        secondary: '#16161D',
        tertiary: '#24242D',
        'button-primary': '#DE5C5F',
        'button-primary-hover': '#E06669',
        'button-primary-disabled': '#DE5C5F',
        'button-secondary': '#16161D',
        'button-secondary-hover': '#1B1B24',
        'button-secondary-disabled': '#efadaf',
        'toast-positive': '#387C44',
        'toast-negative': '#F30C0C',
        'toast-warning': '#FFDE2E',
        'text-primary': '#FFFFFF',
        'text-secondary': '#97999c',
        'text-placeholder': '#b1b3b5',
        'text-button': '#82B6FF',
        'text-button-hovered': '#65AAD0',
        'text-button-disabled': '#b2d5e7',
        'text-error': '#F30C0C',
        'stroke-color': '#3032414d',
        'stroke-color-light': '#8b8ea033',
        'stroke-highlight-blue': '#4B97F7',
        'stroke-highlight-red': '#DE5C5F',
        'response-light': '#f1f2f4',
        'banner-positive': '#008E41'
      },
      borderRadius: {
        18: '18px'
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
  plugins: [
    function ({ addUtilities }: { addUtilities: Function }) {
      addUtilities({
        '.flex-row-center': {
          '@apply flex items-center justify-center': {}
        },
        '.flex-col-center': {
          '@apply flex flex-col items-center justify-center': {}
        },
        '.ellipsis': {
          '@apply overflow-ellipsis whitespace-nowrap overflow-hidden': {}
        },
        '.border-solid-stroke': {
          '@apply border border-solid border-stroke-color': {}
        },
        '.border-solid-light': {
          '@apply border border-solid border-stroke-color-light': {}
        },
        '.bg-glass': {
          background: `linear-gradient(
            137deg,
            rgba(255, 255, 255, 0.03) 0.55%,
            rgba(255, 255, 255, 0) 100%
          )`,
          'backdrop-filter': `blur(100px)`
        },
        '.bg-glass-1': {
          background: `linear-gradient(
            137deg,
            rgba(255, 255, 255, 0.12) 0.55%,
            rgba(255, 255, 255, 0) 100%
          )`,
          'backdrop-filter': `blur(33.31547927856445px)`
        },
        '.bg-glass-1-light': {
          background: `linear-gradient(
            137deg,
            rgba(255, 255, 255, 0.2) 0.55%,
            rgba(255, 255, 255, 0) 100%
          );`,
          'backdrop-filter': `blur(33.31547927856445px)`
        },
        '.bg-glass-grad': {
          background: `linear-gradient(
            137deg,
            rgba(255, 255, 255, 0.03) 0.55%,
            rgba(255, 255, 255, 0) 100%
          )`
        },
        '.bg-glass-2': {
          background: `linear-gradient(111deg, rgba(255, 255, 255, 0.04) -8.95%, rgba(255, 255, 255, 0.00) 200%)`,
          'backdrop-filter': 'blur(7.5px)'
        },
        '.before-bg-glass': {
          // Use this class if bg-glass will used in nesting fashion, normally blur doesn't work correctly if applied in nested fashion
          '@apply before:bg-glass before:absolute before:inset-0': {}
        },
        '.before-bg-glass-1': {
          // Use this class if bg-glass-1 will used in nesting fashion, normally blur doesn't work correctly if applied in nested fashion
          '@apply before:bg-glass-1 before:absolute before:inset-0': {}
        },
        '.card': {
          '@apply bg-[#081E32] border border-solid border-[#10365E]': {}
        },
        '.card-light': {
          '@apply bg-[#0F273F] border border-solid border-[#10365E]': {}
        },
        '.flex-row-h-center': {
          '@apply flex items-center': {}
        },
        '.flex-row-v-center': {
          '@apply flex justify-center': {}
        },
        '.flex-col-v-center': {
          '@apply flex flex-col items-center': {}
        },
        '.flex-col-h-center': {
          '@apply flex flex-col justify-center': {}
        }
      });
    }
  ]
};

export default config;
