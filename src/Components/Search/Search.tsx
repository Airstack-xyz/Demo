/* eslint-disable react-refresh/only-export-components */
import classNames from 'classnames';
import { Icon } from '../Icon';
import { InputWithMention } from '../Input/Input';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useMatch, useNavigate, useSearchParams } from 'react-router-dom';
import { getAllMentionDetails, getAllWordsAndMentions } from '../Input/utils';
import {
  CachedQuery,
  UserInputs,
  useSearchInput,
  userInputCache
} from '../../hooks/useSearchInput';
import { showToast } from '../../utils/showToast';
import { useOverviewTokens } from '../../store/tokenHoldersOverview';
import { addAndRemoveCombinationPlaceholder } from './utils';
import AdvancedSearch from '../AdvancedSearch';
import { isMobileDevice } from '../../utils/isMobileDevice';

export const tokenHoldersPlaceholder =
  'Use @ mention or enter any token contract address';
export const tokenBalancesPlaceholder =
  'Enter 0x, name.eth, fc_fname:name, or name.lens';

export const activeClass =
  'bg-glass !border-stroke-color font-bold !text-text-primary';
export const tabClassName =
  'px-2.5 h-[30px] rounded-full mr-5 flex-row-center text-xs text-text-secondary border border-solid border-transparent';

export function TabLinks({ isTokenBalances }: { isTokenBalances: boolean }) {
  return (
    <>
      <Link
        to="/token-balances"
        className={classNames(tabClassName, {
          [activeClass]: isTokenBalances
        })}
      >
        <Icon name="token-balances" className="w-4 mr-1" /> Token balances
      </Link>
      <Link
        to="/token-holders"
        className={classNames(tabClassName, {
          [activeClass]: !isTokenBalances
        })}
      >
        <Icon name="token-holders" className="w-4 mr-1" /> Token holders
      </Link>
    </>
  );
}

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

const ALLOWED_ADDRESS_REGEX =
  /0x[a-fA-F0-9]+|.*\.(eth|lens|cb\.id)|(fc_name:|lens\/@).*/;

const padding = '  ';

