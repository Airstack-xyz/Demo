import { getAllWordsAndMentions } from '../Components/Search/Input/utils';

export const getActiveSocialInfoString = ({
  dappName,
  profileNames,
  profileTokenIds,
  followerTab,
  followerCount,
  followerData = {},
  followingCount,
  followingData = {}
}: {
  dappName: string;
  profileNames: string[];
  profileTokenIds: string[];
  followerTab?: boolean;
  followerCount?: string | number;
  followerData?: {
    filters?: string[];
    mentionRawText?: string;
  };
  followingCount?: string | number;
  followingData?: {
    filters?: string[];
    mentionRawText?: string;
  };
}) => {
  const socialInfo: (string | number)[] = [
    dappName,
    profileNames?.join(','),
    profileTokenIds?.join(',')
  ];

  socialInfo.push(followerTab === false ? '0' : '1');

  socialInfo.push(followerCount != null ? followerCount : '');
  socialInfo.push(followerData.filters ? followerData.filters.join(',') : '');
  socialInfo.push(followerData.mentionRawText || '');

  socialInfo.push(followingCount != null ? followingCount : '');
  socialInfo.push(followingData.filters ? followingData.filters.join(',') : '');
  socialInfo.push(followingData.mentionRawText || '');

  return socialInfo.join('│');
};

export const getActiveSocialInfo = (activeSocialInfo?: string) => {
  const [
    dappName,
    profileNamesString,
    profileTokenIdsString,
    followerTab,
    followerCount = '',
    followerFiltersString,
    followerMentionRawText,
    followingCount = '',
    followingFiltersString,
    followingMentionRawText
  ] = activeSocialInfo?.split('│') ?? [];

  let followerMention = null;
  if (followerMentionRawText) {
    const mentionData = getAllWordsAndMentions(followerMentionRawText);
    followerMention = mentionData[0].mention;
  }

  let followingMention = null;
  if (followingMentionRawText) {
    const mentionData = getAllWordsAndMentions(followingMentionRawText);
    followingMention = mentionData[0].mention;
  }

  return {
    isApplicable: Boolean(dappName),
    dappName,
    profileNames: profileNamesString ? profileNamesString.split(',') : [],
    profileTokenIds: profileTokenIdsString
      ? profileTokenIdsString.split(',')
      : [],
    followerTab: followerTab === '0' ? false : true,
    followerCount,
    followerData: {
      filters: followerFiltersString ? followerFiltersString.split(',') : [],
      mentionRawText: followerMentionRawText,
      mention: followerMention
    },
    followingCount,
    followingData: {
      filters: followingFiltersString ? followingFiltersString.split(',') : [],
      mentionRawText: followingMentionRawText,
      mention: followingMention
    }
  };
};

export type SocialInfo = ReturnType<typeof getActiveSocialInfo>;
