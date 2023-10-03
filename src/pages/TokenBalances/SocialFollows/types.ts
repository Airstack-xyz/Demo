import { Chain } from '@airstack/airstack-react/constants';
import { MentionValues } from '../../../Components/Input/utils';

export type SocialsResponse = {
  Socials: {
    Social: Social[];
  };
};

export type Social = {
  id: string;
  isDefault: boolean;
  blockchain: Chain;
  dappName: string;
  dappSlug: string;
  profileName: string;
  profileDisplayName: string;
  profileBio: string;
  profileImage: string;
  profileTokenId: string;
  profileTokenAddress: string;
  followerCount: number;
  followingCount: number;
  userAddress: string;
  profileCreatedAtBlockTimestamp: string;
  profileCreatedAtBlockNumber: number;
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
  followingProfileId: string;
  followerAddress: Wallet;
  followingAddress: Wallet;
};

export type Wallet = {
  socialFollowers: {
    Follower: Follow[];
  };
  socialFollowings: {
    Following: Follow[];
  };
  alsoFollows: {
    Follower: Follow[];
    Following: Follow[];
  };
  mutualFollows: {
    Follower: Follow[];
    Following: Follow[];
  };
  lensSocials: {
    id: string;
    profileTokenId: string;
  }[];
  farcasterSocials: {
    id: string;
    profileTokenId: string;
  }[];
  holdings: {
    tokenId: string;
    tokenAddress: string;
    tokenType: string;
    blockchain: Chain;
    formattedAmount: number;
    poapEvent: {
      eventId: string;
      contentValue: {
        image: {
          extraSmall: string;
        };
      };
    };
    token: {
      logo: {
        small: string;
      };
      projectDetails: {
        imageUrl: string;
      };
    };
    tokenNfts: {
      contentValue: {
        image: {
          extraSmall: string;
        };
      };
    };
  }[];
  identity: string;
  addresses: string[];
  socials: {
    userId: string;
    blockchain: Chain;
    dappName: string;
    dappSlug: string;
    profileName: string;
    profileImage: string;
    profileTokenId: string;
    profileTokenAddress: string;
  }[];
  primaryDomain: {
    name: string;
  };
  domains: {
    name: string;
  }[];
  xmtp: {
    isXMTPEnabled: boolean;
  }[];
};

export type SocialFollowQueryFilters = {
  dappName: string;
  followerProfileId?: string;
  followerCount?: number;
  followingProfileId?: string;
  followingCount?: number;
};

export type SocialFollowLogicalFilters = {
  alsoFollow?: string;
  mutualFollow?: boolean;
  holdingData?: MentionValues | null;
  lensSocial?: boolean;
  farcasterSocial?: boolean;
};
