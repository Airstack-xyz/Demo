import React from 'react';
import './globals.css';
import { Header } from '@/Components/Header';
import { Metadata } from 'next';

const uatUrl = 'https://explorer.uat.airstack.xyz';
const prodUrl = 'https://explorer.airstack.xyz';
const devUrl = 'https://explorer.dev.airstack.xyz';

const url =
  process.env.ENV === 'uat'
    ? uatUrl
    : process.env.ENV === 'production' || process.env.ENV === 'prod'
    ? prodUrl
    : devUrl;
console.log('url', url);

const BASE_URL = process.env.BASE_URL || url;
const title = 'Airstack Explorer';
const description =
  'Multi-chain visual blockchain explorer. Search using ENS, Farcaster, Lens, NFTs, tokens. Fetch historical balances. Download CSV or get APIs';

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL(BASE_URL),
  icons: [
    {
      type: 'image/svg+xml',
      url: '/favicon.ico'
    }
  ],
  openGraph: {
    url: BASE_URL,
    type: 'website',
    title,
    description,
    images: [`${BASE_URL}/images/open-graph/explorer.png`]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@airstack_xyz',
    title,
    description,
    images: [`${BASE_URL}/images/open-graph/explorer.png`]
  }
};

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
