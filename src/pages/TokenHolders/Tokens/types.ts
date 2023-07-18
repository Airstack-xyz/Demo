import { TokenBalance } from '../../TokenBalances/types';

export type Token = TokenBalance;

export type Poap = {
  id: string;
  blockchain: string;
  tokenId: string;
  tokenAddress: string;
  eventId: string;
  poapEvent: PoapEvent;
  owner: Owner;
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
