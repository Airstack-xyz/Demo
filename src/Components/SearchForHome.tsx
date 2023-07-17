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

  const activeClasss =
    'bg-glass !border-stroke-color font-bold text-text-primary';

  return (
    <div className="w-full">
      <div className="my-6 flex-col-center">
        <div className="bg-glass bg-secondry border flex p-1 rounded-full">
          <button
            className={classNames(
              'px-2.5 h-[30px] rounded-full mr-5 flex-row-center text-xs text-text-secondary border border-solid border-transparent',
              {
                [activeClasss]: isTokenBalances
              }
            )}
            onClick={() => setIsTokenBalances(true)}
          >
            <Icon name="token-balances" className="w-4 mr-1" /> Token balances
          </button>
          <button
            className={classNames(
              'px-2.5 h-[30px] rounded-full flex-row-center text-xs text-text-secondary border border-solid border-transparent',
              {
                [activeClasss]: !isTokenBalances
              }
            )}
            onClick={() => setIsTokenBalances(false)}
          >
            <Icon name="token-holders" className="w-4 mr-1" /> Token holders
          </button>
        </div>
      </div>
      <form
        className="flex flex-col sm:flex-row justify-center"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col sm:flex-row items-center h-auto sm:h-[50px] w-full sm:w-[645px] border-solid-stroke rounded-18 bg-glass px-5 py-3">
          {isTokenBalances ? (
            <input
              className="bg-transparent h-full w-full outline-none text-sm"
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
        <button className="bg-button-primary rounded-18 sm:ml-5 mt-5 sm:mt-0 px-6 py-3.5 font-bold w-[40%] sm:w-auto self-center">
          Go
        </button>
      </form>
    </div>
  );
}
