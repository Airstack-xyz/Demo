/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchAIMentionsQuery } from '../../queries';
import { createFormattedRawInput } from '../../utils/createQueryParamsWithMention';
import {
  ADDRESS_OPTION_ID,
  MENTION_MARKUP,
  MENTION_REGEX,
  POAP_OPTION_ID
} from './constants';
import {
  MentionData,
  MentionType,
  SearchAIMentionsInput,
  SearchAIMentionsResponse,
  SearchAIMentionsResults
} from './types';

// Used for passing config in utility functions of react-mentions
export const MENTION_CONFIG = [
  {
    displayTransform: (id: string, display: string) => display || id,
    markup: MENTION_MARKUP,
    regex: MENTION_REGEX
  }
];

// Used for displaying correct type mention in @mention list-item
export const MENTION_TYPE_MAP: Record<string, string> = {
  [MentionType.NFT_COLLECTION]: 'NFT',
  [MentionType.DAO_TOKEN]: 'DAO',
  [MentionType.TOKEN]: 'Token',
  [MentionType.POAP]: 'POAP'
};

export const ID_REGEX = /#⎱.+?⎱\((.+?)\)\s*/g;
export const NAME_REGEX = /#⎱(.+?)⎱\(.+?\)/g;
export const REGEX_LAST_WORD_STARTS_WITH_AT = /\s*@[^\s]*$/g;
export const REGEX_FIRST_WORD_IS_AT = /^@[^\s]*/g;

const REGEX_FIRST_WORD = /([^\s]*)/;

const tokenValuePrefixMap: Record<MentionType, string> = {
  [MentionType.NFT_COLLECTION]: 'NFT collection',
  [MentionType.DAO_TOKEN]: 'token contract address',
  [MentionType.TOKEN]: 'token contract address',
  [MentionType.POAP]: 'POAP event ID'
};

export function getNameFromMarkup(markup: string) {
  //matches names with [ and ] brackets, also keeps one ] in the end
  const NEW_NAME_REGEX = /#⎱([^⎱]+)⎱\((?:[^)]+?)\)/;
  const match = markup.match(NEW_NAME_REGEX);
  if (!match || match[1]) return '';
  // remove the end ] from the string
  return match[1].substring(2, match[1].length - 1);
}

function getNode(parent: HTMLElement) {
  let node = parent.querySelector('#mention-highlight');
  if (node) return node;
  node = document.createElement('div');
  node.id = 'mention-highlight';
  parent.insertBefore(node, parent.firstChild);
  return node;
}

export function highlightMentionText(root: HTMLElement, matched = false) {
  const children = root?.childNodes;

  function updateOnMatch(node: any, regex: RegExp) {
    const _node = node.children?.length > 0 ? node.children[0] : node;
    if (node.nodeType !== Node.TEXT_NODE) {
      node.innerHTML = _node.innerHTML.replace(regex, (match: string) => {
        return `<span class="match-at">${match}</span>`;
      });
    }
  }

  children.forEach((node: any) => {
    const mentionStartMatch = REGEX_LAST_WORD_STARTS_WITH_AT.exec(
      node.innerText
    );

    if (node?.children && node.children.length > 1) {
      highlightMentionText(node, matched);
      return;
    }

    // there is chance that the whole mention word is not in the single node
    // this can happen when the cursor is in the middle of the mention word
    if (matched && node) {
      updateOnMatch(node, REGEX_FIRST_WORD);
      matched = false;
      return;
    }

    if (mentionStartMatch) {
      updateOnMatch(node, REGEX_LAST_WORD_STARTS_WITH_AT);
      matched = true;
    } else if (REGEX_FIRST_WORD_IS_AT.exec(node.innerText)) {
      updateOnMatch(node, REGEX_FIRST_WORD_IS_AT);
    }
  });
}

export function highlightMention(
  el: HTMLTextAreaElement | null,
  disableHighlighting?: boolean
) {
  if (!el) return;
  const root = getNode(el.parentElement as HTMLElement) as HTMLElement;
  const targetNode = root.nextSibling as HTMLElement;
  const config = { childList: true, subtree: true, characterData: true };

  const callback = () => {
    root.innerHTML = targetNode.innerHTML;
    if (!disableHighlighting) {
      highlightMentionText(root);
    }
  };
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
  callback(); // Handle the initial value

  // !Important: handleScroll is responsible for moving overflow text content to left, without this typing will not shift text content to left
  function handleScroll({ target }: any) {
    root.scrollTop = target.scrollTop;
    root.scrollLeft = target.scrollLeft;
  }

  el?.addEventListener('scroll', handleScroll);
  // Adding keyup event as well because scroll event on mention-input doesn't get called on Safari
  el?.addEventListener('keyup', handleScroll);

  return () => {
    observer.disconnect();
    el?.removeEventListener('scroll', handleScroll);
    el?.removeEventListener('keyup', handleScroll);
  };
}

// id format: <address> <token type> <blockchain>
export function generateId(mention: SearchAIMentionsResults) {
  return `${mention.address} ${mention.type} ${mention.blockchain} ${mention.eventId}`;
}

