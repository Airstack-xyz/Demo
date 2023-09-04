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
}

export interface ContentValue {
  image: Image;
}

export interface Image {
  medium: string;
}
