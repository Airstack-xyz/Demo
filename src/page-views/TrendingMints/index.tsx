import classNames from 'classnames';
import { Search } from './Search';
import { MAX_SEARCH_WIDTH } from '@/Components/Search/constants';
import { TrendingMints } from './TrendingMints';

export function TrendingMintsPage() {
  return (
    <div className={classNames('max-w-screen-lg')}>
    <div style={{ maxWidth: MAX_SEARCH_WIDTH }} className="w-full mb-10">
      <Search />
    </div>
    <TrendingMints />
  </div>
  );
}
