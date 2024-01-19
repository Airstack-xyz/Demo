import { ReactNode } from 'react';
import { Header } from '../Components/Header';
import { Helmet } from 'react-helmet';

const BASE_URL = process.env.BASE_URL as string;

function BaseMetaData() {
  const title = 'Airstack Explorer';
  const description =
    'Visual Blockchain Explorer. Open source. Forkable. Fetch identities including; ENS, Lens, Farcaster, XMTP, POAPs, NFTs, Tokens.';
  const image = `${BASE_URL}/images/open-graph/explorer.png`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:url" content={BASE_URL} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@airstack_xyz" />
      <meta name="twitter:url" content={BASE_URL} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}

export function MainLayout({
  children
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="pt-[70px] pb-8 max-sm:min-h-[140vh]">
      <BaseMetaData />
      <Header />
      <div className="">{children}</div>
    </div>
  );
}
