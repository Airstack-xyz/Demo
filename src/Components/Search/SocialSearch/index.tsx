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
  SocialSearchItem,
  SocialSearchResponse,
  SocialSearchVariables
} from './types';
import { getSearchItemMention, getUpdatedMentionValue } from './utils';

const LOADING_ITEM_COUNT = 10;

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

type SearchDataType = {
  isLoading: boolean;
  isError?: boolean;
  searchTerm?: string | null;
  items: SocialSearchItem[];
};

const CONTAINER_ID = 'social-search';

const LIMIT = 30;

const DISABLED_KEYS = ['ArrowUp', 'ArrowDown', 'Enter'];

const defaultSearchData: SearchDataType = {
  isLoading: true,
  searchTerm: null,
  items: []
};

export default function SocialSearch({
  mentionInputRef, // reference to mention-input element
  mentionValue, // mention-input's value containing markup for mentions
  query, // query to be searched
  displayValueStartIndex, // query starting index in mention-input's display value i.e. value visible to user
  displayValueEndIndex, // query ending index in mention-input's display value i.e. value visible to user
  onChange,
  onClose
}: {
  mentionInputRef: MutableRefObject<HTMLTextAreaElement | null>;
  mentionValue: string;
  query: string;
  displayValueStartIndex: number;
  displayValueEndIndex: number;
  onChange: (value: string) => void;
  onClose: () => void;
}) {
  const [searchData, setSearchData] =
    useState<SearchDataType>(defaultSearchData);
  const [focusIndex, setFocusIndex] = useState(0);

  const focusIndexRef = useRef(0);

  // store refs so that it can be used in events without triggering useEffect
  focusIndexRef.current = focusIndex;

  const { isLoading, isError, searchTerm, items } = searchData;

  const handleData = useCallback((data: SocialSearchResponse) => {
    const nextItems = data?.Socials?.Social || [];
    setSearchData(prev => ({
      ...prev,
      isLoading: false,
      isError: false,
      items: [...(prev.items || []), ...nextItems]
    }));
    setFocusIndex(0);
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

  const selectListItem = useCallback(() => {
    const gridItems = document.querySelectorAll<HTMLButtonElement>(
      `#${CONTAINER_ID} .infinite-scroll-component button`
    );
    const itemIndex = focusIndexRef.current;
    const activeItem = gridItems[itemIndex];
    activeItem?.click();
  }, []);

  useEffect(() => {
    setSearchData(prev => ({
      ...prev,
      searchTerm: query,
      items: []
    }));
  }, [query]);

  useEffect(() => {
    const mentionInputEl = mentionInputRef.current;

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
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
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
    displayValueEndIndex,
    displayValueStartIndex,
    focusListItem,
    mentionInputRef,
    onClose,
    selectListItem
  ]);

  useEffect(() => {
    setSearchData(prev => ({
      ...prev,
      isLoading: true,
      isError: false
    }));
    fetchData({
      limit: LIMIT,
      searchRegex: [`^${searchTerm}`, `^lens/@${searchTerm}`]
    });
    return () => {
      cancelRequest();
    };
  }, [cancelRequest, fetchData, searchTerm]);

  const handleNext = useCallback(() => {
    if (!isLoading && hasNextPage && getNextPage) {
      getNextPage();
    }
  }, [getNextPage, hasNextPage, isLoading]);

  const handleMentionChange = (mention: string) => {
    const value = getUpdatedMentionValue(
      mentionValue,
      mention,
      displayValueStartIndex
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

  const dataNotFound =
    !isError && !isLoading && !hasNextPage && items.length === 0;

  const errorOccurred = isError && !isLoading && items.length === 0;

  return (
    <div id={CONTAINER_ID} className="pt-2 px-2.5 relative z-20">
      <InfiniteScroll
        next={handleNext}
        dataLength={items.length}
        hasMore={hasNextPage}
        loader={<ListLoader />}
        height={306}
        className="flex flex-col gap-2 no-scrollbar"
      >
        {dataNotFound && (
          <div className="p-2 text-center text-sm text-white w-full">
            No results to display!
          </div>
        )}
        {errorOccurred && (
          <div className="p-2 text-center text-sm text-white w-full">
            Error while fetching data!
          </div>
        )}
        {isLoading && <ListLoader />}
        {items.map((item, index) => (
          <ListItem
            key={`${item.id}_${index}`}
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
