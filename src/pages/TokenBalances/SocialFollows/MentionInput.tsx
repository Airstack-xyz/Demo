import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '../../../Components/Icon';
import { InputWithMention } from '../../../Components/Input/Input';
import { getAllWordsAndMentions } from '../../../Components/Input/utils';
import { MentionData } from '../../../Components/Input/types';

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
  const [value, setValue] = useState('');

  const [isInputSectionFocused, setIsInputSectionFocused] = useState(false);

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
    setValue('');
    onClear?.();
  }, [onClear]);

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

  return (
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
        onChange={setValue}
        onSubmit={handleSubmit}
        placeholder={placeholder}
        disableSuggestions={disableSuggestions}
      />
      <div ref={buttonSectionRef} className="flex justify-end pl-2">
        {isInputSectionFocused && value && (
          <button type="button" onClick={handleInputSubmit}>
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
  );
}
