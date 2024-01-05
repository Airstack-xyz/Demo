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
import { PADDING } from '../Search';
import ListItem, { ListItemLoader } from './ListItem';
import {
  SearchDataType,
  SocialSearchItem,
  SocialSearchResponse,
  SocialSearchVariables
} from './types';
import { getSearchItemMention, getUpdatedMentionValue } from './utils';

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

const CONTAINER_ID = 'social-search';

const LIMIT = 30;

const DISABLED_KEYS = ['ArrowUp', 'ArrowDown', 'Enter'];

const defaultSearchData: SearchDataType = {
  isLoading: false,
  items: null
};

export default function SocialSearch({
  mentionInputRef, // reference to mention-input element
  mentionValue, // mention-input's value containing markup for mentions
  query, // query to be searched
  queryStartIndex, // query starting index in mention-input's display value i.e. value visible to user
  queryEndIndex, // query ending index in mention-input's display value i.e. value visible to user
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
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  const focusIndexRef = useRef<number | null>(null);

  // store refs so that it can be used in events without triggering useEffect
  focusIndexRef.current = focusIndex;

  const { isLoading, isError, items } = searchData;

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
    const gridItems = document.querySelectorAll<HTMLButtonElement>(
      `#${CONTAINER_ID} .infinite-scroll-component button`
    );
    const itemIndex =
      focusIndexRef.current === null
        ? 0
        : Math.min(
            Math.max(focusIndexRef.current + delta, 0),
            gridItems.length
          );
    const activeItem = gridItems[itemIndex];
    if (activeItem) {
      activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setFocusIndex(itemIndex);
    }
  }, []);

  const selectListItem = useCallback(() => {
    const gridItems = document.querySelectorAll<HTMLButtonElement>(
      `#${CONTAINER_ID} .infinite-scroll-component button`
    );
    const itemIndex = focusIndexRef.current || 0;
    const activeItem = gridItems[itemIndex];
    activeItem?.click();
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
      items: []
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
    const mention = getSearchItemMention(item);
    handleMentionChange(mention);
  };

  const listLength = items?.length ?? 0;

  const dataNotFound =
    !isError && !isLoading && !hasNextPage && items?.length === 0;

  const errorOccurred = isError && !isLoading && items?.length === 0;

  return (
    <div id={CONTAINER_ID} className="py-2 px-2.5 relative z-20">
      <div
        id="social-search-scroll"
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
          {dataNotFound && (
            <div className="p-2 text-center text-sm text-white w-full">
              Couldn't find any Lens or Farcaster profile
            </div>
          )}
          {errorOccurred && (
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
              onMouseEnter={() => setFocusIndex(index)}
            />
          ))}
          {isLoading && <ListLoader />}
        </InfiniteScroll>
      </div>
    </div>
  );
}
