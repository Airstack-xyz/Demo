export interface TokenType {
  amount: string;
  tokenType: string;
  blockchain: 'ethereum' | 'polygon';
  tokenAddress: string;
  formattedAmount: number;
  tokenNfts: TokenNfts;
  token: Token;
  tokenId?: string;
  _tokenId?: string;
  _common_tokens?: TokenType[];
}

export type CommonTokenType = TokenType & {
  token?: {
    tokenBalances: TokenType[];
  };
};

export interface TokenNfts {
  tokenId: string;
  contentValue: ContentValue;
  erc6551Accounts: Erc6551Account[];
}

export interface Erc6551Account {
  address: Address;
}

export interface Address {
  addresses: string[];
  tokenBalances: TokenType[];
}
export interface ContentValue {
  image: Image;
}

export interface Image {
  small: string;
  medium: string;
}

export interface Token {
  name: string;
  symbol: string;
  logo: {
    small: string;
    medium: string;
  };
  projectDetails: {
    imageUrl: string;
  };
}

export type PoapsType = {
  Poaps: {
    Poap: {
      id: string;
      blockchain: string;
      tokenId: string;
      tokenAddress: string;
      poapEvent: {
        city: string;
        eventName: string;
        startDate: string;
        eventId: string;
        logo: {
          image: {
            small: string;
            medium: string;
          };
        };
      };
      _common_tokens?: PoapType[];
    }[];
    pageInfo: {
      nextCursor: string;
      prevCursor: string;
    };
  };
};

export type PoapType = PoapsType['Poaps']['Poap'][0];

export type CommonPoapType = PoapsType['Poaps']['Poap'][0] & {
  poapEvent?: {
    poaps: PoapType[];
  };
};

export interface SocialsType {
  Wallet: Wallet;
}

export interface Wallet {
  primaryDomain: PrimaryDomain;
  domains: Domain[];
  socials: Social[];
  xmtp: Xmtp[];
}

export interface PrimaryDomain {
  name: string;
}

export interface Domain {
  name: string;
}

export interface Social {
  isDefault: boolean;
  blockchain: string;
  dappName: string;
  dappSlug: string;
  profileName: string;
  profileTokenId: string;
  followerCount: number;
  followingCount: number;
}

export interface Xmtp {
  isXMTPEnabled: boolean;
}

// ERC20

export interface ERC20TokensType {
  ethereum: {
    TokenBalance: TokenBalance[];
  };
  polygon: {
    TokenBalance: TokenBalance[];
  };
}

export interface Ethereum {
  TokenBalance: TokenBalance[];
}

export interface TokenBalance {
  tokenAddress: string;
  formattedAmount: number;
  blockchain: string;
  tokenId: string;
  token: Token;
  tokenNfts: TokenNfts;
  owner: Owner;
  tokenType: string;
  id: string;
}

export interface Owner {
  identity: string;
  addresses: string[];
  poaps: Poap[];
  socials: Social[];
  primaryDomain: PrimaryDomain;
  domains: Domain[];
  xmtp: Xmtp[];
}

export interface Poap {
  dappName: string;
  tokenUri: string;
  tokenAddress: string;
  tokenId: string;
}

export interface PrimaryDomain {
  name: string;
}

export interface Domain {
  chainId: string;
  dappName: string;
  owner: string;
  name: string;
}
