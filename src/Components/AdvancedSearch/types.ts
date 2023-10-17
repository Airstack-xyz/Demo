export type AdvancedSearchAIMentionsInput = {
  searchTerm?: string | null;
  blockchain?: string | null;
  tokenType?: string | null;
  limit?: number | null;
  cursor?: string | null;
};

export type AdvancedSearchAIMentionsResults = {
  type: string;
  name: string;
  address: string;
  eventId: string | null;
  blockchain: 'ethereum' | 'polygon' | 'gnosis';
  tokenType: string;
  thumbnailURL: string | null;
  symbol: string | null;
  image: {
    medium: string | null;
  } | null;
  metadata: {
    tokenMints: number | null;
  } | null;
};

export type AdvancedSearchAIMentionsResponse = {
  SearchAIMentions: {
    results: AdvancedSearchAIMentionsResults[];
    pageInfo: {
      nextCursor: string | null;
    };
  };
};
