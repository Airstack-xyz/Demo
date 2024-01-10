import classNames from 'classnames';
import { capitalizeFirstLetter, pluralize } from '../../../utils';
import LazyImage from '../../LazyImage';
import { AdvancedMentionSearchItem } from './types';

export const ListItemLoader = () => {
  return (
    <div className="h-[36px] my-0.5 shrink-0 rounded-18 bg-[linear-gradient(111deg,#ffffff0f_-8.95%,#ffffff00_114%)] animate-pulse" />
  );
};

type ListItemProps = {
  item: AdvancedMentionSearchItem;
  isFocused?: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
};

const listItemClass = 'flex items-center py-2 px-2.5 rounded-18';

export default function ListItem({
  item,
  isFocused,
  onClick,
  onMouseEnter
}: ListItemProps) {
  const { type, tokenType, name, blockchain, image, metadata } = item;

  const assetType = type === 'POAP' ? 'POAP' : tokenType;

  const formattedBlockchain = capitalizeFirstLetter(blockchain);

  const tokenMints = metadata?.tokenMints;
  const showPOAPHolderCount = type === 'POAP' && Number.isInteger(tokenMints);

  return (
    <button
      tabIndex={-1}
      className={classNames(
        listItemClass,
        isFocused &&
          'bg-[linear-gradient(111deg,#ffffff0f_-8.95%,#ffffff00_114%)]'
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <LazyImage
        className="h-[18px] w-[18px] rounded-full mr-2"
        src={image?.extraSmall}
        alt={blockchain}
        fallbackSrc={`/images/blockchains/${formattedBlockchain}.png`}
      />
      <span className="flex items-end overflow-hidden">
        <span className="text-sm text-white ellipsis pr-2">{name}</span>
        <span className="text-[10px] text-text-secondary pb-[1px] whitespace-nowrap">
          <span>{formattedBlockchain}</span>
          <span> • </span>
          <span>{assetType}</span>
          {showPOAPHolderCount && (
            <>
              <span> • </span>
              <span>{pluralize(tokenMints, 'holder')}</span>
            </>
          )}
        </span>
      </span>
    </button>
  );
}
