export enum MentionType {
  DAO_TOKEN = 'DAO_TOKEN',
  NFT_COLLECTION = 'NFT_COLLECTION',
  POAP = 'POAP',
  TOKEN = 'TOKEN'
}

export enum Blockchain {
  ethereum = 'ethereum',
  polygon = 'polygon'
}

export type MentionData = {
  address: string;
  token?: string;
  blockchain?: string;
  eventId?: string | null;
  customInputType?: string;
};

export type SearchAIMentionsInput = {
  searchTerm?: string | null;
  blockchain?: string | null;
  tokenType?: string | null;
  limit?: number | null;
  cursor?: string | null;
};

export type SearchAIMentionsResults = {
  type: string;
  name: string;
  address: string;
  eventId: string | null;
  blockchain: string;
  image: {
    extraSmall: string | null;
  } | null;
  metadata: {
    tokenMints: number | null;
  } | null;
};

export type SearchAIMentionsResponse = {
  SearchAIMentions: {
    results: SearchAIMentionsResults[];
  };
};
