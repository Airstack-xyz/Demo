import { Icon } from '../../../Components/Icon';
import { UpdateUserInputs } from '../../../hooks/useSearchInput';
import {
  ActiveTab,
  SocialInfo,
  getActiveSocialInfoString
} from '../../../utils/activeSocialInfoString';
import { DetailsSection } from './DetailsSection';
import { TableSection } from './TableSection';
import { TabContainer, Tab } from '../../../Components/Tab';
import { capitalizeFirstLetter } from '../../../utils';
import { ChannelsSection } from './ChannelsSection';
import { isMobileDevice } from '@/utils/isMobileDevice';

type SocialDetailsProps = {
  identities: string[];
  socialInfo: SocialInfo;
  activeSocialInfo: string;
  setQueryData: UpdateUserInputs;
};

export function SocialDetails({
  identities,
  socialInfo,
  activeSocialInfo,
  setQueryData
}: SocialDetailsProps) {
  const handleTabChange = (activeTab: ActiveTab) => {
    setQueryData(
      {
        activeSocialInfo: getActiveSocialInfoString({
          ...socialInfo,
          activeTab
        })
      },
      { updateQueryParams: true }
    );
  };

  const handleClose = () => {
    setQueryData(
      {
        activeSocialInfo: ''
      },
      { updateQueryParams: true }
    );
  };

  const isMobile = isMobileDevice();
  const canShowChannels = socialInfo.dappName.toLowerCase() === 'farcaster';

  const channelsTabActive =
    socialInfo.activeTab === 'channels' && canShowChannels;

  return (
    <div className="main-section w-full text-sm pt-4 sm:pt-0">
      <div className="flex items-center">
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
      <TabContainer className="my-0">
        <Tab
          icon="follower-gray"
          header={
            isMobile ? 'Followers' : `${socialInfo.followerCount} Followers`
          }
          active={socialInfo.activeTab === 'followers'}
          onClick={() => handleTabChange('followers')}
        />
        <Tab
          icon="following-gray"
          header={
            isMobile ? 'Following' : `${socialInfo.followingCount} Following`
          }
          active={socialInfo.activeTab === 'followings'}
          onClick={() => handleTabChange('followings')}
        />
        {canShowChannels && (
          <Tab
            icon="farcaster-flat-gray"
            header={'Channels'}
            active={socialInfo.activeTab === 'channels'}
            onClick={() => handleTabChange('channels')}
          />
        )}
      </TabContainer>
      {channelsTabActive ? (
        <ChannelsSection identity={socialInfo.socialsFor || identities[0]} />
      ) : (
        <TableSection
          key={activeSocialInfo}
          identities={identities}
          socialInfo={socialInfo}
          setQueryData={setQueryData}
        />
      )}
    </div>
  );
}
