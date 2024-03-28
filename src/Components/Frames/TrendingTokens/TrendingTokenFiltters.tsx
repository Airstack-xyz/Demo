import { FrameDropdown, FrameDropdownOption } from '../FrameDropdown';
import {
  ENCODED_AUDIENCE,
  ENCODED_CRITERIA,
  ENCODED_TIME_FRAME,
  ENCODED_TRANSFER_TYPE
} from './constants';
import { ENCODED_BLOCKCHAIN } from '../constants';
import { FrameLabel } from '../FrameLabel';
export const timeFrameOptions: FrameDropdownOption[] = [
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

export const blockchainOptions: FrameDropdownOption[] = [
  {
    label: 'Base',
    value: ENCODED_BLOCKCHAIN.base
  }
];

export const audienceOptions: FrameDropdownOption[] = [
  {
    label: 'Farcaster users',
    value: ENCODED_AUDIENCE.FARCASTER
  },
  {
    label: 'All',
    value: ENCODED_AUDIENCE.ALL
  }
];

export const criteriaOptions: FrameDropdownOption[] = [
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

export const transferTypeOptions: FrameDropdownOption[] = [
  {
    label: 'All',
    value: ENCODED_TRANSFER_TYPE.ALL
  },
  {
    label: 'Self initiated',
    value: ENCODED_TRANSFER_TYPE.SELF_INITIATED
  }
];

type TrendingTokenFilttersProps = {
  selectedTimeFrame: FrameDropdownOption;
  selectedBlockchain: FrameDropdownOption;
  selectedAudience: FrameDropdownOption;
  selectedCriteria: FrameDropdownOption;
  selectedTransferType: FrameDropdownOption;
  handleTimeFrameSelect: (value: FrameDropdownOption) => void;
  handleBlockchainSelect: (value: FrameDropdownOption) => void;
  handleAudienceSelect: (value: FrameDropdownOption) => void;
  handleCriteriaSelect: (value: FrameDropdownOption) => void;
  handleTransferTypeSelect: (value: FrameDropdownOption) => void;
};

export function TrendingTokenFiltters({
  selectedTimeFrame,
  selectedBlockchain,
  selectedAudience,
  selectedCriteria,
  selectedTransferType,
  handleTimeFrameSelect,
  handleBlockchainSelect,
  handleAudienceSelect,
  handleCriteriaSelect,
  handleTransferTypeSelect
}: TrendingTokenFilttersProps) {
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
}
