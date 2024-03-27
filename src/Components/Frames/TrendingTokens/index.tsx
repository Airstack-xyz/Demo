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
  },
];


function ModalContent() {
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
  const [selectedTransferType, setSelectedTransferType] = useState<FrameDropdownOption>(
    transferTypeOptions[0]
  );

  const { frameUrl, postUrl } = useMemo(() => {
    const params = {
      a: selectedAudience.value,
      b: selectedBlockchain.value,
      c: selectedCriteria.value,
      t: selectedTimeFrame.value,
      r: selectedTransferType.value
    };
    const searchParams = new URLSearchParams(params);
    return {
      frameUrl: `${FRAMES_ENDPOINT}/tt/${encodeFrameData(params)}`,
      postUrl: `${FRAMES_ENDPOINT}/tt/frame?${searchParams.toString()}`
    };
  }, [selectedAudience.value, selectedBlockchain.value, selectedCriteria.value, selectedTimeFrame.value, selectedTransferType.value]);

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

  return (
    <div className="py-1">
      <div className="text-white text-lg font-semibold">
        Showcase Trending Tokens in a Frame
      </div>
      <div className="mt-4 gap-7">
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
      </div>
      <div className="flex items-end max-sm:mt-8 mt-4 gap-6">
        <FrameURL containerClass="w-full" longUrl={frameUrl} />
      </div>
      <div className="max-sm:mt-8 mt-4">
        <FrameLabel label="Preview" labelIcon="frame" labelIconSize={16} />
        <FrameRenderer
          postUrl={postUrl}
          frameContainerClass="bg-gradient-to-b from-[#122230] to-[#051523]"
        />
      </div>
    </div>
  );
}

export function TrendingTokensFrameModal({ disabled, buttonContent }: { disabled?: boolean, buttonContent?: ReactNode; }) {
  return (
    <FrameModal disabled={disabled} buttonContent={buttonContent}>
      <ModalContent />
    </FrameModal>
  );
}
