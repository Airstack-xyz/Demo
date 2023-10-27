import { Domain, Social } from './index';

export interface SocialQueryResponse {
  SocialFollowings: SocialFollowings;
  SocialFollowers: SocialFollowers;
}

export interface SocialFollowings {
  Following: Following[];
}

export interface SocialFollowers {
  Follower: {
    followerAddress: FollowingAddress;
  }[];
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

export interface Xmtp {
  isXMTPEnabled: boolean;
}

export interface MutualFollower {
  Follower: {
    followerAddress: {
      socials: {
        profileName: string;
      }[];
    };
  }[];
  Following: {
    followingAddress: {
      socials: {
        profileName: string;
      }[];
    };
  }[];
}
