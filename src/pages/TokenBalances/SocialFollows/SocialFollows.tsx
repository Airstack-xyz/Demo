import { useState } from 'react';
import { Icon } from '../../../Components/Icon';
import { UpdateUserInputs } from '../../../hooks/useSearchInput';
import { SocialInfo } from '../../../utils/activeSocialInfoString';
import { DetailsSection } from './DetailsSection';
import { TableSection } from './TableSection';
import { TabContainer, Tab } from '../../../Components/Tab';
import { capitalizeFirstLetter } from '../../../utils';

type SocialFollowsProps = {
  identities: string[];
  socialInfo: SocialInfo;
  setQueryData: UpdateUserInputs;
};

export function SocialFollows({
  identities,
  socialInfo,
  setQueryData
}: SocialFollowsProps) {
  const [isFollowerQuery, setIsFollowerQuery] = useState(
    socialInfo.followerTab
  );

  const handleClose = () => {
    setQueryData(
      {
        activeSocialInfo: ''
      },
      { updateQueryParams: true }
    );
  };

  return (
    <div className="max-w-[950px] text-sm m-auto w-[98vw] pt-10 sm:pt-0">
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
            <span className="text-text-secondary break-all cursor-pointer max-w-[90%] sm:max-w-[500px] ellipsis">
              Token balances of {identities.join(', ')}
            </span>
          </div>
          <span className="text-text-secondary">/</span>
        </div>
        <div className="flex items-center flex-1">
          <Icon name="table-view" height={20} width={20} className="mr-2" />
          <span className="text-text-primary">
            {capitalizeFirstLetter(socialInfo.dappName)} details
          </span>
        </div>
      </div>
      <DetailsSection
        identities={identities}
        profileNames={socialInfo.profileNames}
        dappName={socialInfo.dappName}
      />
      <TabContainer className="mb-0">
        <Tab
          icon="nft-flat"
          header={`${socialInfo.followerCount} followers`}
          active={isFollowerQuery}
          onClick={() => setIsFollowerQuery(true)}
        />
        <Tab
          icon="erc20"
          header={`${socialInfo.followingCount} following`}
          active={!isFollowerQuery}
          onClick={() => setIsFollowerQuery(false)}
        />
      </TabContainer>
      <TableSection
        key={
          isFollowerQuery ? 'follower-table-section' : 'following-table-section'
        }
        identities={identities}
        socialInfo={socialInfo}
        isFollowerQuery={isFollowerQuery}
        setQueryData={setQueryData}
      />
    </div>
  );
}
