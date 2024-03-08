import { formatAddress } from '../../../utils';
import {
  getEndOfLastMention,
  getPlainText,
  mapPlainTextIndex
  // @ts-ignore
} from '../../Input/react-mentions/utils';
import { MENTION_CONFIG, truncateMentionLabel } from '../../Input/utils';
import { SocialSearchItem } from './types';

export const INFINITE_SCROLL_CONTAINER_ID = 'social-search-scroller';

export const getSearchItemMention = (
  item: SocialSearchItem,
  truncateLabel?: boolean
) => {
  const address = formatAddress(item.profileName, item.dappName);
  const displayLabel = truncateLabel ? truncateMentionLabel(address) : address;
  return `#⎱${displayLabel}⎱(${address}  ethereum null)`;
};

export const getChannelSearchItemMention = (
  channelName: string,
  channelId: string,
  truncateLabel?: boolean
) => {
  const displayLabel = truncateLabel
    ? truncateMentionLabel(channelName)
    : channelName;
  return `#⎱${displayLabel}⎱(${channelId}  null null)`;
};

const SEARCH_TERM_REGEX = /([a-zA-Z0-9_.:/@+-]{3,})$/;

// regex to stop searching if query matches it
const SEARCH_STOP_REGEX = /^((fc_fname:|lens\/@).*|.*(.lens))$/;

export const getSocialSearchQueryData = (mentionValue: string) => {
  if (mentionValue.length < 3) {
    return null;
  }
  const displayValue = getPlainText(mentionValue, MENTION_CONFIG);
  const indexInDisplayValue = getEndOfLastMention(mentionValue, MENTION_CONFIG);
  const matched = displayValue
    .substring(indexInDisplayValue)
    .match(SEARCH_TERM_REGEX);
  if (!matched || matched.index === undefined) {
    return null;
  }
  const query = matched[1].toLowerCase();
  if (SEARCH_STOP_REGEX.test(query)) {
    return null;
  }
  const queryStartIndex = indexInDisplayValue + matched.index;
  const queryEndIndex = queryStartIndex + query.length;
  return {
    query,
    queryStartIndex,
    queryEndIndex
  };
};

export const getUpdatedMentionValue = (
  mentionValue: string,
  mention: string,
  indexInDisplayValue = 0
) => {
  // for the passed index in the displayValue, returns the corresponding index in mentionValue
  const positionInValue = mapPlainTextIndex(
    mentionValue,
    MENTION_CONFIG,
    indexInDisplayValue,
    'NULL'
  );
  if (positionInValue === null) {
    return null;
  }
  return (
    mentionValue.substring(0, positionInValue) +
    mentionValue.substring(positionInValue).replace(SEARCH_TERM_REGEX, mention)
  );
};
