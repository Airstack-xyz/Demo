import { MENTION_MARKUP, MENTION_REGEX } from '../Input/constants';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { mapPlainTextIndex, getPlainText } from '../Input/react-mentions/utils';
import { AdvancedSearchAIMentionsResults } from './types';

export const getSearchItemMention = (item: AdvancedSearchAIMentionsResults) => {
  return `#⎱${item.name}⎱(${item.address} ${item.type} ${item.blockchain} ${
    item.eventId || 'null'
  })`;
};

export const getCustomInputMention = (address: string, mode: string) => {
  return `#⎱${address}⎱(${address}    ${mode})`;
};

const SEARCH_TERM_REGEX = /@(\w*)?/;

export const getSearchQuery = (text?: string, start = 0) => {
  if (!text) return null;
  const matched = text.substring(start).match(SEARCH_TERM_REGEX);
  return matched ? matched[1] : null;
};

export const getAssetAddress = (
  type: string,
  eventId: string | null,
  address: string
) => {
  if (type === 'POAP') {
    if (!eventId) return '';
    return `#${eventId}`;
  }
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
};

const mentionConfig = [
  {
    displayTransform: (id: string, display: string) => display || id,
    markup: MENTION_MARKUP,
    regex: MENTION_REGEX
  }
];

export const getDisplayValue = (mentionValue: string) => {
  return getPlainText(mentionValue, mentionConfig);
};

export const getUpdatedMentionValue = (
  mentionValue: string,
  mention: string,
  indexInDisplayValue = 0
) => {
  // for the passed index in the displayValue, returns the corresponding index in mentionValue
  const positionInValue = mapPlainTextIndex(
    mentionValue,
    mentionConfig,
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
