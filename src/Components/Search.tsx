import classNames from 'classnames';
import { Icon } from './Icon';
import { useMatch } from '@reach/router';
import { InputWithMention } from './Input/Input';
import { useCallback } from 'react';

export function Search() {
  const hanldeChange = useCallback((value: string) => {
    // eslint-disable-next-line no-console
    console.log('changed ', value);
  }, []);
  const isTokenBalances = useMatch('/token-balances');
  const activeItem = isTokenBalances ? 'token-balances' : 'poaps';
  const activeClasss = 'bg-tertiary border border-solid border-stroke-color';
  return (
    <div>
      <div className="my-6 flex-col-center">
        <div className="glass-effect bg-secondry border flex p-1 rounded-lg">
          <a
            href="/token-balances"
            className={classNames('p-2  rounded-lg mr-5', {
              [activeClasss]: activeItem === 'token-balances'
            })}
          >
            <Icon name="address-wallet" className="w-[30px]" />
          </a>
          <a
            href="/token-holders"
            className={classNames('p-2  rounded-lg mr-5', {
              [activeClasss]: activeItem === 'poaps'
            })}
          >
            <Icon name="nft-gray" className="w-[30px]" />
          </a>
        </div>
      </div>
      <div className="flex">
        <div className="flex items-center bg-secondary h-[50px] w-[645px] border border-solid border-stroke-color rounded-2xl">
          <span className="bg-tertiary h-full flex justify-center items-center px-4 mr-3 rounded-l-2xl">
            {isTokenBalances ? 'Token Balances' : 'Token holders'}
          </span>
          <InputWithMention onChange={hanldeChange} onSubmit={hanldeChange} />
        </div>
        <button className="bg-button-primary rounded-xl ml-5 px-6 font-bold">
          Go
        </button>
      </div>
    </div>
  );
}
