export interface ResponseType {
  LensMutualFollows: LensMutualFollows;
  FarcasterMutualFollows: FarcasterMutualFollows;
  EthereumTransfers: EthereumTransfers;
  PolygonTransfers: PolygonTransfers;
  Poaps: Poaps;
  EthereumNFTs: EthereumNfts;
  PolygonNFTs: PolygonNfts;
}

export interface LensMutualFollows {
  Follower: Follower[];
  pageInfo: PageInfo;
  pageInfo_cursor: PageInfoCursor;
}

export interface Follower {
  followerAddress: FollowerAddress;
}

export interface FollowerAddress {
  socialFollowings: SocialFollowings;
}

export interface SocialFollowings {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Following: any;
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
  pageInfo_cursor1: PageInfoCursor1;
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
}

export interface PageInfo2 {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  prevCursor: string;
  nextCursor: string;
}

export interface PageInfoCursor1 {
  prevCursor: string;
  nextCursor: string;
}

export interface EthereumTransfers {
  TokenTransfer: TokenTransfer[];
  pageInfo: PageInfo3;
  pageInfo_cursor2: PageInfoCursor2;
}

export interface TokenTransfer {
  to: To;
}

export interface To {
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

export interface PageInfo3 {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  prevCursor: string;
  nextCursor: string;
}

export interface PageInfoCursor2 {
  prevCursor: string;
  nextCursor: string;
}

export interface PolygonTransfers {
  TokenTransfer: TokenTransfer2[];
  pageInfo: PageInfo4;
  pageInfo_cursor3: PageInfoCursor3;
}

export interface TokenTransfer2 {
  to: To2;
}

export interface To2 {
  addresses: string[];
  domains?: Domain2[];
  socials?: Social[];
  xmtp?: Xmtp2[];
}

export interface Domain2 {
  name: string;
}

export interface Xmtp2 {
  isXMTPEnabled: boolean;
}

export interface PageInfo4 {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  prevCursor: string;
  nextCursor: string;
}

export interface PageInfoCursor3 {
  prevCursor: string;
  nextCursor: string;
}

export interface Poaps {
  Poap: Poap[];
  pageInfo: PageInfo5;
  pageInfo_cursor4: PageInfoCursor4;
}

export interface Poap {
  eventId: string;
}

export interface PageInfo5 {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  prevCursor: string;
  nextCursor: string;
}

export interface PageInfoCursor4 {
  prevCursor: string;
  nextCursor: string;
}

export interface EthereumNfts {
  TokenBalance: TokenBalance[];
  pageInfo: PageInfo6;
  pageInfo_cursor5: PageInfoCursor5;
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

export interface PageInfoCursor5 {
  prevCursor: string;
  nextCursor: string;
}

export interface PolygonNfts {
  TokenBalance: TokenBalance2[];
  pageInfo: PageInfo7;
  pageInfo_cursor6: PageInfoCursor6;
}

export interface TokenBalance2 {
  tokenAddress: string;
}

export interface PageInfo7 {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  prevCursor: string;
  nextCursor: string;
}

export interface PageInfoCursor6 {
  prevCursor: string;
  nextCursor: string;
}

export type RecommendedUser = {
  addresses?: string[];
  domains?: Domain[];
  socials?: Social[];
  xmtp?: Xmtp[];
  tokenTransfers?: boolean;
  follows?: Record<string, boolean>;
  poaps?: {
    name: string;
    image?: string;
  }[];
  nfts?: {
    name: string;
    image?: string;
    address?: string;
    tokenNfts?: {
      tokenId: string;
    };
    blockchain?: string;
  }[];
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
  userAssociatedAddresses: string[];
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
