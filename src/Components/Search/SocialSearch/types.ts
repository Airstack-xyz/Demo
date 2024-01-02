export type SocialSearchItem = {
  id: string;
  profileName: string;
  dappName: string;
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
