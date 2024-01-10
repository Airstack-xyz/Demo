import { ReactNode, RefObject } from 'react';
import { ChainSelectOption } from './ChainFilter';
import { TokenSelectOption } from './TokenFilter';

export type SearchDataType = {
  isLoading: boolean;
  isError?: boolean;
  searchTerm?: string | null;
  cursor?: string | null;
  nextCursor?: string | null;
  hasMore: boolean;
  items: AdvancedMentionSearchItem[];
  selectedToken: TokenSelectOption;
  selectedChain: ChainSelectOption;
};

export type FiltersType = {
  token: TokenSelectOption;
  chain: ChainSelectOption;
};

export type FilterButtonDataType = {
  containerRef: RefObject<HTMLElement | null>;
  RenderButton?: (props: {
    appliedFilterCount: number;
    isOpen: boolean;
    onClick: () => void;
  }) => ReactNode;
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
    extraSmall: string | null;
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
