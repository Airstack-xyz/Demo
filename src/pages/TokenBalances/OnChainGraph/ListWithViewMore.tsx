import { Chain } from '@airstack/airstack-react/constants';
import { Asset } from '../../../Components/Asset';
import { RecommendedUser } from './types';
import { useMemo, useState } from 'react';

export function ListWithViewMore({
  items = [],
  limit = 3
}: {
  items: RecommendedUser['nfts'];
  limit?: number;
}) {
  const [showAll, setShowAll] = useState(false);
  const visibleItems = useMemo(() => {
    if (showAll) {
      return items;
    }
    return items.slice(0, limit);
  }, [items, limit, showAll]);
  return (
    <ul className="ml-5">
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
      {!showAll && items.length > limit && (
        <button onClick={() => setShowAll(true)} className="text-text-button">
          see more
        </button>
      )}
    </ul>
  );
}
