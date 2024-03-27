import type { Config } from 'tailwindcss';
// new color tokens -
// https://www.figma.com/file/eUVSqknQC8YZXdLbV6aDb8/Design-Library?type=design&node-id=422-53&mode=design&t=B7Vn5ipwopkmJdBz-0

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'concert-one': ['Concert One', 'sans-serif']
      },
      colors: {
        primary: '#061523',
        secondary: '#081E32',
        tertiary: '#0F273F',
        'button-primary': '#FFFFFF',
        'button-primary-hover': '#E06669',
        'button-primary-disabled': '#DE5C5F',
        'button-secondary': '#172633',
        'button-secondary-hover': '#1A2C3B',
        'button-secondary-disabled': '#efadaf',
        'button-tertiary': '#061523',
        'button-translucent': '#82B6FF',
        'toast-positive': '#387C44',
        'toast-negative': '#F30C0C',
        'toast-warning': '#FFDE2E',
        'text-primary': '#FFFFFF',
        'text-secondary': '#868D94',
        'text-placeholder': '#b1b3b5',
        'text-button': '#82B6FF',
        'text-button-hovered': '#65AAD0',
        'text-button-disabled': '#b2d5e7',
        'text-error': '#F30C0C',
        'stroke-color': '#0B2641',
        'stroke-color-light': '#10365E',
        'stroke-highlight-blue': '#4B97F7',
        'stroke-highlight-red': '#DE5C5F',
        'response-light': '#f1f2f4',
        'banner-positive': '#008E41',
        'card-hover': '#0A223B',
        dropdown: '#172633',
        header: '#162B42',
        navbar: '#15293D',
        'input-primary': '#12212E',
        'input-secondary': '#162B42',
        'input-tertiary': '#061523',
        'input-stroke-primary': '#2A3743',
        'input-stroke-secondary': '#384A5B',
        'input-stroke-tertiary': '#10365E',
        'hover-primary': '#142738',
        'hover-secondry': '#172633'
      },
      borderRadius: {
        18: '18px'
      },
      width: {
        main: '1050px'
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
          '@apply bg-secondary border border-solid border-stroke-color-light':
            {}
        },
        '.card-light': {
          '@apply bg-tertiary border border-solid border-stroke-color-light': {}
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
        },
        '.bg-glass-new': {
          background: `rgba(255, 255, 255, 0.05)`,
          'backdrop-filter': 'blur(50px)'
        },
        '.main-section': {
          '@apply w-full max-w-[1050px]': {}
        },
        '.dropdown-bg': {
          background: '#172633',
          'backdrop-filter': 'blur(33.31547927856445px)'
        },
        '.button-filter': {
          '@apply bg-dropdown rounded-full enabled:hover:bg-button-secondary-hover disabled:opacity-30 disabled:cursor-not-allowed':
            {}
        },
        '.content': {
          '@apply w-[1440px] max-w-[100vw]': {}
        },
        '.header-btn-bg': {
          background: 'rgba(255, 255, 255, 0.05)',
          'backdrop-filter': 'blur(33.31547927856445px)'
        },
        '.button-primary': {
          '@apply bg-button-primary disabled:opacity-30 text-text-button': {}
        }
      });
    }
  ]
};

export default config;
