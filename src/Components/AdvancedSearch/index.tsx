import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AdvancedSearchAIMentionsQuery } from '../../queries';
import { Icon, IconType } from '../Icon';
import { fetchAIMentions } from '../Input/utils';
import Asset, { AssetLoader } from './Asset';
import BlockchainFilter, {
  BlockchainSelectOption,
  defaultChainOption
} from './BlockchainFilter';
import CustomInput, { CustomInputModeType } from './CustomInput';
import Filters, { TokenSelectOption, defaultTokenOption } from './Filters';
import {
  AdvancedSearchAIMentionsResponse,
  AdvancedSearchAIMentionsResults
} from './types';
import {
  getDisplayValue,
  getSearchItemMention,
  getSearchQuery,
  getUpdatedMentionValue
} from './utils';

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

function FooterButton({
  text,
  icon,
  onClick
}: {
  text: string;
  icon: IconType;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={classNames(
        'py-1.5 px-3 w-full flex-row-center rounded-full bg-glass-1 text-text-button font-medium border-[#0F0F0F] text-xs hover:bg-glass-1-light'
      )}
      onClick={onClick}
    >
      <Icon name={icon} className="mr-1.5" height={18} width={18} />
      {text}
    </button>
  );
}

type SearchDataType = {
  isLoading: boolean;
  isError?: boolean;
  searchTerm?: string | null;
  cursor?: string | null;
  nextCursor?: string | null;
  hasMore: boolean;
  items: AdvancedSearchAIMentionsResults[];
  selectedToken: TokenSelectOption;
  selectedChain: BlockchainSelectOption;
};

const LIMIT = 30;

const DISABLED_KEYS = [
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Enter'
];

const defaultSearchData: SearchDataType = {
  isLoading: true,
  searchTerm: null,
  cursor: null,
  nextCursor: null,
  hasMore: true,
  items: [],
  selectedToken: defaultTokenOption,
  selectedChain: defaultChainOption
};

export default function AdvancedSearch({
  mentionInputSelector,
  value,
  onChange,
  onClose
}: {
  mentionInputSelector: string;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}) {
  const [searchData, setSearchData] =
    useState<SearchDataType>(defaultSearchData);
  const [focusIndex, setFocusIndex] = useState(0);
  const [customInputMode, setCustomInputMode] =
    useState<CustomInputModeType | null>(null);

  const focusIndexRef = useRef(0);

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
      setFocusIndex(itemIndex);
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
    const text = getDisplayValue(value);
    const query = getSearchQuery(text, 0);
    // if there is no matching query found
    // if (query === null) {
    //   onClose();
    // }
    if (query) {
      setSearchData(prev => ({
        ...prev,
        searchTerm: query,
        cursor: null,
        hasMore: true,
        items: []
      }));
    }
  }, [value, onClose]);

  useEffect(() => {
    function handleKeyUp(event: KeyboardEvent) {
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
      }
    }
    document.addEventListener('keyup', handleKeyUp, true);
    return () => {
      document.removeEventListener('keyup', handleKeyUp, true);
    };
  }, [focusGridItem, onClose, selectGridItem]);

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

      setSearchData(prev => ({
        ...prev,
        isLoading: false,
        isError: false,
        hasMore: nextHasMore,
        nextCursor: nextCursor,
        items: [...prev.items, ...nextItems]
      }));

      focusIndexRef.current = 0;
      setFocusIndex(0);
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

  const handleMentionUpdate = (itemMention: string) => {
    const mentionValue = getUpdatedMentionValue(value, itemMention, 0);
    if (mentionValue !== null) {
      // append space to the value
      const finalMentionValue = mentionValue.trim() + ' ';
      onChange(finalMentionValue);
      const aiInputEl =
        document.querySelector<HTMLTextAreaElement>(mentionInputSelector);
      // focus and put caret to last position
      aiInputEl?.focus();
      aiInputEl?.setSelectionRange(
        finalMentionValue.length,
        finalMentionValue.length
      );
    }
    onClose();
  };

  const handleCustomInputAdd = (itemMention: string) => {
    handleMentionUpdate(itemMention);
  };

  const handleItemSelect = (item: AdvancedSearchAIMentionsResults) => {
    const itemMention = getSearchItemMention(item);
    handleMentionUpdate(itemMention);
  };

  const isBlockchainFilterDisabled = selectedToken.value === 'POAP';

  const dataNotFound = !isError && !isLoading && !hasMore && items.length === 0;

  const errorOccurred = isError && !isLoading && items.length === 0;

  const showCustomInput =
    customInputMode === 'ID_ADDRESS' || customInputMode === 'ID_POAP';

  return (
    <div
      id="advancedSearch"
      className={classNames(
        'pt-5 px-5 relative z-20 transition-all',
        showCustomInput ? 'max-h-[100px]' : 'max-h-[648px]:'
      )}
    >
      {showCustomInput ? (
        <CustomInput mode={customInputMode} onAdd={handleCustomInputAdd} />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <Filters
              selectedOption={selectedToken}
              onSelect={handleTokenSelect}
            />
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
            height={460}
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
                  setFocusIndex(index);
                }}
              />
            ))}
          </InfiniteScroll>
          <div className="py-[20px] flex items-stretch gap-x-[20px]">
            <FooterButton
              icon="token-balances"
              text="Enter token contract address"
              onClick={() => setCustomInputMode('ID_ADDRESS')}
            />
            <FooterButton
              icon="poap-flat"
              text="Enter a POAP event ID"
              onClick={() => setCustomInputMode('ID_POAP')}
            />
          </div>
        </>
      )}
    </div>
  );
}
