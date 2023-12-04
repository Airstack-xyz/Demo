import { Chain } from '@airstack/airstack-react/constants';
import { MentionData } from '../../../Components/Input/types';
import { TokenBlockchain } from '../../../types';

export type Social = {
  id: string;
  isDefault: boolean;
  blockchain: Chain;
  dappName: string;
  profileName: string;
  profileHandle: string;
  profileDisplayName: string;
  profileBio: string;
  profileImage: string;
  profileTokenId: string;
  profileTokenAddress: string;
  followerCount: number;
  followingCount: number;
  profileCreatedAtBlockTimestamp: string;
  profileCreatedAtBlockNumber: number;
  profileImageContentValue: {
    image: {
      small: string;
    };
  };
};

export type Follow = {
  id: string;
  blockchain: Chain;
  dappName: string;
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
  identity: string;
  addresses: string[];
  socials: {
    userId: string;
    blockchain: Chain;
    dappName: string;
    profileName: string;
    profileHandle: string;
    profileImage: string;
    profileTokenId: string;
    profileTokenAddress: string;
    profileImageContentValue: {
      image: {
        extraSmall: string;
      };
    };
  }[];
  lensSocials: {
    id: string;
    profileTokenId: string;
  }[];
  farcasterSocials: {
    id: string;
    profileTokenId: string;
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
  poapHoldings: Holding[];
} & {
  [Key in `${TokenBlockchain}Holdings`]: Holding[];
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
