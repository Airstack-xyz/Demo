import classNames from 'classnames';
import { Helmet } from 'react-helmet';
import { GetAPIDropdown } from '../../Components/GetAPIDropdown';
import { Layout } from '../../Components/Layout';
import { MAX_SEARCH_WIDTH } from '../../Components/Search/constants';
import { OnChainGraph } from './OnChainGraph';
import { Search } from './Search';

function MetaData() {
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
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://explorer.airstack.xyz" />
      <meta
        property="og:image"
        content="/images/open-graph/onchain-graph.png"
      />

      <meta property="twitter:title" content="Airstack Onchain Graph" />
      <meta
        property="twitter:description"
        content="The onchain address book - analyze onchain interactions to create recommendations."
      />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:site" content="@airstack_xyz" />
      <meta property="twitter:url" content="https://explorer.airstack.xyz" />
      <meta
        property="twitter:image"
        content="/images/open-graph/onchain-graph.png"
      />
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
