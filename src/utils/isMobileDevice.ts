// this is same width as the sm breakpoint in tailwind.config.js
const SMALL_SCREEN_WIDTH = 858;

export function isMobileDevice() {
  return (
    typeof window !== 'undefined' && window.innerWidth <= SMALL_SCREEN_WIDTH
  );
}
