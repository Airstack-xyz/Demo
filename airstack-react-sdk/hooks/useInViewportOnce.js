import { useRef, useState, useCallback, useEffect } from "react";
function useInViewportOnce(target) {
  const observer = useRef(null);
  const [inViewport, setInViewport] = useState(false);
  const intersected = useRef(false);
  const startObserver = useCallback(
    (observerRef) => {
      if (target.current && observerRef) {
        observerRef == null ? void 0 : observerRef.observe(target.current);
      }
    },
    [target]
  );
  const stopObserver = useCallback(
    (observerRef) => {
      if (target.current) {
        observerRef == null ? void 0 : observerRef.unobserve(target.current);
      }
      observerRef == null ? void 0 : observerRef.disconnect();
      observer.current = null;
    },
    [target]
  );
  const handleIntersection = useCallback(
    (entries) => {
      const entry = entries[0] || {};
      const { isIntersecting, intersectionRatio } = entry;
      const isInViewport = typeof isIntersecting !== "undefined" ? isIntersecting : intersectionRatio > 0;
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
export {
  useInViewportOnce
};
