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
  isSpam: boolean;
  name: string;
  symbol: string;
  tokenType: string;
  formattedAmount: number;
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
  addresses: string[];
  primaryDomain: Domain;
  domains: Domain[];
  farcasterSocials: Social[];
  lensSocials: Social[];
  xmtp: Xmtp[];
}

export interface Domain {
  name: string;
  isPrimary?: boolean;
  tokenNft: {
    tokenId: string;
    address: string;
    blockchain: string;
  };
}

export interface Social {
  isDefault: boolean;
  blockchain: string;
  dappName: string;
  profileName: string;
  profileHandle: string;
  profileImage: string;
  profileTokenId: string;
  followerCount: number;
  followingCount: number;
  profileTokenAddress: string;
  profileImageContentValue: {
    image: {
      small: string;
    };
  };
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
  dappName: string;
  owner: string;
  name: string;
}
