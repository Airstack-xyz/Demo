import { formatAddress } from '../../../utils';
import {
  getEndOfLastMention,
  getPlainText,
  mapPlainTextIndex
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
} from '../../Input/react-mentions/utils';
import { MENTION_CONFIG } from '../../Input/utils';
import { SocialSearchItem } from './types';

export const getSearchItemMention = (item: SocialSearchItem) => {
  const address = formatAddress(item.profileName, item.dappName);
  return `#⎱${address}⎱(${address}  ethereum null)`;
};

const SEARCH_TERM_REGEX = /\b([a-zA-Z0-9.]{3,})$/;

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
  const query = matched[1];
  if (query.startsWith('fc_') || query.startsWith('lens/')) {
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