export const Search = memo(function Search() {
  const [isTokenBalanceActive, setIsTokenBalanceActive] = useState(true);
  const isHome = useMatch('/');
  const isTokenBalancesPage = !!useMatch('/token-balances');
  const [searchParams] = useSearchParams();
  const [, setOverviewTokens] = useOverviewTokens(['tokens']);

  const isTokenBalances = isHome ? isTokenBalanceActive : isTokenBalancesPage;

  const [{ rawInput }, setData] = useSearchInput(isTokenBalances);
  const navigate = useNavigate();

  const isMobile = isMobileDevice();

  const [value, setValue] = useState(rawInput || '');

  const [advancedSearchData, setAdvancedSearchData] =
    useState<AdvancedSearchData>(defaultAdvancedSearchData);

  const [isInputSectionFocused, setIsInputSectionFocused] = useState(false);
  const inputSectionRef = useRef<HTMLDivElement>(null);
  const buttonSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTokenBalances) {
      // force reset tokenHolder's activeView when user navigates to tokenBalances page
      // else when user clicks on a token in balances page and goes to holder they will see the detailed activeView instead of the holders
      userInputCache.tokenHolder.activeView = '';
    }
  }, [isTokenBalances]);

  useEffect(() => {
    setValue(rawInput ? rawInput.trim() + padding : '');
  }, [rawInput]);

  useEffect(() => {
    if (isTokenBalances) {
      setOverviewTokens({
        tokens: []
      });
    }
  }, [isTokenBalances, setOverviewTokens]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // if click event is outside input section
      if (
        inputSectionRef.current &&
        !inputSectionRef.current?.contains(event.target as Node)
      ) {
        setIsInputSectionFocused(false);
        setAdvancedSearchData(prev => ({ ...prev, visible: false }));
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

  const handleDataChange = useCallback(
    (data: Partial<CachedQuery>) => {
      setOverviewTokens({
        tokens: []
      });
      if (isHome) {
        setData(data, {
          updateQueryParams: true,
          reset: isTokenBalances,
          redirectTo: isTokenBalances ? '/token-balances' : '/token-holders'
        });
        return;
      }
      setData(data, {
        updateQueryParams: true,
        reset: isTokenBalances
      });
    },
    [isHome, isTokenBalances, setData, setOverviewTokens]
  );

  const handleTokenBalancesSearch = useCallback(
    (value: string) => {
      const address: string[] = [];
      const rawInput: string[] = [];

      getAllWordsAndMentions(value).forEach(({ word, mention, rawValue }) => {
        if (mention) {
          rawInput.push(rawValue);
          address.push(mention.address);
          return;
        }

        // check if it is a valid address
        const isValid = ALLOWED_ADDRESS_REGEX.test(word);
        if (!isValid) return;

        address.push(word);
        rawInput.push(rawValue);
      });

      if (address.length === 0) {
        showToast(
          "Couldn't find any valid wallet address or ens/lens/farcaster name",
          'negative'
        );
        handleDataChange({});
        return;
      }

      if (address.length > 2) {
        showToast('You can only compare 2 identities at a time', 'negative');
        return;
      }

      const rawTextWithMentions = rawInput.join(padding);
      const filterValues: Partial<CachedQuery> = {
        address,
        rawInput: rawInput.join(padding),
        inputType: 'ADDRESS' as UserInputs['inputType']
      };

      // For combination reset snapshot filter
      if (address.length > 1) {
        filterValues.activeSnapshotInfo = undefined;
      }

      setValue(rawTextWithMentions.trim() + padding);
      handleDataChange(filterValues);
    },
    [handleDataChange]
  );

  const handleTokenHoldersSearch = useCallback(
    (value: string) => {
      const address: string[] = [];
      const rawInput: string[] = [];
      let inputType: string | null = null;
      let hasInputTypeMismatch = false;
      let token = '';
      const wordsAndMentions = getAllWordsAndMentions(value);

      wordsAndMentions.forEach(({ word, mention, rawValue }) => {
        if (mention) {
          rawInput.push(rawValue);
          address.push(mention.eventId || mention.address);
          token = mention.token || '';
          const _inputType = mention.customInputType || '';
          hasInputTypeMismatch = hasInputTypeMismatch
            ? hasInputTypeMismatch
            : inputType !== null
            ? inputType !== _inputType
            : false;
          inputType = inputType || _inputType;
          return;
        }

        const _inputType = word.startsWith('0x')
          ? 'ADDRESS'
          : !isNaN(Number(word))
          ? 'POAP'
          : null;
        hasInputTypeMismatch = hasInputTypeMismatch
          ? hasInputTypeMismatch
          : inputType !== null
          ? inputType !== _inputType
          : false;

        inputType = inputType || _inputType;
        if (!inputType) return;
        address.push(word);
        rawInput.push(rawValue);
      });

      if (address.length === 0) {
        showToast("Couldn't find any contract", 'negative');
        return;
      }

      if (address.length > 2) {
        showToast('You can only compare 2 tokens at a time', 'negative');
        return;
      }

      const rawTextWithMentions = rawInput.join(padding);
      const filterValues: Partial<CachedQuery> = {
        address,
        rawInput: rawTextWithMentions,
        inputType: (token || inputType || 'ADDRESS') as UserInputs['inputType']
      };

      // For every new search reset snapshot filter
      filterValues.activeSnapshotInfo = undefined;

      setValue(rawTextWithMentions + padding);
      handleDataChange(filterValues);
    },
    [handleDataChange]
  );

  const shouldShowCombinationPlaceholder = useMemo(() => {
    if (!rawInput) return false;
    const [mentions] = getAllMentionDetails(value);
    return mentions.length === 1 && rawInput === value.trim();
  }, [rawInput, value]);

  useEffect(() => {
    return addAndRemoveCombinationPlaceholder(
      shouldShowCombinationPlaceholder,
      isTokenBalances
    );
  }, [isTokenBalances, shouldShowCombinationPlaceholder]);

  const handleSubmit = useCallback(
    (mentionValue: string) => {
      setIsInputSectionFocused(false);
      setAdvancedSearchData(prev => ({ ...prev, visible: false }));

      const trimmedValue = mentionValue.trim();

      if (searchParams.get('rawInput') === trimmedValue) {
        window.location.reload(); // reload page if same search
        return;
      }

      if (isTokenBalances) {
        return handleTokenBalancesSearch(trimmedValue);
      }

      handleTokenHoldersSearch(trimmedValue);
    },
    [
      handleTokenBalancesSearch,
      handleTokenHoldersSearch,
      isTokenBalances,
      searchParams
    ]
  );

  const handleInputSubmit = () => {
    handleSubmit(value);
  };

  const handleInputClear = useCallback(() => {
    if (advancedSearchData.visible) {
      setAdvancedSearchData(prev => ({ ...prev, visible: false }));
    } else {
      setValue('');
    }
  }, [advancedSearchData.visible]);

  const getTabChangeHandler = useCallback(
    (isTokenBalance: boolean) => {
      if (!isHome) {
        setValue('');
        navigate({
          pathname: isTokenBalance ? '/token-balances' : '/token-holders'
        });
      } else {
        setIsTokenBalanceActive(prev => !prev);
      }
    },
    [isHome, navigate]
  );

  const showAdvancedSearch = useCallback(
    (startIndex: number, endIndex: number) => {
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

  const inputPlaceholder = isTokenBalances
    ? tokenBalancesPlaceholder
    : tokenHoldersPlaceholder;

  const showPrefixIcon = isHome && (!isInputSectionFocused || !value);

  const enableAdvancedSearch = !isMobile && !isTokenBalances;

  const disableSuggestions = isTokenBalances;

  return (
    <div className="relative z-10">
      <div className="my-6 flex-col-center">
        <div className="bg-glass bg-secondary border flex p-1 rounded-full">
          {isHome && (
            <>
              <button
                onClick={() => getTabChangeHandler(true)}
                className={classNames(tabClassName, {
                  [activeClass]: isTokenBalances
                })}
              >
                <Icon name="token-balances" className="w-4 mr-1" /> Token
                balances
              </button>
              <button
                onClick={() => getTabChangeHandler(false)}
                className={classNames(tabClassName, {
                  [activeClass]: !isTokenBalances
                })}
              >
                <Icon name="token-holders" className="w-4 mr-1" /> Token holders
              </button>
            </>
          )}
          {!isHome && <TabLinks isTokenBalances={isTokenBalances} />}
        </div>
      </div>
      <div
        id="main-input-section"
        className="flex-row-center relative h-[50px] z-40"
      >
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
            {showPrefixIcon && (
              <Icon name="search" width={15} height={15} className="mr-1.5" />
            )}
            <InputWithMention
              value={value}
              placeholder={inputPlaceholder}
              disableSuggestions={disableSuggestions}
              onChange={setValue}
              onSubmit={handleSubmit}
              onAdvancedSearch={
                enableAdvancedSearch ? showAdvancedSearch : undefined
              }
            />
            <div ref={buttonSectionRef} className="flex justify-end pl-3">
              {!!value && (
                <>
                  {!isInputSectionFocused || advancedSearchData.visible ? (
                    <button
                      type="button"
                      className="text-right w-5"
                      onClick={handleInputClear}
                    >
                      <Icon name="close" width={14} height={14} />
                    </button>
                  ) : (
                    <button type="button" onClick={handleInputSubmit}>
                      <Icon name="search" width={20} height={20} />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          {advancedSearchData.visible && (
            <>
              <div
                className="bg-primary/70 z-[-1] inset-0 fixed"
                onClick={hideAdvancedSearch}
              />
              <AdvancedSearch
                mentionInputSelector="#main-input-section #mention-input"
                mentionValue={value}
                displayValueStartIndex={advancedSearchData.startIndex}
                displayValueEndIndex={advancedSearchData.endIndex}
                onChange={setValue}
                onClose={hideAdvancedSearch}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
});
