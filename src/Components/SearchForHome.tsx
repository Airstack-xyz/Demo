import classNames from 'classnames';
import { Icon } from './Icon';
import { InputWithMention } from './Input/Input';
import { FormEvent, useCallback, useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { getValuesFromId } from './Input/utils';

const tokenHoldersPlaceholder = 'Use @ mention or enter any contract address';
const tokenBalancesPlaceholder =
  'Enter 0x, name.eth, fc_fname:name, or name.lens';

export function HomeSearch() {
  const [isTokenBalances, setIsTokenBalances] = useState(true);

  const [value, setValue] = useState('');

  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      const { address, blockchain = 'ethereum' } = getValuesFromId(value) || {};
      if (!address) return;

      const searchData = { address, blockchain, rawInput: value };

      navigate({
        pathname: isTokenBalances ? '/token-balances' : '/token-holders',
        search: createSearchParams(searchData).toString()
      });
    },
    [isTokenBalances, navigate, value]
  );

  const activeClasss = 'bg-tertiary border border-solid border-stroke-color';

  return (
    <div className="w-full">
      <div className="my-6 flex-col-center">
        <div className="bg-glass bg-secondry border flex p-1 rounded-lg ">
          <button
            className={classNames('p-2  rounded-lg mr-5', {
              [activeClasss]: isTokenBalances
            })}
            onClick={() => setIsTokenBalances(true)}
          >
            <Icon
              name={isTokenBalances ? 'token-balances' : 'token-balances-grey'}
              className="w-[30px]"
            />
          </button>
          <button
            className={classNames('p-2  rounded-lg', {
              [activeClasss]: !isTokenBalances
            })}
            onClick={() => setIsTokenBalances(false)}
          >
            <Icon
              name={isTokenBalances ? 'token-holders-grey' : 'token-holders'}
              className="w-[30px]"
            />
          </button>
        </div>
      </div>
      <form
        className="flex flex-col sm:flex-row justify-center"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col sm:flex-row items-center h-auto sm:h-[50px] w-full sm:w-[645px] border border-solid border-stroke-color rounded-18 bg-glass">
          <span className="bg-glass h-full flex justify-center items-center px-4 py-3.5 m-0 sm:mr-3 rounded-t-18 sm:rounded-tr-none sm:rounded-l-18 w-full sm:w-auto min-w-[152px]">
            {isTokenBalances ? 'Token Balances' : 'Token holders'}
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
        <button className="bg-button-primary rounded-18 sm:ml-5 mt-5 sm:mt-0 px-6 py-3.5 font-bold w-[40%] sm:w-auto self-center">
          Go
        </button>
      </form>
    </div>
  );
}
