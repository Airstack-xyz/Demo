import classNames from 'classnames';
import { Icon } from './Icon';
import { InputWithMention } from './Input/Input';
import { FormEvent, useCallback, useState } from 'react';
import { Link, useMatch, useSearchParams } from 'react-router-dom';
import { getValuesFromId } from './Input/utils';

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(
    () => searchParams.get('inputValue') || ''
  );

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (searchParams.get('inputValue') === value) return;
      const { address, blockchain = 'ethereum' } = getValuesFromId(value) || {};
      if (!address) return;
      setSearchParams({ query: address, blockchain, inputValue: value });
    },
    [searchParams, setSearchParams, value]
  );
  const isTokenBalances = useMatch('/token-balances');
  const activeItem = isTokenBalances ? 'token-balances' : 'poaps';
  const activeClasss = 'bg-tertiary border border-solid border-stroke-color';

  return (
    <div className="w-full">
      <div className="my-6 flex-col-center">
        <div className="glass-effect bg-secondry border flex p-1 rounded-lg">
          <Link
            to="/token-balances"
            className={classNames('p-2  rounded-lg mr-5', {
              [activeClasss]: activeItem === 'token-balances'
            })}
          >
            <Icon name="address-wallet" className="w-[30px]" />
          </Link>
          <Link
            to="/token-holders"
            className={classNames('p-2  rounded-lg mr-5', {
              [activeClasss]: activeItem === 'poaps'
            })}
          >
            <Icon name="nft-gray" className="w-[30px]" />
          </Link>
        </div>
      </div>
      <form
        className="flex flex-col sm:flex-row justify-center"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col sm:flex-row items-center bg-secondary h-auto sm:h-[50px] w-full sm:w-[645px] border border-solid border-stroke-color rounded-2xl">
          <span className="bg-tertiary h-full flex justify-center items-center px-4 py-3.5 m-0 sm:mr-3 rounded-t-2xl sm:rounded-tr-none sm:rounded-l-2xl w-full sm:w-auto">
            {isTokenBalances ? 'Token Balances' : 'Token holders'}
          </span>
          <InputWithMention
            defaultValue={value}
            onChange={setValue}
            onSubmit={setValue}
          />
        </div>
        <button className="bg-button-primary rounded-xl sm:ml-5 mt-5 sm:mt-0 px-6 py-3.5 font-bold w-[40%] sm:w-auto self-center">
          Go
        </button>
      </form>
    </div>
  );
}
