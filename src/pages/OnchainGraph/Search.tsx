import classNames from 'classnames';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  createSearchParams,
  useMatch,
  useNavigate,
  useSearchParams
} from 'react-router-dom';
import { UserInputs, userInputCache } from '../../hooks/useSearchInput';
import { showToast } from '../../utils/showToast';
import { useOverviewTokens } from '../../store/tokenHoldersOverview';
import { Icon } from '../../Components/Icon';
import { getAllWordsAndMentions } from '../../Components/Input/utils';
import { addAndRemoveCombinationPlaceholder } from '../../Components/Search/utils';
import { InputWithMention } from '../../Components/Input/Input';
import { createFormattedRawInput } from '../../utils/createQueryParamsWithMention';
import { useIdentity } from './hooks/useIdentity';
import {
  tabClassName,
  activeClass,
  TabLinks,
  tokenBalancesPlaceholder,
  tokenHoldersPlaceholder
} from '../../Components/Search/Search';

const padding = '  ';
export const Search = memo(function Search() {
  const [searchParams] = useSearchParams();

  const identity = useIdentity();

  const isHome = useMatch('/');
  const setOverviewTokens = useOverviewTokens(['tokens'])[1];

  const isTokenBalances = true;

  const navigate = useNavigate();

  const [value, setValue] = useState(() => {
    return !identity.trim()
      ? ''
      : createFormattedRawInput({
          label: identity,
          address: identity,
          type: 'ADDRESS',
          blockchain: 'ethereum'
        });
  });

  const [isInputSectionFocused, setIsInputSectionFocused] = useState(false);
  const inputSectionRef = useRef<HTMLDivElement>(null);
  const buttonSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rawInput = createFormattedRawInput({
      label: identity,
      address: identity,
      type: 'ADDRESS',
      blockchain: 'ethereum'
    });
    setValue(rawInput ? rawInput.trim() + padding : '');
  }, [identity]);

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

        let isValid =
          word.startsWith('fc_fname:') ||
          Boolean(word.match(/.*\.(eth|lens)$/));
        // check if it is a valid address
        isValid = isValid || word.startsWith('0x');
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

      const rawTextWithMentions = rawInput.join(padding);
      const searchData = {
        address,
        blockchain: 'ethereum',
        rawInput: rawTextWithMentions,
        inputType: 'ADDRESS' as UserInputs['inputType']
      };

      navigate({
        pathname: '/token-balances',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        search: createSearchParams(searchData as any).toString()
      });
    },
    [navigate]
  );

  useEffect(() => {
    return addAndRemoveCombinationPlaceholder(false, isTokenBalances);
  }, [isTokenBalances]);

  const handleSubmit = useCallback(
    (mentionValue: string) => {
      setIsInputSectionFocused(false);

      const trimmedValue = mentionValue.trim();

      if (searchParams.get('identity') === trimmedValue) {
        window.location.reload(); // reload page if same search
        return;
      }

      return handleTokenBalancesSearch(trimmedValue);
    },
    [handleTokenBalancesSearch, searchParams]
  );

  const handleInputSubmit = () => {
    handleSubmit(value);
  };

  const handleInputClear = useCallback(() => {
    setValue('');
  }, []);

  const getTabChangeHandler = useCallback(
    (tokenBalance: boolean) => {
      navigate({
        pathname: tokenBalance ? '/token-balances' : '/token-holders'
      });
    },
    [navigate]
  );

  const showPrefixIcon = isHome && (!isInputSectionFocused || !value);

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
      <div className="flex flex-row justify-center">
        <div
          ref={inputSectionRef}
          className="flex items-center h-[50px] w-full border-solid-stroke rounded-18 bg-glass px-4 py-3"
        >
          {showPrefixIcon && (
            <Icon name="search" width={15} height={15} className="mr-1.5" />
          )}
          <InputWithMention
            value={value}
            onChange={setValue}
            onSubmit={handleSubmit}
            placeholder={
              isTokenBalances
                ? tokenBalancesPlaceholder
                : tokenHoldersPlaceholder
            }
            disableSuggestions={isTokenBalances}
          />
          <div ref={buttonSectionRef} className="flex justify-end pl-3">
            {isInputSectionFocused && value && (
              <button type="button" onClick={handleInputSubmit}>
                <Icon name="search" width={20} height={20} />
              </button>
            )}
            {!isInputSectionFocused && value && (
              <button
                type="button"
                className="text-right w-5"
                onClick={handleInputClear}
              >
                <Icon name="close" width={14} height={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
