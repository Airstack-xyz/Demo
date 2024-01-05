import { Icon, IconType } from '../../Icon';
import LazyImage from '../../LazyImage';
import { AdvancedMentionSearchItem } from './types';
import { getFormattedAddress } from './utils';
import classNames from 'classnames';

export const GridItemLoader = () => {
  return (
    <div className="aspect-square rounded-[18px] bg-secondary animate-pulse" />
  );
};

type GridItemProps = {
  item: AdvancedMentionSearchItem;
  isFocused?: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
};

const gridItemClass =
  'aspect-square rounded-[18px] bg-secondary p-2.5 flex flex-col text-left justify-between overflow-hidden relative border border-transparent';

export default function GridItem({
  item,
  isFocused,
  onClick,
  onMouseEnter
}: GridItemProps) {
  const {
    type,
    name,
    address,
    eventId,
    blockchain,
    tokenType,
    symbol,
    image,
    metadata
  } = item;

  const assetType = type === 'POAP' ? 'POAP' : tokenType;

  const formattedAddress = getFormattedAddress(type, eventId, address);

  const tokenMints = metadata?.tokenMints;
  const showPOAPHolderCount = type === 'POAP' && Number.isInteger(tokenMints);

  return (
    <button
      tabIndex={-1}
      className={classNames(gridItemClass, isFocused && 'border-white/50')}
      style={{ textShadow: 'rgba(0, 0, 0, 0.4) 0px 0px 2px' }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <div className="absolute inset-0 flex-col-center">
        <LazyImage
          alt="asset-image"
          src={image?.medium}
          className={classNames(
            'aspect-square',
            tokenType === 'ERC20' && image?.medium ? 'h-[50%]' : 'h-full'
          )}
        />
      </div>
      <div className="w-full flex justify-end text-sm">
        <div className="rounded-full h-[32px] w-[32px] bg-glass border-solid-light">
          <Icon
            name={blockchain as IconType}
            height={30}
            width={30}
            style={{ filter: 'drop-shadow(rgba(0, 0, 0, 0.4) 0px 0px 2px)' }}
          />
        </div>
        <div className="h-[32px] rounded-3xl ml-2.5 border-solid-light flex-row-center px-2 bg-glass">
          {assetType}
        </div>
        {showPOAPHolderCount && (
          <div className="h-[32px] rounded-3xl ml-2.5 border-solid-light flex-row-center px-2.5 bg-glass">
            <Icon
              name="token-holders-white"
              height={18}
              width={18}
              className="mr-0.5"
            />
            {tokenMints}
          </div>
        )}
      </div>
      <div className="rounded-[15px] w-full px-4 py-2 text-sm bg-glass border-solid-light">
        <div className="ellipsis">{formattedAddress || '--'}</div>
        <div className="flex items-center justify-between font-semibold">
          <div className="ellipsis flex-1">{name}</div>
          {!!symbol && <div className="ml-1">{symbol}</div>}
        </div>
      </div>
    </button>
  );
}
