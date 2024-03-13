import { Icon } from '@/Components/Icon';
import LazyImage from '@/Components/LazyImage';
import { Link } from '@/Components/Link';
import { resetCachedUserInputs } from '@/hooks/useSearchInput';
import { createTokenHolderUrl } from '@/utils/createTokenUrl';
import { UsersIcon } from '../Icons';
import { TrendingMint } from './types';

export const MintItemLoader = () => {
  return (
    <div className="aspect-square min-h-[288px] rounded-[18px] bg-token animate-pulse" />
  );
};

export function Mint({ item }: { item: TrendingMint }) {
  const tokenNft = item?.token?.tokenNfts?.find(
    v => v.contentValue?.image?.medium
  );

  const image =
    tokenNft?.contentValue?.image?.medium || '/images/token-placeholder.svg';

  const criteriaCount = item?.criteriaCount || 0;

  const name = item?.token?.name;

  const symbol = item?.token?.symbol || item?.token?.type;

  const tokenHolderUrl = createTokenHolderUrl({
    address: item.address || '',
    inputType: 'ADDRESS',
    type: item.token?.type || '',
    blockchain: item.blockchain || '',
    label: name || '--'
  });

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.stopPropagation();
    resetCachedUserInputs('tokenHolder');
  };

  return (
    <Link
      className="group aspect-square flex flex-col justify-between max-w-[288px] w-full relative rounded-18 bg-token token cursor-pointer"
      to={tokenHolderUrl}
      onClick={handleClick}
    >
      <LazyImage
        src={image}
        className="absolute aspect-square overflow-hidden object-cover rounded-18"
      />
      <div className="flex justify-between m-2 z-[5]">
        <button className="rounded-18 text-primary hover:border-text-secondary visible flex items-center gap-1 border border-solid border-transparent bg-white px-3 py-2 text-sm group-hover:visible sm:invisible">
          <UsersIcon />
          Holders
        </button>
        <div
          className="flex items-center gap-1 px-2 py-1 bg-glass text-sm rounded-18"
          style={{ textShadow: 'rgba(0, 0, 0, 0.4) 0px 0px 2px' }}
        >
          <Icon name="token-balances" height={16} width={16} />
          {criteriaCount}
        </div>
      </div>
      <div className="p-3 bg-glass rounded-b-18 visible sm:invisible group-hover:visible">
        <div className="text-sm">{symbol || '--'}</div>
        <div className="font-bold mt-2">{name || '--'}</div>
      </div>
    </Link>
  );
}
