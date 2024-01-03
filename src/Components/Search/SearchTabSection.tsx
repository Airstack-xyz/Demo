import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Icon } from '../Icon';

const tabClass =
  'px-2.5 h-[30px] rounded-full mr-5 flex-row-center text-xs text-text-secondary border border-solid border-transparent';

const activeTabClass =
  'bg-glass !border-stroke-color font-bold !text-text-primary';

function TabLinks({ isTokenBalances }: { isTokenBalances: boolean }) {
  return (
    <>
      <Link
        to="/token-balances"
        className={classNames(tabClass, {
          [activeTabClass]: isTokenBalances
        })}
      >
        <Icon name="token-balances" className="w-4 mr-1" /> Token balances
      </Link>
      <Link
        to="/token-holders"
        className={classNames(tabClass, {
          [activeTabClass]: !isTokenBalances
        })}
      >
        <Icon name="token-holders" className="w-4 mr-1" /> Token holders
      </Link>
    </>
  );
}

function TabButtons({
  isTokenBalances,
  onTabChange
}: {
  isTokenBalances: boolean;
  onTabChange: (isTokenBalances: boolean) => void;
}) {
  return (
    <>
      <button
        onClick={() => onTabChange(true)}
        className={classNames(tabClass, {
          [activeTabClass]: isTokenBalances
        })}
      >
        <Icon name="token-balances" className="w-4 mr-1" /> Token balances
      </button>
      <button
        onClick={() => onTabChange(false)}
        className={classNames(tabClass, {
          [activeTabClass]: !isTokenBalances
        })}
      >
        <Icon name="token-holders" className="w-4 mr-1" /> Token holders
      </button>
    </>
  );
}

export function SearchTabSection({
  isHome,
  isTokenBalances,
  onTabChange
}: {
  isHome: boolean;
  isTokenBalances: boolean;
  onTabChange: (isTokenBalances: boolean) => void;
}) {
  return (
    <div className="bg-glass bg-secondary border flex p-1 rounded-full">
      {isHome ? (
        <TabButtons
          isTokenBalances={isTokenBalances}
          onTabChange={onTabChange}
        />
      ) : (
        <TabLinks isTokenBalances={isTokenBalances} />
      )}
    </div>
  );
}
