export interface TokenType {
  amount: string;
  tokenType: string;
  blockchain: string;
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
