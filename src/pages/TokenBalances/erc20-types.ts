export interface ERC20Response {
  Accounts: Accounts;
}

export interface Accounts {
  Account: Account[];
}

export interface Account {
  nft: Nft;
  address: Address;
}

export interface Nft {
  lastTransferTimestamp: string;
  lastTransferBlock: number;
  lastTransferHash: string;
  tokenURI: string;
  tokenId: string;
  tokenBalances: TokenBalance[];
  token: Token;
}

export interface TokenBalance {
  tokenType: string;
}

export interface Token {
  name: string;
  symbol: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tokenTraits: any;
  totalSupply: string;
  owner: Owner;
}

export interface Owner {
  identity: string;
}

export interface Address {
  tokenBalances: TokenBalance2[];
}

export interface TokenBalance2 {
  tokenType: string;
  tokenAddress: string;
  tokenId: string;
  owner: Owner2;
  tokenNfts: TokenNfts;
}

export interface Owner2 {
  identity: string;
}

export interface TokenNfts {
  erc6551Accounts: Erc6551Account[];
}

export interface Erc6551Account {
  address: Address2;
}

export interface Address2 {
  addresses: string[];
}
