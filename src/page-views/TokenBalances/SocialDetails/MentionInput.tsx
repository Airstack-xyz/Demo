import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '../../../Components/Icon';
import { InputWithMention } from '../../../Components/Input/Input';
import {
  AdvancedMentionSearchParams,
  MentionData
} from '../../../Components/Input/types';
import { getAllWordsAndMentions } from '../../../Components/Input/utils';
import AdvancedMentionSearch from '../../../Components/Search/AdvancedMentionSearch';
import { PADDING } from '../../../Components/Search/Search';
import { isMobileDevice } from '../../../utils/isMobileDevice';

export type MentionOutput = {
  text: string;
  mentions: MentionData[];
  rawText: string;
};

function MentionFiltersButton({
  appliedFilterCount,
  isOpen,
  onClick
}: {
  appliedFilterCount: number;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      tabIndex={-1}
      className={classNames(
        'px-2 rounded-full bg-glass-1 text-text-secondary border border-solid border-transparent text-[10px] hover:bg-glass-1-light flex-row-center',
        { 'border-white': isOpen }
      )}
      onClick={onClick}
    >
      {appliedFilterCount > 0 ? (
        <>
          <span>{`Filters (${appliedFilterCount})`}</span>
        </>
      ) : (
        <>
          <span>Filters</span>
          <Icon
            name="arrow-down"
            height={18}
            width={18}
            className={classNames('ml-0.5', isOpen ? 'rotate-180' : 'rotate-0')}
          />
        </>
      )}
    </button>
  );
}

type SearchData = {
  visible: boolean;
  query: string;
  queryStartIndex: number;
  queryEndIndex: number;
};

const defaultSearchData: SearchData = {
  visible: false,
  query: '',
  queryStartIndex: -1,
  queryEndIndex: -1
};

export function MentionInput({
  defaultValue,
  placeholder,
  className,
  disabled,
  validationFn,
  onSubmit,
  onClear
}: {
  defaultValue: string;
  placeholder: string;
  className?: string;
  disabled?: boolean;
  disableSuggestions?: boolean;
  validationFn?: (params: MentionOutput) => boolean;
  onSubmit: (params: MentionOutput) => void;
  onClear?: () => void;
}) {
  const mentionInputRef = useRef<HTMLTextAreaElement>(null);
  const inputSectionRef = useRef<HTMLDivElement>(null);
  const buttonSectionRef = useRef<HTMLDivElement>(null);

  const [isInputSectionFocused, setIsInputSectionFocused] = useState(false);

  const [advancedMentionSearchData, setAdvancedMentionSearchData] =
    useState<SearchData>(defaultSearchData);

  const [value, setValue] = useState(defaultValue);

  const isMobile = isMobileDevice();

  const isAdvancedMentionSearchVisible = advancedMentionSearchData.visible;

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
        setAdvancedMentionSearchData(prev => ({ ...prev, visible: false }));
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
      setAdvancedMentionSearchData(prev => ({ ...prev, visible: false }));

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

  const showAdvancedMentionSearch = useCallback(
    (data: AdvancedMentionSearchParams) => {
      setAdvancedMentionSearchData(prev => ({
        ...prev,
        ...data,
        visible: true
      }));
    },
    []
  );

  const hideAdvancedMentionSearch = useCallback(() => {
    setAdvancedMentionSearchData(prev => ({ ...prev, visible: false }));
  }, []);

  const handleSubmitAfterDelay = useCallback(
    (val: string) => {
      setValue(val);
      setTimeout(() => handleSubmit(val), 200);
    },
    [handleSubmit]
  );

  const handleInputClear = useCallback(() => {
    if (isAdvancedMentionSearchVisible) {
      setAdvancedMentionSearchData(prev => ({ ...prev, visible: false }));
    } else {
      setValue('');
      onClear?.();
    }
  }, [isAdvancedMentionSearchVisible, onClear]);

  const handleInputSubmit = () => {
    handleSubmit(value);
  };

  const renderButtonContent = () => {
    if (!value || (isAdvancedMentionSearchVisible && isMobile)) {
      return null;
    }
    if (!isInputSectionFocused || isAdvancedMentionSearchVisible) {
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
            onChange={setValue}
            onSubmit={handleSubmit}
            onAdvancedMentionSearch={showAdvancedMentionSearch}
          />
          <div ref={buttonSectionRef} className="flex justify-end pl-2">
            {renderButtonContent()}
          </div>
        </div>
        {isAdvancedMentionSearchVisible && (
          <div
            className={classNames(
              'before-bg-glass before:rounded-18 rounded-18 border-solid-stroke absolute',
              isMobile ? 'w-full top-[38px]' : 'w-[min(60vw,786px)] top-[32px]'
            )}
          >
            <div
              className="bg-primary/70 z-[-1] inset-0 fixed"
              onClick={hideAdvancedMentionSearch}
            />
            <AdvancedMentionSearch
              {...advancedMentionSearchData}
              filtersButtonData={{
                containerRef: buttonSectionRef,
                RenderButton: MentionFiltersButton
              }}
              mentionInputRef={mentionInputRef}
              mentionValue={value}
              viewType={isMobile ? 'LIST_VIEW' : 'GRID_VIEW'}
              onChange={handleSubmitAfterDelay}
              onClose={hideAdvancedMentionSearch}
            />
          </div>
        )}
      </div>
    </div>
  );
}
