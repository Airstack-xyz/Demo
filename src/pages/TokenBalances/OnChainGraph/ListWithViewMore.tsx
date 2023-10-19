import { Chain } from '@airstack/airstack-react/constants';
import { Asset } from '../../../Components/Asset';
import { RecommendedUser } from './types';
import { useMemo, useState } from 'react';
import classNames from 'classnames';

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
      className={classNames('ml-5', {
        'skeleton-loader': loading
      })}
    >
      {visibleItems?.map?.((item, index) => (
        <li key={index} className="flex items-center text-text-secondary">
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
      {loading && (
        <li
          className="flex items-center text-text-secondary h-5"
          data-loader-type="block"
          data-loader-width="50"
        ></li>
      )}
      {!loading && !showAll && items.length > limit && (
        <button onClick={() => setShowAll(true)} className="text-text-button">
          see more
        </button>
      )}
    </ul>
  );
}
