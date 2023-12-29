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
