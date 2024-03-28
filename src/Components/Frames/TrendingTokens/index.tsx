import { ReactNode, useMemo, useState } from 'react';
import { FrameDropdown, FrameDropdownOption } from '../FrameDropdown';
import { FrameLabel } from '../FrameLabel';
import { FrameModal } from '../FrameModal';
import { FrameURL } from '../FrameURL';
import {
  ENCODED_AUDIENCE,
  ENCODED_CRITERIA,
  ENCODED_TIME_FRAME,
  ENCODED_TRANSFER_TYPE
} from './constants';
import { ENCODED_BLOCKCHAIN, FRAMES_ENDPOINT } from '../constants';
import { encodeFrameData } from '../utils';
import { FrameRenderer } from '../FrameRenderer';
import { Link } from '@/Components/Link';
import classNames from 'classnames';
import { CustomFramePlaceholder } from './CustomFramePlaceholder';
import { AddressInput } from './AddressInput';

const timeFrameOptions: FrameDropdownOption[] = [
  {
    label: '1 Hour',
    value: ENCODED_TIME_FRAME.ONE_HOUR
  },
  {
    label: '2 Hours',
    value: ENCODED_TIME_FRAME.TWO_HOURS
  },
  {
    label: '8 Hours',
    value: ENCODED_TIME_FRAME.EIGHT_HOURS
  },
  {
    label: '1 Day',
    value: ENCODED_TIME_FRAME.ONE_DAY
  },
  {
    label: '2 Days',
    value: ENCODED_TIME_FRAME.TWO_DAYS
  },
  {
    label: '7 Days',
    value: ENCODED_TIME_FRAME.SEVEN_DAYS
  }
];

const blockchainOptions: FrameDropdownOption[] = [
  {
    label: 'Base',
    value: ENCODED_BLOCKCHAIN.base
  }
];

const audienceOptions: FrameDropdownOption[] = [
  {
    label: 'Farcasters only',
    value: ENCODED_AUDIENCE.FARCASTER
  },
  {
    label: 'All',
    value: ENCODED_AUDIENCE.ALL
  }
];

const criteriaOptions: FrameDropdownOption[] = [
  {
    label: 'Unique users',
    value: ENCODED_CRITERIA.UNIQUE_WALLETS
  },
  {
    label: 'Total transfers',
    value: ENCODED_CRITERIA.TOTAL_TRANSFERS
  },
  {
    label: 'Unique holders',
    value: ENCODED_CRITERIA.UNIQUE_HOLDERS
  }
];

const transferTypeOptions: FrameDropdownOption[] = [
  {
    label: 'All',
    value: ENCODED_TRANSFER_TYPE.ALL
  },
  {
    label: 'Self initiated',
    value: ENCODED_TRANSFER_TYPE.SELF_INITIATED
  }
];

const tabClass = 'h-9 px-5 rounded-full flex-col-center';
const activeTabClass = 'bg-white text-[#10212E] font-bold';

