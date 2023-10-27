import { Domain, Social, Xmtp } from './index';

export interface NFTQueryResponse {
  TokenBalances: TokenBalances;
}

export interface TokenBalances {
  TokenBalance: TokenBalance[];
}

export interface TokenBalance {
  tokenAddress?: string;
  token: Token;
  owner: Owner;
}

export interface Token {
  name: string;
  address: string;
  tokenNfts: TokenNft[];
  blockchain: string;
  logo: Logo;
}

export interface TokenNft {
  tokenId: string;
}

export interface Logo {
  small?: string;
  extraSmall?: string;
}

export interface Owner {
  addresses: string[];
  domains?: Domain[];
  socials: Social[];
  xmtp: Xmtp[];
}
