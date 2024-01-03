import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AdvancedMentionSearchQuery } from '../../../queries';
import { Icon } from '../../Icon';
import { fetchAIMentions } from '../../Input/utils';
import { PADDING } from '../Search';
import BlockchainFilter, {
  BlockchainSelectOption,
  defaultChainOption
} from './BlockchainFilter';
import Filters, { TokenSelectOption, defaultTokenOption } from './Filters';
import GridItem, { GridItemLoader } from './GridItem';
import {
  AdvancedMentionSearchInput,
  AdvancedMentionSearchItem,
  AdvancedMentionSearchResponse
} from './types';
import {
  getSearchQuery,
  getSearchItemMention,
  getUpdatedMentionValue
} from './utils';

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

type SearchDataType = {
  isLoading: boolean;
  isError?: boolean;
  cursor?: string | null;
  nextCursor?: string | null;
  hasMore: boolean;
  items: AdvancedMentionSearchItem[];
  selectedToken: TokenSelectOption;
  selectedChain: BlockchainSelectOption;
};

const CONTAINER_ID = 'advanced-mention-search';

const LIMIT = 30;

const DISABLED_KEYS = [
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Enter'
];

const defaultSearchData: SearchDataType = {
  isLoading: false,
  cursor: null,
  nextCursor: null,
  hasMore: true,
  items: [],
  selectedToken: defaultTokenOption,
  selectedChain: defaultChainOption
};

export default function AdvancedMentionSearch({
  mentionInputRef, // reference to mention-input element
  mentionValue, // mention-input's value containing markup for mentions
  queryStartIndex, // @mention query starting index in mention-input's display value i.e. value visible to user
  queryEndIndex, // @mention query ending index in mention-input's display value i.e. value visible to user
  onChange,
  onClose
}: {
  mentionInputRef: MutableRefObject<HTMLTextAreaElement | null>;
  mentionValue: string;
  query: string;
  queryStartIndex: number;
  queryEndIndex: number;
  onChange: (value: string) => void;
  onClose: () => void;
}) {
  const [searchData, setSearchData] =
    useState<SearchDataType>(defaultSearchData);
  const [focusIndex, setFocusIndex] = useState(0);

  const focusIndexRef = useRef(0);
  const firstFetchRef = useRef(true);

  // store refs so that it can be used in events without triggering useEffect
  focusIndexRef.current = focusIndex;

  const {
    isLoading,
    isError,
    cursor,
    hasMore,
    items,
    selectedChain,
    selectedToken
  } = searchData;

  const focusGridItem = useCallback((delta: number) => {
    const gridItems = document.querySelectorAll<HTMLButtonElement>(
      `#${CONTAINER_ID} .infinite-scroll-component button`
    );
    const itemIndex = Math.min(
      Math.max(focusIndexRef.current + delta, 0),
      gridItems.length
    );
    const activeItem = gridItems[itemIndex];
    if (activeItem) {
      activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setFocusIndex(itemIndex);
    }
  }, []);

  const selectGridItem = useCallback(() => {
    const gridItems = document.querySelectorAll<HTMLButtonElement>(
      `#${CONTAINER_ID} .infinite-scroll-component button`
    );
    const itemIndex = focusIndexRef.current;
    const activeItem = gridItems[itemIndex];
    activeItem?.click();
  }, []);

  const fetchData = useCallback(
    async ({
      input,
      signal
    }: {
      input: AdvancedMentionSearchInput;
      signal: AbortSignal;
    }) => {
      setSearchData(prev => ({
        ...prev,
        isLoading: true,
        isError: false
      }));

      const [data, error] =
        await fetchAIMentions<AdvancedMentionSearchResponse>({
          query: AdvancedMentionSearchQuery,
          signal: signal,
          input: input
        });

      firstFetchRef.current = false;

      if (signal.aborted) {
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

      setSearchData(prev => ({
        ...prev,
        isLoading: false,
        isError: false,
        hasMore: nextHasMore,
        nextCursor: nextCursor,
        items: [...prev.items, ...nextItems]
      }));
      setFocusIndex(0);
    },
    []
  );

  useEffect(() => {
    const mentionInputEl = mentionInputRef.current;

    // set mention-input's caret to correct position
    mentionInputEl?.setSelectionRange(queryEndIndex, queryEndIndex);

    function handleInputClick() {
      const selectionStart = mentionInputEl?.selectionStart ?? -1;
      // if mention-input's caret moves before @ position
      if (selectionStart <= queryStartIndex) {
        onClose();
        return;
      }
      const substring =
        mentionInputEl?.value.substring(queryStartIndex, selectionStart) || '';
      // if mention-input's caret moves after @mention
      if (/\s/.test(substring)) {
        onClose();
        return;
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      // disable mention-input's certain keys, so that they can be used in advanced search
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
    mentionInputEl?.addEventListener('click', handleInputClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      mentionInputEl?.removeEventListener('click', handleInputClick);
    };
  }, [
    queryEndIndex,
    queryStartIndex,
    focusGridItem,
    mentionInputRef,
    onClose,
    selectGridItem
  ]);

  useEffect(() => {
    // returns null when there is no matching @mention query found from given index
    const query = getSearchQuery(mentionValue, queryStartIndex);
    if (query === null) {
      onClose();
      return;
    }

    const controller = new AbortController();

    // for first time if no filters are applied then -> fetch POAPs while keeping default filters selected
    const shouldUseInitialFilters =
      firstFetchRef.current &&
      !query &&
      selectedToken.value === null &&
      selectedChain.value === null;

    const input = shouldUseInitialFilters
      ? {
          limit: LIMIT,
          tokenType: 'POAP'
        }
      : {
          limit: LIMIT,
          searchTerm: query,
          cursor: cursor,
          tokenType: selectedToken.value,
          blockchain: selectedChain.value
        };

    fetchData({ input, signal: controller.signal });

    return () => {
      controller?.abort();
    };
  }, [
    cursor,
    selectedToken.value,
    selectedChain.value,
    fetchData,
    mentionValue,
    queryStartIndex,
    onClose
  ]);

  const handleReloadData = useCallback(() => {
    setSearchData(prev => ({
      ...prev,
      cursor: prev.cursor === null ? undefined : null, // causes fetchData useEffect to invoke again
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

  const handleMentionChange = (mention: string) => {
    const value = getUpdatedMentionValue(
      mentionValue,
      mention,
      queryStartIndex
    );
    if (value !== null) {
      // append space to the value
      const finalValue = value.trim() + PADDING;
      onChange(finalValue);
    }
    onClose();
  };

  const handleItemSelect = (item: AdvancedMentionSearchItem) => {
    const mention = getSearchItemMention(item);
    handleMentionChange(mention);
  };

  const isBlockchainFilterDisabled = selectedToken.value === 'POAP';

  const dataNotFound = !isError && !isLoading && !hasMore && items.length === 0;

  const errorOccurred = isError && !isLoading && items.length === 0;

  return (
    <div id={CONTAINER_ID} className="pt-5 px-5 relative z-20">
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
          <GridItem
            key={`${item.address}_${index}`}
            item={item}
            isFocused={focusIndex === index}
            onClick={() => handleItemSelect(item)}
            onMouseEnter={() => setFocusIndex(index)}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
}
