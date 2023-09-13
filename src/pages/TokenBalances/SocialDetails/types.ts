import { Chain } from '@airstack/airstack-react/constants';

export type SocialDetailsResponse = {
  Socials: Socials;
};

export type Socials = {
  Socials: Social[];
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
