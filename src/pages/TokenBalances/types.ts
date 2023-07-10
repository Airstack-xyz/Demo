export interface TokenType {
  amount: string;
  tokenType: string;
  blockchain: 'ethereum' | 'polygon';
  tokenAddress: string;
  tokenNfts: TokenNfts;
  token: Token;
}

export interface TokenNfts {
  tokenId: string;
  contentValue: ContentValue;
}

export interface ContentValue {
  image: Image;
}

export interface Image {
  small: string;
}

export interface Token {
  name: string;
  symbol: string;
}

export type PoapType = {
  Poaps: {
    Poap: {
      poapEvent: {
        eventName: string;
        startDate: string;
        isVirtualEvent: boolean;
        eventId: string;
        logo: {
          image: {
            small: string;
          };
        };
      };
    }[];
    pageInfo: {
      nextCursor: string;
      prevCursor: string;
    };
  };
};

export interface SocialsType {
  Wallet: Wallet;
}

export interface Wallet {
  primaryDomain: PrimaryDomain;
  domains: Domain[];
  socials: Social[];
}

export interface PrimaryDomain {
  name: string;
}

export interface Domain {
  name: string;
}

export interface Social {
  dappName: string;
  profileName: string;
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
  token: Token;
  id: string;
}

export interface Token {
  symbol: string;
  name: string;
}
