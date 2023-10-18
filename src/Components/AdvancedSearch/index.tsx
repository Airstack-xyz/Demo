import { useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Asset, { AssetLoader } from './Asset';
import BlockchainFilter, {
  BlockchainSelectOption,
  defaultChainOption
} from './BlockchainFilter';
import Filters, { TokenSelectOption, defaultTokenOption } from './Filters';
import {
  getDisplayValue,
  getItemMention,
  getSearchQuery,
  getUpdatedMentionValue
} from './utils';
import {
  AdvancedSearchAIMentionsResponse,
  AdvancedSearchAIMentionsResults
} from './types';
import { Icon } from '../Icon';
import { fetchAIMentions } from '../Input/utils';
import { AdvancedSearchAIMentionsQuery } from '../../queries';

const LOADING_ITEM_COUNT = 9;

const loadingItems = new Array(LOADING_ITEM_COUNT).fill(0);

function GridLoader() {
  return (
    <>
      {loadingItems.map((_, idx) => (
        <AssetLoader key={idx} />
      ))}
    </>
  );
}

type AdvancedSearchProps = {
  mentionStartIndex: number;
  mentionEndIndex: number;
  mentionValue: string;
  onItemSelect: (value: string) => void;
  onClose: () => void;
};

type SearchData = {
  isLoading: boolean;
  isError?: boolean;
  searchTerm?: string | null;
  cursor?: string | null;
  nextCursor?: string | null;
  hasMore: boolean;
  items: AdvancedSearchAIMentionsResults[];
  selectedToken: TokenSelectOption;
  selectedChain: BlockchainSelectOption;
  focusIndex: number;
};

const LIMIT = 30;

const DISABLED_KEYS = [
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Enter'
];

const defaultSearchData: SearchData = {
  isLoading: true,
  searchTerm: null,
  cursor: null,
  nextCursor: null,
  hasMore: true,
  items: [],
  selectedToken: defaultTokenOption,
  selectedChain: defaultChainOption,
  focusIndex: 0
};

export default function AdvancedSearch({
  mentionStartIndex,
  mentionEndIndex,
  mentionValue,
  onItemSelect,
  onClose
}: AdvancedSearchProps) {
  const [searchData, setSearchData] = useState<SearchData>(defaultSearchData);
  const focusIndexRef = useRef(0);

  const {
    isLoading,
    isError,
    searchTerm,
    cursor,
    hasMore,
    items,
    selectedChain,
    selectedToken,
    focusIndex
  } = searchData;

  const focusGridItem = useCallback((delta: number) => {
    const gridItems = document.querySelectorAll<HTMLButtonElement>(
      '#advancedSearch .infinite-scroll-component button'
    );
    const itemIndex = Math.min(
      Math.max(focusIndexRef.current + delta, 0),
      gridItems.length
    );
    const activeItem = gridItems[itemIndex];
    if (activeItem) {
      activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      focusIndexRef.current = itemIndex;
      setSearchData(prev => ({
        ...prev,
        focusIndex: itemIndex
      }));
    }
  }, []);

  const selectGridItem = useCallback(() => {
    const gridItems = document.querySelectorAll<HTMLButtonElement>(
      '#advancedSearch .infinite-scroll-component button'
    );
    const itemIndex = focusIndexRef.current;
    const activeItem = gridItems[itemIndex];
    activeItem?.click();
  }, []);

  useEffect(() => {
    const text = getDisplayValue(mentionValue);
    const query = getSearchQuery(text, mentionStartIndex);
    // if there is no matching query found
    if (query === null) {
      onClose();
    }
    if (query) {
      setSearchData(prev => ({
        ...prev,
        searchTerm: query,
        cursor: null,
        hasMore: true,
        items: []
      }));
    }
  }, [mentionValue, onClose, mentionStartIndex]);

  useEffect(() => {
    const aiInputEl =
      document.querySelector<HTMLTextAreaElement>('#mention-input');

    // set ai-input's caret to correct position
    aiInputEl?.setSelectionRange(mentionEndIndex, mentionEndIndex);

    function handleAIInputClick() {
      const selectionStart = aiInputEl?.selectionStart ?? -1;
      // if ai-input's caret moves before @ position
      if (selectionStart <= mentionStartIndex) {
        onClose();
        return;
      }
      const substring =
        aiInputEl?.value.substring(mentionStartIndex, selectionStart) || '';
      // if ai-input's query contains whitespace
      if (/\s/.test(substring)) {
        onClose();
        return;
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      // disable ai-input's certain keys, so that they can be used in advanced search
      if (DISABLED_KEYS.includes(event.key)) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
      switch (event.key) {
        case 'ArrowLeft':
          focusGridItem(-1);
          break;
        case 'ArrowRight':
          focusGridItem(+1);
          break;
        case 'ArrowUp':
          focusGridItem(-3);
          break;
        case 'ArrowDown':
          focusGridItem(+3);
          break;
        case 'Enter':
          selectGridItem();
          break;
        case ' ':
        case 'Escape':
          onClose();
          break;
      }
    }

    document.addEventListener('keydown', handleKeyDown, true);
    aiInputEl?.addEventListener('click', handleAIInputClick);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      aiInputEl?.removeEventListener('click', handleAIInputClick);
    };
  }, [
    focusGridItem,
    onClose,
    mentionEndIndex,
    mentionStartIndex,
    selectGridItem
  ]);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchData() {
      setSearchData(prev => ({
        ...prev,
        isLoading: true,
        isError: false
      }));

      const [data, error] =
        await fetchAIMentions<AdvancedSearchAIMentionsResponse>({
          query: AdvancedSearchAIMentionsQuery,
          signal: controller.signal,
          input: {
            limit: LIMIT,
            searchTerm: searchTerm,
            cursor: cursor,
            tokenType: selectedToken.value,
            blockchain: selectedChain.value
          }
        });

      if (controller.signal.aborted) {
        return;
      }

      if (error) {
        setSearchData(prev => ({
          ...prev,
          isLoading: false,
          isError: true,
          items: []
        }));
        return;
      }

      const nextItems = data?.SearchAIMentions?.results || [];
      const nextCursor = data?.SearchAIMentions?.pageInfo?.nextCursor;
      const nextHasMore = !!nextCursor;
      focusIndexRef.current = 0;
      setSearchData(prev => ({
        ...prev,
        isLoading: false,
        isError: false,
        hasMore: nextHasMore,
        nextCursor: nextCursor,
        items: [...prev.items, ...nextItems],
        focusIndex: 0
      }));
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [searchTerm, cursor, selectedToken.value, selectedChain.value]);

  const handleReloadData = useCallback(() => {
    setSearchData(prev => ({
      ...prev,
      cursor: prev.cursor === null ? undefined : null, // Causes fetchData useEffect to invoke again
      nextCursor: null,
      hasMore: true,
      items: []
    }));
  }, []);

  const handleTokenSelect = useCallback((option: TokenSelectOption) => {
    setSearchData(prev => ({
      ...prev,
      cursor: null,
      nextCursor: null,
      hasMore: true,
      items: [],
      selectedToken: option,
      selectedChain:
        option.value === 'POAP' ? defaultChainOption : prev.selectedChain
    }));
  }, []);

  const handleChainSelect = useCallback((option: BlockchainSelectOption) => {
    setSearchData(prev => ({
      ...prev,
      cursor: null,
      nextCursor: null,
      hasMore: true,
      items: [],
      selectedChain: option
    }));
  }, []);

  const handleMoreFetch = useCallback(() => {
    setSearchData(prev => ({
      ...prev,
      cursor: prev.nextCursor
    }));
  }, []);

  const handleItemSelect = (item: AdvancedSearchAIMentionsResults) => {
    const itemMention = getItemMention(item);
    const value = getUpdatedMentionValue(
      mentionValue,
      itemMention,
      mentionStartIndex
    );
    if (value) {
      onItemSelect(value);
    } else {
      onClose();
    }
  };

  const isBlockchainFilterDisabled = selectedToken.value === 'POAP';

  const dataNotFound = !isError && !isLoading && !hasMore && items.length === 0;

  const errorOccurred = isError && !isLoading && items.length === 0;

  return (
    <div id="advancedSearch" className="pt-5 px-5">
      <div className="flex justify-between items-center">
        <Filters selectedOption={selectedToken} onSelect={handleTokenSelect} />
        <BlockchainFilter
          isDisabled={isBlockchainFilterDisabled}
          selectedOption={selectedChain}
          onSelect={handleChainSelect}
        />
      </div>
      <InfiniteScroll
        next={handleMoreFetch}
        dataLength={items.length}
        hasMore={hasMore}
        loader={<GridLoader />}
        height={508}
        className="mt-5 pr-1 grid grid-cols-3 auto-rows-max gap-[25px] no-scrollbar"
      >
        {dataNotFound && (
          <div className="p-2 text-center col-span-3">
            No results to display!
          </div>
        )}
        {errorOccurred && (
          <div className="p-2 flex-col-center col-span-3">
            Error while fetching data!
            <button
              type="button"
              className="flex-row-center text-base text-text-button font-bold mt-4"
              onClick={handleReloadData}
            >
              <Icon name="refresh-blue" width={18} height={18} /> Try Again
            </button>
          </div>
        )}
        {isLoading && <GridLoader />}
        {items.map((item, index) => (
          <Asset
            key={`${item.address}_${index}`}
            item={item}
            isFocused={focusIndex === index}
            onClick={() => handleItemSelect(item)}
            onMouseEnter={() => {
              focusIndexRef.current = index;
              setSearchData(prev => ({
                ...prev,
                focusIndex: index
              }));
            }}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
}
