import { memo, useCallback, useEffect, useState } from 'react';
import {
  createSearchParams,
  useMatch,
  useNavigate,
  useSearchParams
} from 'react-router-dom';
import { getAllWordsAndMentions } from '../../Components/Search/Input/utils';
import {
  ALLOWED_ADDRESS_REGEX,
  PADDING,
  tokenBalancesPlaceholder,
  tokenHoldersPlaceholder
} from '../../Components/Search/Search';
import { SearchInputSection } from '../../Components/Search/SearchInputSection';
import { SearchTabSection } from '../../Components/Search/SearchTabSection';
import { addAndRemoveCombinationPlaceholder } from '../../Components/Search/utils';
import { userInputCache } from '../../hooks/useSearchInput';
import { useOverviewTokens } from '../../store/tokenHoldersOverview';
import { createFormattedRawInput } from '../../utils/createQueryParamsWithMention';
import { isMobileDevice } from '../../utils/isMobileDevice';
import { showToast } from '../../utils/showToast';
import { useIdentity } from './hooks/useIdentity';

export const Search = memo(function Search() {
  const [searchParams] = useSearchParams();

  const identity = useIdentity();

  const isHome = !!useMatch('/');
  const [, setOverviewTokens] = useOverviewTokens(['tokens']);

  const isTokenBalances = true;

  const navigate = useNavigate();

  const isMobile = isMobileDevice();

  const [value, setValue] = useState(() => {
    const rawInput = createFormattedRawInput({
      label: identity,
      address: identity,
      type: 'ADDRESS',
      blockchain: 'ethereum'
    });
    return rawInput ? rawInput.trim() + PADDING : '';
  });

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
        return;
      }

      if (address.length > 2) {
        showToast('You can only compare 2 identities at a time', 'negative');
        return;
      }

      const rawTextWithMentions = rawInput.join(PADDING).trim();
      const searchData = {
        address: address.join(','),
        blockchain: 'ethereum',
        rawInput: rawTextWithMentions,
        inputType: 'ADDRESS'
      } as Record<string, string | string[]>;

      navigate({
        pathname: '/token-balances',
        search: createSearchParams(searchData).toString()
      });
    },
    [navigate]
  );

  useEffect(() => {
    return addAndRemoveCombinationPlaceholder(false, isTokenBalances);
  }, [isTokenBalances]);

  const handleSubmit = useCallback(
    (val: string) => {
      const trimmedValue = val.trim();

      if (searchParams.get('identity') === trimmedValue) {
        window.location.reload(); // reload page if same search
        return;
      }

      return handleTokenBalancesSearch(trimmedValue);
    },
    [handleTokenBalancesSearch, searchParams]
  );

  const handleTabChange = useCallback(
    (tokenBalance: boolean) => {
      navigate({
        pathname: tokenBalance ? '/token-balances' : '/token-holders'
      });
    },
    [navigate]
  );

  const placeholder = isTokenBalances
    ? tokenBalancesPlaceholder
    : tokenHoldersPlaceholder;

  const enabledSearchType = isTokenBalances
    ? 'SOCIAL_SEARCH'
    : isMobile
    ? 'MENTION_SEARCH'
    : 'ADVANCED_MENTION_SEARCH';

  return (
    <div className="relative z-10">
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
