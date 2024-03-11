import { Chain } from '@airstack/airstack-react/constants';
import { Asset } from '../../Components/Asset';
import { RecommendedUser } from './types';
import { useMemo, useState } from 'react';
import classNames from 'classnames';

function Loader() {
  return (
    <li className="flex items-center mb-2">
      <div
        data-loader-type="block"
        className="h-6 w-6 rounded-full mr-1.5"
      ></div>
      <div
        className="flex items-center text-text-secondary h-5"
        data-loader-type="block"
        data-loader-width="50"
      ></div>
    </li>
  );
}

export function ListWithViewMore({
  items = [],
  limit = 3,
  loading
}: {
  items: RecommendedUser['nfts'];
  limit?: number;
  loading?: boolean;
}) {
  const [showAll, setShowAll] = useState(false);
  const visibleItems = useMemo(() => {
    if (showAll) {
      return items;
    }
    return items.slice(0, limit);
  }, [items, limit, showAll]);
  return (
    <ul
      className={classNames('ml-5 mb-2', {
        'skeleton-loader': loading
      })}
    >
      {visibleItems?.map?.((item, index) => (
        <li
          key={index}
          className="flex mb-2 last:mb-0 items-center text-text-secondary"
        >
          <span className="h-[20px] w-[20px] [&>img]:w-full mr-2">
            <Asset
              chain={item.blockchain as Chain}
              tokenId={item.tokenNfts?.tokenId || ''}
              address={item.blockchain ? item.address || '' : ''}
              image={item.image}
              useImageOnError
              className="h-[20px] w-[20px]"
            />
          </span>
          {item.name}
        </li>
      ))}
      {loading && <Loader />}
      {!loading && !showAll && items.length > limit && (
        <button
          onClick={e => {
            e.stopPropagation();
            setShowAll(true);
          }}
          className="text-text-button"
        >
          see more
        </button>
      )}
    </ul>
  );
}
