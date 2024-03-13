'use client';
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import dynamic from 'next/dynamic';

function Loader() {
  return (
    <div className="flex-col-center skeleton-loader">
      <div
        className="flex items-center rounded-full w-[404px] sm:w-[604px] h-[30px] sm:h-[38px] my-6"
        data-loader-type="block"
      ></div>
      <div
        className="flex items-center h-[50px] w-full rounded-full px-4 py-3 transition-all z-20 relative bg-[#ffffff0d]"
        data-loader-type="block"
      ></div>
    </div>
  );
}

// !IMPORTANT: This component is used to load the search component
// when we are directly loding search component, sometimes it does not apear on the screen untill the user clicks on the page.
// this component might fix it as it will re-render unitll the search component is loaded

export function SearchLoader() {
  const intervalId = useRef(0);
  const [tempCount, setTempCount] = useState(0);

  useEffect(() => {
    intervalId.current = window.setInterval(() => {
      setTempCount(count => count + 1);
    }, 500);
    return () => clearInterval(intervalId.current);
  }, []);

  const Search = useMemo(
    () =>
      dynamic(
        () =>
          import('../Search/Search').then(module => {
            console.log('search component fetched ', module);
            return module;
          }),
        {
          ssr: false,
          loading: () => <Loader />
        }
      ),
    []
  );

  const onSearchLoaded = useCallback(() => {
    console.log('onSearchLoaded');
    clearInterval(intervalId.current);
  }, []);

  console.log('loading serach counter', tempCount);

  return (
    <Suspense>
      <Search onLoad={onSearchLoaded} />
    </Suspense>
  );
}
