import { getAllWordsAndMentions } from '../Components/Input/utils';

export const getActiveSocialInfoString = ({
  dappName,
  dappSlug,
  followerCount,
  followingCount,
  followerTab,
  mentionRawText,
  thresholdRawText,
  filters
}: {
  dappName: string;
  dappSlug: string;
  followerCount: number;
  followingCount: number;
  followerTab?: boolean;
  mentionRawText?: string;
  thresholdRawText?: string;
  filters?: string[];
}) => {
  return `${dappName}│${dappSlug}│${followerCount}│${followingCount}│${
    followerTab ? '1' : '0'
  }│${mentionRawText || ''}│${thresholdRawText || ''}│${
    filters?.join(',') || ''
  }`;
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
    isApplicable: Boolean(dappSlug),
    dappName,
    dappSlug,
    followerCount: Number(followerCount),
    followingCount: Number(followingCount),
    followerTab: followerTab === '1',
    mentionRawText,
    thresholdRawText,
    activeMention,
    thresholdAmount,
    filters
  };
};

export type SocialInfo = ReturnType<typeof getActiveSocialInfo>;
