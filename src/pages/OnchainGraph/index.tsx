import classNames from 'classnames';
import { Helmet } from 'react-helmet';
import { GetAPIDropdown } from '../../Components/GetAPIDropdown';
import { Layout } from '../../Components/Layout';
import { MAX_SEARCH_WIDTH } from '../../Components/Search/constants';
import { OnChainGraph } from './OnChainGraph';
import { Search } from './Search';
import { useIdentity } from './hooks/useIdentity';

const BASE_URL = process.env.BASE_URL as string;

function MetaData() {
  const identity = useIdentity();

  const url = `${BASE_URL}/onchain-graph?identity=${identity}`;
  const image = `${BASE_URL}/images/open-graph/onchain-graph.png`;

  return (
    <Helmet>
      <title>Airstack Onchain Graph</title>
      <meta
        name="description"
        content="The onchain address book - analyze onchain interactions to create recommendations."
      />

      <meta property="og:title" content="Airstack Onchain Graph" />
      <meta
        property="og:description"
        content="The onchain address book - analyze onchain interactions to create recommendations."
      />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      <meta property="twitter:title" content="Airstack Onchain Graph" />
      <meta
        property="twitter:description"
        content="The onchain address book - analyze onchain interactions to create recommendations."
      />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
}

const getAPIDropdownOptions = [
  {
    label: 'Onchain Graph Guide',
    link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/guides/onchain-graph'
  }
];

export function OnChainGraphPage() {
  return (
    <Layout>
      <MetaData />
      <div className={classNames('px-2 pt-5 max-w-[1440px] mx-auto sm:pt-8')}>
        <div style={{ maxWidth: MAX_SEARCH_WIDTH }} className="mx-auto w-full">
          <Search />
          <div className="my-3 flex-row-center">
            <div className="flex justify-center w-full z-[21]">
              <GetAPIDropdown
                options={getAPIDropdownOptions}
                dropdownAlignment="center"
                hideFooter
                hideDesktopNudge
              />
            </div>
          </div>
        </div>
        <OnChainGraph />
      </div>
    </Layout>
  );
}
