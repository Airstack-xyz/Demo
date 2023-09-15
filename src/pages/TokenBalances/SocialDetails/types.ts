import { Chain } from '@airstack/airstack-react/constants';

export type SocialsResponse = {
  Socials: {
    Social: Social[];
  };
};

export type Social = {
  id: string;
  blockchain: Chain;
  dappName: string;
  dappSlug: string;
  profileName: string;
  profileImage: string;
  profileTokenId: string;
  profileTokenAddress: string;
  followerCount: number;
  followingCount: number;
  userAddress: string;
  userCreatedAtBlockTimestamp: string;
  userCreatedAtBlockNumber: number;
};

export type SocialFollowResponse = {
  SocialFollowers: {
    Follower: Follow[];
  };
  SocialFollowings: {
    Following: Follow[];
  };
};

export type Follow = {
  id: string;
  blockchain: Chain;
  dappName: string;
  dappSlug: string;
  followerProfileId: string;
  followerTokenId: string;
  followingProfileId: string;
  followerAddress: Wallet;
  followingAddress: Wallet;
};

export type Wallet = {
  identity: string;
  addresses: string[];
  socials: {
    blockchain: Chain;
    dappName: string;
    dappSlug: string;
    profileName: string;
    profileTokenId: string;
    profileTokenAddress: string;
  }[];
  primaryDomain: {
    name: string;
  };
  domains: {
    name: string;
    dappName: string;
  }[];
  xmtp: {
    isXMTPEnabled: boolean;
  }[];
};
