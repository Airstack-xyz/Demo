import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import AdvancedSearch from '../AdvancedSearch';
import { Icon } from '../Icon';
import { AdvancedSearchParams, InputWithMention } from '../Input/Input';

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

export function SearchInputSection({
  value,
  placeholder,
  disableSuggestions,
  disableAdvanceSearch,
  showPrefixSearchIcon,
  onValueChange,
  onValueSubmit
}: {
  value: string;
  placeholder?: string;
  disableSuggestions?: boolean;
  disableAdvanceSearch?: boolean;
  showPrefixSearchIcon?: boolean;
  onValueChange: (value: string) => void;
  onValueSubmit: (value: string) => void;
}) {
  const mentionInputRef = useRef<HTMLTextAreaElement>(null);
  const inputSectionRef = useRef<HTMLDivElement>(null);

  const [isInputSectionFocused, setIsInputSectionFocused] = useState(false);

  const [advancedSearchData, setAdvancedSearchData] =
    useState<AdvancedSearchData>(defaultAdvancedSearchData);

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

  const handleOnSubmit = useCallback(
    (val: string) => {
      setIsInputSectionFocused(false);
      setAdvancedSearchData(prev => ({ ...prev, visible: false }));
      onValueSubmit(val);
    },
    [onValueSubmit]
  );

  const handleAdvanceSearchOnChange = useCallback(
    (val: string) => {
      onValueChange(val);
      setTimeout(() => handleOnSubmit(val), 200);
    },
    [onValueChange, handleOnSubmit]
  );

  const handleInputClear = useCallback(() => {
    if (advancedSearchData.visible) {
      setAdvancedSearchData(prev => ({ ...prev, visible: false }));
    } else {
      onValueChange('');
    }
  }, [advancedSearchData.visible, onValueChange]);

  const handleInputSubmit = () => {
    handleOnSubmit(value);
  };

  const renderButtonContent = () => {
    if (!value) {
      return null;
    }
    if (!isInputSectionFocused || advancedSearchData.visible) {
      return (
        <button
          type="button"
          className="text-right w-5"
          onClick={handleInputClear}
        >
          <Icon name="close" width={14} height={14} />
        </button>
      );
    }
    return (
      <button type="button" onClick={handleInputSubmit}>
        <Icon name="search" width={20} height={20} />
      </button>
    );
  };

  const isPrefixSearchIconVisible =
    showPrefixSearchIcon && (!isInputSectionFocused || !value);

  return (
    <div className="flex-row-center relative h-[50px] z-40">
      <div
        ref={inputSectionRef}
        className={classNames(
          'before-bg-glass before:rounded-18 before:border-solid-stroke transition-all absolute top-0',
          advancedSearchData.visible ? 'w-[min(60vw,900px)]' : 'w-full'
        )}
      >
        <div
          className={classNames(
            'flex items-center h-[50px] w-full rounded-18 px-4 py-3 transition-all z-20 relative',
            advancedSearchData.visible
              ? 'bg-[linear-gradient(137deg,#ffffff0f_-8.95%,#ffffff00_114%)]'
              : ''
          )}
        >
          {isPrefixSearchIconVisible && (
            <Icon name="search" width={15} height={15} className="mr-1.5" />
          )}
          <InputWithMention
            value={value}
            placeholder={placeholder}
            disableSuggestions={disableSuggestions}
            onChange={onValueChange}
            onSubmit={handleOnSubmit}
            onAdvancedSearch={
              disableAdvanceSearch ? undefined : showAdvancedSearch
            }
          />
          <div className="flex justify-end pl-3">{renderButtonContent()}</div>
        </div>
        {advancedSearchData.visible && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
