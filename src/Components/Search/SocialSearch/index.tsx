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
  getChannelSearchItemMention,
  getSearchItemMention,
  getUpdatedMentionValue
} from './utils';
import { farcasterChannelsSearchQuery } from '../../../queries/channels';
import {
  FarcasterChannelsQuery,
  FarcasterChannelsQueryVariables
} from '../../../../__generated__/airstack-types';
import { EnabledSearchType } from '../SearchInputSection';
import ChannelListItem, { Channel } from './ChannelListItem';

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

const defaultSearchData: SearchDataType<SocialSearchItem> = {
  isLoading: false,
  items: null,
  focusIndex: null
};

const defaultSearchDataChannels: SearchDataType<Channel> = {
  isLoading: false,
  items: null,
  focusIndex: null
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SearchDataState = any;

type SocialSearchProps = {
  searchType: EnabledSearchType;
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
  searchType,
  mentionInputRef,
  mentionValue,
  query,
  queryStartIndex,
  queryEndIndex,
  onChange,
  onClose
}: SocialSearchProps) {
  const [searchData, setSocialSearchData] =
    useState<SearchDataType<SocialSearchItem>>(defaultSearchData);

  const [channelsData, setChannelsData] = useState<SearchDataType<Channel>>(
    defaultSearchDataChannels
  );

  const isMobile = isMobileDevice();

  const isSocialSearch = searchType === 'SOCIAL_SEARCH';
  const { isLoading, isError, items, focusIndex } = isSocialSearch
    ? searchData
    : channelsData;

  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef(items);
  const focusIndexRef = useRef(focusIndex);

  // store refs so that it can be used in events without triggering useEffect
  itemsRef.current = items;
  focusIndexRef.current = focusIndex;

  const setSearchData = isSocialSearch ? setSocialSearchData : setChannelsData;

  const handleData = useCallback((data: SocialSearchResponse) => {
    const nextItems = data?.Socials?.Social || [];
    setSocialSearchData(prev => ({
      ...prev,
      isLoading: false,
      isError: false,
      items: [...(prev.items || []), ...nextItems]
    }));
  }, []);

  const handleChannelsData = useCallback((data: FarcasterChannelsQuery) => {
    const nextItems: Channel[] =
      data?.FarcasterChannels?.FarcasterChannel || [];
    setChannelsData(prev => ({
      ...prev,
      isLoading: false,
      isError: false,
      items: [...(prev.items || []), ...nextItems]
    }));
  }, []);

  const handleError = useCallback(() => {
    setSearchData((prev: SearchDataState) => ({
      ...prev,
      isLoading: false,
      isError: true
    }));
  }, [setSearchData]);

  const [fetchData, { pagination, cancelRequest }] = useLazyQueryWithPagination<
    SocialSearchResponse,
    SocialSearchVariables
  >(SocialSearchQuery, undefined, {
    onCompleted: handleData,
    onError: handleError
  });

  const [
    fetchChannels,
    { pagination: channelPagination, cancelRequest: cancelChannelsRequest }
  ] = useLazyQueryWithPagination<
    FarcasterChannelsQuery,
    FarcasterChannelsQueryVariables
  >(farcasterChannelsSearchQuery, undefined, {
    onCompleted: handleChannelsData,
    onError: handleError
  });

  const { hasNextPage, getNextPage } = isSocialSearch
    ? pagination
    : channelPagination;

  const focusListItem = useCallback(
    (delta: number) => {
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
        setSearchData((prev: SearchDataState) => ({
          ...prev,
          focusIndex: itemIndex
        }));
      }
    },
    [setSearchData]
  );

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
    setSearchData((prev: SearchDataState) => ({
      ...prev,
      isLoading: true,
      isError: false,
      items: [],
      focusIndex: null
    }));

    const fetcher = isSocialSearch ? fetchData : fetchChannels;
    const cancelReq = isSocialSearch ? cancelRequest : cancelChannelsRequest;

    fetcher({
      limit: LIMIT,
      searchRegex: isSocialSearch
        ? [`^${query}`, `^lens/@${query}`]
        : [`^(?i)${query}`]
    });
    return () => {
      cancelReq();
    };
  }, [
    cancelChannelsRequest,
    cancelRequest,
    fetchChannels,
    fetchData,
    isSocialSearch,
    query,
    searchType,
    setSearchData
  ]);

  const handleFetchMore = useCallback(() => {
    if (!isLoading && hasNextPage && getNextPage) {
      setSearchData((prev: SearchDataState) => ({
        ...prev,
        isLoading: true
      }));
      getNextPage();
    }
  }, [getNextPage, hasNextPage, isLoading, setSearchData]);

  const handleItemHover = useCallback(
    (index: number) => {
      setSearchData((prev: SearchDataState) => ({
        ...prev,
        focusIndex: index
      }));
    },
    [setSearchData]
  );

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

  const handleChannelItemSelect = (item: Channel) => {
    // @mention label should be truncated in mobile for first mention
    const truncateLabel = isMobile && getMentionCount(mentionValue) === 0;
    const mention = getChannelSearchItemMention(
      item.name,
      item.channelId,
      truncateLabel
    );
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
          {items?.map((_item, index) => {
            if (isSocialSearch) {
              const item = _item as SocialSearchItem;
              return (
                <ListItem
                  key={`${item.id}_${index}`}
                  item={item}
                  isFocused={focusIndex === index}
                  onClick={() => handleItemSelect(item)}
                  onMouseEnter={() => handleItemHover(index)}
                />
              );
            }
            const item = _item as Channel;
            return (
              <ChannelListItem
                key={`${item.channelId}_${index}`}
                item={item}
                isFocused={focusIndex === index}
                onClick={() => handleChannelItemSelect(item)}
                onMouseEnter={() => handleItemHover(index)}
              />
            );
          })}
          {isLoading && <ListLoader />}
        </InfiniteScroll>
      </div>
    </div>
  );
}
