export type Owner = {
  identity: string;
  primaryDomain: {
    name: string;
    avatar: string;
  } | null;
  domains:
    | {
        name: string;
        avatar: string;
      }[]
    | null;
  farcasterSocials:
    | {
        profileName: string;
        profileImage: string;
        profileImageContentValue: {
          image: {
            small: string;
          };
        };
      }[]
    | null;
  lensSocials:
    | {
        profileName: string;
        profileImage: string;
        profileImageContentValue: {
          image: {
            small: string;
          };
        };
      }[]
    | null;
};

export type TokenBalance = {
  amount: string;
  formattedAmount: number;
  blockchain: string;
  tokenType: string;
  tokenId: string;
  tokenAddress: string;
  tokenNfts: {
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
  owner: Owner;
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
  owner: Owner;
};

export type TokenHoldersFrameResponse = {
  TokenBalances: {
    TokenBalance: TokenBalance[];
  };
  Poaps: {
    Poap: Poap[];
  };
};

export type TokenHoldersFrameVariables =
  | {
      address: string;
      limit: number;
      blockchain: string;
    }
  | {
      address: string;
      limit: number;
    };
