import {
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { MentionsInput, Mention } from './react-mentions';
import './input-styles.css';
import {
  generateId,
  capitalizeFirstLetter,
  highlightMention,
  ID_REGEX,
  NAME_REGEX,
  REGEX_LAST_WORD_STARTS_WITH_AT,
  debouncePromise,
  MentionType,
  SearchAIMentions_SearchAIMentions,
  fetchMentionOptions
} from './utils';
import { AddressInput } from './AddressInput';
import { ADDRESS_OPTION_ID, MENTION_COUNT, POAP_OPTION_ID } from './constants';
import { Icon } from '../Icon';

type Option = SearchAIMentions_SearchAIMentions & {
  id: string;
  display: string;
};

type AIInputProps = {
  disabled?: boolean;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  defaultValue?: string;
};

const mentionTypeMap: Record<MentionType, string> = {
  [MentionType.NFT_COLLECTION]: 'NFT',
  [MentionType.DAO_TOKEN]: 'DAO',
  [MentionType.TOKEN]: 'Token',
  [MentionType.POAP]: 'POAP'
};
const placeholder = 'Enter 0x, name.eth, fc_fname:name, or name.lens';
export function InputWithMention({
  disabled,
  onChange,
  defaultValue,
  onSubmit
}: AIInputProps) {
  const [showInputFor, setShowInputFor] = useState<
    'ID_ADDRESS' | 'ID_POAP' | null
  >(null);
  const [inputPositon, setInputPositon] = useState({
    top: 'auto',
    left: 'auto',
    right: 'auto'
  });
  const [value, setValue] = useState(defaultValue || '');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const allowSubmitRef = useRef(true);
  const valueRef = useRef(value);
  const lastPositionOfCarretRef = useRef(0);
  const [loading, setLoading] = useState(false);

  // const [getMentions, { loading }] = useLazyQuery(MentionsQuery);

  // const placeholder = useAnimateInputPlaceholder(inputRef.current);

  const getMentions = useCallback(async (query: string) => {
    setLoading(true);
    const res = await fetchMentionOptions(query, MENTION_COUNT);
    setLoading(false);
    return res;
  }, []);

  const handlePaste = useCallback((event: ClipboardEvent) => {
    if (event.target !== inputRef.current) {
      return;
    }
    const REGEX_WORD_STARTS_WITH_AT = /\s@[^\s-]*/g;
    const REGEX_FIRST_WORD_STARTS_WITH_AT = /^@\w+/g;

    // find the first word that starts with @
    let match = REGEX_WORD_STARTS_WITH_AT.exec(valueRef.current || '');
    // if no match, try to match the first word of the value if it starts with @
    if (!match) {
      match = REGEX_FIRST_WORD_STARTS_WITH_AT.exec(valueRef.current || '');
    }
    if (match && inputRef.current) {
      const matchingText = match[0];
      const caretPosition = matchingText.length + match.index;
      inputRef.current.setSelectionRange(caretPosition, caretPosition);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  useEffect(() => {
    return highlightMention(inputRef.current);
  }, []);

  const handleUserInput = useCallback(
    ({ target: { value } }: { target: { value: string } }) => {
      valueRef.current = value;
      setValue(value);
      onChange(value);
    },
    [onChange]
  );

  const handleKeypress: KeyboardEventHandler<HTMLTextAreaElement> = useCallback(
    event => {
      if (event.key === 'Enter') {
        // prevent sumbmition when user is selecting a suggestion from the dropdown menu with Enter key
        if (!allowSubmitRef.current) {
          allowSubmitRef.current = true;
          return;
        }
        event.preventDefault();
        onSubmit(value);
      }
    },
    [onSubmit, value]
  );

  const onAddSuggestion = useCallback((id: string) => {
    // this prevents submition if user is selecting a suggestion from the dropdown menu with enter key
    allowSubmitRef.current = false;

    if (id === ADDRESS_OPTION_ID || id === POAP_OPTION_ID) {
      const overlay = document.getElementById(
        'suggestions-overlay'
      ) as HTMLElement;

      const top = overlay.style.top
        ? `${parseInt(overlay.style.top, 10)}px`
        : 'auto';
      let left = overlay.style.left
        ? `${parseInt(overlay.style.left, 10)}px`
        : 'auto';
      const right = overlay.style.right
        ? `${parseInt(overlay.style.right, 10)}px`
        : 'auto';

      if (left !== 'auto' && inputRef.current) {
        const maxLeft = 290 + parseInt(left, 10);
        const isGoingPastInputBorder = inputRef.current.offsetWidth < maxLeft;
        left = isGoingPastInputBorder
          ? `${inputRef.current.offsetWidth - 290}px`
          : left;
      }
      setInputPositon({
        top: top,
        left: left,
        right: right
      });
      setShowInputFor(id);
      lastPositionOfCarretRef.current = inputRef.current?.selectionStart || 0;

      return false; // don't add the mention to input
    }
    return true; // add the mention
  }, []);

  const handleCloseAddressInput = useCallback(
    (address: string) => {
      setShowInputFor(null);
      // wait for address input to hide before taking focus back to input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);

      if (!address) return;

      let extraLengthTakenByMention = 0;

      const mentionMakups = value.match(ID_REGEX);
      // find out how many characters the mention markup is longer than the id
      // so we can adjust the carret position accordingly
      // the mention markup is longer than the id because it contains the display name
      mentionMakups?.forEach(mention => {
        const REGEX_NAME = new RegExp(NAME_REGEX);
        const match = REGEX_NAME.exec(mention);
        const id = match?.[1] || '';
        extraLengthTakenByMention += mention.trimEnd().length - id.length;
      });

      const actualCarretPosition =
        lastPositionOfCarretRef.current + extraLengthTakenByMention;

      let textBeforeCarret = value.slice(0, actualCarretPosition);
      const remainingText = value.slice(actualCarretPosition);
      const startsWithAt = textBeforeCarret[0] === '@';
      // add space in front of the mention if it doesn't start with @, otherwise the regex won't match
      textBeforeCarret = startsWithAt
        ? ' ' + textBeforeCarret
        : textBeforeCarret;

      textBeforeCarret = textBeforeCarret
        .trimEnd()
        .replace(
          REGEX_LAST_WORD_STARTS_WITH_AT,
          ` #[${address}](${address}    ${showInputFor})`
        );

      if (startsWithAt) {
        // remove the space we added in front of the mention
        textBeforeCarret = textBeforeCarret.substring(1);
      }

      const newValue = textBeforeCarret + remainingText.trimStart();
      handleUserInput({ target: { value: newValue } });
    },
    [handleUserInput, showInputFor, value]
  );
  const fetchMentions = useCallback(
    async (query: string): Promise<Option[]> => {
      const [response] = await getMentions(query);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = response as any;
      if (data?.SearchAIMentions) {
        return data.SearchAIMentions.map(
          (mention: SearchAIMentions_SearchAIMentions) => ({
            id: generateId(mention),
            display: mention.name,
            ...mention,
            blockchain: capitalizeFirstLetter(mention.blockchain || '')
          })
        );
      }

      return [];
    },
    [getMentions]
  );

  const deboucedFetch = useMemo(
    () => debouncePromise(fetchMentions),
    [fetchMentions]
  );

  const getData = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (query: string, callback: any) => {
      const data = await deboucedFetch(query);
      const dataWithAddressOption = [
        ...(data || []),
        { id: ADDRESS_OPTION_ID },
        { id: POAP_OPTION_ID }
      ];
      callback(dataWithAddressOption);
    },
    [deboucedFetch]
  );

  return (
    <div className="wrapper w-full p-2 sm:w-auto sm:p-auto">
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore-next-line */}
      <MentionsInput
        id="mention-input"
        singleLine
        style={{ outline: 'none' }}
        placeholder={placeholder}
        onKeyUp={handleKeypress}
        className="mentions"
        value={value}
        onChange={handleUserInput}
        spellCheck={false}
        inputRef={inputRef}
        disabled={showInputFor || disabled}
        customChildren={
          showInputFor ? (
            <AddressInput
              {...inputPositon}
              placeholder={
                showInputFor === ADDRESS_OPTION_ID
                  ? 'Enter contract address here'
                  : 'Enter POAP event id here'
              }
              onRequestClose={handleCloseAddressInput}
            />
          ) : null
        }
      >
        <Mention
          markup="#[__display__](__id__)"
          trigger="@"
          appendSpaceOnAdd
          onAdd={onAddSuggestion}
          className="mention"
          isLoading={loading}
          renderSuggestion={(suggestion: Option) => {
            if (suggestion.id === ADDRESS_OPTION_ID) {
              return (
                <div className="addressOption">
                  <Icon name="input-tokens" /> Enter token contract address
                </div>
              );
            }

            if (suggestion.id === POAP_OPTION_ID) {
              return (
                <div className="addressOption">
                  <Icon name="input-poap" /> Enter a POAP event ID
                </div>
              );
            }

            return (
              <div className="suggestion">
                <img
                  src={suggestion.thumbnailURL || ''}
                  alt={suggestion.display}
                />
                <span className="text">
                  <p className="text-left">
                    {suggestion.display}
                    <span className="type">
                      {suggestion.blockchain}
                      <span>•</span>
                      {mentionTypeMap[suggestion.type as MentionType] || ''}
                    </span>
                  </p>
                </span>
              </div>
            );
          }}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore-next-line
          data={getData}
        />
      </MentionsInput>
    </div>
  );
}
