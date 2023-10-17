import { MENTION_MARKUP, MENTION_REGEX } from '../Input/constants';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { mapPlainTextIndex } from '../Input/react-mentions/utils';
import { AdvancedSearchAIMentionsResults } from './types';

export const getItemMention = (item: AdvancedSearchAIMentionsResults) => {
  return `#⎱${item.name}⎱(${item.address} ${item.type} ${item.blockchain} ${
    item.eventId || 'null'
  })`;
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

const DEFAULT_IMAGE_REGEX =
  /site\/images\/ai-suggestion-(eth|polygon|gnosis).png/;

export const getAssetImage = (type: string, url?: string | null) => {
  if (!url) {
    return '';
  }
  const [matched] = url.match(DEFAULT_IMAGE_REGEX) || [];
  if (matched) {
    if (type === 'NFT_COLLECTION') {
      return ''; // Want to show placeholder image for NFTs if they have default image
    }
    return `https://assets.airstack.xyz/${matched}`;
  }
  return url;
};

const mapConfig = [
  {
    displayTransform: (id: string, display: string) => display || id,
    markup: MENTION_MARKUP,
    regex: MENTION_REGEX
  }
];

export const getUpdatedMentionValue = (
  mentionValue: string,
  itemMention: string,
  indexInDisplayValue: number
) => {
  // for the passed index in the displayValue, returns the corresponding index in mentionValue
  const positionInValue = mapPlainTextIndex(
    mentionValue,
    mapConfig,
    indexInDisplayValue,
    'NULL'
  );
  if (positionInValue === null) {
    return;
  }
  return (
    mentionValue.substring(0, positionInValue) +
    mentionValue
      .substring(positionInValue)
      .replace(SEARCH_TERM_REGEX, itemMention)
  );
};
