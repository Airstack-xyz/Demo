import { useCallback, useEffect, useRef, useState } from 'react';

const INTERVAL = 100;

type HookProps = {
  text: string;
  interval?: number;
  onComplete?: () => void;
  loop?: string;
};

export function useTextTypingEffect({
  text: completeText,
  interval = INTERVAL,
  onComplete,
  loop
}: HookProps) {
  const currentIndexRef = useRef(1);
  const intervalRef = useRef(0);
  const [text, setText] = useState('');
  const textRef = useRef(completeText);

  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    currentIndexRef.current = 1;
  }, []);

  const animate = useCallback(() => {
    intervalRef.current = setInterval(() => {
      if (currentIndexRef.current === textRef.current.length) {
        reset();
        setText(textRef.current);
        onComplete && onComplete();
        if (loop) {
          animate();
        }
        return;
      }
      setText(textRef.current.substring(0, currentIndexRef.current));
      currentIndexRef.current++;
    }, interval);
  }, [interval, loop, onComplete, reset]);

  useEffect(() => {
    reset();
    setText('');
    textRef.current = completeText;
    if (completeText) {
      animate();
    }
    return () => clearInterval(intervalRef.current);
  }, [animate, completeText, reset]);

  const stop = useCallback(
    (updatedText?: string) => {
      reset();
      if (updatedText) {
        setText(updatedText);
      }
    },
    [reset]
  );

  return {
    text: textRef.current === text ? completeText : text + '...',
    stop
  };
}
