import { getAllWordsAndMentions } from '../Components/Input/utils';

export const getActiveSocialInfoString = ({
  profileNames,
  dappName,
  followerTab,
  followerCount,
  followerMentionRawText,
  followerThresholdRawText,
  followerFilters,
  followingCount,
  followingMentionRawText,
  followingThresholdRawText,
  followingFilters
}: {
  profileNames: string[];
  dappName: string;
  followerTab?: boolean;
  followerCount?: string | number;
  followerMentionRawText?: string;
  followerThresholdRawText?: string;
  followerFilters?: string[];
  followingCount?: string | number;
  followingMentionRawText?: string;
  followingThresholdRawText?: string;
  followingFilters?: string[];
}) => {
  const socialInfo: (string | number)[] = [profileNames.join(','), dappName];

  socialInfo.push(followerTab === false ? '0' : '1');

  socialInfo.push(followerCount != undefined ? followerCount : '');
  socialInfo.push(followerMentionRawText || '');
  socialInfo.push(followerThresholdRawText || '');
  socialInfo.push(followerFilters ? followerFilters.join(',') : '');

  socialInfo.push(followingCount != undefined ? followingCount : '');
  socialInfo.push(followingMentionRawText || '');
  socialInfo.push(followingThresholdRawText || '');
  socialInfo.push(followingFilters ? followingFilters.join(',') : '');

  return socialInfo.join('│');
};

export const getActiveSocialInfo = (activeSocialInfo?: string) => {
  const [
    profileNamesString,
    dappName,
    followerTab,
    followerCount,
    followerMentionRawText,
    followerThresholdRawText,
    followerFiltersString,
    followingCount,
    followingMentionRawText,
    followingThresholdRawText,
    followingFiltersString
  ] = activeSocialInfo?.split('│') ?? [];

  let followerActiveMention = null;
  let followerThresholdAmount = null;
  let followerFilters: string[] = [];
  let followingActiveMention = null;
  let followingThresholdAmount = null;
  let followingFilters: string[] = [];

  if (followerMentionRawText) {
    const mentionData = getAllWordsAndMentions(followerMentionRawText);
    followerActiveMention = mentionData[0].mention;
  }
  if (followingActiveMention) {
    const mentionData = getAllWordsAndMentions(followingMentionRawText);
    followingActiveMention = mentionData[0].mention;
  }

  if (followerThresholdRawText) {
    const thresholdData = getAllWordsAndMentions(followerThresholdRawText);
    followerThresholdAmount = Number(thresholdData[0].mention?.address);
  }
  if (followingThresholdRawText) {
    const thresholdData = getAllWordsAndMentions(followingThresholdRawText);
    followingThresholdAmount = Number(thresholdData[0].mention?.address);
  }

  if (followerFiltersString) {
    followerFilters = followerFiltersString?.split(',');
  }
  if (followingFiltersString) {
    followingFilters = followingFiltersString?.split(',');
  }

  return {
    isApplicable: Boolean(dappName),
    profileNames: profileNamesString.split(','),
    dappName,
    followerTab: followerTab === '1',
    followerCount,
    followerMentionRawText,
    followerThresholdRawText,
    followerActiveMention,
    followerThresholdAmount,
    followerFilters,
    followingCount,
    followingMentionRawText,
    followingThresholdRawText,
    followingActiveMention,
    followingThresholdAmount,
    followingFilters
  };
};

export type SocialInfo = ReturnType<typeof getActiveSocialInfo>;
