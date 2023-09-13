import { getAllWordsAndMentions } from '../Components/Input/utils';

export const getActiveSocialInfoString = ({
  dappName,
  dappSlug,
  followerCount,
  followingCount,
  followerTab,
  mentionRawText,
  thresholdRawText,
  filterString
}: {
  dappName: string;
  dappSlug: string;
  followerCount: number;
  followingCount: number;
  followerTab?: boolean;
  mentionRawText?: string;
  thresholdRawText?: string;
  filterString?: string;
}) => {
  return `${dappName}│${dappSlug}│${followerCount}│${followingCount}│${
    followerTab ? '1' : '0'
  }│${mentionRawText || ''}│${thresholdRawText || ''}│${filterString || ''}`;
};

export const getActiveSocialInfo = (activeSocialInfo?: string) => {
  const [
    dappName,
    dappSlug,
    followerCount,
    followingCount,
    followerTab,
    mentionRawText,
    thresholdRawText,
    filterString
  ] = activeSocialInfo?.split('│') ?? [];

  let activeMention = null;
  let thresholdValue = null;
  let filters: string[] = [];

  if (mentionRawText) {
    const mentionData = getAllWordsAndMentions(mentionRawText);
    activeMention = mentionData[0].mention;
  }

  if (thresholdRawText) {
    const thresholdData = getAllWordsAndMentions(thresholdRawText);
    thresholdValue = Number(thresholdData[0].mention?.address);
  }

  if (filterString) {
    filters = filterString?.split(',');
  }

  return {
    isApplicable: Boolean(dappSlug),
    dappName,
    dappSlug,
    followerCount: Number(followerCount),
    followingCount: Number(followingCount),
    followerTab: followerTab === '1',
    mentionRawText,
    thresholdRawText,
    activeMention: activeMention,
    thresholdValue: thresholdValue,
    filters: filters
  };
};

export type SocialInfo = ReturnType<typeof getActiveSocialInfo>;
