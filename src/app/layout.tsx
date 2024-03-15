import React from 'react';
import './globals.css';
import { Header } from '@/Components/Header/Header';
import { Metadata } from 'next';
import Script from 'next/script';

const GTM_ID = process.env.GOOGLE_TAG_MANAGER_ID;
const TWITTER_PIXEL_ID = process.env.TWITTER_PIXEL_ID;

const uatUrl = 'https://explorer.uat.airstack.xyz';
const prodUrl = 'https://airstack.xyz';
const devUrl = 'https://explorer.dev.airstack.xyz';

const url =
  process.env.ENV === 'uat'
    ? uatUrl
    : process.env.ENV === 'production' || process.env.ENV === 'prod'
    ? prodUrl
    : devUrl;

const BASE_URL = process.env.BASE_URL || url;
const title = 'Airstack Explorer';
const description =
  'Airstack - the easiest way to build on Farcaster. Frames SDK. Frames API. No-code Frames. Onchain Composability APIs for Ethereum, Base, Zora, Optimism, Polygon, XMTP, ENS, Farcaster, Lens and more. Trending Mints. Trending Tokens.';

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
            <main className="pr-2 pl-2 sm:pr-6 sm:pl-16 pt-5 flex flex-col items-center">
              {children}
            </main>
          </div>
        </div>
        {GTM_ID && (
          <Script async id="google-tag-manager">
            {`
            (function (w, d, s, l, i) {
              w[l] = w[l] || [];
              w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
              var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != 'dataLayer' ? '&l=' + l : '';
              j.async = true;
              j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
              f.parentNode.insertBefore(j, f);
            })(
              window,
              document,
              'script',
              'dataLayer',
              '${GTM_ID}'
            );
          `}
          </Script>
        )}
        {TWITTER_PIXEL_ID && (
          <Script async id="twitter-pixel">
            {`
            (function (e, t, n, s, u, a) {
              e.twq ||
                ((s = e.twq =
                  function () {
                    s.exe ? s.exe.apply(s, arguments) : s.queue.push(arguments);
                  }),
                (s.version = '1.1'),
                (s.queue = []),
                (u = t.createElement(n)),
                (u.async = !0),
                (u.src = 'https://static.ads-twitter.com/uwt.js'),
                (a = t.getElementsByTagName(n)[0]),
                a.parentNode.insertBefore(u, a));
            })(window, document, 'script');
            twq('config', '${TWITTER_PIXEL_ID}');
          `}
          </Script>
        )}
      </body>
    </html>
  );
}
