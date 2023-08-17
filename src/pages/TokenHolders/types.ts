import { TokenBalance } from '../TokenBalances/types';

export type Token = TokenBalance &
  Pick<Poap, '_poapEvent'> & {
    _token: TokenBalance['token'];
    _tokenAddress: string;
    _tokenId: string;
    owner: TokenBalance['owner'] & {
      tokenBalances: Token[];
    };
  };

export type TokensData = {
  ethereum: { TokenBalance: Token[] };
  polygon: { TokenBalance: Token[] };
  Poaps: PoapsData['Poaps'];
};

export type PoapsData = {
  Poaps: {
    Poap: Poap[];
  };
};

export type Poap = {
  id: string;
  blockchain: string;
  tokenId: string;
  tokenType: string;
  tokenAddress: string;
  eventId: string;
  poapEvent: PoapEvent;
  _poapEvent: PoapEvent;
  owner: Owner & {
    poaps: Poap[];
  };
};

export type PoapEvent = {
  blockchain: string;
  eventName: string;
  logo: {
    image: {
      small: string;
      medium: string;
    };
  };
};

export interface Owner {
  identity: string;
  addresses: string[];
  socials: Social[];
  primaryDomain: PrimaryDomain;
  domains: Domain[];
  xmtp: Xmtp[];
}

export interface Social {
  blockchain: string;
  dappSlug: string;
  profileName: string;
}

export interface PrimaryDomain {
  name: string;
}

export interface Domain {
  chainId: string;
  dappName: string;
  name: string;
}

export interface Xmtp {
  isXMTPEnabled: boolean;
}

export interface TotalSupply {
  ethereum: Supply;
  polygon: Supply;
}
export interface Supply {
  totalSupply: string;
}

export type OverviewData = {
  ethereum: OverviewBlockchainData;
  polygon: OverviewBlockchainData;
};

export type OverviewBlockchainData = {
  ensUsersCount: number;
  farcasterProfileCount: number;
  lensProfileCount: number;
  primaryEnsUsersCount: number;
  totalHolders: number;
  xmtpUsersCount: number;
};

export interface TotalPoapsSupply {
  PoapEvents: PoapEvents;
}

export interface PoapEvents {
  PoapEvent: [
    {
      tokenMints: number;
    }
  ];
}
