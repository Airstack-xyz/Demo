import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '../../../Components/Icon';
import { InputWithMention } from '../../../Components/Input/Input';
import {
  MentionValues,
  getAllWordsAndMentions
} from '../../../Components/Input/utils';

export type MentionOutput = {
  text: string;
  mentions: MentionValues[];
  rawText: string;
};

type MentionInputProps = {
  defaultValue: string;
  placeholder: string;
  tooltip?: string;
  className?: string;
  disabled?: boolean;
  disableSuggestions?: boolean;
  onSubmit: (params: MentionOutput) => void;
  validationFn?: (params: MentionOutput) => boolean;
  onClear?: () => void;
};

const padding = '  ';

export function MentionInput({
  defaultValue,
  placeholder,
  tooltip,
  className,
  disabled,
  disableSuggestions,
  validationFn,
  onSubmit,
  onClear
}: MentionInputProps) {
  const [value, setValue] = useState('');

  const [isInputSectionFocused, setIsInputSectionFocused] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

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

  const handleTooltipShow = useCallback(() => {
    setIsTooltipVisible(true);
  }, []);

  const handleTooltipHide = useCallback(() => {
    setIsTooltipVisible(false);
  }, []);

  const handleInputClear = useCallback(() => {
    setValue('');
    onClear?.();
  }, [onClear]);

  const handleSubmit = (value: string) => {
    setIsInputSectionFocused(false);

    const rawInput: string[] = [];
    const words: string[] = [];
    const mentions: MentionValues[] = [];

    getAllWordsAndMentions(value).forEach(({ word, mention, rawValue }) => {
      rawInput.push(rawValue);
      words.push(word);
      if (mention) {
        mentions.push(mention);
        return;
      }
    });

    const rawText = rawInput.join(padding);
    const text = words.join(' ');

    if (rawText && validationFn && !validationFn({ text, mentions, rawText })) {
      return;
    }

    onSubmit({ text, mentions, rawText });

    setValue(rawText.trim() + padding);
  };

  return (
    <div className="relative">
      <div
        ref={inputSectionRef}
        onMouseEnter={disabled ? handleTooltipShow : undefined}
        onMouseLeave={disabled ? handleTooltipHide : undefined}
        className={classNames('sf-mention-input', className)}
      >
        <InputWithMention
          value={value}
          disabled={disabled}
          onChange={setValue}
          onSubmit={handleSubmit}
          placeholder={placeholder}
          disableSuggestions={disableSuggestions}
        />
        <div ref={buttonSectionRef} className="flex justify-end pl-2">
          {isInputSectionFocused && value && (
            <button type="submit">
              <Icon name="search" width={16} height={16} />
            </button>
          )}
          {!isInputSectionFocused && value && (
            <button type="button" onClick={handleInputClear}>
              <Icon name="close" width={14} height={14} />
            </button>
          )}
        </div>
      </div>
      {disabled && isTooltipVisible && (
        <div className="absolute left-4 top-4 z-20">
          <img src="images/cursor.svg" height={30} width={30} />
          <div className="bg-glass-1 rounded-[16px] py-1.5 px-3 w-max text-text-secondary">
            {tooltip || 'Please wait until loading finishes'}
          </div>
        </div>
      )}
    </div>
  );
}
