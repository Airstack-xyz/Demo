// this is same width as the sm breakpoint in tailwind.config.js
const SMALL_SCREEN_WIDTH = 858;

export function isMobileDevice() {
  return window && window.innerWidth <= SMALL_SCREEN_WIDTH;
}
