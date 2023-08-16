import classNames from 'classnames';
import { Icon } from './Icon';
import { InputWithMention } from './Input/Input';
import { FormEvent, memo, useCallback, useEffect, useState } from 'react';
import { Link, useMatch, useSearchParams } from 'react-router-dom';
import { getAllWordsAndMentions } from './Input/utils';
import { UserInputs, useSearchInput } from '../hooks/useSearchInput';
import { showToast } from '../utils/showToast';

const tokenHoldersPlaceholder =
  'Use @ mention or enter any token contract address';
const tokenBalancesPlaceholder =
  'Enter 0x, name.eth, fc_fname:name, or name.lens';

export const Search = memo(function Search() {
  const [searchParams] = useSearchParams();
  let isTokenBalances = !!useMatch('/token-balances');
  const isHome = useMatch('/');

  if (isHome) {
    isTokenBalances = true;
  }

  const [{ rawInput }, setData] = useSearchInput();

  const [value, setValue] = useState(rawInput || '');

  useEffect(() => {
    setValue(rawInput + '  ');
  }, [rawInput]);

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
        setData({}, { reset: true, updateQueryParams: true });
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
      setValue(rawTextWithMenions + '  ');
      setData(searchData, { updateQueryParams: true });
    },
    [setData]
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
          address.push(mention.address);
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

      if (address.length === 0 || hasInputTypeMismatch) {
        showToast(
          hasInputTypeMismatch
            ? 'Input tokens can only be of one type (Poap or NFT)'
            : 'Couldn’t find any contract',
          'negative'
        );
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
      setData(searchData, { updateQueryParams: true });
    },
    [setData]
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

  const activeClasss =
    'bg-glass !border-stroke-color font-bold !text-text-primary';

  return (
    <div className="w-[105%] sm:w-full z-10">
      <div className="my-6 flex-col-center">
        <div className="bg-glass bg-secondry border flex p-1 rounded-full">
          <Link
            to="/token-balances"
            className={classNames(
              'px-2.5 h-[30px] rounded-full mr-5 flex-row-center text-xs text-text-secondary border border-solid border-transparent',
              {
                [activeClasss]: isTokenBalances
              }
            )}
          >
            <Icon name="token-balances" className="w-4 mr-1" /> Token balances
          </Link>
          <Link
            to="/token-holders"
            className={classNames(
              'px-2.5 h-[30px] rounded-full mr-5 flex-row-center text-xs text-text-secondary border border-solid border-transparent',
              {
                [activeClasss]: !isTokenBalances
              }
            )}
          >
            <Icon name="token-holders" className="w-4 mr-1" /> Token holders
          </Link>
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
