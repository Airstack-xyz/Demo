import { TokenBlockchain } from '../../../types';
import { CommonTokenType } from '../../TokenBalances/types';
import { Domain, Social, Xmtp } from './index';

export type CommonNFTQueryResponse = {
  [Key in TokenBlockchain]: {
    TokenBalance: CommonTokenType[];
  };
};

export interface NFTQueryResponse {
  TokenBalances: TokenBalances;
}

export type NFTCountData = {
  [Key in `${TokenBlockchain}Count`]: number;
};

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
