import { getAllWordsAndMentions } from '../Components/Input/utils';

const activeTabs = ['followers', 'followings', 'channels'];
export type ActiveTab = 'followers' | 'followings' | 'channels';
type DappName = 'lens' | 'farcaster';

export const getActiveSocialInfoString = ({
  dappName,
  profileNames,
  profileTokenIds,
  followerCount,
  followerData = {},
  followingCount,
  followingData = {},
  activeTab = 'followers',
  socialsFor
}: {
  dappName: DappName;
  profileNames: string[];
  profileTokenIds: string[];
  activeTab?: ActiveTab;
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
  socialsFor?: string;
}) => {
  const socialInfo: (string | number)[] = [
    dappName,
    profileNames?.join(','),
    profileTokenIds?.join(',')
  ];

  const tabIndex = activeTabs.indexOf(activeTab as string);
  const tab = tabIndex === -1 ? 'followers' : activeTab;
  socialInfo.push(tab);

  socialInfo.push(followerCount != null ? followerCount : '');
  socialInfo.push(followerData.filters ? followerData.filters.join(',') : '');
  socialInfo.push(followerData.mentionRawText || '');

  socialInfo.push(followingCount != null ? followingCount : '');
  socialInfo.push(followingData.filters ? followingData.filters.join(',') : '');
  socialInfo.push(followingData.mentionRawText || '');
  socialInfo.push(socialsFor || '');

  return socialInfo.join('│');
};

export const getActiveSocialInfo = (activeSocialInfo?: string) => {
  const [
    dappName,
    profileNamesString,
    profileTokenIdsString,
    activeTab,
    followerCount = '',
    followerFiltersString,
    followerMentionRawText,
    followingCount = '',
    followingFiltersString,
    followingMentionRawText,
    socialsFor
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

  const activeTabIndex = activeTabs.indexOf(activeTab);
  return {
    isApplicable: Boolean(dappName),
    dappName: dappName as DappName,
    profileNames: profileNamesString ? profileNamesString.split(',') : [],
    profileTokenIds: profileTokenIdsString
      ? profileTokenIdsString.split(',')
      : [],
    activeTab: activeTabIndex === -1 ? 'followers' : (activeTab as ActiveTab),
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
    },
    socialsFor
  };
};

export type SocialInfo = ReturnType<typeof getActiveSocialInfo>;
