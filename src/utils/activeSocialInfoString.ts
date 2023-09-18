import { getAllWordsAndMentions } from '../Components/Input/utils';

export const getActiveSocialInfoString = ({
  dappName,
  followerCount,
  followingCount,
  followerTab,
  mentionRawText,
  thresholdRawText,
  filters
}: {
  dappName: string;
  followerCount?: string | number;
  followingCount?: string | number;
  followerTab?: boolean;
  mentionRawText?: string;
  thresholdRawText?: string;
  filters?: string[];
}) => {
  const socialInfo: (string | number)[] = [dappName];
  socialInfo.push(followerCount != undefined ? followerCount : '');
  socialInfo.push(followingCount != undefined ? followingCount : '');
  socialInfo.push(followerTab ? '1' : '0');
  socialInfo.push(mentionRawText || '');
  socialInfo.push(thresholdRawText || '');
  socialInfo.push(filters ? filters.join(',') : '');
  return socialInfo.join('│');
};

export const getActiveSocialInfo = (activeSocialInfo?: string) => {
  const [
    dappName,
    followerCount,
    followingCount,
    followerTab,
    mentionRawText,
    thresholdRawText,
    filterString
  ] = activeSocialInfo?.split('│') ?? [];

  let activeMention = null;
  let thresholdAmount = null;
  let filters: string[] = [];

  if (mentionRawText) {
    const mentionData = getAllWordsAndMentions(mentionRawText);
    activeMention = mentionData[0].mention;
  }

  if (thresholdRawText) {
    const thresholdData = getAllWordsAndMentions(thresholdRawText);
    thresholdAmount = Number(thresholdData[0].mention?.address);
  }

  if (filterString) {
    filters = filterString?.split(',');
  }

  return {
    isApplicable: Boolean(dappName),
    dappName,
    followerCount,
    followingCount,
    followerTab: followerTab === '1',
    mentionRawText,
    thresholdRawText,
    activeMention,
    thresholdAmount,
    filters
  };
};

export type SocialInfo = ReturnType<typeof getActiveSocialInfo>;
