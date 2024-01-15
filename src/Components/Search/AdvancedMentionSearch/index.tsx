import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { AdvancedMentionSearchQuery } from '../../../queries';
import { isMobileDevice } from '../../../utils/isMobileDevice';
import { fetchAIMentions, getMentionCount } from '../../Input/utils';
import { PADDING } from '../Search';
import { ChainSelectOption, defaultChainOption } from './ChainFilter';
import GridView from './GridView';
import ListView from './ListView';
import { TokenSelectOption, defaultTokenOption } from './TokenFilter';
import {
  AdvancedMentionSearchInput,
  AdvancedMentionSearchItem,
  AdvancedMentionSearchResponse,
  FilterButtonDataType,
  SearchDataType
} from './types';
import {
  INFINITE_SCROLL_CONTAINER_ID,
  getSearchItemMention,
  getSearchQuery,
  getUpdatedMentionValue
} from './utils';

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
  searchTerm: null,
  cursor: null,
  nextCursor: null,
  hasMore: true,
  items: [],
  selectedToken: defaultTokenOption,
  selectedChain: defaultChainOption,
  focusIndex: null
};

type AdvancedMentionSearchProps = {
  // reference to mention-input element
  mentionInputRef: MutableRefObject<HTMLTextAreaElement | null>;
  // mention-input's value containing markup for mentions
  mentionValue: string;
  // @mention query starting index in mention-input's display value i.e. value visible to user
  queryStartIndex: number;
  // @mention query ending index in mention-input's display value i.e. value visible to user,
  queryEndIndex: number;
  // determines whether to render results in form of list (LIST_VIEW) (mobile friendly) or 3x3 grid (GRID_VIEW)
  viewType: 'GRID_VIEW' | 'LIST_VIEW';
  // used for rendering filters button (for LIST_VIEW) outside (as portal) inside specified html element
  filtersButtonData?: FilterButtonDataType;
  // callback func, invoked when mention value is changed
  onChange: (value: string) => void;
  // callback func, invoked when search to be closed
  onClose: () => void;
};

