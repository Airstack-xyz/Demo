import { Social } from '../types';

export interface SocialQueryResponse {
  SocialFollowings: SocialFollowings;
}

export interface SocialFollowings {
  Following: Following[];
}

export interface Following {
  followingAddress: FollowingAddress;
}

export interface FollowingAddress {
  addresses: string[];
  domains?: Domain[];
  socials: Social[];
  xmtp?: Xmtp[];
  mutualFollower: MutualFollower;
}

export interface Domain {
  name: string;
}

export interface Xmtp {
  isXMTPEnabled: boolean;
}

export interface MutualFollower {
  Follower: any;
}
