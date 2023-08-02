import classNames from 'classnames';
import { Icon } from './Icon';
import { InputWithMention } from './Input/Input';
import { FormEvent, memo, useCallback, useEffect, useState } from 'react';
import {
  Link,
  createSearchParams,
  useMatch,
  useNavigate,
  useSearchParams
} from 'react-router-dom';
import { getValuesFromId } from './Input/utils';
import { UserInputs, useSearchInput } from '../hooks/useSearchInput';

const tokenHoldersPlaceholder =
  'Use @ mention or enter any token contract address';
const tokenBalancesPlaceholder =
  'Enter 0x, name.eth, fc_fname:name, or name.lens';

export const Search = memo(function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  let isTokenBalances = !!useMatch('/token-balances');
  const isHome = useMatch('/');

  if (isHome) {
    isTokenBalances = true;
  }

  const [{ rawInput }, setData] = useSearchInput();

  const [value, setValue] = useState(rawInput || '');

  useEffect(() => {
    setValue(rawInput);
  }, [rawInput, value]);

  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      const {
        address,
        blockchain = 'ethereum',
        eventId,
        customInputType
      } = getValuesFromId(value) || {};

      if (!address) return;

      const searchData = {
        address: eventId || address,
        blockchain,
        rawInput: value,
        inputType: (customInputType as UserInputs['inputType']) || 'ADDRESS'
      };

      setData(
        {
          ...searchData
        },
        {
          reset: true
        }
      );

      if (isHome) {
        navigate({
          pathname: '/token-balances',
          search: createSearchParams(searchData).toString()
        });
        return;
      }

      if (searchParams.get('rawInput') === value) {
        window.location.reload(); // reload page if same search
      }

      setSearchParams(searchData);
    },
    [isHome, navigate, searchParams, setData, setSearchParams, value]
  );

  const activeClasss =
    'bg-glass !border-stroke-color font-bold !text-text-primary';

  return (
    <div className="w-full z-10">
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
      <form
        className="flex flex-col sm:flex-row justify-center"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col sm:flex-row items-center h-[50px] w-full sm:w-[645px] border-solid-stroke rounded-18 bg-glass px-5 py-3">
          {isTokenBalances ? (
            <input
              className="bg-transparent h-full w-full outline-none text-sm"
              value={value}
              placeholder={tokenBalancesPlaceholder}
              onChange={({ target }) => setValue(target.value)}
            />
          ) : (
            <InputWithMention
              defaultValue={value}
              onChange={setValue}
              onSubmit={setValue}
              placeholder={tokenHoldersPlaceholder}
            />
          )}
        </div>
        <button
          type="submit"
          className="bg-button-primary rounded-18 sm:ml-5 mt-5 sm:mt-0 px-6 py-3.5 font-bold w-[40%] sm:w-auto self-center"
        >
          Go
        </button>
      </form>
    </div>
  );
});
