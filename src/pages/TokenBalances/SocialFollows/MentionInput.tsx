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
  const [value, setValue] = useState(defaultValue);

  const isMobile = isMobileDevice();

  const [isInputSectionFocused, setIsInputSectionFocused] = useState(false);
  const [isAdvancedSearchVisible, setIsAdvancedSearchVisible] = useState(false);
  const inputSectionRef = useRef<HTMLDivElement>(null);
  const buttonSectionRef = useRef<HTMLDivElement>(null);

  // Need to show advanced only for desktop screen
  const isAdvancedSearchEnabled = !isMobile;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // if click event is outside input section
      if (
        inputSectionRef.current &&
        !inputSectionRef.current?.contains(event.target as Node)
      ) {
        setIsInputSectionFocused(false);
        setIsAdvancedSearchVisible(false);
      }
      // if click event is from input section not from button section
      else if (
        buttonSectionRef.current &&
        !buttonSectionRef.current?.contains(event.target as Node)
      ) {
        setIsInputSectionFocused(true);
        if (isAdvancedSearchEnabled) {
          setIsAdvancedSearchVisible(true);
        }
      }
    }
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [isAdvancedSearchEnabled]);

  const handleInputClear = useCallback(() => {
    if (isAdvancedSearchVisible) {
      setIsAdvancedSearchVisible(false);
    } else {
      setValue('');
      onClear?.();
    }
  }, [isAdvancedSearchVisible, onClear]);

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

  const hideAdvancedSearch = useCallback(() => {
    setIsAdvancedSearchVisible(false);
  }, []);

  const _disableSuggestions =
    !isMobile || isAdvancedSearchVisible || disableSuggestions;

  return (
    <div id="sf-input-section" className="relative z-10">
      <div ref={inputSectionRef}>
        <div
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
            disableSuggestions={_disableSuggestions}
            onChange={setValue}
            onSubmit={handleSubmit}
          />
          <div ref={buttonSectionRef} className="flex justify-end pl-2">
            {!!value && (
              <>
                {!isInputSectionFocused || isAdvancedSearchVisible ? (
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
        {isAdvancedSearchVisible && (
          <div className="before-bg-glass before:rounded-18 rounded-18 border-solid-stroke w-[min(60vw,786px)] absolute top-8">
            <div
              className="bg-primary/70 z-[-1] inset-0 fixed"
              onClick={hideAdvancedSearch}
            />
            <AdvancedSearch
              mentionInputSelector="#sf-input-section #mention-input"
              value={value}
              onChange={setValue}
              onClose={hideAdvancedSearch}
            />
          </div>
        )}
      </div>
    </div>
  );
}
