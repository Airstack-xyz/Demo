import { Search } from '../../Components/Search';
import { Layout } from '../../Components/Layout';
import classNames from 'classnames';
import { GetAPIDropdown } from '../../Components/GetAPIDropdown';
import { OnChainGraph } from './OnChainGraph';

export function OnChainGraphPage() {
  return (
    <Layout>
      <div className={classNames('px-2 pt-5 max-w-[1440px] mx-auto sm:pt-8')}>
        <div className="max-w-[645px] mx-auto w-full">
          <Search />
          <div className="my-3 flex-row-center">
            <div className="flex justify-center w-full">
              <GetAPIDropdown options={[]} dropdownAlignment="center" />
            </div>
          </div>
        </div>
        <OnChainGraph />
      </div>
    </Layout>
  );
}
