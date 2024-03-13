import { TokenBlockchain } from '../../../types';

export type TokenBalance = {
  amount: string;
  formattedAmount: number;
  blockchain: string;
  tokenType: string;
  tokenId: string;
  tokenAddress: string;
  tokenNfts: {
    tokenId: string;
    contentValue: {
      image: {
        small: string | null;
      };
    };
  } | null;
  token: {
    name: string;
    symbol: string | null;
    logo: {
      small: string | null;
    };
    projectDetails: {
      imageUrl: string | null;
    };
  };
};

export type Poap = {
  id: string;
  blockchain: string;
  tokenId: string;
  tokenAddress: string;
  poapEvent: {
    city: string;
    eventName: string;
    startDate: string;
    eventId: string;
    contentValue: {
      image: {
        small: string;
      };
    };
  };
};

export type Wallet = {
  identity: string;
  primaryDomain: {
    name: string;
  } | null;
  domains:
    | {
        name: string;
      }[]
    | null;
  farcasterSocials:
    | {
        profileName: string;
      }[]
    | null;
  lensSocials:
    | {
        profileName: string;
      }[]
    | null;
};

export type TokenBalanceFrameResponse = {
  [Key in TokenBlockchain]: {
    TokenBalance: TokenBalance[];
  };
} & {
  poap: {
    Poap: Poap[];
  };
  wallet: Wallet;
};

export type TokenBalanceFrameVariables = {
  owner: string;
  limit: number;
  tokenType: string[];
};