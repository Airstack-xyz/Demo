import classNames from 'classnames';
import { GetAPIDropdown } from '../../Components/GetAPIDropdown';
import { Layout } from '../../Components/Layout';
import { MAX_SEARCH_WIDTH } from '../../Components/Search/constants';
import { ShareURLDropdown } from '../../Components/ShareURLDropdown';
import { OnChainGraph } from './OnChainGraph';
import { Search } from './Search';

const getAPIDropdownOptions = [
  {
    label: 'Onchain Graph Guide',
    link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/guides/onchain-graph'
  }
];

export function OnChainGraphPage() {
  return (
    <Layout>
      <div className={classNames('px-2 pt-5 max-w-[1440px] mx-auto sm:pt-8')}>
        <div style={{ maxWidth: MAX_SEARCH_WIDTH }} className="mx-auto w-full">
          <Search />
          <div className="my-3 flex-row-center">
            <div className="flex justify-center w-full gap-3.5 z-[21]">
              <GetAPIDropdown
                options={getAPIDropdownOptions}
                dropdownAlignment="center"
                hideFooter
                hideDesktopNudge
              />
              <ShareURLDropdown dropdownAlignment="center" />
            </div>
          </div>
        </div>
        <OnChainGraph />
      </div>
    </Layout>
  );
}
