import { ReactNode } from 'react';
import { Header } from '../Components/Header';
import { Helmet } from 'react-helmet';

const BASE_URL = process.env.BASE_URL as string;
const IMAGE_URL = `${BASE_URL}/images/open-graph/explorer.png`;

function BaseMetaData() {
  return (
    <Helmet>
      <title>Airstack Explorer</title>
      <meta
        name="description"
        content="Visual Blockchain Explorer. Open source. Forkable. Fetch identities including; ENS, Lens, Farcaster, XMTP, POAPs, NFTs, Tokens."
      />

      <meta property="og:title" content="Airstack Explorer" />
      <meta
        property="og:description"
        content="Visual Blockchain Explorer. Open source. Forkable. Fetch identities including; ENS, Lens, Farcaster, XMTP, POAPs, NFTs, Tokens."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={BASE_URL} />
      <meta property="og:image" content={IMAGE_URL} />

      <meta
        property="twitter:title"
        content="Airstack Explorer"
        data-react-helmet="true"
      />
      <meta
        property="twitter:description"
        content="Visual Blockchain Explorer. Open source. Forkable. Fetch identities including; ENS, Lens, Farcaster, XMTP, POAPs, NFTs, Tokens."
        data-react-helmet="true"
      />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:site" content="@airstack_xyz" />
      <meta
        property="twitter:url"
        content={BASE_URL}
        data-react-helmet="true"
      />
      <meta property="twitter:image" content={IMAGE_URL} />
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
