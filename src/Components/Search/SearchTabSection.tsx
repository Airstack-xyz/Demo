import classNames from 'classnames';
import { Icon, IconType } from '../Icon';
import { isMobileDevice } from '../../utils/isMobileDevice';
import { usePathname } from 'next/navigation';
import { Link } from '@/Components/Link';
import { Dropdown } from '../Dropdown';

const tabClass =
  'px-2 sm:px-6 h-[30px] rounded-full flex-row-center text-xs sm:text-sm text-white border border-solid border-transparent';

const activeTabClass = 'bg-white font-bold !text-[#10212E]';

export type TabUrl =
  | 'token-balances'
  | 'token-holders'
  | 'trending-mints'
  | 'channels';

const options: {
  label: string;
  mobileLabel: string;
  value: TabUrl;
  extraMatch?: string[];
  shouldNavigate?: boolean;
}[] = [
  {
    label: 'Users',
    mobileLabel: 'Users',
    value: 'token-balances',
    extraMatch: ['onchain-graph']
  },
  { label: 'Tokens', mobileLabel: 'Tokens', value: 'token-holders' },
  {
    label: 'Mints',
    mobileLabel: 'Mints',
    value: 'trending-mints',
    shouldNavigate: true
  },
  { label: 'Channels', mobileLabel: 'Channels', value: 'channels' }
];

function TabLinks() {
  const isMobile = isMobileDevice();
  const activePath = usePathname() || '';
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
            <Icon
              name={option.value as IconType}
              className={classNames('w-4 mr-1', {
                invert: isActive
              })}
            />{' '}
            {isMobile ? option.mobileLabel : option.label}
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
  onTabChange: (activeTab: TabUrl, shouldNavigate?: boolean) => void;
}) {
  const isMobile = isMobileDevice();
  return (
    <>
      {options.map((option, index) => {
        return (
          <button
            key={index}
            onClick={() => onTabChange(option.value, option.shouldNavigate)}
            className={classNames(tabClass, {
              [activeTabClass]: activeTab === option.value
            })}
          >
            <Icon
              name={option.value as IconType}
              className={classNames('w-4 mr-1', {
                invert: activeTab === option.value
              })}
            />{' '}
            {isMobile ? option.mobileLabel : option.label}
          </button>
        );
      })}
    </>
  );
}

function AskAI() {
  const isMobile = isMobileDevice();
  return (
    <Dropdown
      optionsContainerClassName={classNames('w-80 p-6 card', {
        '!right-0 !left-auto': isMobile
      })}
      renderPlaceholder={(_, isOpen: boolean) => (
        <button
          className={classNames(tabClass, 'px-2 sm:px-5', {
            'border border-solid border-white': isOpen
          })}
        >
          <Icon name="ai-robot" />
          <span className="ml-1">Ask AI</span>
        </button>
      )}
      options={[
        {
          label: '--',
          value: '--'
        }
      ]}
      renderOption={() => (
        <div>
          <div
            className="text-white text-sm mb-5 leading-relaxed"
            onClick={e => e.stopPropagation()}
          >
            Query onchain with Airstack AI! <br /> Farcaster, ENS, Ethereum,
            Base, Zora, Lens, XMTP, NFTs, Tokens, POAPs and more.
          </div>
          <div>
            <Link
              to="https://app.airstack.xyz/api-studio"
              target="_blank"
              className="bg-white py-2 px-5 rounded-full text-black mr-5"
            >
              Go to AI Studio {'->'}
            </Link>
            <button>Close</button>
          </div>
        </div>
      )}
      onChange={() => {}}
    />
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
    <div className="bg-glass-new border flex p-0 sm:p-1 gap-1 rounded-full text-left">
      {isHome ? (
        <TabButtons activeTab={activeTab} onTabChange={onTabChange} />
      ) : (
        <TabLinks />
      )}
      <AskAI />
    </div>
  );
}
