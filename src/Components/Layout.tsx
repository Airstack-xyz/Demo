import { ReactNode } from 'react';
import { Header } from './Header';

export function Layout({
  children
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="pt-[70px] pb-8">
      <Header />
      <div className="">{children}</div>
    </div>
  );
}
