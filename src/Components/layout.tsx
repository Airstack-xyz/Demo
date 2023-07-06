import { ReactNode } from 'react';
import { Header } from './Header';

export function Layout({
  children
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center mt-[70px] pb-8">
      <Header />
      {children}
    </div>
  );
}
