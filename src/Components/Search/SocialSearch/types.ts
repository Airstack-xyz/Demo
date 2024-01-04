export type SearchDataType = {
  isLoading: boolean;
  isError?: boolean;
  items: SocialSearchItem[] | null;
};

export type SocialSearchItem = {
  id: string;
  profileName: string;
  dappName: string;
  followerCount: number;
};

export type SocialSearchResponse = {
  Socials: {
    Social: SocialSearchItem[];
  };
};

export type SocialSearchVariables = {
  searchRegex: string[];
  limit: number;
};
