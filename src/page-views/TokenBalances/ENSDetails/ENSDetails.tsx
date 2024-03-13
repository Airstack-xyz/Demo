import React from 'react';
import { UpdateUserInputs } from '../../../hooks/useSearchInput';
import { ENSInfo } from '../../../utils/activeENSInfoString';
import { Icon } from '../../../Components/Icon';
import { DetailsSection } from './DetailsSection';

type ENSDetailsProps = {
  identities: string[];
  ensInfo: ENSInfo;
  activeENSInfo: string;
  setQueryData: UpdateUserInputs;
};

export function ENSDetails({
  identities,
  ensInfo,
  activeENSInfo,
  setQueryData
}: ENSDetailsProps) {
  const handleClose = () => {
    setQueryData(
      {
        activeENSInfo: ''
      },
      { updateQueryParams: true }
    );
  };

  return (
    <div className="max-w-[1050px] w-full text-sm pt-10 sm:pt-0">
      <div className="flex items-center mb-7">
        <div className="flex items-center max-w-[60%] sm:w-auto overflow-hidden mr-2">
          <div
            className="flex items-center cursor-pointer hover:bg-glass-1 px-2 py-1 rounded-full overflow-hidden"
            onClick={handleClose}
          >
            <Icon
              name="token-holders"
              height={20}
              width={20}
              className="mr-2"
            />
            <span className="text-text-secondary break-all cursor-pointer ellipsis">
              Token balances of {identities.join(', ')}
            </span>
          </div>
          <span className="text-text-secondary">/</span>
        </div>
        <div className="flex items-center ellipsis">
          <Icon name="table-view" height={20} width={20} className="mr-2" />
          <span className="text-text-primary">ENS details</span>
        </div>
      </div>
      <DetailsSection key={activeENSInfo} identity={ensInfo.identity} />
    </div>
  );
}