export function getUsableValues(value: string) {
  if (!value) return { prompt: '', displayValue: '' };
  // customId is a string generated by generateId function
  function replacer(_: unknown, customId: string) {
    const [address, token, blockchain, _eventId, customInputType] =
      customId.split(' ');
    const eventId = _eventId === 'null' ? null : _eventId;
    // if no token and blockchain, it's a user entered address so use it as is
    if (customInputType === ADDRESS_OPTION_ID) {
      return `${address} `;
    }

    if (customInputType === POAP_OPTION_ID || token === MentionType.POAP) {
      return `${tokenValuePrefixMap[MentionType.POAP]} ${eventId || address} `;
    }

    return `${
      tokenValuePrefixMap[token as MentionType] || ''
    } ${address} on ${blockchain} `;
  }
  const prompt = value.replace(ID_REGEX, replacer);
  const displayValue = value.replace(NAME_REGEX, '$1 ');
  return {
    prompt,
    displayValue
  };
}
export function isMention(str: string) {
  return Boolean(/#⎱.+?⎱\((.+?)\)\s*/g.exec(str));
}

export function getValuesFromId(id: string): MentionData {
  const match = /#⎱.+?⎱\((.+?)\)\s*/g.exec(id);
  if (!match) return { address: id };
  const [address, token, blockchain, eventId, customInputId] =
    match[1].split(' ');
  const customInputType =
    token === MentionType.POAP || customInputId === POAP_OPTION_ID
      ? 'POAP'
      : 'ADDRESS';

  return {
    address,
    token,
    blockchain,
    eventId: eventId === 'null' ? null : eventId,
    customInputType
  };
}

export function getAllMentionDetails(query: string): [MentionData[], string] {
  const matches = query.match(/#⎱.+?⎱\((.+?)\)\s*/g);
  if (!matches) return [[], ''];

  return [
    matches.map(match => getValuesFromId(match)),
    matches.map(match => match.trim()).join(' ')
  ];
}

function getRawString(string: string) {
  return createFormattedRawInput({
    address: string,
    blockchain: 'ethereum',
    type: string.startsWith('0x')
      ? 'ADDRESS'
      : !isNaN(Number(string))
      ? 'POAP'
      : '',
    label: string
  });
}

type WordWithMention = {
  word: string;
  rawValue: string;
  mention?: MentionData;
};

export function getAllWordsAndMentions(query: string): WordWithMention[] {
  const matches = query.matchAll(/#⎱.+?⎱\((.+?)\)\s*/g);

  const wordsAndMentions: WordWithMention[] = [];
  let currentIndex = 0;

  [...matches].forEach(match => {
    const matchedString = match[0];
    const index = match.index;
    const wordBeforeMention = query.substring(currentIndex, index);

    if (wordBeforeMention) {
      wordBeforeMention.split(' ').forEach(word => {
        if (word) {
          wordsAndMentions.push({
            word: word,
            rawValue: getRawString(word)
          });
        }
      });
    }

    if (index !== undefined && index >= currentIndex) {
      wordsAndMentions.push({
        word: matchedString.trim(),
        rawValue: matchedString.trim(),
        mention: getValuesFromId(matchedString.trim())
      });
      currentIndex = index + matchedString.length;
    }
  });

  if (currentIndex < query.length) {
    const lastWord = query.substring(currentIndex, query.length);
    lastWord.split(' ').forEach(word => {
      if (word) {
        wordsAndMentions.push({
          word: word,
          rawValue: getRawString(word)
        });
      }
    });
  }
  return wordsAndMentions;
}

export function needHelp(str: string) {
  // match /help or /help <something>
  const regex = /\/(help|.*?\shelp)/g;
  const match = regex.exec(str.trim());
  return Boolean(match);
}

export function debouncePromise<CB extends (...args: any[]) => any>(
  callback: CB,
  timeout = 500
): CB {
  let timer: any;
  let resolved: ((value: null | Awaited<ReturnType<CB>>) => void) | null = null;
  return ((...args) => {
    clearTimeout(timer);
    if (resolved) {
      resolved(null);
      resolved = null;
    }
    timer = setTimeout(async () => {
      const response: any = await callback(...args);
      if (resolved) {
        resolved(response);
      }
    }, timeout);
    return new Promise(r => (resolved = r));
  }) as CB;
}

const MENTION_ENDPOINT = process.env.MENTION_ENDPOINT as string;

export async function fetchAIMentions<T = SearchAIMentionsResponse>({
  input,
  query,
  signal
}: {
  input: SearchAIMentionsInput;
  query?: string;
  signal?: AbortSignal | null;
}): Promise<[T | null, string | null]> {
  try {
    const res = await fetch(MENTION_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({
        query: query || SearchAIMentionsQuery,
        variables: {
          input
        }
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      signal
    });

    if (!res.ok) {
      return [null, 'Something went wrong'];
    }

    const { data } = await res.json();
    if (data.errors) {
      return [null, data.errors[0].message];
    }

    return [data, null];
  } catch (error: any) {
    return [null, error?.message || 'Something went wrong'];
  }
}
