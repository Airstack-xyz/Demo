import { useEffect, useRef } from 'react';

export const useOutsideClick = <T extends HTMLElement = HTMLElement>(
  callback: () => void
) => {
  const ref = useRef<T>(null);
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const el = ref?.current;
      if (!el || el.contains(event.target as Node)) {
        return;
      }
      callbackRef.current?.();
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return ref;
};
