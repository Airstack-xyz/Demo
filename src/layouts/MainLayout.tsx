import { ReactNode } from 'react';
import { Header } from '../Components/Header';

export function MainLayout({
  children
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="pt-[70px] pb-8 max-sm:min-h-[140vh]">
      <Header />
      <div className="">{children}</div>
    </div>
  );
}
