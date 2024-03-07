import React, { Suspense } from 'react';
import './globals.css';
import { Header } from '@/Components/Header';
import { AuthProvider } from '@/context/auth';

function Content({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <>
        <Header />
        <main className="">{children}</main>
      </>
    </AuthProvider>
  );
}

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
            <Suspense fallback={<Content>{children}</Content>}>
              <Content>{children}</Content>
            </Suspense>
          </div>
        </div>
      </body>
    </html>
  );
}
