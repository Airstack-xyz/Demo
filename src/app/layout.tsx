import React from 'react';
import './globals.css';
import { Header } from '@/Components/Header';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div id="root">
          <div className="pt-[70px] pb-8 max-sm:min-h-[140vh]">
            <Header />
            <main className="">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
