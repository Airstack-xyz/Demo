import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import AdvancedSearch from '../../../Components/AdvancedSearch';
import { Icon } from '../../../Components/Icon';
import {
  AdvancedSearchParams,
  InputWithMention
} from '../../../Components/Input/Input';
import { MentionData } from '../../../Components/Input/types';
import { getAllWordsAndMentions } from '../../../Components/Input/utils';
import { PADDING } from '../../../Components/Search/Search';
import { isMobileDevice } from '../../../utils/isMobileDevice';

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
  startIndex: number;
  endIndex: number;
};

const defaultAdvancedSearchData: AdvancedSearchData = {
  visible: false,
  startIndex: -1,
  endIndex: -1
};

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
  const mentionInputRef = useRef<HTMLTextAreaElement>(null);
  const inputSectionRef = useRef<HTMLDivElement>(null);

  const [isInputSectionFocused, setIsInputSectionFocused] = useState(false);

  const [advancedSearchData, setAdvancedSearchData] =
    useState<AdvancedSearchData>(defaultAdvancedSearchData);

  const [value, setValue] = useState(defaultValue);

  const isMobile = isMobileDevice();

  useEffect(() => {
    const mentionInputEl = mentionInputRef?.current;
    function handleMentionInputFocus() {
      setIsInputSectionFocused(true);
    }
    function handleClickOutside(event: MouseEvent) {
      // if click event is outside mention input section
      if (
        inputSectionRef.current &&
        !inputSectionRef.current?.contains(event.target as Node)
      ) {
        setIsInputSectionFocused(false);
        setAdvancedSearchData(prev => ({ ...prev, visible: false }));
      }
    }
    mentionInputEl?.addEventListener('focus', handleMentionInputFocus);
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      mentionInputEl?.removeEventListener('focus', handleMentionInputFocus);
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const handleSubmit = useCallback(
    (val: string) => {
      setIsInputSectionFocused(false);
      setAdvancedSearchData(prev => ({ ...prev, visible: false }));

      const rawInput: string[] = [];
      const words: string[] = [];
      const mentions: MentionData[] = [];

      getAllWordsAndMentions(val).forEach(({ word, mention, rawValue }) => {
        rawInput.push(rawValue);
        words.push(word);
        if (mention) {
          mentions.push(mention);
          return;
        }
      });

      const rawText = rawInput.join(PADDING);
      const text = words.join(' ');

      if (
        rawText &&
        validationFn &&
        !validationFn({ text, mentions, rawText })
      ) {
        return;
      }

      onSubmit({ text, mentions, rawText });

      setValue(rawText.trim() + PADDING);
    },
    [onSubmit, validationFn]
  );

  const showAdvancedSearch = useCallback(
    ({ startIndex, endIndex }: AdvancedSearchParams) => {
      setAdvancedSearchData({
        visible: true,
        startIndex,
        endIndex
      });
    },
    []
  );

  const hideAdvancedSearch = useCallback(() => {
    setAdvancedSearchData(prev => ({ ...prev, visible: false }));
  }, []);

  const handleAdvanceSearchOnChange = (value: string) => {
    setValue(value);
    setTimeout(() => handleSubmit(value), 200);
  };

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

  const renderButtonContent = () => {
    if (!value) {
      return null;
    }
    if (!isInputSectionFocused || advancedSearchData.visible) {
      return (
        <button type="button" onClick={handleInputClear}>
          <Icon name="close" width={14} height={14} />
        </button>
      );
    }
    return (
      <button type="button" onClick={handleInputSubmit}>
        <Icon name="search" width={14} height={14} />
      </button>
    );
  };

  const disableAdvanceSearch = isMobile;

  return (
    <div className="relative z-10">
      <div ref={inputSectionRef}>
        <div
          className={classNames(
            'sf-mention-input',
            { 'cursor-not-allowed': disabled },
            className
          )}
        >
          <InputWithMention
            mentionInputRef={mentionInputRef}
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            disableSuggestions={disableSuggestions}
            onChange={setValue}
            onSubmit={handleSubmit}
            onAdvancedSearch={
              disableAdvanceSearch ? undefined : showAdvancedSearch
            }
          />
          <div className="flex justify-end pl-2">{renderButtonContent()}</div>
        </div>
        {advancedSearchData.visible && (
          <div className="before-bg-glass before:rounded-18 rounded-18 border-solid-stroke w-[min(60vw,786px)] absolute top-8">
            <div
              className="bg-primary/70 z-[-1] inset-0 fixed"
              onClick={hideAdvancedSearch}
            />
            <AdvancedSearch
              mentionInputRef={mentionInputRef}
              mentionValue={value}
              displayValueStartIndex={advancedSearchData.startIndex}
              displayValueEndIndex={advancedSearchData.endIndex}
              onChange={handleAdvanceSearchOnChange}
              onClose={hideAdvancedSearch}
            />
          </div>
        )}
      </div>
    </div>
  );
}
