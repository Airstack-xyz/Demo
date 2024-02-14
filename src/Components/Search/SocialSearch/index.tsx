import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { SocialSearchQuery } from '../../../queries';
import { isMobileDevice } from '../../../utils/isMobileDevice';
import { getMentionCount } from '../../Input/utils';
import { PADDING } from '../Search';
import ListItem, { ListItemLoader } from './ListItem';
import {
  SearchDataType,
  SocialSearchItem,
  SocialSearchResponse,
  SocialSearchVariables
} from './types';
import {
  INFINITE_SCROLL_CONTAINER_ID,
  getSearchItemMention,
  getUpdatedMentionValue
} from './utils';

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

const LIMIT = 30;

const DISABLED_KEYS = ['ArrowUp', 'ArrowDown', 'Enter'];

const defaultSearchData: SearchDataType = {
  isLoading: false,
  items: null,
  focusIndex: null
};

type SocialSearchProps = {
  // reference to mention-input element
  mentionInputRef: MutableRefObject<HTMLTextAreaElement | null>;
  // mention-input's value containing markup for mentions
  mentionValue: string;
  // query to be searched
  query: string;
  // query starting index in mention-input's display value i.e. value visible to user
  queryStartIndex: number;
  // query ending index in mention-input's display value i.e. value visible to user
  queryEndIndex: number;
  // callback func, invoked when mention value is changed
  onChange: (value: string) => void;
  // callback func, invoked when search to be closed
  onClose: () => void;
};

export default function SocialSearch({
  mentionInputRef,
  mentionValue,
  query,
  queryStartIndex,
  queryEndIndex,
  onChange,
  onClose
}: SocialSearchProps) {
  const [searchData, setSearchData] =
    useState<SearchDataType>(defaultSearchData);

  const isMobile = isMobileDevice();

  const { isLoading, isError, items, focusIndex } = searchData;

  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef(items);
  const focusIndexRef = useRef(focusIndex);

  // store refs so that it can be used in events without triggering useEffect
  itemsRef.current = items;
  focusIndexRef.current = focusIndex;

  const handleData = useCallback((data: SocialSearchResponse) => {
    const nextItems = data?.Socials?.Social || [];
    setSearchData(prev => ({
      ...prev,
      isLoading: false,
      isError: false,
      items: [...(prev.items || []), ...nextItems]
    }));
  }, []);

  const handleError = useCallback(() => {
    setSearchData(prev => ({
      ...prev,
      isLoading: false,
      isError: true
    }));
  }, []);

  const [fetchData, { pagination, cancelRequest }] = useLazyQueryWithPagination<
    SocialSearchResponse,
    SocialSearchVariables
  >(SocialSearchQuery, undefined, {
    onCompleted: handleData,
    onError: handleError
  });

  const { hasNextPage, getNextPage } = pagination;

  const focusListItem = useCallback((delta: number) => {
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

  const selectListItem = useCallback(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;
    const itemIndex = focusIndexRef.current || 0;
    const activeEl = containerEl.querySelector<HTMLButtonElement>(
      `.infinite-scroll-component button:nth-of-type(${itemIndex + 1})`
    );
    activeEl?.click();
  }, []);

  useEffect(() => {
    const mentionInputEl = mentionInputRef.current;

    function handleInputClick() {
      const selectionStart = mentionInputEl?.selectionStart ?? -1;
      // if mention-input's caret moves before query start index
      if (selectionStart <= queryStartIndex) {
        onClose();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      // allow enter press if no item is focussed
      if (event.key === 'Enter' && focusIndexRef.current === null) {
        return;
      }
      // disable mention-input's certain keys, so that they can be used in advanced search
      if (DISABLED_KEYS.includes(event.key)) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
      switch (event.key) {
        case 'ArrowUp':
          focusListItem(-1);
          break;
        case 'ArrowDown':
          focusListItem(+1);
          break;
        case 'Enter':
          selectListItem();
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
    focusListItem,
    mentionInputRef,
    onClose,
    selectListItem
  ]);

  useEffect(() => {
    setSearchData(prev => ({
      ...prev,
      isLoading: true,
      isError: false,
      items: [],
      focusIndex: null
    }));
    fetchData({
      limit: LIMIT,
      searchRegex: [`^${query}`, `^lens/@${query}`]
    });
    return () => {
      cancelRequest();
    };
  }, [cancelRequest, fetchData, query]);

  const handleFetchMore = useCallback(() => {
    if (!isLoading && hasNextPage && getNextPage) {
      setSearchData(prev => ({
        ...prev,
        isLoading: true
      }));
      getNextPage();
    }
  }, [getNextPage, hasNextPage, isLoading]);

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

  const handleItemSelect = (item: SocialSearchItem) => {
    // @mention label should be truncated in mobile for first mention
    const truncateLabel = isMobile && getMentionCount(mentionValue) === 0;
    const mention = getSearchItemMention(item, truncateLabel);
    handleMentionChange(mention);
  };

  const listLength = items?.length ?? 0;

  const isDataNotFound =
    !isError && !isLoading && !hasNextPage && items?.length === 0;

  const isErrorOccurred = isError && !isLoading && items?.length === 0;

  return (
    <div ref={containerRef} className="py-2 px-2.5 relative z-20">
      <div
        id={INFINITE_SCROLL_CONTAINER_ID}
        className="max-h-[302px] overflow-y-scroll"
      >
        <InfiniteScroll
          next={handleFetchMore}
          dataLength={listLength}
          hasMore={hasNextPage}
          loader={null}
          scrollableTarget="social-search-scroll"
          className="flex flex-col gap-2 pr-1"
        >
          {isDataNotFound && (
            <div className="p-2 text-center text-sm text-white w-full">
              Couldn't find any Farcaster or Lens profile. Click enter to search
              ENS.
            </div>
          )}
          {isErrorOccurred && (
            <div className="p-2 text-center text-sm text-white w-full">
              Error while fetching data!
            </div>
          )}
          {items?.map((item, index) => (
            <ListItem
              key={`${item.id}_${index}`}
              item={item}
              isFocused={focusIndex === index}
              onClick={() => handleItemSelect(item)}
              onMouseEnter={() => handleItemHover(index)}
            />
          ))}
          {isLoading && <ListLoader />}
        </InfiniteScroll>
      </div>
    </div>
  );
}
