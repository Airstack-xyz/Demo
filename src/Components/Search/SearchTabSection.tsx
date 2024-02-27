import classNames from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import { Icon, IconType } from '../Icon';

const tabClass =
  'px-2.5 h-[30px] rounded-full mr-5 flex-row-center text-xs text-text-secondary border border-solid border-transparent';

const activeTabClass =
  'bg-glass !border-stroke-color font-bold !text-text-primary';

export type TabUrl = 'token-balances' | 'token-holders' | 'channels';

const options: {
  label: string;
  value: TabUrl;
  extraMatch?: string[];
}[] = [
  {
    label: 'Token balances',
    value: 'token-balances',
    extraMatch: ['onchain-graph']
  },
  { label: 'Token holders', value: 'token-holders' },
  { label: 'Channels', value: 'channels' }
];

function TabLinks() {
  const activePath = useLocation().pathname;
  return (
    <>
      {options.map((option, index) => {
        const isActive =
          activePath.includes(option.value) ||
          (option.extraMatch || []).some(match => activePath.includes(match));
        return (
          <Link
            key={index}
            to={`/${option.value}`}
            className={classNames(tabClass, {
              [activeTabClass]: isActive
            })}
          >
            <Icon name={option.value as IconType} className="w-4 mr-1" />{' '}
            {option.label}
          </Link>
        );
      })}
    </>
  );
}

function TabButtons({
  activeTab,
  onTabChange
}: {
  activeTab: string;
  onTabChange: (activeTab: TabUrl) => void;
}) {
  return (
    <>
      {options.map((option, index) => {
        return (
          <button
            key={index}
            onClick={() => onTabChange(option.value)}
            className={classNames(tabClass, {
              [activeTabClass]: activeTab === option.value
            })}
          >
            <Icon name={option.value as IconType} className="w-4 mr-1" />{' '}
            {option.label}
          </button>
        );
      })}
    </>
  );
}

export function SearchTabSection({
  isHome,
  activeTab,
  onTabChange
}: {
  isHome: boolean;
  activeTab: TabUrl;
  onTabChange: (activeTab: TabUrl) => void;
}) {
  return (
    <div className="bg-glass bg-secondary border flex p-1 rounded-full">
      {isHome ? (
        <TabButtons activeTab={activeTab} onTabChange={onTabChange} />
      ) : (
        <TabLinks />
      )}
    </div>
  );
}
