import classNames from 'classnames';
import { Icon } from './Icon';
import { useMatch } from '@reach/router';

export function Search() {
  const isTokenBalances = useMatch('/token-balances');
  const activeItem = isTokenBalances ? 'token-balances' : 'poaps';
  const activeClasss = 'bg-tertiary border border-solid border-stroke-color';
  return (
    <div>
      <div className="my-6 flex-col-center">
        <div className="glass-effect bg-secondry border flex p-1 rounded-lg">
          <button
            className={classNames('p-2  rounded-lg mr-5', {
              [activeClasss]: activeItem === 'token-balances'
            })}
          >
            <Icon name="address-wallet" className="w-[30px]" />
          </button>
          <button
            className={classNames('p-2  rounded-lg mr-5', {
              [activeClasss]: activeItem === 'poaps'
            })}
          >
            <Icon name="nft-gray" className="w-[30px]" />
          </button>
        </div>
      </div>
      <div className="flex">
        <div className="flex items-center rounded-xl bg-secondary overflow-hidden h-[50px] w-[645px] border">
          <span className="bg-tertiary h-full flex justify-center items-center px-4">
            Token Blaances
          </span>
          <input
            placeholder="Enter 0x, name.eth, fc_fname:name, or name.lens"
            type="text"
            className="h-full flex-1 bg-secondary px-4 text-text-secondary"
          />
        </div>
        <button className="bg-button-primary rounded-xl ml-5 px-6">Go</button>
      </div>
    </div>
  );
}
