import { Search } from './Search';
import { Layout } from '../../Components/Layout';
import classNames from 'classnames';
import { OnChainGraph } from './OnChainGraph';
import { GetAPIDropdown } from '../../Components/GetAPIDropdown';

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
        <div className="max-w-[645px] mx-auto w-full">
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
