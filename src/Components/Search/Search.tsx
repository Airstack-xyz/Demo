'use client';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useMatch } from '@/hooks/useMatch';
import {
  CachedQuery,
  UserInputs,
  useSearchInput,
  userInputCache
} from '../../hooks/useSearchInput';
import { useOverviewTokens } from '../../store/tokenHoldersOverview';
import { showToast } from '../../utils/showToast';
import {
  getAllMentionDetails,
  getAllWordsAndMentions,
  isSolanaAddress
} from '../Input/utils';
import { EnabledSearchType, SearchInputSection } from './SearchInputSection';
import { SearchTabSection, TabUrl } from './SearchTabSection';
import { addAndRemoveCombinationPlaceholder } from './utils';
import { useNavigate } from '@/hooks/useNavigate';
import classNames from 'classnames';

export const tokenHoldersPlaceholder =
  'Type "@" to search by name, or enter any contract address, or any POAP event ID';
export const tokenBalancesPlaceholder =
  'Search Farcaster profiles by name, or enter 0x address, Solana address, ENS.eth, cb.id, or Lens';

const channelsPlaceholder = 'Search Farcaster channels by name';

const placeholderMap: Record<TabUrl, string> = {
  'token-balances': tokenBalancesPlaceholder,
  'token-holders': tokenHoldersPlaceholder,
  channels: channelsPlaceholder
};

const enabledSearchMap: Record<TabUrl, EnabledSearchType> = {
  'token-balances': 'SOCIAL_SEARCH',
  'token-holders': 'ADVANCED_MENTION_SEARCH',
  channels: 'CHANNEL_SEARCH'
};

export const ALLOWED_ADDRESS_REGEX =
  /0x[a-fA-F0-9]+|.*\.(eth|lens|cb\.id)|(fc_fname:|fc_fid:|lens\/@).*/;

export const PADDING = '  ';

export const Search = memo(function Search() {
  const [activeTab, setCurrentTab] = useState<TabUrl>('token-balances');
  const activePath = usePathname()?.replace('/', '') as TabUrl;
  const isHome = !!useMatch('/');
  const searchParams = useSearchParams();
  const [, setOverviewTokens] = useOverviewTokens(['tokens']);

  const actualActiveTab = isHome ? activeTab : activePath;
  const isTokenBalances = actualActiveTab === 'token-balances';

  const [{ rawInput }, setData] = useSearchInput(isHome ? activeTab : null);
  const navigate = useNavigate();

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
          redirectTo: activeTab
        });
        return;
      }
      setData(data, {
        updateQueryParams: true,
        reset: isTokenBalances
      });
    },
    [activeTab, isHome, isTokenBalances, setData, setOverviewTokens]
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
        const isValid =
          ALLOWED_ADDRESS_REGEX.test(word) || isSolanaAddress(word);

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
        showToast(
          actualActiveTab === 'channels'
            ? "Couldn't find any channel"
            : "Couldn't find any contract",
          'negative'
        );
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
        inputType: (token || inputType || 'ADDRESS') as UserInputs['inputType'],
        activeSnapshotInfo: undefined, // For every new search reset snapshot filter
        resolve6551: undefined, // For every new search reset resolve6551 filter
        activeView: undefined,
        activeViewToken: undefined,
        activeTokenInfo: undefined
      };

      setValue(rawTextWithMentions + PADDING);
      handleDataChange(filterValues);
    },
    [actualActiveTab, handleDataChange]
  );

  const shouldShowCombinationPlaceholder = useMemo(() => {
    if (!rawInput) return false;
    const [mentions] = getAllMentionDetails(value);
    return mentions.length === 1 && rawInput === value.trim();
  }, [rawInput, value]);

  useEffect(() => {
    if (actualActiveTab === 'channels') {
      return;
    }
    return addAndRemoveCombinationPlaceholder(
      shouldShowCombinationPlaceholder,
      isTokenBalances
    );
  }, [actualActiveTab, isTokenBalances, shouldShowCombinationPlaceholder]);

  const handleSubmit = useCallback(
    (mentionValue: string) => {
      const trimmedValue = mentionValue.trim();

      if (searchParams?.get('rawInput') === trimmedValue) {
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
    (pathname: TabUrl) => {
      if (!isHome) {
        setValue('');
        navigate({
          pathname
        });
      } else {
        setCurrentTab(pathname);
      }
    },
    [isHome, navigate]
  );

  const placeholder = placeholderMap[actualActiveTab] || '';

  const enabledSearchType =
    enabledSearchMap[actualActiveTab] || 'SOCIAL_SEARCH';

  return (
    <div className="relative">
      <div
        className={classNames(
          'my-6 flex flex-col justify-center  relative z-[41]',
          {
            'items-center': isHome,
            'items-start ': !isHome
          }
        )}
      >
        <SearchTabSection
          isHome={isHome}
          activeTab={activeTab}
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
