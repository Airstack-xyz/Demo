import InfiniteScroll from 'react-infinite-scroll-component';
import { Icon } from '../../Icon';
import ChainFilter, { ChainSelectOption } from './ChainFilter';
import GridItem, { GridItemLoader } from './GridItem';
import TokenFilter, { TokenSelectOption } from './TokenFilter';
import { AdvancedMentionSearchItem, SearchDataType } from './types';

const LOADING_ITEM_COUNT = 9;

const loadingItems = new Array(LOADING_ITEM_COUNT).fill(0);

function GridLoader() {
  return (
    <>
      {loadingItems.map((_, idx) => (
        <GridItemLoader key={idx} />
      ))}
    </>
  );
}

type GridViewProps = {
  searchData: SearchDataType;
  focusIndex: null | number;
  isChainFilterDisabled?: boolean;
  isDataNotFound?: boolean;
  isErrorOccurred?: boolean;
  onTokenSelect: (option: TokenSelectOption) => void;
  onChainSelect: (option: ChainSelectOption) => void;
  onItemSelect: (item: AdvancedMentionSearchItem) => void;
  onItemHover: (itemIndex: number) => void;
  onFetchMore: () => void;
  onDataReload: () => void;
};

export default function GridView({
  searchData,
  focusIndex,
  isChainFilterDisabled,
  isDataNotFound,
  isErrorOccurred,
  onTokenSelect,
  onChainSelect,
  onItemSelect,
  onItemHover,
  onFetchMore,
  onDataReload
}: GridViewProps) {
  const { isLoading, hasMore, items, selectedChain, selectedToken } =
    searchData;

  return (
    <div className="pt-5 px-5">
      <div className="flex justify-between items-center">
        <TokenFilter selectedOption={selectedToken} onSelect={onTokenSelect} />
        <ChainFilter
          isDisabled={isChainFilterDisabled}
          selectedOption={selectedChain}
          onSelect={onChainSelect}
        />
      </div>
      <InfiniteScroll
        next={onFetchMore}
        dataLength={items.length}
        hasMore={hasMore}
        loader={<GridLoader />}
        height={508}
        className="mt-5 pr-1 grid grid-cols-3 auto-rows-max gap-[25px] no-scrollbar"
      >
        {isDataNotFound && (
          <div className="p-2 text-center col-span-3">
            No results to display!
          </div>
        )}
        {isErrorOccurred && (
          <div className="p-2 flex-col-center col-span-3">
            Error while fetching data!
            <button
              type="button"
              className="flex-row-center text-base text-text-button font-bold mt-4"
              onClick={onDataReload}
            >
              <Icon name="refresh-blue" width={18} height={18} /> Try Again
            </button>
          </div>
        )}
        {isLoading && <GridLoader />}
        {items.map((item, index) => (
          <GridItem
            key={`${item.address}_${index}`}
            item={item}
            isFocused={focusIndex === index}
            onClick={() => onItemSelect(item)}
            onMouseEnter={() => onItemHover(index)}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
}
