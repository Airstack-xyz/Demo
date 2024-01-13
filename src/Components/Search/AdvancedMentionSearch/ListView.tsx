import { RefObject, useCallback, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Icon } from '../../Icon';
import { ChainSelectOption } from './ChainFilter';
import FiltersView, { FiltersButtonPortal } from './FiltersView';
import ListItem, { ListItemLoader } from './ListItem';
import { TokenSelectOption } from './TokenFilter';
import {
  AdvancedMentionSearchItem,
  FilterButtonDataType,
  FiltersType,
  SearchDataType
} from './types';
import { INFINITE_SCROLL_CONTAINER_ID, getAppliedFilterCount } from './utils';

const LOADING_ITEM_COUNT = 8;

const loadingItems = new Array(LOADING_ITEM_COUNT).fill(0);

function ListLoader() {
  return (
    <>
      {loadingItems.map((_, idx) => (
        <ListItemLoader key={idx} />
      ))}
    </>
  );
}

type ListViewProps = {
  mentionInputRef: RefObject<HTMLTextAreaElement | null>;
  filtersButtonData?: FilterButtonDataType;
  searchData: SearchDataType;
  focusIndex: null | number;
  isDataNotFound?: boolean;
  isErrorOccurred?: boolean;
  onTokenSelect: (option: TokenSelectOption) => void;
  onChainSelect: (option: ChainSelectOption) => void;
  onItemSelect: (item: AdvancedMentionSearchItem) => void;
  onItemHover: (itemIndex: number) => void;
  onFetchMore: () => void;
  onDataReload: () => void;
};

export default function ListView({
  mentionInputRef,
  filtersButtonData,
  searchData,
  focusIndex,
  isDataNotFound,
  isErrorOccurred,
  onTokenSelect,
  onChainSelect,
  onItemSelect,
  onItemHover,
  onFetchMore,
  onDataReload
}: ListViewProps) {
  const { isLoading, hasMore, items, selectedChain, selectedToken } =
    searchData;

  const [isFiltersViewVisible, setIsFiltersViewVisible] = useState(false);

  const toggleFiltersView = useCallback(() => {
    setIsFiltersViewVisible(prev => !prev);
  }, []);

  const hideFiltersView = useCallback(() => {
    setIsFiltersViewVisible(false);
  }, []);

  const applyFilter = useCallback(
    ({ token, chain }: FiltersType) => {
      onTokenSelect(token);
      onChainSelect(chain);
      setIsFiltersViewVisible(false);
      mentionInputRef.current?.focus();
    },
    [mentionInputRef, onChainSelect, onTokenSelect]
  );

  const appliedFilterCount = useMemo(
    () =>
      getAppliedFilterCount({
        appliedChainFilter: selectedChain,
        appliedTokenFilter: selectedToken
      }),
    [selectedChain, selectedToken]
  );

  return (
    <div className="py-2 px-2.5">
      {filtersButtonData && (
        <FiltersButtonPortal
          containerRef={filtersButtonData.containerRef}
          RenderButton={filtersButtonData.RenderButton}
          appliedFilterCount={appliedFilterCount}
          isOpen={isFiltersViewVisible}
          onClick={toggleFiltersView}
        />
      )}
      {isFiltersViewVisible ? (
        <FiltersView
          selectedChain={selectedChain}
          selectedToken={selectedToken}
          onClose={hideFiltersView}
          onApply={applyFilter}
        />
      ) : (
        <div
          id={INFINITE_SCROLL_CONTAINER_ID}
          className="max-h-[392px] overflow-y-scroll"
        >
          <InfiniteScroll
            next={onFetchMore}
            dataLength={items.length}
            hasMore={hasMore}
            loader={null}
            scrollableTarget={INFINITE_SCROLL_CONTAINER_ID}
            className="flex flex-col gap-2 pr-1"
          >
            {isDataNotFound && (
              <div className="p-2 text-center text-sm text-white w-full">
                No results to display!
              </div>
            )}
            {isErrorOccurred && (
              <div className="p-2 text-center text-sm text-white w-full flex-col-center">
                Error while fetching data!
                <button
                  type="button"
                  className="flex-row-center text-sm text-text-button font-bold mt-1"
                  onClick={onDataReload}
                >
                  <Icon
                    name="refresh-blue"
                    className="h-[14px] w-[14px] mr-0.5"
                  />
                  Try Again
                </button>
              </div>
            )}
            {items?.map((item, index) => (
              <ListItem
                key={`${item.address}_${index}`}
                item={item}
                isFocused={focusIndex === index}
                onClick={() => onItemSelect(item)}
                onMouseEnter={() => onItemHover(index)}
              />
            ))}
            {isLoading && <ListLoader />}
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
}
