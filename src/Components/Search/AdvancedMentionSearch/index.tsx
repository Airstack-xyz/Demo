import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { AdvancedMentionSearchQuery } from '../../../queries';
import { fetchAIMentions } from '../../Input/utils';
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
  selectedChain: defaultChainOption
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
  const [focusIndex, setFocusIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const focusIndexRef = useRef(0);
  const firstFetchRef = useRef(true);

  // store refs so that it can be used in events without triggering useEffect
  focusIndexRef.current = focusIndex;

  const isListView = viewType === 'LIST_VIEW';

  const {
    isLoading,
    isError,
    searchTerm,
    cursor,
    hasMore,
    items,
    selectedChain,
    selectedToken
  } = searchData;

  const focusGridItem = useCallback((delta: number) => {
    const containerEl = containerRef.current;
    if (!containerEl) return;
    const gridItems = containerEl.querySelectorAll<HTMLButtonElement>(
      `.infinite-scroll-component button`
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
    const containerEl = containerRef.current;
    if (!containerEl) return;
    const gridItems = containerEl.querySelectorAll<HTMLButtonElement>(
      `.infinite-scroll-component button`
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
      items: []
    }));
  }, [onClose, mentionValue, queryStartIndex]);

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

  const handleChainSelect = useCallback((option: ChainSelectOption) => {
    setSearchData(prev => ({
      ...prev,
      cursor: null,
      nextCursor: null,
      hasMore: true,
      items: [],
      selectedChain: option
    }));
  }, []);

  const handleFetchMore = useCallback(() => {
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

  const isChainFilterDisabled = selectedToken.value === 'POAP';

  const isDataNotFound =
    !isError && !isLoading && !hasMore && items.length === 0;

  const isErrorOccurred = isError && !isLoading && items.length === 0;

  return (
    <div ref={containerRef} className="relative z-20">
      {isListView ? (
        <ListView
          filtersButtonData={filtersButtonData}
          searchData={searchData}
          focusIndex={focusIndex}
          isDataNotFound={isDataNotFound}
          isErrorOccurred={isErrorOccurred}
          onTokenSelect={handleTokenSelect}
          onChainSelect={handleChainSelect}
          onItemSelect={handleItemSelect}
          onItemHover={setFocusIndex}
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
          onItemHover={setFocusIndex}
          onFetchMore={handleFetchMore}
          onDataReload={handleDataReload}
        />
      )}
    </div>
  );
}
