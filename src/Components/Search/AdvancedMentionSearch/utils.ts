import {
  mapPlainTextIndex,
  getPlainText
  // @ts-ignore
} from '../../Input/react-mentions/utils';
import { MENTION_CONFIG, truncateMentionLabel } from '../../Input/utils';
import { ChainSelectOption, defaultChainOption } from './ChainFilter';
import { TokenSelectOption, defaultTokenOption } from './TokenFilter';
import { AdvancedMentionSearchItem } from './types';

export const INFINITE_SCROLL_CONTAINER_ID = 'advance-search-scroller';

export const getSearchItemMention = (
  item: AdvancedMentionSearchItem,
  truncateLabel?: boolean
) => {
  const displayLabel = truncateLabel
    ? truncateMentionLabel(item.name)
    : item.name;
  return `#⎱${displayLabel}⎱(${item.address} ${item.type} ${item.blockchain} ${
    item.eventId || 'null'
  })`;
};

export const getCustomInputMention = (address: string, mode: string) => {
  return `#⎱${address}⎱(${address}    ${mode})`;
};

const SEARCH_TERM_REGEX = /@(\w*)?/;

export const getSearchQuery = (
  mentionValue: string,
  displayValueStartIndex = 0
) => {
  const displayValue = getPlainText(mentionValue, MENTION_CONFIG);
  const matched = displayValue
    .substring(displayValueStartIndex)
    .match(SEARCH_TERM_REGEX);
  return matched ? matched[1] : null;
};

export const getFormattedAddress = (
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

export const getAppliedFilterCount = ({
  appliedTokenFilter,
  appliedChainFilter
}: {
  appliedTokenFilter: TokenSelectOption;
  appliedChainFilter: ChainSelectOption;
}) => {
  let count = 0;
  if (appliedTokenFilter.value !== defaultChainOption.value) {
    count += 1;
  }
  if (appliedChainFilter.value !== defaultTokenOption.value) {
    count += 1;
  }
  return count;
};

const DEFAULT_IMAGE_REGEX = /ai-suggestion-(.+).png$/;

export const isDefaultImage = (url: string) => {
  if (!url) {
    return false;
  }
  return DEFAULT_IMAGE_REGEX.test(url);
};
