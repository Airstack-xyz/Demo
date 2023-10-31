import { Chain } from '@airstack/airstack-react/constants';
import { MentionData } from '../../../Components/Input/types';

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

export type Holding = {
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
  poapHoldings: Holding[];
  ethereumHoldings: Holding[];
  polygonHoldings: Holding[];
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
  identity?: string;
  profileTokenId?: string;
  followCount?: number;
};

export type SocialFollowLogicalFilters = {
  alsoFollow?: string;
  mutualFollow?: boolean;
  holdingData?: MentionData | null;
  lensSocial?: boolean;
  farcasterSocial?: boolean;
};