export default function AdvancedMentionSearch({
  mentionInputRef,
  mentionValue,
  queryStartIndex,
  queryEndIndex,
  viewType,
  filtersButtonData,
  onChange,
  onClose
}: AdvancedMentionSearchProps) {
  const [searchData, setSearchData] =
    useState<SearchDataType>(defaultSearchData);

  const isMobile = isMobileDevice();

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

  const containerRef = useRef<HTMLDivElement>(null);
  const firstFetchRef = useRef(true);
  const itemsRef = useRef(items);
  const focusIndexRef = useRef(focusIndex);

  // store refs so that it can be used in events without triggering useEffect
  itemsRef.current = items;
  focusIndexRef.current = focusIndex;

  const isListView = viewType === 'LIST_VIEW';

  const focusGridItem = useCallback((delta: number) => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    const nextIndex =
      focusIndexRef.current == null ? 0 : focusIndexRef.current + delta;
    const lastIndex =
      itemsRef.current == null ? 0 : itemsRef.current.length - 1;

    const itemIndex = Math.max(0, Math.min(nextIndex, lastIndex));

    const activeEl = containerEl.querySelector<HTMLButtonElement>(
      `.infinite-scroll-component button:nth-of-type(${itemIndex + 1})`
    );
    const parentEl = containerEl.querySelector<HTMLDivElement>(
      `#${INFINITE_SCROLL_CONTAINER_ID}`
    );

    if (activeEl && parentEl) {
      const targetScrollTop =
        activeEl.offsetTop -
        parentEl.clientHeight * 0.5 +
        activeEl.offsetHeight * 0.5;
      parentEl.scroll({ behavior: 'smooth', top: targetScrollTop });
      setSearchData(prev => ({
        ...prev,
        focusIndex: itemIndex
      }));
    }
  }, []);

  const selectGridItem = useCallback(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;
    const itemIndex = focusIndexRef.current || 0;
    const activeEl = containerEl.querySelector<HTMLButtonElement>(
      `.infinite-scroll-component button:nth-of-type(${itemIndex + 1})`
    );
    activeEl?.click();
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
    },
    []
  );

  useEffect(() => {
    // returns null when there is no matching @mention query found from given index
    const query = getSearchQuery(mentionValue, queryStartIndex);
    if (query === null) {
      onClose();
      return;
    }
    setSearchData(prev => ({
      ...prev,
      searchTerm: query,
      cursor: null,
      hasMore: true,
      items: [],
      focusIndex: null
    }));
  }, [onClose, mentionValue, queryStartIndex]);

  useEffect(() => {
    const mentionInputEl = mentionInputRef.current;

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
      if (isListView) {
        switch (event.key) {
          case 'ArrowUp':
            focusGridItem(-1);
            break;
          case 'ArrowDown':
            focusGridItem(+1);
            break;
          case 'Enter':
            selectGridItem();
            break;
          case ' ':
          case 'Escape':
            onClose();
            break;
        }
      } else {
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
    selectGridItem,
    isListView
  ]);

  useEffect(() => {
    const controller = new AbortController();

    // for first time if no filters are applied then -> fetch POAPs while keeping default filters selected
    const shouldUseInitialFilters =
      firstFetchRef.current &&
      !searchTerm &&
      selectedToken.value === null &&
      selectedChain.value === null;

    const input = shouldUseInitialFilters
      ? {
          limit: LIMIT,
          tokenType: 'POAP'
        }
      : {
          limit: LIMIT,
          searchTerm: searchTerm,
          cursor: cursor,
          tokenType: selectedToken.value,
          blockchain: selectedChain.value
        };

    fetchData({ input, signal: controller.signal });

    return () => {
      controller?.abort();
    };
  }, [cursor, fetchData, searchTerm, selectedChain.value, selectedToken.value]);

  const handleDataReload = useCallback(() => {
    setSearchData(prev => ({
      ...prev,
      cursor: prev.cursor === null ? undefined : null, // causes fetchData useEffect to invoke again
      nextCursor: null,
      hasMore: true,
      items: [],
      focusIndex: null
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
        option.value === 'POAP' ? defaultChainOption : prev.selectedChain,
      focusIndex: null
    }));
  }, []);

  const handleChainSelect = useCallback((option: ChainSelectOption) => {
    setSearchData(prev => ({
      ...prev,
      cursor: null,
      nextCursor: null,
      hasMore: true,
      items: [],
      selectedChain: option,
      focusIndex: null
    }));
  }, []);

  const handleFetchMore = useCallback(() => {
    setSearchData(prev => ({
      ...prev,
      cursor: prev.nextCursor
    }));
  }, []);

  const handleItemHover = useCallback((index: number) => {
    setSearchData(prev => ({
      ...prev,
      focusIndex: index
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
    // @mention label should be truncated in mobile for first mention
    const truncateLabel = isMobile && getMentionCount(mentionValue) === 0;
    const mention = getSearchItemMention(item, truncateLabel);
    handleMentionChange(mention);
  };

  const isChainFilterDisabled = selectedToken.value === 'POAP';

  const isDataNotFound =
    !isError && !isLoading && !hasMore && items.length === 0;

  const isErrorOccurred = isError && !isLoading && items.length === 0;

  return (
    <div ref={containerRef} className="relative z-20">
      {isListView ? (
        <ListView
          mentionInputRef={mentionInputRef}
          filtersButtonData={filtersButtonData}
          searchData={searchData}
          focusIndex={focusIndex}
          isDataNotFound={isDataNotFound}
          isErrorOccurred={isErrorOccurred}
          onTokenSelect={handleTokenSelect}
          onChainSelect={handleChainSelect}
          onItemSelect={handleItemSelect}
          onItemHover={handleItemHover}
          onFetchMore={handleFetchMore}
          onDataReload={handleDataReload}
        />
      ) : (
        <GridView
          searchData={searchData}
          focusIndex={focusIndex}
          isChainFilterDisabled={isChainFilterDisabled}
          isDataNotFound={isDataNotFound}
          isErrorOccurred={isErrorOccurred}
          onTokenSelect={handleTokenSelect}
          onChainSelect={handleChainSelect}
          onItemSelect={handleItemSelect}
          onItemHover={handleItemHover}
          onFetchMore={handleFetchMore}
          onDataReload={handleDataReload}
        />
      )}
    </div>
  );
}
