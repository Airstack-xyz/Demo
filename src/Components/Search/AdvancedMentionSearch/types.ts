import { BlockchainSelectOption } from './BlockchainFilter';
import { TokenSelectOption } from './Filters';

export type SearchDataType = {
  isLoading: boolean;
  isError?: boolean;
  searchTerm?: string | null;
  cursor?: string | null;
  nextCursor?: string | null;
  hasMore: boolean;
  items: AdvancedMentionSearchItem[];
  selectedToken: TokenSelectOption;
  selectedChain: BlockchainSelectOption;
};

export type ViewComponentProps = {
  searchData: SearchDataType;
  focusIndex: null | number;
  isChainFilterDisabled?: boolean;
  isDataNotFound?: boolean;
  isErrorOccurred?: boolean;
  setFocusIndex: (index: number) => void;
  onTokenSelect: (option: TokenSelectOption) => void;
  onChainSelect: (option: BlockchainSelectOption) => void;
  onItemSelect: (item: AdvancedMentionSearchItem) => void;
  onMoreFetch: () => void;
  onReloadData: () => void;
};

export type AdvancedMentionSearchItem = {
  type: string;
  name: string;
  address: string;
  eventId: string | null;
  blockchain: string;
  tokenType: string;
  symbol: string | null;
  image: {
    medium: string | null;
  } | null;
  metadata: {
    tokenMints: number | null;
  } | null;
};

export type AdvancedMentionSearchResponse = {
  SearchAIMentions: {
    results: AdvancedMentionSearchItem[];
    pageInfo: {
      nextCursor: string | null;
    };
  };
};

export type AdvancedMentionSearchInput = {
  searchTerm?: string | null;
  blockchain?: string | null;
  tokenType?: string | null;
  limit?: number | null;
  cursor?: string | null;
};
