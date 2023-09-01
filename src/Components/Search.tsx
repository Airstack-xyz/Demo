import classNames from 'classnames';
import { Icon } from './Icon';
import { InputWithMention } from './Input/Input';
import {
  FormEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { Link, useMatch, useNavigate, useSearchParams } from 'react-router-dom';
import { getAllWordsAndMentions } from './Input/utils';
import {
  CachedQuery,
  UserInputs,
  useSearchInput,
  userInputCache
} from '../hooks/useSearchInput';
import { showToast } from '../utils/showToast';
import { useOverviewTokens } from '../store/tokenHoldersOverview';

const tokenHoldersPlaceholder =
  'Use @ mention or enter any token contract address';
const tokenBalancesPlaceholder =
  'Enter 0x, name.eth, fc_fname:name, or name.lens';

const activeClasss =
  'bg-glass !border-stroke-color font-bold !text-text-primary';
const tabClassName =
  'px-2.5 h-[30px] rounded-full mr-5 flex-row-center text-xs text-text-secondary border border-solid border-transparent';

function TabLinks({ isTokenBalances }: { isTokenBalances: boolean }) {
  return (
    <>
      <Link
        to="/token-balances"
        className={classNames(tabClassName, {
          [activeClasss]: isTokenBalances
        })}
      >
        <Icon name="token-balances" className="w-4 mr-1" /> Token balances
      </Link>
      <Link
        to="/token-holders"
        className={classNames(tabClassName, {
          [activeClasss]: !isTokenBalances
        })}
      >
        <Icon name="token-holders" className="w-4 mr-1" /> Token holders
      </Link>
    </>
  );
}

export const Search = memo(function Search() {
  const [isTokenBalanceActive, setIsTokenBalanceActive] = useState(true);
  const isHome = useMatch('/');
  const isTokenBalancesPage = !!useMatch('/token-balances');
  const [searchParams] = useSearchParams();
  const setOverviewTokens = useOverviewTokens(['tokens'])[1];

  const isTokenBalances = isHome ? isTokenBalanceActive : isTokenBalancesPage;

  const [
    { rawInput, snapshotBlockNumber, snapshotDate, snapshotTimestamp },
    setData
  ] = useSearchInput(isTokenBalances);
  const navigate = useNavigate();

  const [value, setValue] = useState(rawInput || '');

  const [isInputSectionFocused, setIsInputSectionFocused] = useState(false);
  const inputSectionRef = useRef<HTMLDivElement>(null);
  const buttonSectionRef = useRef<HTMLDivElement>(null);

  const isSnapshotQuery = Boolean(
    snapshotBlockNumber || snapshotDate || snapshotTimestamp
  );

  useEffect(() => {
    setValue(rawInput ? rawInput.trim() + '  ' : '');
  }, [rawInput]);

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
          'Couldn’t find any valid wallet address or ens/lens/farcaster name',
          'negative'
        );
        handleDataChange({});
        return;
      }

      if (isSnapshotQuery && address.length > 1) {
        showToast(
          'You can only search for snapshots for 1 identity at a time',
          'negative'
        );
        return;
      }

      if (address.length > 2) {
        showToast(
          'You can only search for 2 or less identities at a time',
          'negative'
        );
        return;
      }

      const rawTextWithMenions = rawInput.join('  ');
      const searchData = {
        address,
        blockchain: 'ethereum',
        rawInput: rawTextWithMenions,
        inputType: 'ADDRESS' as UserInputs['inputType']
      };
      setValue(rawTextWithMenions.trim() + '  ');
      handleDataChange(searchData);
    },
    [isSnapshotQuery, handleDataChange]
  );

  const handleTokenHoldersSearch = useCallback(
    (value: string) => {
      const address: string[] = [];
      const rawInput: string[] = [];
      let inputType: string | null = null;
      let hasInputTypeMismatch = false;
      let blockchain = 'ethereum';
      let token = '';
      const wordsAndMentions = getAllWordsAndMentions(value);

      wordsAndMentions.forEach(({ word, mention, rawValue }) => {
        if (mention) {
          rawInput.push(rawValue);
          address.push(mention.eventId || mention.address);
          blockchain = mention.blockchain || '';
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
        showToast('Couldn’t find any contract', 'negative');
        return;
      }

      if (address.length > 2) {
        showToast(
          'You can only search for 2 or less tokens/poaps at a time',
          'negative'
        );
        return;
      }

      const rawTextWithMenions = rawInput.join('  ');
      const searchData = {
        address,
        blockchain,
        rawInput: rawTextWithMenions,
        inputType: (token || inputType || 'ADDRESS') as UserInputs['inputType']
      };
      setValue(rawTextWithMenions + '  ');
      handleDataChange(searchData);
    },
    [handleDataChange]
  );

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const trimedValue = value.trim();

      if (searchParams.get('rawInput') === trimedValue) {
        window.location.reload(); // reload page if same search
        return;
      }

      if (isTokenBalances) {
        return handleTokenBalancesSearch(trimedValue);
      }

      handleTokenHoldersSearch(trimedValue);
    },
    [
      handleTokenBalancesSearch,
      handleTokenHoldersSearch,
      isTokenBalances,
      searchParams,
      value
    ]
  );

  const handleInputClear = useCallback(() => {
    setValue('');
    handleDataChange({});
  }, [handleDataChange]);

  const getTabChangeHandler = useCallback(
    (tokenBalance: boolean) => {
      if (!isHome) {
        setValue('');
        navigate({
          pathname: tokenBalance ? '/token-balances' : '/token-holders'
        });
      } else {
        setIsTokenBalanceActive(active => !active);
      }
    },
    [isHome, navigate]
  );

  return (
    <div className="w-[calc(100vw-20px)] sm:w-[645px] z-10">
      <div className="my-6 flex-col-center">
        <div className="bg-glass bg-secondry border flex p-1 rounded-full">
          {isHome && (
            <>
              <button
                onClick={() => getTabChangeHandler(true)}
                className={classNames(tabClassName, {
                  [activeClasss]: isTokenBalances
                })}
              >
                <Icon name="token-balances" className="w-4 mr-1" /> Token
                balances
              </button>
              <button
                onClick={() => getTabChangeHandler(false)}
                className={classNames(tabClassName, {
                  [activeClasss]: !isTokenBalances
                })}
              >
                <Icon name="token-holders" className="w-4 mr-1" /> Token holders
              </button>
            </>
          )}
          {!isHome && <TabLinks isTokenBalances={isTokenBalances} />}
        </div>
      </div>
      <form className="flex flex-row justify-center" onSubmit={handleSubmit}>
        <div
          ref={inputSectionRef}
          className="flex items-center h-[50px] w-full border-solid-stroke rounded-18 bg-glass px-4 py-3"
        >
          <InputWithMention
            value={value}
            onChange={setValue}
            onSubmit={setValue}
            placeholder={
              isTokenBalances
                ? tokenBalancesPlaceholder
                : tokenHoldersPlaceholder
            }
            disableSuggestions={isTokenBalances}
          />
          <div ref={buttonSectionRef} className="flex justify-end">
            {isInputSectionFocused && value && (
              <button type="submit">
                <Icon name="search" width={22} height={22} />
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
    </div>
  );
});
