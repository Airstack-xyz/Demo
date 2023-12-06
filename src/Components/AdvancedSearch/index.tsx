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
import { ADDRESS_OPTION_ID, POAP_OPTION_ID } from '../Input/constants';

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
        'py-1.5 px-3 w-full flex-row-center rounded-full bg-glass-1 text-text-button font-medium border border-[#434449] text-xs hover:bg-glass-1-light'
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

const MAX_HEIGHT = 648;
const MIN_HEIGHT = 80;

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
  mentionInputSelector, // query selector for mention-input element
  mentionValue, // mention-input's value containing markup for mentions
  displayValueStartIndex, // @mention starting index in mention-input's display value i.e. value visible to user
  displayValueEndIndex, // @mention ending index in mention-input's display value i.e. value visible to user
  onChange,
  onClose
}: {
  mentionInputSelector: string;
  mentionValue: string;
  displayValueStartIndex: number;
  displayValueEndIndex: number;
  onChange: (value: string) => void;
  onClose: () => void;
}) {
  const [searchData, setSearchData] =
    useState<SearchDataType>(defaultSearchData);
  const [focusIndex, setFocusIndex] = useState(0);
  const [inputMode, setInputMode] = useState<CustomInputModeType | null>(null);

  const focusIndexRef = useRef(0);
  const inputModeRef = useRef<CustomInputModeType | null>(null);

  // store refs so that it can be used in events without triggering useEffect
  focusIndexRef.current = focusIndex;
  inputModeRef.current = inputMode;

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
    // convert mention-input's value containing markup for mentions to display value i.e. value visible to user
    const displayValue = getDisplayValue(mentionValue);
    // extract the query from display value bounded within start/end index
    const query = getSearchQuery(displayValue, displayValueStartIndex);
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
  }, [onClose, mentionValue, displayValueStartIndex]);

  useEffect(() => {
    const mentionInputEl =
      document.querySelector<HTMLTextAreaElement>(mentionInputSelector);

    // set mention-input's caret to correct position
    mentionInputEl?.setSelectionRange(
      displayValueEndIndex,
      displayValueEndIndex
    );

    function handleInputClick() {
      const selectionStart = mentionInputEl?.selectionStart ?? -1;
      // if mention-input's caret moves before @ position
      if (selectionStart <= displayValueStartIndex) {
        onClose();
        return;
      }
      const substring =
        mentionInputEl?.value.substring(
          displayValueStartIndex,
          selectionStart
        ) || '';
      // if mention-input's query contains whitespace
      if (/\s/.test(substring)) {
        onClose();
        return;
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      // for custom input mode don't block enter keyboard event
      if (event.key === 'Enter' && inputModeRef.current) {
        return;
      }
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

    document.addEventListener('keyup', handleKeyUp, true);
    mentionInputEl?.addEventListener('click', handleInputClick);

    return () => {
      document.removeEventListener('keyup', handleKeyUp, true);
      mentionInputEl?.removeEventListener('click', handleInputClick);
    };
  }, [
    displayValueEndIndex,
    displayValueStartIndex,
    focusGridItem,
    mentionInputSelector,
    onClose,
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

      setSearchData(prev => ({
        ...prev,
        isLoading: false,
        isError: false,
        hasMore: nextHasMore,
        nextCursor: nextCursor,
        items: [...prev.items, ...nextItems]
      }));

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
      displayValueStartIndex
    );
    if (value !== null) {
      // append space to the value
      const finalValue = value.trim() + ' ';
      onChange(finalValue);
      const mentionInputEl =
        document.querySelector<HTMLTextAreaElement>(mentionInputSelector);
      // focus and put caret to last position
      mentionInputEl?.focus();
      mentionInputEl?.setSelectionRange(finalValue.length, finalValue.length);
    }
    onClose();
  };

  const handleCustomInputAdd = (mention: string) => {
    handleMentionChange(mention);
  };

  const handleItemSelect = (item: AdvancedSearchAIMentionsResults) => {
    const mention = getSearchItemMention(item);
    handleMentionChange(mention);
  };

  const isBlockchainFilterDisabled = selectedToken.value === 'POAP';

  const dataNotFound = !isError && !isLoading && !hasMore && items.length === 0;

  const errorOccurred = isError && !isLoading && items.length === 0;

  const showCustomInput =
    inputMode === ADDRESS_OPTION_ID || inputMode === POAP_OPTION_ID;

  return (
    <div
      id="advancedSearch"
      className={classNames(
        'pt-5 px-5 relative z-20 transition-all',
        showCustomInput ? `h-[${MIN_HEIGHT}px]` : `h-[${MAX_HEIGHT}px]`
      )}
    >
      {showCustomInput ? (
        <CustomInput mode={inputMode} onAdd={handleCustomInputAdd} />
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
            height={MAX_HEIGHT - 140}
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
                onMouseEnter={() => setFocusIndex(index)}
              />
            ))}
          </InfiniteScroll>
          <div className="py-[20px] flex items-stretch gap-x-[20px]">
            <FooterButton
              icon="token-balances"
              text="Enter token contract address"
              onClick={() => setInputMode(ADDRESS_OPTION_ID)}
            />
            <FooterButton
              icon="poap-flat"
              text="Enter a POAP event ID"
              onClick={() => setInputMode(POAP_OPTION_ID)}
            />
          </div>
        </>
      )}
    </div>
  );
}
