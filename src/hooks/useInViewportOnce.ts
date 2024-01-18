import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

export function useInViewportOnce(target: RefObject<HTMLElement>) {
  const observer = useRef<IntersectionObserver | null>(null);
  const [inViewport, setInViewport] = useState<boolean>(false);
  const intersected = useRef<boolean>(false);

  const startObserver = useCallback(
    (observerRef: IntersectionObserver | null) => {
      if (target.current && observerRef) {
        observerRef?.observe(target.current);
      }
    },
    [target]
  );

  const stopObserver = useCallback(
    (observerRef: IntersectionObserver | null) => {
      if (target.current) {
        observerRef?.unobserve(target.current);
      }

      observerRef?.disconnect();
      observer.current = null;
    },
    [target]
  );

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0] || {};
      const { isIntersecting, intersectionRatio } = entry;
      const isInViewport =
        typeof isIntersecting !== 'undefined'
          ? isIntersecting
          : intersectionRatio > 0;
      // enter
      if (!intersected.current && isInViewport) {
        intersected.current = true;
        setInViewport(isInViewport);
        return;
      }
    },
    []
  );

  const getIntersectionObserver = useCallback(() => {
    if (!observer.current) {
      observer.current = new IntersectionObserver(handleIntersection);
      return observer.current;
    }
    return null;
  }, [handleIntersection]);

  useEffect(() => {
    const observerRef = getIntersectionObserver();
    startObserver(observerRef);
    return () => {
      stopObserver(observerRef);
    };
  }, [getIntersectionObserver, startObserver, stopObserver]);

  return inViewport;
}
