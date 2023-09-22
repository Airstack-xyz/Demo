export const getActiveSocialInfoString = ({
  dappName,
  profileNames,
  profileTokenIds,
  followerTab,
  followerCount,
  followerFilters,
  followingCount,
  followingFilters
}: {
  dappName: string;
  profileNames: string[];
  profileTokenIds: string[];
  followerTab?: boolean;
  followerCount?: string | number;
  followerFilters?: string[];
  followingCount?: string | number;
  followingFilters?: string[];
}) => {
  const socialInfo: (string | number)[] = [
    dappName,
    profileNames?.join(','),
    profileTokenIds?.join(',')
  ];

  socialInfo.push(followerTab === false ? '0' : '1');

  socialInfo.push(followerCount != undefined ? followerCount : '');
  socialInfo.push(followerFilters?.join(',') || '');

  socialInfo.push(followingCount != undefined ? followingCount : '');
  socialInfo.push(followingFilters?.join(',') || '');

  return socialInfo.join('│');
};

export const getActiveSocialInfo = (activeSocialInfo?: string) => {
  const [
    dappName,
    profileNamesString,
    profileTokenIdsString,
    followerTab,
    followerCount,
    followerFiltersString,
    followingCount,
    followingFiltersString
  ] = activeSocialInfo?.split('│') ?? [];

  return {
    isApplicable: Boolean(dappName),
    dappName,
    profileNames: profileNamesString ? profileNamesString.split(',') : [],
    profileTokenIds: profileTokenIdsString
      ? profileTokenIdsString.split(',')
      : [],
    followerTab: followerTab === '1',
    followerCount,
    followerFilters: followerFiltersString
      ? followerFiltersString.split(',')
      : [],
    followingCount,
    followingFilters: followingFiltersString
      ? followingFiltersString?.split(',')
      : []
  };
};

export type SocialInfo = ReturnType<typeof getActiveSocialInfo>;
