import { useCallback, useEffect, useRef, useState } from 'react';
import { useTextTypingEffect } from './useTextTypingEffect';

const placeholderChangeWaitTime = 1000;
const placeholders = [
  'Start with a natural language search',
  'e.g. "for shnoodles.eth show all web3 socials, ENS, and NFTs"',
  'Type /help to learn what I can do',
  'Type @ to select from 10,000+ tokens, NFTs, and POAP events',
  'e.g. "show all attendees of @devcon2 and their ENS and web3 socials"',
  'Type /help to learn what I can do'
];

export function useAnimateInputPlaceholder(input: HTMLTextAreaElement | null) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeoutIdRef = useRef<any>(0);

  const onPlaceholderAninationComplete = useCallback(() => {
    timeoutIdRef.current = setTimeout(() => {
      setPlaceholderIndex((placeholderIndex + 1) % placeholders.length);
    }, placeholderChangeWaitTime);
  }, [placeholderIndex]);

  const { text, stop } = useTextTypingEffect({
    text: placeholders[placeholderIndex],
    interval: 80,
    onComplete: onPlaceholderAninationComplete
  });

  const handleFocus = useCallback(() => {
    clearTimeout(timeoutIdRef.current);
    stop(placeholders[placeholderIndex]);
  }, [placeholderIndex, stop]);

  const handleBlur = useCallback(
    (event: FocusEvent) => {
      const target = event.target as HTMLTextAreaElement;
      if (target.value.trim() === '') {
        onPlaceholderAninationComplete();
      }
    },
    [onPlaceholderAninationComplete]
  );

  useEffect(() => {
    if (input) {
      if (input.value.trim().length > 0) {
        handleFocus(); // stop animation as there is text in the input
      }
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
      return () => {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      };
    }
  }, [handleBlur, handleFocus, input, placeholderIndex, stop, text]);

  return text;
}
