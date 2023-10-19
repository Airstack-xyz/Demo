export interface OnChainDataResponse {
  LensFollowings: Followings;
  FarcasterFollowings: Followings;
  EthereumTransfers: EthereumTransfers;
  PolygonTransfers: PolygonTransfers;
  Poaps: Poaps;
  EthereumNFTs: EthereumNfts;
  PolygonNFTs: PolygonNfts;
}

export interface TokenTransferResponse {
  EthereumTokenSent: TokenSentReceived;
  EthereumTokenReceived: TokenSentReceived;
  PolygonTokenSent: TokenSentReceived;
  PolygonTokenReceived: TokenSentReceived;
}

export interface TokenSentReceived {
  TokenTransfer: TokenTransfer[];
  pageInfo_cursor: PageInfoCursor;
}

export interface Followings {
  Following: Following[];
  pageInfo: PageInfo;
}

export interface Follower {
  followerAddress: FollowerAddress;
}

export interface FollowerAddress {
  socialFollowings: SocialFollowers;
}

export interface SocialFollowers {
  Follower: {
    followerAddress: {
      socials: Pick<Social, 'profileName'>[];
    };
  }[];
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  prevCursor: string;
  nextCursor: string;
}

export interface PageInfoCursor {
  prevCursor: string;
  nextCursor: string;
}

export interface FarcasterMutualFollows {
  Follower: Follower2[];
  pageInfo: PageInfo2;
}

export interface Follower2 {
  followerAddress: FollowerAddress2;
}

export interface FollowerAddress2 {
  socialFollowings: SocialFollowings2;
}

export interface SocialFollowings2 {
  Following?: Following[];
}

export interface Following {
  followingAddress: FollowingAddress;
}

export interface FollowingAddress {
  addresses: string[];
  domains: Domain[];
  socials: Social[];
  xmtp: Xmtp[];
  mutualFollower: SocialFollowers;
}

export interface PageInfo2 {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  prevCursor: string;
  nextCursor: string;
}

export interface EthereumTransfers {
  TokenTransfer: TokenTransfer[];
  pageInfo: PageInfo;
}

export interface TokenTransfer {
  to?: Transfer;
  from?: Transfer;
}

export interface Transfer {
  addresses: string[];
  domains?: Domain[];
  socials?: Social[];
  xmtp?: Xmtp[];
}

export interface Domain {
  name: string;
}

export interface Xmtp {
  isXMTPEnabled: boolean;
}

export interface PolygonTransfers {
  TokenTransfer: TokenTransfer[];
  pageInfo: PageInfo;
}
export interface Poaps {
  Poap: Poap[];
  pageInfo: PageInfo;
}

export interface Poap {
  eventId: string;
}
export interface EthereumNfts {
  TokenBalance: TokenBalance[];
  pageInfo: PageInfo6;
}

export interface TokenBalance {
  tokenAddress: string;
}

export interface PageInfo6 {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  prevCursor: string;
  nextCursor: string;
}

export interface PolygonNfts {
  TokenBalance: TokenBalance2[];
  pageInfo: PageInfo;
}

export interface TokenBalance2 {
  tokenAddress: string;
}

export type RecommendedUser = {
  addresses?: string[];
  domains?: Domain[];
  socials?: Social[];
  xmtp?: Xmtp[];
  tokenTransfers?: {
    sent?: boolean;
    received?: boolean;
  };
  follows?: {
    followingOnLens?: boolean;
    followedOnLens?: boolean;
    followingOnFarcaster?: boolean;
    followedOnFarcaster?: boolean;
  };
  poaps?: {
    name: string;
    image?: string;
    eventId?: string;
  }[];
  nfts?: {
    name: string;
    image?: string;
    address?: string;
    tokenNfts?: {
      tokenId: string;
    };
    blockchain?: 'ethereum' | 'polygon';
  }[];
  _score?: number;
};

export interface Domain {
  name: string;
}

export interface Social {
  dappName: string;
  blockchain: string;
  profileName: string;
  profileTokenId: string;
  profileImage: string;
  profileTokenAddress: string;
}

export interface Xmtp {
  isXMTPEnabled: boolean;
}

export type NFTAndPoapResponse = {
  EthereumNFTs: EthereumNfts;
  PolygonNFTs: EthereumNfts;
  Poaps: Poaps;
};

export interface EthereumNfts {
  TokenBalance: TokenBalance[];
}

export interface TokenBalance {
  token: {
    name: string;
    logo: {
      small?: string;
    };
    address?: string;
    tokenNfts?: {
      tokenId: string;
    };
    blockchain?: string;
  };
  owner: Owner;
}

type Owner = {
  addresses: string[];
  domains?: Domain[];
  socials: Social[];
  xmtp?: Xmtp[];
};

export interface PolygonNfts {
  TokenBalance: TokenBalance2[];
}

export interface TokenBalance2 {
  token: Token2;
  owner: Owner;
}

export interface Token2 {
  name: string;
  logo: Logo2;
}

export interface Logo2 {
  small?: string;
}

export interface Poaps {
  Poap: Poap[];
}

export interface Poap {
  poapEvent: {
    eventName: string;
    contentValue: ContentValue;
  };
  attendee: Attendee;
}

export interface ContentValue {
  image: {
    extraSmall: string;
  };
}

export interface Attendee {
  owner: Owner;
}
