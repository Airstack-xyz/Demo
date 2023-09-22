import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '../../../Components/Icon';
import { InputWithMention } from '../../../Components/Input/Input';
import {
  MentionValues,
  getAllWordsAndMentions
} from '../../../Components/Input/utils';
import classNames from 'classnames';

export type MentionOutput = {
  text: string;
  mentions: MentionValues[];
  rawText: string;
};

type MentionInputProps = {
  defaultValue: string;
  placeholder: string;
  className?: string;
  disableSuggestions?: boolean;
  onSubmit: (params: MentionOutput) => void;
  validationFn?: (params: MentionOutput) => boolean;
  onClear?: () => void;
};

const padding = '  ';

export function MentionInput({
  defaultValue,
  placeholder,
  className,
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

  const handleInputSubmit = useCallback((value: string) => {
    setIsInputSectionFocused(false);
    setValue(value);
  }, []);

  const handleInputClear = useCallback(() => {
    setValue('');
    onClear?.();
  }, [onClear]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
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

    if (validationFn && !validationFn({ text, mentions, rawText })) {
      return;
    }

    onSubmit({ text, mentions, rawText });

    setValue(rawText.trim() + padding);
  };

  return (
    <form className="flex flex-row justify-center" onSubmit={handleSubmit}>
      <div
        ref={inputSectionRef}
        className={classNames(
          'flex items-center h-[40px] min-w-[200px] border-solid-stroke rounded-full bg-glass px-3 py-2',
          className
        )}
      >
        <InputWithMention
          value={value}
          onChange={setValue}
          onSubmit={handleInputSubmit}
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
    </form>
  );
}
