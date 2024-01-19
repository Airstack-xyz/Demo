import classNames from 'classnames';
import { Helmet } from 'react-helmet';
import { GetAPIDropdown } from '../../Components/GetAPIDropdown';
import { MainLayout } from '../../layouts/MainLayout';
import { MAX_SEARCH_WIDTH } from '../../Components/Search/constants';
import { OnChainGraph } from './OnChainGraph';
import { Search } from './Search';
import { useIdentity } from './hooks/useIdentity';
import { getAPIDropdownOptions } from './constants';

const BASE_URL = process.env.BASE_URL as string;

function MetaData() {
  const identity = useIdentity();

  const url = `${BASE_URL}/onchain-graph?identity=${identity}`;
  const title = 'Airstack Onchain Graph';
  const description =
    'The onchain address book - analyze onchain interactions to create recommendations.';
  const image = `${BASE_URL}/images/open-graph/onchain-graph.png`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}

export function OnChainGraphPage() {
  return (
    <MainLayout>
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
    </MainLayout>
  );
}
