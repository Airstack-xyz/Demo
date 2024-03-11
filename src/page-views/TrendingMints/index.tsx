import classNames from 'classnames';
import { Search } from './Search';
import { MAX_SEARCH_WIDTH } from '@/Components/Search/constants';
import { TrendingMints } from './TrendingMints';

export function TrendingMintsPage() {
  return (
    <div className={classNames('px-2 pt-5 max-w-[1440px] mx-auto sm:pt-8')}>
    <div style={{ maxWidth: MAX_SEARCH_WIDTH }} className="mx-auto w-full mb-10">
      <Search />
    </div>
    <TrendingMints />
  </div>
  );
}
