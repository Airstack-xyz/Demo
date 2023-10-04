import { ReactNode, useLayoutEffect } from 'react';
import { Header } from './Header';
import { useLocation } from 'react-router-dom';

export function Layout({
  children
}: {
  children: ReactNode;
  className?: string;
}) {
  const location = useLocation();

  useLayoutEffect(() => {
    // Scroll to top of page if location changes
    document.documentElement.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="w-full h-screen flex flex-col items-center pt-[70px] pb-8">
      <Header />
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