function ModalContent() {
  const [activeTab, setActiveTab] = useState<
    'trending-tokens' | 'custom-tokens'
  >('custom-tokens');
  const [tokenAddresses, setTokenAddresses] = useState<string[]>([]);
  const [selectedTimeFrame, setSelectedTimeFrame] =
    useState<FrameDropdownOption>(timeFrameOptions[0]);
  const [selectedBlockchain, setSelectedBlockchain] =
    useState<FrameDropdownOption>(blockchainOptions[0]);
  const [selectedAudience, setSelectedAudience] = useState<FrameDropdownOption>(
    audienceOptions[0]
  );
  const [selectedCriteria, setSelectedCriteria] = useState<FrameDropdownOption>(
    criteriaOptions[0]
  );
  const [selectedTransferType, setSelectedTransferType] =
    useState<FrameDropdownOption>(transferTypeOptions[0]);

  const { frameUrl, postUrl } = useMemo(() => {
    let params: Record<string, any> = {
      a: selectedAudience.value,
      b: selectedBlockchain.value,
      c: selectedCriteria.value,
      t: selectedTimeFrame.value,
      r: selectedTransferType.value
    };

    if (activeTab === 'custom-tokens') {
      const tokensParams: Record<string, string> = {};

      tokenAddresses.forEach((address, index) => {
        tokensParams[`t${index}`] = address;
      });

      params = {
        b: selectedBlockchain.value,
        ...tokensParams
      };
    }

    const urlSubPath = activeTab === 'trending-tokens' ? 'tt' : 'ct';

    const searchParams = new URLSearchParams(params);
    return {
      frameUrl: `${FRAMES_ENDPOINT}/${urlSubPath}/${encodeFrameData(params)}`,
      postUrl: `${FRAMES_ENDPOINT}/${urlSubPath}/frame?${searchParams.toString()}`
    };
  }, [
    activeTab,
    selectedAudience.value,
    selectedBlockchain.value,
    selectedCriteria.value,
    selectedTimeFrame.value,
    selectedTransferType.value,
    tokenAddresses
  ]);

  const handleTimeFrameSelect = (option: FrameDropdownOption) => {
    setSelectedTimeFrame(option);
  };

  const handleBlockchainSelect = (option: FrameDropdownOption) => {
    setSelectedBlockchain(option);
  };

  const handleAudienceSelect = (option: FrameDropdownOption) => {
    setSelectedAudience(option);
  };

  const handleCriteriaSelect = (option: FrameDropdownOption) => {
    setSelectedCriteria(option);
  };

  const handleTransferTypeSelect = (option: FrameDropdownOption) => {
    setSelectedTransferType(option);
  };

  const filters = useMemo(() => {
    if (activeTab === 'custom-tokens') {
      return (
        <>
          <FrameLabel
            label="Add up a contract on Base"
            labelIcon="funnel"
            labelIconSize={16}
          />
          <AddressInput onSubmit={setTokenAddresses} />
        </>
      );
    }
    return (
      <>
        <FrameLabel label="Filters" labelIcon="funnel" labelIconSize={16} />
        <div className="flex flex-wrap gap-3">
          <FrameDropdown
            heading="Time frame"
            icon="clock"
            options={timeFrameOptions}
            selectedOption={selectedTimeFrame}
            onSelect={handleTimeFrameSelect}
          />
          <FrameDropdown
            heading="Blockchain"
            icon="blockchain-filter"
            options={blockchainOptions}
            selectedOption={selectedBlockchain}
            onSelect={handleBlockchainSelect}
          />
          <FrameDropdown
            heading="Audience"
            icon="user"
            options={audienceOptions}
            selectedOption={selectedAudience}
            onSelect={handleAudienceSelect}
          />
          <FrameDropdown
            heading="Criteria"
            icon="wallet"
            options={criteriaOptions}
            selectedOption={selectedCriteria}
            onSelect={handleCriteriaSelect}
          />
          <FrameDropdown
            heading="Transfer type"
            icon="transfer"
            options={transferTypeOptions}
            selectedOption={selectedTransferType}
            onSelect={handleTransferTypeSelect}
          />
        </div>
      </>
    );
  }, [
    activeTab,
    selectedAudience,
    selectedBlockchain,
    selectedCriteria,
    selectedTimeFrame,
    selectedTransferType
  ]);

  return (
    <div className="py-1">
      <div className="text-white text-lg font-semibold">
        Create your own Tokens Swaps Frame!
      </div>
      <div className="text-[#FFDE2E] flex row items-center text-xs mt-2.5 mb-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="15"
          viewBox="0 0 14 15"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7.01667 13.4487C7.216 12.8513 7.68467 12.3827 8.28133 12.184L9.33333 11.8333L8.28133 11.4833C7.68467 11.284 7.216 10.8153 7.01667 10.218L6.66667 9.16667L6.316 10.218C6.11667 10.8153 5.648 11.284 5.05133 11.4833L4 11.8333L5.05133 12.184C5.648 12.3827 6.11667 12.8513 6.316 13.4487L6.66667 14.5L7.01667 13.4487ZM3.01667 9.44867C3.216 8.85133 3.68467 8.38267 4.28133 8.184L5.33333 7.83333L4.28133 7.48333C3.68467 7.284 3.216 6.81533 3.01667 6.218L2.66667 5.16667L2.316 6.218C2.11667 6.81533 1.648 7.284 1.05133 7.48333L0 7.83333L1.05133 8.184C1.648 8.38267 2.11667 8.85133 2.316 9.44867L2.66667 10.5L3.01667 9.44867ZM9.33333 9.83333L8.65867 7.80933C8.34867 6.88 7.61933 6.15133 6.69067 5.84133L4.66667 5.16667L6.69067 4.492C7.61933 4.18267 8.34867 3.45333 8.65867 2.524L9.33333 0.5L10.0073 2.524C10.3173 3.45333 11.0467 4.18267 11.9753 4.492L14 5.16667L11.9753 5.84133C11.0467 6.15133 10.3173 6.88 10.0073 7.80933L9.33333 9.83333Z"
            fill="#FFDE2E"
          />
        </svg>
        <span className="ml-1 mr-2">
          Earn Airstack points and $Degen rewards with every swap! 
        </span>
        <Link to="" className="text-text-button underline">
          Learn more
        </Link>
      </div>
      <div>
        <FrameLabel
          label="Choose Tokens"
          labelIcon="token-balances-gray"
          labelIconSize={16}
        />
        <div className="flex">
          <div className="bg-glass-new text-xs flex items-center rounded-full">
            <button
              className={classNames(tabClass, {
                [activeTabClass]: activeTab === 'trending-tokens'
              })}
              onClick={() => setActiveTab('trending-tokens')}
            >
              Trending
            </button>
            <button
              className={classNames(tabClass, {
                [activeTabClass]: activeTab === 'custom-tokens'
              })}
              onClick={() => setActiveTab('custom-tokens')}
            >
              Custom
            </button>
          </div>
        </div>
      </div>
      <div className="mt-4 gap-7">{filters}</div>
      <div className="flex items-end max-sm:mt-8 mt-4 gap-6">
        <FrameURL containerClass="w-full" longUrl={frameUrl} />
      </div>
      <div className="max-sm:mt-8 mt-4">
        <FrameLabel label="Preview" labelIcon="frame" labelIconSize={16} />
        <FrameRenderer
          key={activeTab}
          postUrl={
            activeTab === 'custom-tokens' && tokenAddresses.length === 0
              ? ''
              : postUrl
          }
          frameContainerClass="bg-gradient-to-b from-[#122230] to-[#051523]"
          initialContent={<CustomFramePlaceholder />}
        />
      </div>
    </div>
  );
}

export function TrendingTokensFrameModal({
  disabled,
  buttonContent
}: {
  disabled?: boolean;
  buttonContent?: ReactNode;
}) {
  return (
    <FrameModal disabled={disabled} buttonContent={buttonContent}>
      <ModalContent />
    </FrameModal>
  );
}
