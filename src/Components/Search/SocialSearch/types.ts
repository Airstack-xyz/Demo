export type SocialSearchItem = {
  id: string;
  profileName: string;
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
