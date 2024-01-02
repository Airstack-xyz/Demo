import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import AdvancedMentionSearch from './AdvancedMentionSearch';
import { Icon } from '../Icon';
import { AdvancedMentionSearchParams, InputWithMention } from './Input/Input';
import { getSocialSearchQueryData } from './SocialSearch/utils';
import SocialSearch from './SocialSearch';

type EnabledSearchType =
  | 'SOCIAL_SEARCH' // social type-ahead infinite dropdown list search
  | 'ADVANCED_MENTION_SEARCH' // advanced @mention infinite grid search with filters
  | 'MENTION_SEARCH' // default @mention dropdown list search
  | null;

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

export function SearchInputSection({
  value,
  placeholder,
  enabledSearchType,
  showPrefixSearchIcon,
  onValueChange,
  onValueSubmit
}: {
  value: string;
  placeholder?: string;
  enabledSearchType: EnabledSearchType;
  showPrefixSearchIcon?: boolean;
  onValueChange: (value: string) => void;
  onValueSubmit: (value: string) => void;
}) {
  const mentionInputRef = useRef<HTMLTextAreaElement>(null);
  const inputSectionRef = useRef<HTMLDivElement>(null);

  const [isInputSectionFocused, setIsInputSectionFocused] = useState(false);

  const [socialSearchData, setSocialSearchData] =
    useState<SearchData>(defaultSearchData);
  const [advancedMentionSearchData, setAdvancedMentionSearchData] =
    useState<SearchData>(defaultSearchData);

  const isSocialSearchEnabled = enabledSearchType === 'SOCIAL_SEARCH';
  const isAdvancedMentionSearchEnabled =
    enabledSearchType === 'ADVANCED_MENTION_SEARCH';

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
        setSocialSearchData(prev => ({ ...prev, visible: false }));
      }
    }
    mentionInputEl?.addEventListener('focus', handleMentionInputFocus);
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      mentionInputEl?.removeEventListener('focus', handleMentionInputFocus);
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

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

  const checkSocialSearchVisibility = useCallback((val: string) => {
    const data = getSocialSearchQueryData(val);
    if (data) {
      setSocialSearchData(prev => ({
        ...prev,
        ...data,
        visible: true
      }));
    } else {
      setSocialSearchData(prev => ({ ...prev, visible: false }));
    }
  }, []);

  const hideAdvancedMentionSearch = useCallback(() => {
    setAdvancedMentionSearchData(prev => ({ ...prev, visible: false }));
  }, []);

  const hideSocialSearch = useCallback(() => {
    setSocialSearchData(prev => ({ ...prev, visible: false }));
  }, []);

  const handleOnChange = useCallback(
    (val: string) => {
      if (isSocialSearchEnabled) {
        checkSocialSearchVisibility(val);
      }
      onValueChange(val);
    },
    [checkSocialSearchVisibility, isSocialSearchEnabled, onValueChange]
  );

  const handleOnSubmit = useCallback(
    (val: string) => {
      setIsInputSectionFocused(false);
      setSocialSearchData(prev => ({ ...prev, visible: false }));
      setAdvancedMentionSearchData(prev => ({ ...prev, visible: false }));
      onValueSubmit(val);
    },
    [onValueSubmit]
  );

  const handleSubmitAfterDelay = useCallback(
    (val: string) => {
      onValueChange(val);
      setTimeout(() => handleOnSubmit(val), 200);
    },
    [onValueChange, handleOnSubmit]
  );

  const handleInputClear = useCallback(() => {
    if (advancedMentionSearchData.visible) {
      setAdvancedMentionSearchData(prev => ({ ...prev, visible: false }));
    } else {
      onValueChange('');
    }
  }, [advancedMentionSearchData.visible, onValueChange]);

  const handleInputSubmit = () => {
    handleOnSubmit(value);
  };

  const renderButtonContent = () => {
    if (!value) {
      return null;
    }
    if (!isInputSectionFocused || advancedMentionSearchData.visible) {
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

  const disabledHighlighting = !enabledSearchType;

  const disableSuggestions = isSocialSearchEnabled || !enabledSearchType;

  return (
    <div className="flex-row-center relative h-[50px] z-40">
      <div
        ref={inputSectionRef}
        className={classNames(
          'before-bg-glass before:rounded-18 before:border-solid-stroke transition-all absolute top-0',
          advancedMentionSearchData.visible ? 'w-[min(70vw,900px)]' : 'w-full'
        )}
      >
        <div
          className={classNames(
            'flex items-center h-[50px] w-full rounded-18 px-4 py-3 transition-all z-20 relative',
            advancedMentionSearchData.visible || socialSearchData.visible
              ? 'bg-[linear-gradient(137deg,#ffffff0f_-8.95%,#ffffff00_114%)]'
              : ''
          )}
        >
          {isPrefixSearchIconVisible && (
            <Icon name="search" width={15} height={15} className="mr-1.5" />
          )}
          <InputWithMention
            mentionInputRef={mentionInputRef}
            value={value}
            placeholder={placeholder}
            disableHighlighting={disabledHighlighting}
            disableSuggestions={disableSuggestions}
            onChange={handleOnChange}
            onSubmit={handleOnSubmit}
            onAdvancedMentionSearch={
              isAdvancedMentionSearchEnabled
                ? showAdvancedMentionSearch
                : undefined
            }
          />
          <div className="flex justify-end pl-3">{renderButtonContent()}</div>
        </div>
        {advancedMentionSearchData.visible && (
          <>
            <div
              className="bg-primary/70 z-[-1] inset-0 fixed"
              onClick={hideAdvancedMentionSearch}
            />
            <AdvancedMentionSearch
              {...advancedMentionSearchData}
              mentionInputRef={mentionInputRef}
              mentionValue={value}
              onChange={handleSubmitAfterDelay}
              onClose={hideAdvancedMentionSearch}
            />
          </>
        )}
        {socialSearchData.visible && (
          <>
            <SocialSearch
              {...socialSearchData}
              mentionInputRef={mentionInputRef}
              mentionValue={value}
              onChange={handleSubmitAfterDelay}
              onClose={hideSocialSearch}
            />
          </>
        )}
      </div>
    </div>
  );
}
