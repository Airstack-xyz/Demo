/* eslint-disable react-refresh/only-export-components */
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useMatch, useNavigate, useSearchParams } from 'react-router-dom';
import {
  CachedQuery,
  UserInputs,
  useSearchInput,
  userInputCache
} from '../../hooks/useSearchInput';
import { useOverviewTokens } from '../../store/tokenHoldersOverview';
import { isMobileDevice } from '../../utils/isMobileDevice';
import { showToast } from '../../utils/showToast';
import { getAllMentionDetails, getAllWordsAndMentions } from './Input/utils';
import { SearchInputSection } from './SearchInputSection';
import { SearchTabSection } from './SearchTabSection';
import { addAndRemoveCombinationPlaceholder } from './utils';

export const tokenHoldersPlaceholder =
  'Type "@" to search by name, or enter any contract address, or any POAP event ID';
export const tokenBalancesPlaceholder =
  'Enter 0x, name.eth, fc_fname:name, or name.lens';

export const ALLOWED_ADDRESS_REGEX =
  /0x[a-fA-F0-9]+|.*\.(eth|lens|cb\.id)|(fc_fname:|lens\/@).*/;

export const PADDING = '  ';

export const Search = memo(function Search() {
  const [isTokenBalanceActive, setIsTokenBalanceActive] = useState(true);
  const isHome = !!useMatch('/');
  const isTokenBalancesPage = !!useMatch('/token-balances');
  const [searchParams] = useSearchParams();
  const [, setOverviewTokens] = useOverviewTokens(['tokens']);

  const isTokenBalances = isHome ? isTokenBalanceActive : isTokenBalancesPage;

  const [{ rawInput }, setData] = useSearchInput(isTokenBalances);
  const navigate = useNavigate();

  const isMobile = isMobileDevice();

  const [value, setValue] = useState(rawInput ? rawInput.trim() + PADDING : '');

  useEffect(() => {
    if (isTokenBalances) {
      // force reset tokenHolder's activeView when user navigates to tokenBalances page
      // else when user clicks on a token in balances page and goes to holder they will see the detailed activeView instead of the holders
      userInputCache.tokenHolder.activeView = '';
    }
  }, [isTokenBalances]);

  useEffect(() => {
    if (isTokenBalances) {
      setOverviewTokens({
        tokens: []
      });
    }
  }, [isTokenBalances, setOverviewTokens]);

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
    (val: string) => {
      const address: string[] = [];
      const rawInput: string[] = [];

      getAllWordsAndMentions(val).forEach(({ word, mention, rawValue }) => {
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

      const rawTextWithMentions = rawInput.join(PADDING).trim();
      const filterValues: Partial<CachedQuery> = {
        address,
        rawInput: rawTextWithMentions,
        inputType: 'ADDRESS' as UserInputs['inputType']
      };

      // For combination reset snapshot filter
      if (address.length > 1) {
        filterValues.activeSnapshotInfo = undefined;
      }

      setValue(rawTextWithMentions + PADDING);
      handleDataChange(filterValues);
    },
    [handleDataChange]
  );

  const handleTokenHoldersSearch = useCallback(
    (val: string) => {
      const address: string[] = [];
      const rawInput: string[] = [];
      let inputType: string | null = null;
      let hasInputTypeMismatch = false;
      let token = '';
      const wordsAndMentions = getAllWordsAndMentions(val);

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

      const rawTextWithMentions = rawInput.join(PADDING).trim();
      const filterValues: Partial<CachedQuery> = {
        address,
        rawInput: rawTextWithMentions,
        inputType: (token || inputType || 'ADDRESS') as UserInputs['inputType']
      };

      // For every new search reset snapshot filter
      filterValues.activeSnapshotInfo = undefined;

      setValue(rawTextWithMentions + PADDING);
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

  const handleTabChange = useCallback(
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

  const placeholder = isTokenBalances
    ? tokenBalancesPlaceholder
    : tokenHoldersPlaceholder;

  const enabledSearchType = isTokenBalances
    ? 'SOCIALS_SEARCH'
    : isMobile
    ? 'MENTION_SEARCH'
    : 'ADVANCED_MENTION_SEARCH';

  return (
    <div className="relative z-50">
      <div className="my-6 flex-col-center">
        <SearchTabSection
          isHome={isHome}
          isTokenBalances={isTokenBalances}
          onTabChange={handleTabChange}
        />
      </div>
      <SearchInputSection
        value={value}
        placeholder={placeholder}
        enabledSearchType={enabledSearchType}
        showPrefixSearchIcon={isHome}
        onValueChange={setValue}
        onValueSubmit={handleSubmit}
      />
    </div>
  );
});
