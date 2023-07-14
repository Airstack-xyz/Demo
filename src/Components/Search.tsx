import classNames from 'classnames';
import { Icon } from './Icon';
import { InputWithMention } from './Input/Input';
import { FormEvent, useCallback, useState } from 'react';
import {
  Link,
  createSearchParams,
  useMatch,
  useNavigate,
  useSearchParams
} from 'react-router-dom';
import { getValuesFromId } from './Input/utils';
import { useSearchInput } from '../hooks/useSearchInput';

const tokenHoldersPlaceholder = 'Use @ mention or enter any contract address';
const tokenBalancesPlaceholder =
  'Enter 0x, name.eth, fc_fname:name, or name.lens';

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  let isTokenBalances = !!useMatch('/token-balances');
  const isHome = useMatch('/');

  if (isHome) {
    isTokenBalances = true;
  }

  const { rawInput, setData } = useSearchInput();

  const [value, setValue] = useState(rawInput);

  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      const { address, blockchain = 'ethereum' } = getValuesFromId(value) || {};
      if (!address) return;

      const searchData = { address, blockchain, rawInput: value };

      setData({
        ...searchData
      });

      if (isHome) {
        navigate({
          pathname: '/token-balances',
          search: createSearchParams(searchData).toString()
        });
        return;
      }

      if (searchParams.get('rawInput') === value) {
        navigate(0); // reload page if same search, this is to trigger refetch in pages
      }

      setSearchParams(searchData);
    },
    [isHome, navigate, searchParams, setData, setSearchParams, value]
  );

  const activeClasss = 'bg-tertiary border border-solid border-stroke-color';

  return (
    <div className="w-full">
      <div className="my-6 flex-col-center">
        <div className="glass-effect bg-secondry border flex p-1 rounded-lg">
          <Link
            to="/token-balances"
            className={classNames('p-2  rounded-lg mr-5', {
              [activeClasss]: isTokenBalances
            })}
          >
            <Icon
              name={isTokenBalances ? 'token-balances' : 'token-balances-grey'}
              className="w-[30px]"
            />
          </Link>
          <Link
            to="/token-holders"
            className={classNames('p-2  rounded-lg', {
              [activeClasss]: !isTokenBalances
            })}
          >
            <Icon
              name={isTokenBalances ? 'token-holders-grey' : 'token-holders'}
              className="w-[30px]"
            />
          </Link>
        </div>
      </div>
      <form
        className="flex flex-col sm:flex-row justify-center"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col sm:flex-row items-center h-auto sm:h-[50px] w-full sm:w-[645px] border border-solid border-stroke-color rounded-2xl glass-effect">
          <span className="bg-tertiary h-full flex justify-center items-center px-4 py-3.5 m-0 sm:mr-3 rounded-t-2xl sm:rounded-tr-none sm:rounded-l-2xl w-full sm:w-auto">
            {isTokenBalances || isHome ? 'Token Balances' : 'Token holders'}
          </span>
          <InputWithMention
            defaultValue={value}
            onChange={setValue}
            onSubmit={setValue}
            placeholder={
              isTokenBalances
                ? tokenBalancesPlaceholder
                : tokenHoldersPlaceholder
            }
          />
        </div>
        <button className="bg-button-primary rounded-xl sm:ml-5 mt-5 sm:mt-0 px-6 py-3.5 font-bold w-[40%] sm:w-auto self-center">
          Go
        </button>
      </form>
    </div>
  );
}
