import { Link } from '@/Components/Link';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import { RefObject, useState } from 'react';
import { isMobileDevice } from '../../utils/isMobileDevice';
import { Icon, IconType } from '../Icon';

const tabClass =
  'px-2 sm:px-6 h-[30px] rounded-full flex-row-center text-xs sm:text-sm text-white whitespace-nowrap border border-solid border-transparent';

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

function AskAIButton({
  isOpen,
  onClick
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={classNames(tabClass, 'px-2 sm:px-5', {
        'border border-solid border-white': isOpen
      })}
      onClick={onClick}
    >
      <Icon name="ai-robot" />
      <span className="ml-1">Ask AI</span>
    </button>
  );
}

function AskAIDropdown({
  dropdownRef,
  onClose
}: {
  dropdownRef: RefObject<HTMLDivElement>;
  onClose: () => void;
}) {
  return (
    <div
      ref={dropdownRef}
      className="bg-glass rounded-18 mt-1 flex flex-col absolute left-auto right-0 top-full w-80 p-6 card z-[100]"
    >
      <div
        className="text-white text-sm mb-5 leading-relaxed"
        onClick={e => e.stopPropagation()}
      >
        Query onchain with Airstack AI! <br /> Farcaster, ENS, Ethereum, Base,
        Zora, Lens, XMTP, NFTs, Tokens, POAPs and more.
      </div>
      <div className="text-xs font-medium">
        <Link
          to="https://app.airstack.xyz/api-studio"
          target="_blank"
          className="bg-white py-2 px-5 rounded-full text-black mr-5"
        >
          Go to AI Studio {'->'}
        </Link>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
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
  const [isAIDropdownVisible, setIsAIDropdownVisible] = useState(false);

  const handleAIDropdownClose = () => {
    setIsAIDropdownVisible(false);
  };

  const containerRef = useOutsideClick<HTMLDivElement>(handleAIDropdownClose);

  const handleAIDropdownToggle = () => {
    setIsAIDropdownVisible(prev => !prev);
  };

  return (
    <div className="relative">
      <div className="no-scrollbar scroll-shadow-r z-[42] -mx-2 my-6 flex items-start overflow-x-auto sm:justify-center">
        <div className="bg-glass-new flex min-w-max gap-1 rounded-full border p-0 text-left max-sm:ml-3 max-sm:mr-8 sm:p-1">
          {isHome ? (
            <TabButtons activeTab={activeTab} onTabChange={onTabChange} />
          ) : (
            <TabLinks />
          )}
          <AskAIButton
            isOpen={isAIDropdownVisible}
            onClick={handleAIDropdownToggle}
          />
        </div>
      </div>
      {isAIDropdownVisible && (
        <AskAIDropdown
          dropdownRef={containerRef}
          onClose={handleAIDropdownClose}
        />
      )}
    </div>
  );
}
