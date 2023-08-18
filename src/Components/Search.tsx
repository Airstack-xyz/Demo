import classNames from 'classnames';
import { Icon } from './Icon';
import { InputWithMention } from './Input/Input';
import { FormEvent, memo, useCallback, useEffect, useState } from 'react';
import { Link, useMatch, useNavigate, useSearchParams } from 'react-router-dom';
import { getAllWordsAndMentions } from './Input/utils';
import {
  CachedQuery,
  UserInputs,
  useSearchInput
} from '../hooks/useSearchInput';
import { showToast } from '../utils/showToast';

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

  const isTokenBalances = isHome ? isTokenBalanceActive : isTokenBalancesPage;

  const [{ rawInput }, setData] = useSearchInput(isTokenBalances);
  const navigate = useNavigate();

  const [value, setValue] = useState(rawInput || '');

  useEffect(() => {
    setValue(rawInput ? rawInput.trim() + '  ' : '');
  }, [rawInput]);

  const handleDataChange = useCallback(
    (data: Partial<CachedQuery>) => {
      if (isHome) {
        setData(data, {
          updateQueryParams: true,
          reset: isTokenBalances,
          redirectTo: isTokenBalances ? '/token-balances' : '/token-holders'
        });
      }
      setData(data, {
        updateQueryParams: true,
        reset: isTokenBalances
      });
    },
    [isHome, isTokenBalances, setData]
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
    [handleDataChange]
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
    <div className="w-[105%] sm:w-full z-10">
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
        <div className="flex flex-col sm:flex-row items-center h-[50px] w-full sm:w-[645px] border-solid-stroke rounded-18 bg-glass px-5 py-3">
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
        </div>
        <button
          type="submit"
          className="bg-button-primary rounded-18 ml-2 sm:ml-5 px-6 py-3 sm:py-3.5 font-bold self-center"
        >
          Go
        </button>
      </form>
    </div>
  );
});
