import { ReactNode } from 'react';

export type SocialType = {
  isDefault: boolean;
  blockchain: string;
  profileName: string;
  profileTokenId: string;
  followerCount: number;
  followingCount: number;
};

export type SocialSectionType = {
  name: string;
  values: ReactNode[];
};

export type WalletType = {
  addresses: string[];
  primaryDomain: {
    name: string;
  };
  domains: {
    name: string;
  }[];
  farcasterSocials: SocialType[];
  lensSocials: SocialType[];
  xmtp: {
    isXMTPEnabled: boolean;
  }[];
};
