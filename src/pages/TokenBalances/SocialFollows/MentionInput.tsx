import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '../../../Components/Icon';
import { InputWithMention } from '../../../Components/Input/Input';
import { getAllWordsAndMentions } from '../../../Components/Input/utils';
import { MentionData } from '../../../Components/Input/types';
import { isMobileDevice } from '../../../utils/isMobileDevice';
import AdvancedSearch from '../../../Components/AdvancedSearch';

export type MentionOutput = {
  text: string;
  mentions: MentionData[];
  rawText: string;
};

type MentionInputProps = {
  defaultValue: string;
  placeholder: string;
  className?: string;
  disabled?: boolean;
  disableSuggestions?: boolean;
  validationFn?: (params: MentionOutput) => boolean;
  onSubmit: (params: MentionOutput) => void;
  onClear?: () => void;
};

type AdvancedSearchData = {
  visible: boolean;
  mentionStartIndex: number;
  mentionEndIndex: number;
};

const defaultAdvancedSearchData: AdvancedSearchData = {
  visible: false,
  mentionStartIndex: -1,
  mentionEndIndex: -1
};

const advancedSearchContainerClass =
  'before-bg-glass before:rounded-18 rounded-18 border-solid-stroke w-[min(60vw,786px)] absolute top-8';

const padding = '  ';

export function MentionInput({
  defaultValue,
  placeholder,
  className,
  disabled,
  disableSuggestions,
  validationFn,
  onSubmit,
  onClear
}: MentionInputProps) {
  const [value, setValue] = useState('');

  const [advancedSearchData, setAdvancedSearchData] =
    useState<AdvancedSearchData>(defaultAdvancedSearchData);

  const [isInputSectionFocused, setIsInputSectionFocused] = useState(false);

  const isMobile = isMobileDevice();

  const inputSectionRef = useRef<HTMLDivElement>(null);
  const buttonSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setValue(defaultValue || '');
  }, [defaultValue]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // if click event is outside input section
      if (
        inputSectionRef.current &&
        !inputSectionRef.current?.contains(event.target as Node)
      ) {
        setIsInputSectionFocused(false);
      }
      // if click event is from input section not from button section
      else if (
        buttonSectionRef.current &&
        !buttonSectionRef.current?.contains(event.target as Node)
      ) {
        setIsInputSectionFocused(true);
      }
    }
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const handleInputClear = useCallback(() => {
    if (advancedSearchData.visible) {
      setAdvancedSearchData(prev => ({ ...prev, visible: false }));
    } else {
      setValue('');
      onClear?.();
    }
  }, [advancedSearchData.visible, onClear]);

  const handleInputSubmit = () => {
    handleSubmit(value);
  };

  const handleSubmit = (mentionValue: string) => {
    setIsInputSectionFocused(false);

    const rawInput: string[] = [];
    const words: string[] = [];
    const mentions: MentionData[] = [];

    getAllWordsAndMentions(mentionValue).forEach(
      ({ word, mention, rawValue }) => {
        rawInput.push(rawValue);
        words.push(word);
        if (mention) {
          mentions.push(mention);
          return;
        }
      }
    );

    const rawText = rawInput.join(padding);
    const text = words.join(' ');

    if (rawText && validationFn && !validationFn({ text, mentions, rawText })) {
      return;
    }

    onSubmit({ text, mentions, rawText });

    setValue(rawText.trim() + padding);
  };

  const showAdvancedSearch = useCallback(
    (mentionStartIndex: number, mentionEndIndex: number) => {
      setAdvancedSearchData({
        visible: true,
        mentionStartIndex,
        mentionEndIndex
      });
    },
    []
  );

  const hideAdvancedSearch = useCallback(() => {
    setAdvancedSearchData(prev => ({ ...prev, visible: false }));
  }, []);

  return (
    <div className="relative z-10">
      <div
        ref={inputSectionRef}
        className={classNames(
          'sf-mention-input',
          { 'cursor-not-allowed': disabled },
          className
        )}
      >
        <InputWithMention
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          disableSuggestions={disableSuggestions || advancedSearchData.visible}
          onChange={setValue}
          onSubmit={handleSubmit}
          showAdvancedSearch={isMobile ? undefined : showAdvancedSearch}
        />
        <div ref={buttonSectionRef} className="flex justify-end pl-2">
          {!!value && (
            <>
              {!isInputSectionFocused || advancedSearchData.visible ? (
                <button type="button" onClick={handleInputClear}>
                  <Icon name="close" width={14} height={14} />
                </button>
              ) : (
                <button type="button" onClick={handleInputSubmit}>
                  <Icon name="search" width={14} height={14} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
      {advancedSearchData.visible && (
        <div className={advancedSearchContainerClass}>
          <div
            className="bg-primary/70 z-[-1] inset-0 fixed"
            onClick={hideAdvancedSearch}
          />
          <AdvancedSearch
            mentionStartIndex={advancedSearchData.mentionStartIndex}
            mentionEndIndex={advancedSearchData.mentionEndIndex}
            mentionValue={value}
            onChange={setValue}
            onClose={hideAdvancedSearch}
          />
        </div>
      )}
    </div>
  );
}
