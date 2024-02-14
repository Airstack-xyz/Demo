import { Header } from './Header';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="pt-[70px] pb-8 max-sm:min-h-[140vh]">
      <Header />
      <main className="">
        <Outlet />
      </main>
    </div>
  );
}
