export interface AccountsResponse {
  Accounts: Accounts;
}

export interface Accounts {
  Account: Account[];
}

export interface Account {
  standard: string;
  address: Address;
}

export interface Address {
  identity: string;
  blockchain: string;
  tokenBalances: TokenBalance[];
}

export interface TokenBalance {
  tokenType: string;
  blockchain: string;
  tokenAddress: string;
  tokenId: string;
  token: Token;
  tokenNfts: TokenNfts;
}

export interface Token {
  name: string;
  symbol: string;
}

export interface TokenNfts {
  contentValue: ContentValue;
  erc6551Accounts: { id: string }[];
}

export interface ContentValue {
  image: Image;
}

export interface Image {
  medium: string;
}

export interface PoapData {
  poap: {
    Poap: Poap[];
  };
  tokenTransfer: TokenTransferContainer;
}

export interface Poap {
  id: string;
  blockchain: string;
  tokenId: string;
  tokenAddress: string;
  eventId: string;
  tokenUri: string;
  poapEvent: PoapEvent;
}

export interface PoapEvent {
  city: string;
  contentValue: ContentValue;
  logo: Logo;
  eventName: string;
  startDate: string;
  endDate: string;
  metadata: Metadata;
  tokenMints: number;
}

export interface ContentValue {
  image: {
    medium: string;
  };
  video: unknown;
  audio: unknown;
}
export interface Logo {
  image: {
    small: string;
    medium: string;
  };
}

export interface Metadata {
  attributes: Attribute[];
  description: string;
  external_url: string;
  home_url: string;
  image_url: string;
  name: string;
  tags: string[];
  year: number;
}

export interface Attribute {
  trait_type: string;
  value: string;
}

export interface TokenTransferContainer {
  TokenTransfer: TokenTransfer[];
}

export interface TokenTransfer {
  blockTimestamp: string;
  blockNumber: number;
  transactionHash: string;
  tokenAddress: string;
  tokenId: string;
}
