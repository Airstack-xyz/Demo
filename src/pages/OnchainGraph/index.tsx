import { Search } from './Search';
import { Layout } from '../../Components/Layout';
import classNames from 'classnames';
import { OnChainGraph } from './OnChainGraph';

export function OnChainGraphPage() {
  return (
    <Layout>
      <div className={classNames('px-2 pt-5 max-w-[1440px] mx-auto sm:pt-8')}>
        <div className="max-w-[645px] mx-auto w-full">
          <Search />
        </div>
        <OnChainGraph />
      </div>
    </Layout>
  );
}
