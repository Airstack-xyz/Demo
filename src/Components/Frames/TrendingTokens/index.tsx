import { ReactNode, useMemo, useState } from 'react';
import { FrameDropdownOption } from '../FrameDropdown';
import classNames from 'classnames';
import { Link } from '@/Components/Link';
import { Icon } from '@/Components/Icon';
import { FrameLabel } from '../FrameLabel';
import { FrameModal } from '../FrameModal';
import { FrameURL } from '../FrameURL';
import { FRAMES_ENDPOINT } from '../constants';
import { encodeFrameData } from '../utils';
import { FrameRenderer } from '../FrameRenderer';
import { CustomFramePlaceholder } from './CustomFramePlaceholder';
import { AddressInput } from './AddressInput';
import {
  TrendingTokenFiltters,
  audienceOptions,
  blockchainOptions,
  criteriaOptions,
  timeFrameOptions,
  transferTypeOptions
} from './TrendingTokenFiltters';

const tabClass = 'h-9 px-5 rounded-full flex-col-center';
const activeTabClass = 'bg-white text-[#10212E] font-bold';

function ModalContent() {
  const [activeTab, setActiveTab] = useState<
    'trending-tokens' | 'custom-tokens'
  >('trending-tokens');
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

  return (
    <div className="py-1">
      <div className="text-white text-lg font-semibold">
        Create your own Tokens Swaps Frame!
      </div>
      <div className="text-[#FFDE2E] flex row items-center text-xs mt-2.5 mb-5">
        <Icon name="stars" width={14} />
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
      <div className="mt-4 gap-7">
        {activeTab === 'custom-tokens' && (
          <>
            <FrameLabel
              label="Add up a contract on Base"
              labelIcon="funnel"
              labelIconSize={16}
            />
            <AddressInput onSubmit={setTokenAddresses} />
          </>
        )}
        {activeTab === 'trending-tokens' && (
          <TrendingTokenFiltters
            selectedTimeFrame={selectedTimeFrame}
            selectedBlockchain={selectedBlockchain}
            selectedAudience={selectedAudience}
            selectedCriteria={selectedCriteria}
            selectedTransferType={selectedTransferType}
            handleTimeFrameSelect={handleTimeFrameSelect}
            handleBlockchainSelect={handleBlockchainSelect}
            handleAudienceSelect={handleAudienceSelect}
            handleCriteriaSelect={handleCriteriaSelect}
            handleTransferTypeSelect={handleTransferTypeSelect}
          />
        )}
      </div>
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
