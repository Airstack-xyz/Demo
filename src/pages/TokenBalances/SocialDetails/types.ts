export type SocialDetailsResponse = {
  Socials: Socials;
};

export type Socials = {
  Socials: Social[];
};

export type Social = {
  id: string;
  dappName: string;
  dappSlug: string;
  profileName: string;
  profileImage: string;
  profileTokenId: string;
  followerCount: number;
  followingCount: number;
  userCreatedAtBlockTimestamp: string;
  userCreatedAtBlockNumber: number;
};
